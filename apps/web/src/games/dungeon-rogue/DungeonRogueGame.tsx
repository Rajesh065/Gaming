import React, { useEffect, useRef, useState } from 'react';
import { DungeonGenerator, GeneratedDungeon, TileType } from '@nexusplay/game-engine';
import { soundFx } from '../../components/AudioSynthesizer';
import { Shield, Swords, Sparkles, Heart, Trophy, RotateCcw } from 'lucide-react';

export const DungeonRogueGame: React.FC<{ onGameOver?: (score: number) => void }> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [gold, setGold] = useState(0);
  const [dungeonLevel, setDungeonLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [heroLevel, setHeroLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>(['Entered the Crypt of Shadows.']);

  const game = useRef<{
    dungeon: GeneratedDungeon;
    hero: { x: number; y: number; attack: number; defense: number };
    enemies: Array<{ id: string; x: number; y: number; hp: number; maxHp: number; attack: number; name: string; icon: string }>;
    chests: Array<{ x: number; y: number; opened: boolean; gold: number }>;
    revealed: boolean[][];
  }>({
    dungeon: DungeonGenerator.generate(36, 28, 8),
    hero: { x: 0, y: 0, attack: 25, defense: 5 },
    enemies: [],
    chests: [],
    revealed: []
  });

  const initLevel = (levelNum: number) => {
    const dungeon = DungeonGenerator.generate(36, 28, 8);
    const hero = {
      x: dungeon.spawnPoint.x,
      y: dungeon.spawnPoint.y,
      attack: 25 + levelNum * 5,
      defense: 5 + levelNum * 2
    };

    const enemies: Array<any> = [];
    const chests: Array<any> = [];

    // Place enemies in rooms
    for (let i = 1; i < dungeon.rooms.length; i++) {
      const r = dungeon.rooms[i];
      enemies.push({
        id: `mob-${i}`,
        x: r.centerX,
        y: r.centerY,
        hp: 40 + levelNum * 20,
        maxHp: 40 + levelNum * 20,
        attack: 10 + levelNum * 4,
        name: i % 2 === 0 ? 'Cursed Skeleton' : 'Void Wraith',
        icon: i % 2 === 0 ? '💀' : '👻'
      });

      if (Math.random() > 0.4) {
        chests.push({
          x: r.x + 1,
          y: r.y + 1,
          opened: false,
          gold: 50 + Math.floor(Math.random() * 80)
        });
      }
    }

    const revealed: boolean[][] = Array.from({ length: 36 }, () =>
      Array.from({ length: 28 }, () => false)
    );

    game.current = { dungeon, hero, enemies, chests, revealed };
    revealFog(hero.x, hero.y);
  };

  const revealFog = (hx: number, hy: number) => {
    const r = 5;
    for (let x = Math.max(0, hx - r); x <= Math.min(35, hx + r); x++) {
      for (let y = Math.max(0, hy - r); y <= Math.min(27, hy + r); y++) {
        if ((x - hx) ** 2 + (y - hy) ** 2 <= r * r) {
          game.current.revealed[x][y] = true;
        }
      }
    }
  };

  useEffect(() => {
    initLevel(dungeonLevel);
  }, []);

  const moveHero = (dx: number, dy: number) => {
    if (isDead) return;
    const g = game.current;
    const nx = g.hero.x + dx;
    const ny = g.hero.y + dy;

    if (nx < 0 || nx >= 36 || ny < 0 || ny >= 28) return;
    if (g.dungeon.tiles[nx][ny] === TileType.WALL) return;

    // Check Enemy Attack
    const enemyIndex = g.enemies.findIndex((e) => e.x === nx && e.y === ny && e.hp > 0);
    if (enemyIndex !== -1) {
      const mob = g.enemies[enemyIndex];
      soundFx.playLaser();
      const dmg = Math.max(5, g.hero.attack - 2);
      mob.hp -= dmg;

      const newLog = [`Hero struck ${mob.name} for ${dmg} damage!`];

      if (mob.hp <= 0) {
        soundFx.playExplosion();
        setScore((s) => s + 150);
        setGold((gl) => gl + 30);
        setXp((x) => {
          const next = x + 40;
          if (next >= 100) {
            setHeroLevel((l) => l + 1);
            setMaxHealth((m) => m + 20);
            setHealth((h) => h + 20);
            soundFx.playPowerUp();
            newLog.push('⚡ Level Up! Health & stats increased.');
            return next - 100;
          }
          return next;
        });
        newLog.push(`💀 Defeated ${mob.name}! Gained 30 Gold.`);
      } else {
        // Retaliation
        const mobDmg = Math.max(2, mob.attack - g.hero.defense);
        setHealth((h) => {
          const nextHp = Math.max(0, h - mobDmg);
          if (nextHp <= 0) {
            setIsDead(true);
            soundFx.playExplosion();
            if (onGameOver) onGameOver(score);
          }
          return nextHp;
        });
        newLog.push(`${mob.name} retaliated for ${mobDmg} damage!`);
      }

      setCombatLog((prev) => [...newLog, ...prev.slice(0, 5)]);
      render();
      return;
    }

    // Check Chest Loot
    const chest = g.chests.find((c) => c.x === nx && c.y === ny && !c.opened);
    if (chest) {
      chest.opened = true;
      soundFx.playPowerUp();
      setGold((gold) => gold + chest.gold);
      setScore((s) => s + 75);
      setCombatLog((prev) => [`💎 Opened Treasure Chest! Gained ${chest.gold} Gold.`, ...prev.slice(0, 5)]);
    }

    // Check Dungeon Staircase Exit
    if (nx === g.dungeon.exitPoint.x && ny === g.dungeon.exitPoint.y) {
      soundFx.playPowerUp();
      setDungeonLevel((lvl) => {
        const nextLvl = lvl + 1;
        initLevel(nextLvl);
        return nextLvl;
      });
      setScore((s) => s + 500);
      setCombatLog((prev) => [`🚪 Descended deeper into Floor ${dungeonLevel + 1}!`, ...prev.slice(0, 5)]);
      return;
    }

    g.hero.x = nx;
    g.hero.y = ny;
    revealFog(nx, ny);
    render();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) moveHero(0, -1);
      if (['ArrowDown', 'KeyS'].includes(e.code)) moveHero(0, 1);
      if (['ArrowLeft', 'KeyA'].includes(e.code)) moveHero(-1, 0);
      if (['ArrowRight', 'KeyD'].includes(e.code)) moveHero(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDead, dungeonLevel, score]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 22;
    const g = game.current;

    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < 36; x++) {
      for (let y = 0; y < 28; y++) {
        const isRevealed = g.revealed[x]?.[y];
        if (!isRevealed) {
          ctx.fillStyle = '#040508';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          continue;
        }

        const tile = g.dungeon.tiles[x][y];
        if (tile === TileType.WALL) {
          ctx.fillStyle = '#1e2433';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          ctx.strokeStyle = '#2b354c';
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillStyle = '#0f141f';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

          if (x === g.dungeon.exitPoint.x && y === g.dungeon.exitPoint.y) {
            ctx.font = '16px sans-serif';
            ctx.fillText('🚪', x * tileSize + 2, y * tileSize + 18);
          }
        }
      }
    }

    // Render Chests
    for (const c of g.chests) {
      if (g.revealed[c.x]?.[c.y]) {
        ctx.font = '14px sans-serif';
        ctx.fillText(c.opened ? '📦' : '🎁', c.x * tileSize + 2, c.y * tileSize + 17);
      }
    }

    // Render Enemies
    for (const mob of g.enemies) {
      if (mob.hp > 0 && g.revealed[mob.x]?.[mob.y]) {
        ctx.font = '16px sans-serif';
        ctx.fillText(mob.icon, mob.x * tileSize + 2, mob.y * tileSize + 18);

        // Mob Health Bar
        const barW = 16;
        const hpPercent = mob.hp / mob.maxHp;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(mob.x * tileSize + 3, mob.y * tileSize + 1, barW, 2);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(mob.x * tileSize + 3, mob.y * tileSize + 1, barW * hpPercent, 2);
      }
    }

    // Render Hero
    if (g.revealed[g.hero.x]?.[g.hero.y]) {
      ctx.font = '18px sans-serif';
      ctx.fillText('🧙‍♂️', g.hero.x * tileSize + 1, g.hero.y * tileSize + 18);
    }
  };

  useEffect(() => {
    render();
  }, [dungeonLevel, isDead]);

  const restartDungeon = () => {
    setHealth(100);
    setMaxHealth(100);
    setGold(0);
    setDungeonLevel(1);
    setScore(0);
    setHeroLevel(1);
    setXp(0);
    setIsDead(false);
    setCombatLog(['Restarted journey in the Crypt of Shadows.']);
    initLevel(1);
  };

  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row gap-6">
      {/* 2D Canvas Viewport */}
      <div className="relative flex-1 bg-cyber-darker rounded-xl border border-cyber-border/70 overflow-hidden flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={36 * 22}
          height={28 * 22}
          className="rounded-lg shadow-lg"
        />

        {isDead && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <h3 className="text-3xl font-black orbitron text-red-500 mb-2 text-glow-pink">YOU PERISHED</h3>
            <p className="text-slate-400 text-sm mb-4">Slain in Floor {dungeonLevel} of the dungeon.</p>
            <button
              onClick={restartDungeon}
              className="px-6 py-2.5 bg-cyber-neon text-black font-bold uppercase rounded-xl flex items-center gap-2 hover:opacity-90 transition-all glow-cyan"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* RPG Stats & Action Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* Status Card */}
        <div className="bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-cyber-neon font-bold uppercase tracking-wider">Hero Level {heroLevel}</span>
            <span className="text-xs text-cyber-yellow font-mono">Floor {dungeonLevel}</span>
          </div>

          {/* Health Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> Health</span>
              <span>{health} / {maxHealth}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-150"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-cyber-purple" /> XP</span>
              <span>{xp} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-purple transition-all duration-150"
                style={{ width: `${xp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wealth & Score */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyber-dark/80 p-3 rounded-xl border border-cyber-border text-center">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Gold Found</div>
            <div className="text-xl font-bold orbitron text-cyber-yellow mt-0.5">💰 {gold}</div>
          </div>
          <div className="bg-cyber-dark/80 p-3 rounded-xl border border-cyber-border text-center">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Score</div>
            <div className="text-xl font-bold orbitron text-cyber-neon mt-0.5">{score}</div>
          </div>
        </div>

        {/* Combat Log */}
        <div className="flex-1 bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border flex flex-col">
          <div className="text-xs text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-cyber-neon" /> Battle Log
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto text-xs max-h-48 font-mono">
            {combatLog.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-white font-semibold' : 'text-slate-400'}>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Controls Guide */}
        <div className="text-xs text-slate-400 bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/40">
          Use <strong className="text-white font-mono">WASD / Arrow Keys</strong> to move & attack monsters. Walk into 🚪 to reach the next dungeon tier!
        </div>
      </div>
    </div>
  );
};
