import React, { useState } from 'react';
import { Gamepad2, Trophy, Users, Shield, Play } from 'lucide-react';
import { CyberRacerGame } from '../games/CyberRacerGame';
import { DungeonRogueGame } from '../games/DungeonRogueGame';
import { CosmoStrikeGame } from '../games/CosmoStrikeGame';
import { NexusChessGame } from '../games/NexusChessGame';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface ArenaProps {
  initialGame?: string;
}

export const LiveArenaPage: React.FC<ArenaProps> = ({ initialGame = 'cyber-racer' }) => {
  const [selectedGame, setSelectedGame] = useState(initialGame);

  const gameOptions = [
    { id: 'cyber-racer', name: 'Apex Cyber Racer 3D', icon: '🏎️', badge: '3D WebGL' },
    { id: 'dungeon-rogue', name: 'Crypt of Shadows: Rogue', icon: '🗡️', badge: '2D RPG' },
    { id: 'cosmo-strike', name: 'Void Vanguard: Cosmo Strike', icon: '🚀', badge: 'Arcade' },
    { id: 'nexus-chess', name: 'Grandmaster Tactics', icon: '♟️', badge: 'Strategy' }
  ];

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Game Selector Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {gameOptions.map((g) => {
          const isSelected = selectedGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                AudioSynthesizer.playClick();
                setSelectedGame(g.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-[#121624] text-slate-400 hover:text-slate-200 hover:bg-[#181D2E] border border-slate-800'
              }`}
            >
              <span className="text-base">{g.icon}</span>
              <span>{g.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {g.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Game Viewport */}
      <div>
        {selectedGame === 'cyber-racer' && <CyberRacerGame />}
        {selectedGame === 'dungeon-rogue' && <DungeonRogueGame />}
        {selectedGame === 'cosmo-strike' && <CosmoStrikeGame />}
        {selectedGame === 'nexus-chess' && <NexusChessGame />}
      </div>
    </div>
  );
};
