import React from 'react';
import { Trophy, Shield, Users, Calendar, Coins, Gem, ArrowRight } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

export const ClansTournamentsPage: React.FC = () => {
  const tournaments = [
    {
      id: '1',
      title: 'Neon Grand Prix Championship 2026',
      game: 'Apex Cyber Racer 3D',
      format: 'Single Elimination (8 Teams)',
      prizeGold: '25,000 Gold',
      prizeCrystals: '1,000 Crystals',
      status: 'LIVE NOW',
      round: 'Semi-Finals',
      registered: '8 / 8 Teams'
    },
    {
      id: '2',
      title: 'Crypt Masters Guild Showdown',
      game: 'Crypt of Shadows',
      format: 'Co-op Speedrun',
      prizeGold: '15,000 Gold',
      prizeCrystals: '500 Crystals',
      status: 'REGISTRATION OPEN',
      round: 'Starts in 2h 45m',
      registered: '12 / 16 Teams'
    }
  ];

  const clans = [
    {
      id: '1',
      name: 'Nexus Vanguard',
      tag: 'NEXUS',
      level: 15,
      members: '48 / 50',
      leader: 'CyberAdmin',
      badge: '🛡️',
      description: 'Top ranked esports guild. Currently recruiting Diamond+ ranked racers.'
    },
    {
      id: '2',
      name: 'Shadow Syndicate',
      tag: 'VOID',
      level: 12,
      members: '36 / 40',
      leader: 'ShadowNinja',
      badge: '⚔️',
      description: 'Dungeon crawler experts focusing on high-floor boss raids and speedruns.'
    }
  ];

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* Tournaments Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Esports Championship Brackets</span>
          </h2>
          <p className="text-xs text-slate-400">Compete for massive crystal prize pools and global rank glory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-[#121624] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                  {t.status}
                </span>
                <span className="text-xs font-mono text-slate-400">{t.round}</span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{t.title}</h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">{t.game} • {t.format}</p>
              </div>

              <div className="flex items-center gap-4 bg-[#0B0E14] p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{t.prizeGold}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 font-bold">
                  <Gem className="w-3.5 h-3.5" />
                  <span>{t.prizeCrystals}</span>
                </div>
              </div>

              <button
                onClick={() => AudioSynthesizer.playSuccess()}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>View Tournament Bracket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guilds / Clans Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Competitive Clans & Guilds</span>
          </h2>
          <p className="text-xs text-slate-400">Join a team to unlock exclusive clan perks and shared armories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clans.map((c) => (
            <div key={c.id} className="bg-[#121624] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1A2030] flex items-center justify-center text-xl border border-slate-700">
                      {c.badge}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{c.name}</h3>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                          [{c.tag}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Leader: {c.leader}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    LV.{c.level}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-2">{c.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Members: {c.members}</span>
                <button
                  onClick={() => AudioSynthesizer.playSuccess()}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-all"
                >
                  Join Clan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
