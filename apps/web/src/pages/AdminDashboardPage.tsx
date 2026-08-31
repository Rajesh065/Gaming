import React, { useState } from 'react';
import { Activity, ShieldAlert, Cpu, Server, Sliders, Check } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

export const AdminDashboardPage: React.FC = () => {
  const [maxSpeed, setMaxSpeed] = useState(280);
  const [enemyScale, setEnemyScale] = useState(1.1);
  const [saved, setSaved] = useState(false);

  const handleSaveConfig = () => {
    AudioSynthesizer.playSuccess();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          <span>Game Master & Server Operations</span>
        </h1>
        <p className="text-xs text-slate-400">Live authoritative room clusters & real-time balance tuning</p>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121624] border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 block mb-1">TICK RATE</span>
          <span className="text-xl font-black font-mono text-emerald-400">29.98 Hz</span>
        </div>
        <div className="bg-[#121624] border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 block mb-1">CONNECTED SOCKETS</span>
          <span className="text-xl font-black font-mono text-cyan-400">1,428</span>
        </div>
        <div className="bg-[#121624] border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 block mb-1">HEAP MEMORY</span>
          <span className="text-xl font-black font-mono text-indigo-400">142 MB</span>
        </div>
        <div className="bg-[#121624] border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 block mb-1">MATCHMAKING QUEUE</span>
          <span className="text-xl font-black font-mono text-amber-400">14 Active</span>
        </div>
      </div>

      {/* Live Game Balance Tuning Sliders */}
      <div className="bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Live Game Balance Controls</h3>
          </div>
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Applied to Cluster
            </span>
          )}
        </div>

        {/* Cyber Racer Max Speed */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Cyber Racer Max Speed</span>
            <span className="text-cyan-400 font-bold">{maxSpeed} KM/H</span>
          </div>
          <input
            type="range"
            min={150}
            max={350}
            value={maxSpeed}
            onChange={(e) => setMaxSpeed(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Dungeon Enemy Damage Scale */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Dungeon Rogue Mob Damage Scale</span>
            <span className="text-rose-400 font-bold">{enemyScale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.05}
            value={enemyScale}
            onChange={(e) => setEnemyScale(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <button
          onClick={handleSaveConfig}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
        >
          Push Changes to Game Cluster
        </button>
      </div>
    </div>
  );
};
