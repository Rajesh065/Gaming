import React, { useState } from 'react';
import { Clan, UserProfile } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { Users, Shield, Award, UserPlus, Crown, Plus } from 'lucide-react';

export const ClansPage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [clans, setClans] = useState<Clan[]>([
    {
      id: 'clan-1',
      name: 'Nexus Vanguard',
      tag: 'NEXUS',
      description: 'Elite competitive esports organization dominating global leaderboards.',
      badgeEmblem: '🛡️',
      level: 15,
      totalXp: 85000,
      memberCount: 24,
      maxMembers: 50,
      leaderId: 'user-admin',
      members: [],
      isRecruiting: true,
      minRatingRequired: 1300,
      createdAt: '2026-01-10'
    },
    {
      id: 'clan-2',
      name: 'Shadow Syndicate',
      tag: 'VOID',
      description: 'Underground guild specializing in stealth tactics and crypt dungeon raids.',
      badgeEmblem: '🗡️',
      level: 9,
      totalXp: 34000,
      memberCount: 18,
      maxMembers: 40,
      leaderId: 'user-player2',
      members: [],
      isRecruiting: true,
      minRatingRequired: 1100,
      createdAt: '2026-02-14'
    },
    {
      id: 'clan-3',
      name: 'Solar Phoenix',
      tag: 'SUN',
      description: 'Fast-paced speed runners and racing tournament champions.',
      badgeEmblem: '🔥',
      level: 12,
      totalXp: 56000,
      memberCount: 30,
      maxMembers: 50,
      leaderId: 'user-player3',
      members: [],
      isRecruiting: false,
      minRatingRequired: 1500,
      createdAt: '2026-01-28'
    }
  ]);

  const [joinedClanId, setJoinedClanId] = useState<string | null>(user.clanId || 'clan-1');

  const handleJoin = (clanId: string) => {
    soundFx.playPowerUp();
    setJoinedClanId(clanId);
    alert('🎉 Successfully joined Clan!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-card via-[#151a2e] to-cyber-card border border-cyber-border p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-purple/15 border border-cyber-purple/40 rounded-full text-cyber-purple text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" /> Guilds & Clan Warfare
          </div>
          <h1 className="text-3xl sm:text-4xl font-black orbitron text-white mb-2">CLAN ALLIANCES</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Team up with fellow players, contribute clan XP, unlock exclusive guild emblems, and compete in Clan Wars.
          </p>
        </div>

        <button
          onClick={() => alert('Clan creation costs 1,000 Gold. Available to level 5+ players.')}
          className="px-6 py-3 bg-cyber-neon text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Clan
        </button>
      </div>

      {/* Clan Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clans.map((clan) => {
          const isUserMember = joinedClanId === clan.id;
          return (
            <div
              key={clan.id}
              className={`bg-cyber-card border p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all ${
                isUserMember ? 'border-cyber-neon glow-cyan' : 'border-cyber-border hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-cyber-dark rounded-xl border border-cyber-border">
                      {clan.badgeEmblem}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-white leading-tight">{clan.name}</h3>
                      <span className="text-xs font-mono font-bold text-cyber-pink">[{clan.tag}]</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-cyber-purple/20 text-cyber-purple font-bold rounded-lg">
                    Level {clan.level}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-6">{clan.description}</p>

                <div className="grid grid-cols-2 gap-3 bg-cyber-dark/80 p-3 rounded-xl border border-cyber-border/70 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Members</span>
                    <strong className="text-white font-mono">{clan.memberCount} / {clan.maxMembers}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Min Rating</span>
                    <strong className="text-cyber-yellow font-mono">{clan.minRatingRequired} ELO</strong>
                  </div>
                </div>
              </div>

              <div>
                {isUserMember ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-cyber-neon/20 border border-cyber-neon text-cyber-neon text-xs font-black uppercase rounded-xl"
                  >
                    Active Member
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(clan.id)}
                    className="w-full py-2.5 bg-cyber-dark hover:bg-slate-800 border border-cyber-border text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Request to Join
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
