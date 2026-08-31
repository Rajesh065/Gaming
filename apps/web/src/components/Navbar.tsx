import React from 'react';
import { Gamepad2, ShoppingBag, Users, Trophy, User, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import { UserProfile } from '@nexusplay/shared-types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenMatchmaking: () => void;
  onToggleChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenMatchmaking,
  onToggleChat
}) => {
  const navItems = [
    { id: 'dashboard', label: 'HUB', icon: Sparkles },
    { id: 'games', label: 'GAMES', icon: Gamepad2 },
    { id: 'store', label: 'STORE', icon: ShoppingBag },
    { id: 'clans', label: 'CLANS', icon: Users },
    { id: 'tournaments', label: 'TOURNAMENTS', icon: Trophy },
    { id: 'leaderboard', label: 'LADDER', icon: Trophy },
    { id: 'profile', label: 'PROFILE', icon: User },
    { id: 'admin', label: 'GM ADMIN', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07090e]/90 backdrop-blur-md border-b border-cyber-border/80 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-neon to-cyber-pink p-0.5 shadow-lg group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyber-neon" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black orbitron tracking-wider text-white">
              NEXUS<span className="text-cyber-neon">PLAY</span>
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 font-mono">
              NEXT-GEN GAMING ECOSYSTEM
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-cyber-card/60 p-1.5 rounded-xl border border-cyber-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  isActive
                    ? 'bg-cyber-neon text-black shadow-md glow-cyan font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Stats, Currency & Quick Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Play Matchmaking CTA */}
          <button
            onClick={onOpenMatchmaking}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all glow-pink shadow-lg"
          >
            <Gamepad2 className="w-4 h-4" /> Quick Match
          </button>

          {/* Currencies */}
          <div className="hidden md:flex items-center gap-3 bg-cyber-card px-3 py-1.5 rounded-xl border border-cyber-border text-xs">
            <span className="text-cyber-yellow font-bold flex items-center gap-1">
              💰 {user.currency.gold.toLocaleString()}
            </span>
            <span className="text-cyber-neon font-bold flex items-center gap-1">
              💎 {user.currency.nexusCrystals.toLocaleString()}
            </span>
          </div>

          {/* Chat Toggle Button */}
          <button
            onClick={onToggleChat}
            className="p-2 bg-cyber-card hover:bg-cyber-border rounded-xl border border-cyber-border text-slate-300 hover:text-cyber-neon transition-all relative"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-neon rounded-full" />
          </button>

          {/* Avatar Widget */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-neon to-cyber-purple p-0.5">
              <div className="w-full h-full bg-[#111420] rounded-[10px] flex items-center justify-center font-black text-xs text-cyber-neon">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                {user.username}
                <span className="text-[10px] px-1.5 py-0.2 bg-cyber-neon/20 text-cyber-neon rounded">
                  Lv.{user.stats.level}
                </span>
              </div>
              <span className="text-[10px] text-cyber-pink font-semibold">
                {user.stats.seasonRank}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
