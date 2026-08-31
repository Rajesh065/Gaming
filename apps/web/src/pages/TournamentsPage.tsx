import React, { useState } from 'react';
import { Tournament, TournamentStatus, GameType, TournamentFormat } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { Trophy, Calendar, Users, Award, Play, ChevronRight, Zap } from 'lucide-react';

export const TournamentsPage: React.FC<{ onLaunchGame: (g: GameType) => void }> = ({ onLaunchGame }) => {
  const [tournaments] = useState<Tournament[]>([
    {
      id: 't-1',
      title: 'Neon Grand Prix Championship 2026',
      description: 'The pinnacle 3D Cyber Racer championship with massive gold and crystal prize pool.',
      gameType: GameType.CYBER_RACER,
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.LIVE,
      prizePoolGold: 25000,
      prizePoolCrystals: 1000,
      maxParticipants: 16,
      currentParticipants: 12,
      startDate: '2026-09-02T18:00:00Z',
      bracket: []
    },
    {
      id: 't-2',
      title: 'Crypt Masters Roguelike Gauntlet',
      description: 'Speed-run floor descent championship in Dungeon Rogue.',
      gameType: GameType.DUNGEON_ROGUE,
      format: TournamentFormat.DOUBLE_ELIMINATION,
      status: TournamentStatus.REGISTRATION,
      prizePoolGold: 15000,
      prizePoolCrystals: 500,
      maxParticipants: 32,
      currentParticipants: 20,
      startDate: '2026-09-05T20:00:00Z',
      bracket: []
    },
    {
      id: 't-3',
      title: 'Cosmo Armada Ace Tournament',
      description: 'Galactic score attack high-intensity space dogfight.',
      gameType: GameType.COSMO_STRIKE,
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.REGISTRATION,
      prizePoolGold: 10000,
      prizePoolCrystals: 300,
      maxParticipants: 16,
      currentParticipants: 8,
      startDate: '2026-09-08T19:00:00Z',
      bracket: []
    }
  ]);

  const [registeredIds, setRegisteredIds] = useState<string[]>(['t-1']);

  const handleRegister = (id: string) => {
    soundFx.playPowerUp();
    setRegisteredIds((prev) => [...prev, id]);
    alert('🏆 Successfully registered for Tournament!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-card via-[#151a2e] to-cyber-card border border-cyber-border p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-yellow/15 border border-cyber-yellow/40 rounded-full text-cyber-yellow text-xs font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" /> Official Esports League
          </div>
          <h1 className="text-3xl sm:text-4xl font-black orbitron text-white mb-2">CHAMPIONSHIP CUPS</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Register for official weekly cups, climb single and double-elimination brackets, and earn massive prize purses.
          </p>
        </div>

        <div className="bg-cyber-dark/90 p-4 rounded-2xl border border-cyber-yellow/40 text-center min-w-[200px] glow-cyan">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Prize Purse</div>
          <div className="text-2xl font-black orbitron text-cyber-yellow mt-0.5">💰 50,000 GOLD</div>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="space-y-6">
        {tournaments.map((t) => {
          const isRegistered = registeredIds.includes(t.id);
          return (
            <div
              key={t.id}
              className="bg-cyber-card border border-cyber-border hover:border-cyber-neon/60 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-all"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      t.status === TournamentStatus.LIVE
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                        : 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50'
                    }`}
                  >
                    ● {t.status}
                  </span>
                  <span className="text-xs text-cyber-pink font-semibold font-mono">{t.format}</span>
                </div>

                <h3 className="text-2xl font-bold orbitron text-white mb-2">{t.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-2xl mb-4">{t.description}</p>

                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-cyber-yellow font-bold">
                    <Trophy className="w-4 h-4" /> 💰 {t.prizePoolGold.toLocaleString()} + 💎 {t.prizePoolCrystals}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="w-4 h-4 text-cyber-blue" /> {t.currentParticipants} / {t.maxParticipants} Registered
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-4 h-4 text-cyber-purple" /> Starts in 2 Days
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col gap-2">
                {t.status === TournamentStatus.LIVE ? (
                  <button
                    onClick={() => onLaunchGame(t.gameType)}
                    className="px-8 py-3.5 bg-cyber-neon text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> Join Live Bracket
                  </button>
                ) : isRegistered ? (
                  <button
                    disabled
                    className="px-8 py-3.5 bg-cyber-dark border border-cyber-neon text-cyber-neon font-bold uppercase text-xs rounded-xl"
                  >
                    Registered ✓
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(t.id)}
                    className="px-8 py-3.5 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-pink"
                  >
                    Register Team
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
