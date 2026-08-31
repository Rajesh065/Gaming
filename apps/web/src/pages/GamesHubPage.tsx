import React, { useState } from 'react';
import { GameType } from '@nexusplay/shared-types';
import { CyberRacerGame } from '../games/cyber-racer/CyberRacerGame';
import { DungeonRogueGame } from '../games/dungeon-rogue/DungeonRogueGame';
import { CosmoStrikeGame } from '../games/cosmo-strike/CosmoStrikeGame';
import { NexusChessGame } from '../games/nexus-chess/NexusChessGame';
import { soundFx } from '../components/AudioSynthesizer';
import { Gamepad2, ArrowLeft, Maximize2, Sparkles, Trophy } from 'lucide-react';

export const GamesHubPage: React.FC<{ initialGame?: GameType }> = ({ initialGame = GameType.CYBER_RACER }) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(initialGame);

  const games = [
    {
      type: GameType.CYBER_RACER,
      title: 'Cyber Racer 3D',
      badge: '3D WebGL Engine',
      icon: '🏎️',
      color: 'border-cyber-neon',
      desc: 'High-speed futuristic racer with dynamic track, lighting, and nitro boosts.'
    },
    {
      type: GameType.DUNGEON_ROGUE,
      title: 'Dungeon Rogue',
      badge: 'Procedural RPG',
      icon: '🧙‍♂️',
      color: 'border-cyber-purple',
      desc: 'Explore procedurally generated crypts, fight skeletons, and collect gold.'
    },
    {
      type: GameType.COSMO_STRIKE,
      title: 'Cosmo Strike',
      badge: 'Arcade Bullet Hell',
      icon: '🚀',
      color: 'border-cyber-pink',
      desc: 'Retro arcade space shooter defending orbital sectors against alien waves.'
    },
    {
      type: GameType.NEXUS_CHESS,
      title: 'Nexus Chess',
      badge: 'Tactical Strategy',
      icon: '♟️',
      color: 'border-cyber-yellow',
      desc: 'Turn-based tactics with chess rules, captures, and AI bot opponent.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Game Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-cyber-card border border-cyber-border p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyber-neon/10 border border-cyber-neon/30 rounded-xl text-cyber-neon">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold orbitron text-white">GAME ARENAS</h1>
            <p className="text-xs text-slate-400">Select any arena below to play instantly in your browser</p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {games.map((g) => (
            <button
              key={g.type}
              onClick={() => {
                soundFx.playClick();
                setActiveGame(g.type);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGame === g.type
                  ? 'bg-cyber-neon text-black font-black glow-cyan'
                  : 'bg-cyber-dark hover:bg-slate-800 text-slate-300 border border-cyber-border'
              }`}
            >
              <span>{g.icon}</span>
              {g.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Game Viewport */}
      <div>
        {activeGame === GameType.CYBER_RACER && <CyberRacerGame />}
        {activeGame === GameType.DUNGEON_ROGUE && <DungeonRogueGame />}
        {activeGame === GameType.COSMO_STRIKE && <CosmoStrikeGame />}
        {activeGame === GameType.NEXUS_CHESS && <NexusChessGame />}
      </div>
    </div>
  );
};
