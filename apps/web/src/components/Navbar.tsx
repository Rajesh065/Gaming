import React from 'react';
import {
  Gamepad2,
  Compass,
  Library,
  Flame,
  Shield,
  Trophy,
  User,
  Settings,
  Bell,
  Coins,
  Gem,
  Activity
} from 'lucide-react';
import { UserProfile } from '@nexusplay/shared-types';
import { AudioSynthesizer } from './AudioSynthesizer';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenWalletModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenWalletModal
}) => {
  const navItems = [
    { id: 'discover', label: 'Store', icon: Compass },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'arena', label: 'Play Arenas', icon: Gamepad2, badge: 'LIVE' },
    { id: 'esports', label: 'Tournaments', icon: Trophy },
    { id: 'clans', label: 'Clans', icon: Shield },
    { id: 'profile', label: 'Armory', icon: User },
    { id: 'admin', label: 'Operations', icon: Activity, adminOnly: true }
  ];

  const handleTabClick = (tabId: string) => {
    AudioSynthesizer.playClick();
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0E121B]/95 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('discover')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0E121B] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                NEXUS<span className="text-cyan-400">PLAY</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wider">
                V2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Esports & Gaming Cloud
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#141926]/90 p-1 rounded-xl border border-slate-800/90 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                onMouseEnter={() => AudioSynthesizer.playHover()}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Balance & Avatar Bar */}
        <div className="flex items-center gap-3">
          {/* Wallet Badges */}
          <div
            onClick={onOpenWalletModal}
            className="flex items-center gap-2 bg-[#141926] px-3 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.currency.gold.toLocaleString()}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700 mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 font-mono">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user.currency.nexusCrystals.toLocaleString()}</span>
            </div>
          </div>

          {/* Notifications */}
          <button
            onClick={() => AudioSynthesizer.playClick()}
            className="relative p-2 rounded-xl bg-[#141926] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0E121B]" />
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => handleTabClick('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-[#141926] rounded-xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shadow"
              style={{ backgroundColor: user.avatar.chassisColor || '#6366f1' }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {user.username}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                  LV.{user.stats.level}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {user.stats.seasonRank} • {user.stats.ratingElo} ELO
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
