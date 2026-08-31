import React, { useEffect, useRef, useState } from 'react';
import { soundFx } from '../../components/AudioSynthesizer';
import { Shield, Zap, Trophy, RotateCcw, Target } from 'lucide-react';

export const CosmoStrikeGame: React.FC<{ onGameOver?: (score: number) => void }> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [shields, setShields] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const state = useRef<{
    playerX: number;
    playerY: number;
    lasers: Array<{ x: number; y: number; vy: number }>;
    aliens: Array<{ x: number; y: number; vx: number; hp: number; maxHp: number; type: 'DRONE' | 'ELITE' | 'BOSS' }>;
    stars: Array<{ x: number; y: number; speed: number; size: number }>;
    keys: { left: false; right: false; fire: false };
    lastFireTime: number;
  }>({
    playerX: 350,
    playerY: 480,
    lasers: [],
    aliens: [],
    stars: [],
    keys: { left: false, right: false, fire: false },
    lastFireTime: 0
  });

  const initWave = (w: number) => {
    const aliens: Array<any> = [];
    const rows = Math.min(4, 2 + Math.floor(w / 2));
    const cols = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: 80 + c * 70,
          y: 60 + r * 45,
          vx: 1.5 + w * 0.3,
          hp: r === 0 ? 3 : 1,
          maxHp: r === 0 ? 3 : 1,
          type: r === 0 ? 'ELITE' : 'DRONE'
        });
      }
    }

    state.current.aliens = aliens;
  };

  useEffect(() => {
    // Generate starfield
    const stars: Array<any> = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 700,
        y: Math.random() * 540,
        speed: 0.5 + Math.random() * 2,
        size: Math.random() > 0.8 ? 2 : 1
      });
    }
    state.current.stars = stars;
    initWave(1);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) state.current.keys.left = true as any;
      if (['ArrowRight', 'KeyD'].includes(e.code)) state.current.keys.right = true as any;
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) state.current.keys.fire = true as any;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) state.current.keys.left = false as any;
      if (['ArrowRight', 'KeyD'].includes(e.code)) state.current.keys.right = false as any;
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) state.current.keys.fire = false as any;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const s = state.current;

      // Background Starfield
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      for (const star of s.stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      if (!isGameOver) {
        // Player Movement
        if (s.keys.left) s.playerX = Math.max(30, s.playerX - 6);
        if (s.keys.right) s.playerX = Math.min(canvas.width - 30, s.playerX + 6);

        // Player Firing
        const now = performance.now();
        if (s.keys.fire && now - s.lastFireTime > 180) {
          s.lasers.push({ x: s.playerX, y: s.playerY - 15, vy: -10 });
          s.lastFireTime = now;
          soundFx.playLaser();
        }

        // Update Lasers
        for (let i = s.lasers.length - 1; i >= 0; i--) {
          const l = s.lasers[i];
          l.y += l.vy;
          if (l.y < 0) {
            s.lasers.splice(i, 1);
            continue;
          }

          // Laser collision with aliens
          for (let j = s.aliens.length - 1; j >= 0; j--) {
            const a = s.aliens[j];
            if (Math.abs(l.x - a.x) < 20 && Math.abs(l.y - a.y) < 18) {
              s.lasers.splice(i, 1);
              a.hp--;
              if (a.hp <= 0) {
                soundFx.playExplosion();
                s.aliens.splice(j, 1);
                setScore((sc) => sc + (a.type === 'ELITE' ? 250 : 100));
              }
              break;
            }
          }
        }

        // Update Aliens
        let changeDir = false;
        for (const a of s.aliens) {
          a.x += a.vx;
          if (a.x > canvas.width - 40 || a.x < 40) {
            changeDir = true;
          }
          if (a.y >= s.playerY - 20) {
            // Alien reached defense line
            setShields((sh) => {
              const next = sh - 1;
              if (next <= 0) {
                setIsGameOver(true);
                soundFx.playExplosion();
                if (onGameOver) onGameOver(score);
              }
              return Math.max(0, next);
            });
            initWave(wave);
            break;
          }
        }

        if (changeDir) {
          for (const a of s.aliens) {
            a.vx *= -1;
            a.y += 18;
          }
        }

        // Check Wave Cleared
        if (s.aliens.length === 0) {
          soundFx.playPowerUp();
          setWave((w) => {
            const nw = w + 1;
            initWave(nw);
            return nw;
          });
          setScore((sc) => sc + 1000);
        }
      }

      // Draw Aliens
      for (const a of s.aliens) {
        ctx.font = a.type === 'ELITE' ? '22px sans-serif' : '18px sans-serif';
        ctx.fillText(a.type === 'ELITE' ? '🛸' : '👾', a.x - 10, a.y);
      }

      // Draw Lasers
      ctx.fillStyle = '#00ffcc';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 8;
      for (const l of s.lasers) {
        ctx.fillRect(l.x - 2, l.y, 4, 14);
      }
      ctx.shadowBlur = 0;

      // Draw Starfighter Ship
      ctx.font = '26px sans-serif';
      ctx.fillText('🚀', s.playerX - 13, s.playerY);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animId);
    };
  }, [wave, isGameOver]);

  const restartGame = () => {
    setScore(0);
    setWave(1);
    setShields(3);
    setIsGameOver(false);
    state.current.lasers = [];
    initWave(1);
  };

  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-2xl flex flex-col items-center">
      {/* Header HUD */}
      <div className="w-full max-w-[700px] flex justify-between items-center bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyber-yellow" />
          <span className="text-xl font-bold orbitron text-white">{score.toLocaleString()}</span>
        </div>
        <div className="text-sm font-bold orbitron text-cyber-neon tracking-wider">
          SECTOR WAVE {wave}
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-cyber-pink" />
          <span className="text-xs text-slate-300">SHIELDS:</span>
          <span className="text-sm font-bold text-cyber-pink font-mono">{'🛡️'.repeat(shields)}</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-xl overflow-hidden border border-cyber-border/70 shadow-2xl">
        <canvas ref={canvasRef} width={700} height={540} />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6">
            <h3 className="text-4xl font-black orbitron text-red-500 mb-2 text-glow-pink">SECTOR OVERRUN</h3>
            <p className="text-slate-400 text-sm mb-6">Hostile alien fleet pierced planetary defenses.</p>
            <div className="bg-cyber-dark p-4 rounded-xl border border-cyber-border mb-6 text-center min-w-[200px]">
              <div className="text-xs text-slate-400 uppercase">Final Score</div>
              <div className="text-2xl font-bold orbitron text-cyber-neon">{score.toLocaleString()}</div>
            </div>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-cyber-neon text-black font-bold uppercase rounded-xl flex items-center gap-2 hover:opacity-90 transition-all glow-cyan"
            >
              <RotateCcw className="w-5 h-5" /> Launch Next Fighter
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 text-xs text-slate-400 text-center">
        Use <strong className="text-white font-mono">A / D / Arrow Keys</strong> to steer, <strong className="text-white font-mono">SPACE</strong> to fire laser cannons!
      </div>
    </div>
  );
};
