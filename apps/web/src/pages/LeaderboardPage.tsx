import React, { useState } from 'react';
import { UserProfile } from '@nexusplay/shared-types';
import { Trophy, Medal, Award, Flame, Swords, Shield } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [filterGame, setFilterGame] = useState('ALL');

  const leaders = [
    { rank: 1, username: 'CyberAdmin', tag: 'NEXUS', elo: 2450, wins: 380, winRate: '84%', rankTier: 'GRANDMASTER', avatar: '👑' },
    { rank: 2, username: 'PhantomRider', tag: 'SUN', elo: 2310, wins: 310, winRate: '79%', rankTier: 'GRANDMASTER', avatar: '⚡' },
    { rank: 3, username: 'ViperStrike', tag: 'NEXUS', elo: 2180, wins: 265, winRate: '74%', rankTier: 'MASTER', avatar: '🏎️' },
    { rank: 4, username: 'ShadowNinja', tag: 'VOID', elo: 1950, wins: 198, winRate: '68%', rankTier: 'DIAMOND', avatar: '🗡️' },
    { rank: 5, username: 'AegisTitan', tag: 'TITAN', elo: 1820, wins: 145, winRate: '64%', rankTier: 'PLATINUM', avatar: '🛡️' },
    { rank: 6, username: 'NovaBlaster', tag: 'STAR', elo: 1740, wins: 120, winRate: '61%', rankTier: 'PLATINUM', avatar: '🚀' },
    { rank: 7, username: 'ZeroQuantum', tag: 'VOID', elo: 1620, wins: 95, winRate: '58%', rankTier: 'GOLD', avatar: '🔮' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-card via-[#151a2e] to-cyber-card border border-cyber-border p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-neon/15 border border-cyber-neon/40 rounded-full text-cyber-neon text-xs font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" /> Global MMR Rankings
          </div>
          <h1 className="text-3xl sm:text-4xl font-black orbitron text-white mb-2">HALL OF VALOR</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Real-time Elo ranking ladder tracking player match performance, tournament victories, and seasonal win rates.
          </p>
        </div>

        <div className="flex gap-2">
          {['ALL', 'CYBER RACER', 'DUNGEON ROGUE', 'COSMO STRIKE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterGame(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGame === tab
                  ? 'bg-cyber-neon text-black font-black glow-cyan'
                  : 'bg-cyber-dark text-slate-400 border border-cyber-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.slice(0, 3).map((player, idx) => (
          <div
            key={player.username}
            className={`bg-cyber-card border p-6 rounded-2xl shadow-xl flex flex-col items-center text-center relative ${
              idx === 0
                ? 'border-cyber-yellow glow-cyan'
                : idx === 1
                ? 'border-slate-400'
                : 'border-cyber-pink'
            }`}
          >
            <div className="text-4xl mb-2">{player.avatar}</div>
            <div className="text-xs font-bold text-cyber-pink font-mono mb-1">[{player.tag}]</div>
            <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40 mb-3">
              {player.rankTier}
            </span>

            <div className="text-2xl font-black orbitron text-cyber-neon">{player.elo} ELO</div>
            <div className="text-xs text-slate-400 mt-1">{player.wins} Wins • {player.winRate} Win Rate</div>
          </div>
        ))}
      </div>

      {/* Full Ranking Table */}
      <div className="bg-cyber-card border border-cyber-border rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-cyber-darker text-slate-400 uppercase font-mono border-b border-cyber-border">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Player</th>
              <th className="p-4">Tier</th>
              <th className="p-4">Rating ELO</th>
              <th className="p-4">Wins</th>
              <th className="p-4">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/60">
            {leaders.map((p) => (
              <tr key={p.username} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono font-bold">
                  {p.rank === 1 ? '🥇 #1' : p.rank === 2 ? '🥈 #2' : p.rank === 3 ? '🥉 #3' : `#${p.rank}`}
                </td>
                <td className="p-4 flex items-center gap-2">
                  <span className="text-lg">{p.avatar}</span>
                  <div>
                    <span className="font-bold text-white block">{p.username}</span>
                    <span className="text-[10px] text-cyber-pink font-mono">[{p.tag}]</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-cyber-purple/20 text-cyber-purple rounded font-semibold text-[10px]">
                    {p.rankTier}
                  </span>
                </td>
                <td className="p-4 font-mono font-black text-cyber-neon text-sm">{p.elo}</td>
                <td className="p-4 font-mono text-slate-300">{p.wins}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">{p.winRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
