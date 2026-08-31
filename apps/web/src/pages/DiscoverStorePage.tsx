import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Star,
  Download,
  Coins,
  Gem,
  Tag,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { UserProfile, GameItem } from '@nexusplay/shared-types';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface StoreProps {
  user: UserProfile;
  onPlayGame: (gameKey: string) => void;
}

export const DiscoverStorePage: React.FC<StoreProps> = ({ user, onPlayGame }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [crateOpening, setCrateOpening] = useState(false);
  const [crateReward, setCrateReward] = useState<string | null>(null);

  const featuredGames = [
    {
      id: 'cyber-racer',
      title: 'Apex Cyber Racer 3D',
      genre: 'Racing / Sci-Fi / WebGL',
      rating: '98% Overwhelmingly Positive',
      playerCount: '14,820 Active Racers',
      price: 'Free to Play',
      badge: 'SEASON 4 LIVE',
      bannerBg: 'from-indigo-600/30 via-slate-900 to-[#0B0E14]',
      desc: 'High-speed procedural 3D WebGL raceway with full vehicle customization, dynamic weather, and online MMR matchmaking.'
    },
    {
      id: 'dungeon-rogue',
      title: 'Crypt of Shadows: Rogue',
      genre: 'Action RPG / Roguelike',
      rating: '94% Very Positive',
      playerCount: '8,410 Explorers',
      price: 'Free to Play',
      badge: 'POPULAR',
      bannerBg: 'from-rose-600/30 via-slate-900 to-[#0B0E14]',
      desc: 'Procedural dungeon depths with 120+ unique gear drops, fog of war exploration, and intense tactical combat.'
    },
    {
      id: 'cosmo-strike',
      title: 'Void Vanguard: Cosmo Strike',
      genre: 'Arcade / Bullet Hell / Shooter',
      rating: '91% Very Positive',
      playerCount: '4,290 Pilots',
      price: 'Free to Play',
      badge: 'ARCADE',
      bannerBg: 'from-cyan-600/30 via-slate-900 to-[#0B0E14]',
      desc: 'Retro-modern space shooter with weapon upgrades, combo multipliers, and epic alien boss encounters.'
    },
    {
      id: 'nexus-chess',
      title: 'Grandmaster Tactics',
      genre: 'Turn-Based / Strategy',
      rating: '96% Very Positive',
      playerCount: '6,150 Tacticians',
      price: 'Free to Play',
      badge: 'STRATEGY',
      bannerBg: 'from-amber-600/30 via-slate-900 to-[#0B0E14]',
      desc: 'Competitive tactical board game featuring precision AI engine levels, Elo rating ladder, and live move notations.'
    }
  ];

  const handleOpenCrate = () => {
    AudioSynthesizer.playLaser();
    setCrateOpening(true);
    setCrateReward(null);

    setTimeout(() => {
      AudioSynthesizer.playSuccess();
      const rewards = [
        '🏎️ Apex Carbon Chassis (Legendary)',
        '⚡ Quantum Plasma Blaster (Mythic)',
        '🚀 Ion Afterburner (Epic)',
        '💎 250 Nexus Crystals Bonus!'
      ];
      const drop = rewards[Math.floor(Math.random() * rewards.length)];
      setCrateReward(drop);
      setCrateOpening(false);
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* Featured Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-[#121624] to-[#0E121B] p-8 md:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              FEATURED TITLE OF THE WEEK
            </span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-cyan-400" /> 98% Overwhelmingly Positive
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            APEX CYBER RACER 3D
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Experience next-generation 3D WebGL racing with procedural city highways, real-time particle thrusters, and authoritative 30Hz netcode.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                AudioSynthesizer.playSuccess();
                onPlayGame('cyber-racer');
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Instant in WebGL</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#141926] px-4 py-3 rounded-xl border border-slate-800">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-white font-bold">14,820 Players In Race</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Armory Loot Crate Opener */}
      <div className="bg-[#121624] border border-indigo-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Quantum Mystery Armory Crate</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Decrypt high-tier weapons, chassis bodykits, and rare Nexus Crystal drops. Every crate guarantees at least Rare tier.
          </p>
          {crateReward && (
            <div className="p-3 bg-[#0B0E14] border border-cyan-500/50 rounded-xl text-xs font-bold text-cyan-300 flex items-center gap-2">
              <span>🎉 UNLOCKED:</span> <span>{crateReward}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleOpenCrate}
          disabled={crateOpening}
          className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0 disabled:opacity-50 transition-all hover:scale-105"
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{crateOpening ? 'Decrypting Nanocrate...' : 'Decrypt Crate (250 Gold)'}</span>
        </button>
      </div>

      {/* Featured Games Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Top Rated Arenas</h2>
            <p className="text-xs text-slate-400">Playable directly in your browser without downloads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onPlayGame(game.id)}
              className="group bg-[#121624] rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 p-5 flex flex-col justify-between game-card-hover cursor-pointer shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    {game.badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{game.price}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{game.genre}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{game.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{game.playerCount}</span>
                <button className="px-3 py-1.5 bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white text-xs font-bold rounded-lg border border-indigo-500/30 transition-all flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
