import React from 'react';
import { Library, Play, Clock, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface LibraryProps {
  onPlayGame: (gameKey: string) => void;
}

export const LibraryPage: React.FC<LibraryProps> = ({ onPlayGame }) => {
  const libraryGames = [
    {
      id: 'cyber-racer',
      title: 'Apex Cyber Racer 3D',
      hoursPlayed: '42.6 hrs',
      lastPlayed: 'Today',
      achievements: '18 / 24 Unlocked',
      version: 'v2.4.1 (Latest)',
      icon: '🏎️'
    },
    {
      id: 'dungeon-rogue',
      title: 'Crypt of Shadows: Rogue',
      hoursPlayed: '19.4 hrs',
      lastPlayed: 'Yesterday',
      achievements: '12 / 20 Unlocked',
      version: 'v1.8.0 (Latest)',
      icon: '🗡️'
    },
    {
      id: 'cosmo-strike',
      title: 'Void Vanguard: Cosmo Strike',
      hoursPlayed: '8.2 hrs',
      lastPlayed: '3 days ago',
      achievements: '8 / 15 Unlocked',
      version: 'v1.2.4 (Latest)',
      icon: '🚀'
    },
    {
      id: 'nexus-chess',
      title: 'Grandmaster Tactics',
      hoursPlayed: '14.1 hrs',
      lastPlayed: 'Last week',
      achievements: '10 / 16 Unlocked',
      version: 'v1.1.0 (Latest)',
      icon: '♟️'
    }
  ];

  return (
    <div className="space-y-6 pb-12 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Personal Game Library</h1>
          <p className="text-xs text-slate-400">4 Titles Installed & Ready for Cloud Execution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {libraryGames.map((game) => (
          <div
            key={game.id}
            className="bg-[#121624] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl game-card-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#1A2030] flex items-center justify-center text-2xl border border-slate-700">
                  {game.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{game.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{game.hoursPlayed} on record</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cloud Synced
              </span>
            </div>

            <div className="my-4 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Achievements
                </span>
                <span className="text-slate-200 font-bold">{game.achievements}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-3/4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">{game.version}</span>
              <button
                onClick={() => {
                  AudioSynthesizer.playSuccess();
                  onPlayGame(game.id);
                }}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Arena</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
