import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Trophy, Flame, Play, RotateCcw } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface Bullet {
  x: number;
  y: number;
}

interface Alien {
  id: number;
  x: number;
  y: number;
  hp: number;
}

export const CosmoStrikeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !isGameStarted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let playerX = canvas.width / 2;
    let bullets: Bullet[] = [];
    let aliens: Alien[] = [];
    let lastSpawn = 0;
    let localScore = 0;
    let animId: number;

    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        bullets.push({ x: playerX, y: canvas.height - 40 });
        AudioSynthesizer.playLaser();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let nextAlienId = 1;

    const loop = (timestamp: number) => {
      animId = requestAnimationFrame(loop);

      // Clear & Draw Starfield
      ctx.fillStyle = '#06080F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 37 + (timestamp * 0.05)) % canvas.width;
        const sy = (i * 73 + (timestamp * 0.1)) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Move Player
      if (keys['a'] || keys['arrowleft']) playerX -= 6;
      if (keys['d'] || keys['arrowright']) playerX += 6;
      playerX = Math.max(20, Math.min(canvas.width - 20, playerX));

      // Draw Player Ship
      ctx.font = '28px sans-serif';
      ctx.fillText('🚀', playerX - 14, canvas.height - 20);

      // Spawn Aliens
      if (timestamp - lastSpawn > 1200) {
        lastSpawn = timestamp;
        aliens.push({
          id: nextAlienId++,
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          hp: 2
        });
      }

      // Update Bullets
      ctx.fillStyle = '#06B6D4';
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= 9;
        ctx.fillRect(b.x - 2, b.y, 4, 12);

        if (b.y < -10) {
          bullets.splice(i, 1);
        }
      }

      // Update Aliens
      for (let aIdx = aliens.length - 1; aIdx >= 0; aIdx--) {
        const a = aliens[aIdx];
        a.y += 2.2;

        ctx.font = '24px sans-serif';
        ctx.fillText('👾', a.x - 12, a.y);

        // Check Bullet Collision
        for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
          const b = bullets[bIdx];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 20) {
            bullets.splice(bIdx, 1);
            a.hp -= 1;
            AudioSynthesizer.playHover();
            if (a.hp <= 0) {
              aliens.splice(aIdx, 1);
              AudioSynthesizer.playExplosion();
              localScore += 50;
              setScore(localScore);
              break;
            }
          }
        }

        // Alien reaches bottom
        if (a && a.y > canvas.height - 30) {
          aliens.splice(aIdx, 1);
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameStarted]);

  return (
    <div className="relative w-full bg-[#0E121B] rounded-2xl overflow-hidden border border-slate-800/80 p-6 flex flex-col items-center shadow-2xl">
      <div className="flex items-center justify-between w-full max-w-[640px] mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-white text-sm">VOID VANGUARD: COSMO STRIKE</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <span className="text-amber-400">SCORE: {score}</span>
          <span className="text-cyan-400">WAVE: {wave}</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#06080F]">
        <canvas ref={canvasRef} width={640} height={460} className="block" />

        {!isGameStarted && (
          <div className="absolute inset-0 bg-[#06080F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <Flame className="w-12 h-12 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-black text-white mb-1">VOID VANGUARD</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-5">
              Classic arcade space shooter. Steer left & right to vaporize incoming drone waves.
            </p>
            <button
              onClick={() => {
                AudioSynthesizer.playSuccess();
                setIsGameStarted(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Starfighter</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-400 font-mono">
        Use <span className="text-white font-bold">A / D (or Arrows)</span> to steer, <span className="text-cyan-400 font-bold">SPACEBAR</span> to fire plasma cannons
      </div>
    </div>
  );
};
