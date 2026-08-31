import React, { useEffect, useRef, useState } from 'react';
import { Shield, Heart, Sparkles, Sword, Play, RotateCcw, Package } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface Mob {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  name: string;
}

export const DungeonRogueGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hp, setHp] = useState(120);
  const [maxHp] = useState(120);
  const [floor, setFloor] = useState(1);
  const [gold, setGold] = useState(0);
  const [potions, setPotions] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [log, setLog] = useState<string[]>(['Descended into Crypt Level 1. Prepare your blade.']);

  const playerPos = useRef({ x: 4, y: 4 });
  const mobs = useRef<Mob[]>([
    { id: '1', x: 8, y: 4, hp: 40, maxHp: 40, name: 'Skeleton Warrior' },
    { id: '2', x: 12, y: 7, hp: 55, maxHp: 55, name: 'Crypt Ghoul' },
    { id: '3', x: 6, y: 10, hp: 35, maxHp: 35, name: 'Necro Minion' }
  ]);
  const chests = useRef<{ x: number; y: number; opened: boolean }[]>([
    { x: 9, y: 8, opened: false },
    { x: 14, y: 4, opened: false }
  ]);
  const exitGate = useRef({ x: 14, y: 12 });

  useEffect(() => {
    if (!canvasRef.current || !isGameStarted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 38;
    const cols = 18;
    const rows = 14;

    const render = () => {
      ctx.fillStyle = '#090C14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Floor & Walls
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const isWall = x === 0 || x === cols - 1 || y === 0 || y === rows - 1;
          const px = x * tileSize;
          const py = y * tileSize;

          if (isWall) {
            ctx.fillStyle = '#1A202C';
            ctx.fillRect(px, py, tileSize - 1, tileSize - 1);
            ctx.strokeStyle = '#2D3748';
            ctx.strokeRect(px, py, tileSize - 1, tileSize - 1);
          } else {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#111624' : '#141A2B';
            ctx.fillRect(px, py, tileSize - 1, tileSize - 1);
          }
        }
      }

      // Draw Exit Gate
      const gate = exitGate.current;
      ctx.fillStyle = '#6366F1';
      ctx.fillRect(gate.x * tileSize + 6, gate.y * tileSize + 6, tileSize - 12, tileSize - 12);
      ctx.font = '16px sans-serif';
      ctx.fillText('🚪', gate.x * tileSize + 8, gate.y * tileSize + 26);

      // Draw Chests
      chests.current.forEach((c) => {
        ctx.font = '18px sans-serif';
        ctx.fillText(c.opened ? '📦' : '🎁', c.x * tileSize + 8, c.y * tileSize + 26);
      });

      // Draw Mobs
      mobs.current.forEach((m) => {
        if (m.hp > 0) {
          ctx.font = '18px sans-serif';
          ctx.fillText('💀', m.x * tileSize + 8, m.y * tileSize + 26);

          // Health Bar
          ctx.fillStyle = '#F43F5E';
          const barW = (tileSize - 12) * (m.hp / m.maxHp);
          ctx.fillRect(m.x * tileSize + 6, m.y * tileSize + 2, barW, 4);
        }
      });

      // Draw Player Hero
      const p = playerPos.current;
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(p.x * tileSize + tileSize / 2, p.y * tileSize + tileSize / 2, tileSize / 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '18px sans-serif';
      ctx.fillText('🧙‍♂️', p.x * tileSize + 8, p.y * tileSize + 26);
    };

    render();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let dx = 0;
      let dy = 0;

      if (key === 'w' || key === 'arrowup') dy = -1;
      if (key === 's' || key === 'arrowdown') dy = 1;
      if (key === 'a' || key === 'arrowleft') dx = -1;
      if (key === 'd' || key === 'arrowright') dx = 1;

      if (dx === 0 && dy === 0) return;

      const nextX = playerPos.current.x + dx;
      const nextY = playerPos.current.y + dy;

      // Check wall boundary
      if (nextX <= 0 || nextX >= cols - 1 || nextY <= 0 || nextY >= rows - 1) return;

      // Check Mob Attack
      const targetMob = mobs.current.find((m) => m.x === nextX && m.y === nextY && m.hp > 0);
      if (targetMob) {
        AudioSynthesizer.playLaser();
        const damage = 25 + Math.floor(Math.random() * 15);
        targetMob.hp = Math.max(0, targetMob.hp - damage);

        setLog((prev) => [
          `⚔️ You struck ${targetMob.name} for ${damage} damage!`,
          ...prev.slice(0, 4)
        ]);

        if (targetMob.hp <= 0) {
          AudioSynthesizer.playSuccess();
          const earned = 40 + Math.floor(Math.random() * 30);
          setGold((g) => g + earned);
          setLog((prev) => [`✨ Slain ${targetMob.name}! Found +${earned} Gold.`, ...prev.slice(0, 4)]);
        } else {
          // Mob strikes back
          const mobDmg = 8 + Math.floor(Math.random() * 6);
          setHp((h) => Math.max(0, h - mobDmg));
        }

        render();
        return;
      }

      // Check Chest
      const targetChest = chests.current.find((c) => c.x === nextX && c.y === nextY && !c.opened);
      if (targetChest) {
        targetChest.opened = true;
        AudioSynthesizer.playSuccess();
        setGold((g) => g + 80);
        setPotions((p) => p + 1);
        setLog((prev) => ['🎁 Opened ancient chest! +80 Gold & +1 Potion.', ...prev.slice(0, 4)]);
      }

      // Check Exit Gate
      if (nextX === exitGate.current.x && nextY === exitGate.current.y) {
        AudioSynthesizer.playSuccess();
        setFloor((f) => f + 1);
        setLog((prev) => [`🚪 Descended to Floor ${floor + 1}! Dungeon reset.`, ...prev.slice(0, 4)]);
        playerPos.current = { x: 2, y: 2 };
        mobs.current.forEach((m) => (m.hp = m.maxHp));
        chests.current.forEach((c) => (c.opened = false));
      } else {
        playerPos.current = { x: nextX, y: nextY };
      }

      AudioSynthesizer.playHover();
      render();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameStarted, floor]);

  const handleUsePotion = () => {
    if (potions <= 0 || hp >= maxHp) return;
    AudioSynthesizer.playSuccess();
    setPotions((p) => p - 1);
    setHp((h) => Math.min(maxHp, h + 50));
    setLog((prev) => ['🧪 Consumed Nano Repair Potion! Healed +50 HP.', ...prev.slice(0, 4)]);
  };

  return (
    <div className="relative w-full bg-[#0E121B] rounded-2xl overflow-hidden border border-slate-800/80 p-6 flex flex-col md:flex-row gap-6 shadow-2xl">
      {/* Canvas Game Area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-[#090C14]">
          <canvas ref={canvasRef} width={684} height={532} className="block" />

          {!isGameStarted && (
            <div className="absolute inset-0 bg-[#090C14]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <Sword className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-2xl font-black text-white mb-1">CRYPT OF SHADOWS</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-5">
                Roguelike 2D dungeon crawler. Slay skeleton guards, loot ancient treasure chests, and conquer dungeon floors.
              </p>
              <button
                onClick={() => {
                  AudioSynthesizer.playSuccess();
                  setIsGameStarted(true);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Enter Dungeon</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center gap-4 mt-4 w-full max-w-[684px] justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUsePotion}
              disabled={potions <= 0}
              className="px-4 py-2 bg-[#141926] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2 shadow"
            >
              <span>🧪 Drink Potion ({potions})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Use <span className="text-white font-bold">WASD / Arrow Keys</span> to explore & strike
          </div>
        </div>
      </div>

      {/* Hero Stats & Inventory Sidebar */}
      <div className="w-full md:w-80 space-y-4">
        {/* Status Card */}
        <div className="bg-[#141926] p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider">HERO STATUS</span>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              FLOOR {floor}
            </span>
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono font-bold mb-1">
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400" /> HP
              </span>
              <span className="text-slate-200">{hp} / {maxHp}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all"
                style={{ width: `${(hp / maxHp) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
            <span className="text-slate-400">GOLD LOOTED</span>
            <span className="text-amber-400 font-bold">{gold} G</span>
          </div>
        </div>

        {/* Combat Logs */}
        <div className="bg-[#141926] p-4 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            DUNGEON LOGS
          </div>
          <div className="space-y-1.5 min-h-[140px]">
            {log.map((entry, idx) => (
              <div key={idx} className="text-xs text-slate-300 font-mono bg-[#0B0E14] px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
