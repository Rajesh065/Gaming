import React, { useState } from 'react';
import { UserProfile, PlayerAvatarConfig } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { User, Shield, Trophy, Sparkles, Palette, Zap, Check } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [avatar, setAvatar] = useState<PlayerAvatarConfig>(user.avatar);
  const [isSaved, setIsSaved] = useState(false);

  const colors = ['#00ffcc', '#ff007f', '#8b5cf6', '#ffd000', '#0099ff', '#ffffff'];

  const handleSave = () => {
    soundFx.playPowerUp();
    const updated: UserProfile = { ...user, avatar };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-cyber-card via-[#151a2e] to-cyber-card border border-cyber-border p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-8">
        {/* Dynamic 3D/Canvas Avatar Hologram Preview */}
        <div className="w-36 h-36 rounded-3xl bg-cyber-darker border-2 border-cyber-neon flex flex-col items-center justify-center relative shadow-2xl glow-cyan overflow-hidden">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg"
            style={{
              backgroundColor: avatar.chassisColor,
              boxShadow: `0 0 25px ${avatar.chassisColor}`
            }}
          >
            🏎️
          </div>
          <div
            className="w-12 h-1.5 rounded-full mt-3 animate-pulse"
            style={{ backgroundColor: avatar.trailColor }}
          />
        </div>

        {/* User Details & Stats */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
            <h1 className="text-3xl font-black orbitron text-white">{user.displayName}</h1>
            <span className="text-xs px-2.5 py-0.5 bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50 rounded-full font-bold">
              Level {user.stats.level}
            </span>
            <span className="text-xs px-2.5 py-0.5 bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50 rounded-full font-bold">
              {user.stats.seasonRank}
            </span>
          </div>
          <p className="text-slate-400 text-xs font-mono mb-4">Player ID: {user.id} • Registered Member</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cyber-dark/80 p-4 rounded-2xl border border-cyber-border text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Rating ELO</span>
              <strong className="text-cyber-neon font-black font-mono text-sm">{user.stats.ratingElo}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Win Rate</span>
              <strong className="text-emerald-400 font-bold font-mono text-sm">{Math.round(user.stats.winRate * 100)}%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Matches Played</span>
              <strong className="text-white font-bold font-mono text-sm">{user.stats.totalGamesPlayed}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Achievements</span>
              <strong className="text-cyber-yellow font-bold font-mono text-sm">{user.stats.achievementsUnlocked} Unlocked</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Customization Lab */}
      <div className="bg-cyber-card border border-cyber-border p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 text-cyber-neon text-xs font-bold uppercase tracking-widest mb-1">
          <Palette className="w-4 h-4" /> Hologram Synthesis
        </div>
        <h2 className="text-2xl font-black orbitron text-white mb-6">CUSTOMIZE VEHICLE & AVATAR</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chassis Primary Color */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-3">Chassis Energy Hue</label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setAvatar({ ...avatar, chassisColor: c })}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    avatar.chassisColor === c ? 'scale-110 ring-4 ring-white shadow-lg' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Plasma Trail Color */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-3">Plasma Trail Vapor</label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setAvatar({ ...avatar, trailColor: c })}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    avatar.trailColor === c ? 'scale-110 ring-4 ring-white shadow-lg' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cyber-border flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-cyber-neon text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan flex items-center gap-2"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isSaved ? 'Hologram Synced!' : 'Save Avatar Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
