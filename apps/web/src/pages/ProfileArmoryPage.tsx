import React, { useState } from 'react';
import { User, Shield, Trophy, Zap, Palette, Award, Check } from 'lucide-react';
import { UserProfile, PlayerAvatarConfig } from '@nexusplay/shared-types';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

interface ProfileProps {
  user: UserProfile;
  onUpdateAvatar?: (avatar: PlayerAvatarConfig) => void;
}

export const ProfileArmoryPage: React.FC<ProfileProps> = ({ user, onUpdateAvatar }) => {
  const [chassisColor, setChassisColor] = useState(user.avatar.chassisColor || '#6366f1');
  const [trailColor, setTrailColor] = useState(user.avatar.trailColor || '#06b6d4');
  const [visor, setVisor] = useState(user.avatar.visorType || 'TITAN_HELM');
  const [saved, setSaved] = useState(false);

  const colors = ['#6366f1', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'];
  const visors = ['TITAN_HELM', 'CYBER_HEX', 'VOID_MASK', 'SPECTRAL_VISOR'];

  const handleSaveAvatar = () => {
    AudioSynthesizer.playSuccess();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onUpdateAvatar?.({
      ...user.avatar,
      chassisColor,
      trailColor,
      visorType: visor
    });
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* Player Battle Card Banner */}
      <div className="bg-[#121624] border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl ring-4 ring-slate-800"
            style={{ backgroundColor: chassisColor }}
          >
            {user.username.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-white">{user.displayName || user.username}</h1>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                [{user.clanTag || 'NEXUS'}]
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Season Rank: <span className="text-indigo-400 font-bold">{user.stats.seasonRank}</span> • {user.stats.ratingElo} MMR
            </p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full md:w-64 bg-[#0B0E14] p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold">LEVEL {user.stats.level}</span>
            <span className="text-cyan-400">{user.stats.currentXp} / {user.stats.nextLevelXp} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
              style={{ width: `${(user.stats.currentXp / user.stats.nextLevelXp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats & Customization Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Stats Box */}
        <div className="bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Competitive Career Stats</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">TOTAL WINS</span>
              <span className="text-lg font-black text-emerald-400">{user.stats.totalWins}</span>
            </div>
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">WIN RATE</span>
              <span className="text-lg font-black text-cyan-400">{Math.round(user.stats.winRate * 100)}%</span>
            </div>
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">K/D RATIO</span>
              <span className="text-lg font-black text-indigo-400">{user.stats.killDeathRatio}</span>
            </div>
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">REPUTATION</span>
              <span className="text-lg font-black text-amber-400">{user.stats.reputationScore} / 100</span>
            </div>
          </div>
        </div>

        {/* 3D Avatar & Color Customizer */}
        <div className="bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Armory Avatar Customizer</h3>
            </div>
            {saved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          {/* Primary Color Palette */}
          <div>
            <span className="text-xs text-slate-400 block mb-2 font-mono">PRIMARY CHASSIS COLOR</span>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    AudioSynthesizer.playClick();
                    setChassisColor(c);
                  }}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    chassisColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Visor Select */}
          <div>
            <span className="text-xs text-slate-400 block mb-2 font-mono">HEADGEAR / VISOR</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {visors.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    AudioSynthesizer.playClick();
                    setVisor(v);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    visor === v
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'bg-[#0B0E14] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveAvatar}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Apply Loadout Customization
          </button>
        </div>
      </div>
    </div>
  );
};
