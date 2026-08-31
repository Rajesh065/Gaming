import React, { useState, useEffect } from 'react';
import { ServerTelemetry, AntiCheatReport, GameBalanceConfig } from '@nexusplay/shared-types';
import { soundFx } from '../components/AudioSynthesizer';
import { ShieldCheck, Activity, AlertTriangle, Sliders, Users, RefreshCw, Cpu, Server, Check } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ServerTelemetry>({
    uptimeSeconds: 1420,
    cpuUsagePercent: 11.2,
    memoryUsageMb: 148,
    activeSocketConnections: 34,
    activeGameRooms: 6,
    matchmakingQueueSize: 2,
    messagesPerSecond: 28,
    tickRateAverageHz: 30.0
  });

  const [balance, setBalance] = useState<GameBalanceConfig>({
    cyberRacer: { maxSpeed: 280, turboMultiplier: 1.8, driftHandling: 1.4 },
    dungeonRogue: { basePlayerHealth: 150, enemyDamageScale: 1.1, dropRateMultiplier: 1.25 },
    cosmoStrike: { fireRateCap: 15, bossHealthMultiplier: 2.0, shieldRegenDelayMs: 2500 }
  });

  const [antiCheatLogs] = useState<AntiCheatReport[]>([
    {
      id: 'ac-1',
      userId: 'user-hacker99',
      username: 'VoidGlitcher',
      gameType: 'CYBER_RACER',
      violationType: 'SPEED_HACK',
      confidenceScore: 0.96,
      snapshotData: { expectedSpeed: 280, recordedSpeed: 890 },
      timestamp: '2026-08-31 09:12:44',
      isReviewed: true,
      actionTaken: 'TEMP_BAN'
    },
    {
      id: 'ac-2',
      userId: 'user-suspicious1',
      username: 'PacketSpoofer',
      gameType: 'COSMO_STRIKE',
      violationType: 'INVALID_PACKET_RATE',
      confidenceScore: 0.91,
      snapshotData: { deltaMs: 14500 },
      timestamp: '2026-08-31 09:21:05',
      isReviewed: false
    }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        cpuUsagePercent: Math.max(5, Math.min(30, prev.cpuUsagePercent + (Math.random() - 0.5) * 3)),
        messagesPerSecond: Math.floor(20 + Math.random() * 15),
        tickRateAverageHz: 29.95 + (Math.random() - 0.5) * 0.1
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveBalance = () => {
    soundFx.playPowerUp();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-card via-[#151a2e] to-cyber-card border border-red-500/40 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/15 border border-red-500/40 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Game Master & Archon Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-black orbitron text-white mb-2">PLATFORM OPERATIONS</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Authoritative tick telemetry, active WebSocket cluster monitoring, live anti-cheat enforcement, and real-time game balancing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-cyber-dark/80 px-4 py-2 rounded-xl border border-cyber-border text-xs font-mono text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> CLUSTER HEALTHY (30 Hz Tick)
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-cyber-card border border-cyber-border p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-semibold mb-2">
            <span>Tick Rate</span>
            <Activity className="w-4 h-4 text-cyber-neon" />
          </div>
          <div className="text-2xl sm:text-3xl font-black orbitron text-cyber-neon">
            {telemetry.tickRateAverageHz.toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">Hz</span>
          </div>
        </div>

        <div className="bg-cyber-card border border-cyber-border p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-semibold mb-2">
            <span>Active Sockets</span>
            <Users className="w-4 h-4 text-cyber-pink" />
          </div>
          <div className="text-2xl sm:text-3xl font-black orbitron text-cyber-pink">
            {telemetry.activeSocketConnections}
          </div>
        </div>

        <div className="bg-cyber-card border border-cyber-border p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-semibold mb-2">
            <span>Game Rooms</span>
            <Server className="w-4 h-4 text-cyber-purple" />
          </div>
          <div className="text-2xl sm:text-3xl font-black orbitron text-cyber-purple">
            {telemetry.activeGameRooms}
          </div>
        </div>

        <div className="bg-cyber-card border border-cyber-border p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-semibold mb-2">
            <span>Heap Memory</span>
            <Cpu className="w-4 h-4 text-cyber-yellow" />
          </div>
          <div className="text-2xl sm:text-3xl font-black orbitron text-cyber-yellow">
            {telemetry.memoryUsageMb} <span className="text-xs font-sans text-slate-400 font-normal">MB</span>
          </div>
        </div>
      </div>

      {/* Two Column: Anti-Cheat Logs & Balance Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Anti-Cheat Log Inspector */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold orbitron text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> ANTI-CHEAT LOGS
              </h3>
              <span className="text-xs text-red-400 font-mono font-bold">2 Incidents Flagged</span>
            </div>

            <div className="space-y-3">
              {antiCheatLogs.map((log) => (
                <div key={log.id} className="bg-cyber-dark/90 p-4 rounded-xl border border-red-500/30 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white">{log.username} ({log.gameType})</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded font-mono font-bold text-[10px]">
                      {log.violationType}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mb-2">Confidence: {Math.round(log.confidenceScore * 100)}% • {log.timestamp}</div>
                  <div className="bg-black/40 p-2 rounded text-[11px] font-mono text-slate-300">
                    {JSON.stringify(log.snapshotData)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Game Balance Tuner */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold orbitron text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyber-neon" /> GAME BALANCE TUNER
              </h3>
              <span className="text-xs text-cyber-neon font-mono">Authoritative Overrides</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-bold mb-1">
                  <span>Cyber Racer Max Speed (KM/H)</span>
                  <span className="text-cyber-neon font-mono">{balance.cyberRacer.maxSpeed}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="400"
                  value={balance.cyberRacer.maxSpeed}
                  onChange={(e) =>
                    setBalance({
                      ...balance,
                      cyberRacer: { ...balance.cyberRacer, maxSpeed: parseInt(e.target.value, 10) }
                    })
                  }
                  className="w-full accent-cyber-neon"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-bold mb-1">
                  <span>Dungeon Rogue Drop Rate Multiplier</span>
                  <span className="text-cyber-purple font-mono">{balance.dungeonRogue.dropRateMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={balance.dungeonRogue.dropRateMultiplier}
                  onChange={(e) =>
                    setBalance({
                      ...balance,
                      dungeonRogue: { ...balance.dungeonRogue, dropRateMultiplier: parseFloat(e.target.value) }
                    })
                  }
                  className="w-full accent-cyber-purple"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-bold mb-1">
                  <span>Cosmo Strike Fire Rate Cap</span>
                  <span className="text-cyber-pink font-mono">{balance.cosmoStrike.fireRateCap} shots/sec</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={balance.cosmoStrike.fireRateCap}
                  onChange={(e) =>
                    setBalance({
                      ...balance,
                      cosmoStrike: { ...balance.cosmoStrike, fireRateCap: parseInt(e.target.value, 10) }
                    })
                  }
                  className="w-full accent-cyber-pink"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveBalance}
            className="w-full mt-6 py-3 bg-cyber-neon text-black font-black uppercase text-xs tracking-wider rounded-xl hover:opacity-90 transition-all glow-cyan flex items-center justify-center gap-2"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            {isSaved ? 'Balance Variables Pushed Live!' : 'Deploy Balance Overrides'}
          </button>
        </div>
      </div>
    </div>
  );
};
