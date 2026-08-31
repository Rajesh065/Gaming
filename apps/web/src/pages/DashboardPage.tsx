import React from 'react';
import { GameType, UserProfile } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { Trophy, Zap, Shield, Flame, Play, Swords, Sparkles, ChevronRight, Gift } from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  onSelectGame: (gameType: GameType) => void;
  onOpenMatchmaking: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onSelectGame,
  onOpenMatchmaking,
  setActiveTab
}) => {
  const dailyQuests = [
    { title: 'Cyber Speed Demon', desc: 'Reach 200 KM/H in Cyber Racer 3D', reward: '+150 Gold', progress: 85, done: false },
    { title: 'Crypt Purge', desc: 'Slay 5 Skeletons in Dungeon Rogue', reward: '+200 Gold', progress: 100, done: true },
    { title: 'Sector Defender', desc: 'Clear Wave 3 in Cosmo Strike', reward: '+10 Crystals', progress: 40, done: false }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Futuristic Hologram Vibe */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1424] via-[#10192e] to-[#180f26] border border-cyber-border p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-neon/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyber-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-neon/10 border border-cyber-neon/40 rounded-full text-cyber-neon text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Season 4: Cyber Rebellion Live
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black orbitron text-white tracking-tight leading-none mb-4">
            ENTER THE <span className="text-cyber-neon text-glow-cyan">NEXUS</span> ARENA
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Compete in next-generation 3D WebGL racing, co-op dungeon rogue crawlers, and space dogfight arenas with real-time authoritative netcode.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectGame(GameType.CYBER_RACER)}
              className="px-8 py-4 bg-cyber-neon text-black font-black uppercase tracking-wider rounded-2xl hover:opacity-90 transition-all glow-cyan shadow-xl flex items-center gap-2 text-sm"
            >
              <Play className="w-5 h-5 fill-current" /> Play Cyber Racer 3D
            </button>
            <button
              onClick={onOpenMatchmaking}
              className="px-8 py-4 bg-cyber-card/80 hover:bg-cyber-card border border-cyber-border text-white font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 text-sm"
            >
              <Flame className="w-5 h-5 text-cyber-pink" /> Ranked Matchmaking
            </button>
          </div>
        </div>
      </div>

      {/* Featured Games Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black orbitron text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-cyber-neon" /> FEATURED ARENAS
          </h2>
          <button
            onClick={() => setActiveTab('games')}
            className="text-xs text-cyber-neon hover:underline font-bold uppercase flex items-center gap-1"
          >
            View All Games <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              type: GameType.CYBER_RACER,
              title: 'Cyber Racer 3D',
              genre: 'WebGL 3D Racer',
              icon: '🏎️',
              tag: 'FEATURED 3D',
              tagColor: 'bg-cyber-neon/20 text-cyber-neon border-cyber-neon/40',
              desc: 'High-octane neon circuit racing with procedural obstacles and nitro boosts.'
            },
            {
              type: GameType.DUNGEON_ROGUE,
              title: 'Dungeon Rogue',
              genre: 'Roguelike RPG',
              icon: '🧙‍♂️',
              tag: 'CO-OP RAID',
              tagColor: 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/40',
              desc: 'Explore procedurally generated crypts, slay undead mobs, and collect epic loot.'
            },
            {
              type: GameType.COSMO_STRIKE,
              title: 'Cosmo Strike',
              genre: 'Space Arcade Shooter',
              icon: '🚀',
              tag: 'BULLET HELL',
              tagColor: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/40',
              desc: 'Defend orbital planetary sectors against alien armada waves with laser beams.'
            },
            {
              type: GameType.NEXUS_CHESS,
              title: 'Nexus Chess',
              genre: 'Turn-Based Tactics',
              icon: '♟️',
              tag: 'STRATEGY',
              tagColor: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/40',
              desc: 'Grandmaster tactical board battle with rating progression & smart AI.'
            }
          ].map((game) => (
            <div
              key={game.type}
              onClick={() => {
                soundFx.playClick();
                onSelectGame(game.type);
              }}
              className="group bg-cyber-card border border-cyber-border hover:border-cyber-neon/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-lg hover:glow-cyan flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{game.icon}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${game.tagColor}`}>
                    {game.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold orbitron text-white group-hover:text-cyber-neon transition-colors mb-1">
                  {game.title}
                </h3>
                <div className="text-xs text-cyber-pink font-semibold mb-3">{game.genre}</div>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">{game.desc}</p>
              </div>

              <div className="pt-4 border-t border-cyber-border/60 flex items-center justify-between text-xs font-bold text-cyber-neon">
                <span>LAUNCH ARENA</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Daily Quests & Season Battle Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Quests */}
        <div className="lg:col-span-2 bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold orbitron text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-cyber-yellow" /> DAILY OPERATIONS & BOUNTIES
            </h3>
            <span className="text-xs text-slate-400 font-mono">Resets in 14h 32m</span>
          </div>

          <div className="space-y-3">
            {dailyQuests.map((q, idx) => (
              <div
                key={idx}
                className="bg-cyber-dark/80 border border-cyber-border/70 p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{q.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-cyber-yellow/15 text-cyber-yellow font-bold rounded">
                      {q.reward}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{q.desc}</p>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${q.done ? 'bg-cyber-neon' : 'bg-cyber-blue'}`}
                      style={{ width: `${q.progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  {q.done ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-cyber-neon/20 border border-cyber-neon text-cyber-neon text-xs font-bold uppercase rounded-xl"
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectGame(GameType.CYBER_RACER)}
                      className="px-4 py-2 bg-cyber-dark hover:bg-slate-800 border border-cyber-border text-white text-xs font-bold uppercase rounded-xl transition-all"
                    >
                      Progress
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Season Battle Pass Progress */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyber-pink text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" /> Season 4 Pass
            </div>
            <h3 className="text-2xl font-black orbitron text-white mb-2">CYBER WARLORD</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Unlock Tier 50 to claim the exclusive Mythic Quantum Hover-Chassis skin.
            </p>

            <div className="bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border mb-4">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-white">Tier {user.stats.level} / 50</span>
                <span className="text-cyber-neon">{user.stats.currentXp} / {user.stats.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-pink to-cyber-neon"
                  style={{ width: `${(user.stats.currentXp / user.stats.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('store')}
            className="w-full py-3 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all glow-pink"
          >
            Upgrade to Premium Pass
          </button>
        </div>
      </div>
    </div>
  );
};
