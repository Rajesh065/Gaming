import React, { useState, useEffect } from 'react';
import { GameType, GameMode } from '@nexusplay/shared-types';
import { soundFx } from './AudioSynthesizer';
import { X, Loader2, CheckCircle2, Zap, Swords, Flame, Globe } from 'lucide-react';

interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (gameType: GameType) => void;
}

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({
  isOpen,
  onClose,
  onLaunchGame
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.CYBER_RACER);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.RANKED_1V1);
  const [queueState, setQueueState] = useState<'IDLE' | 'SEARCHING' | 'MATCH_FOUND'>('IDLE');
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (queueState === 'SEARCHING') {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);

      // Simulate match finding after 3 seconds
      const timeout = setTimeout(() => {
        setQueueState('MATCH_FOUND');
        soundFx.playPowerUp();
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setTimerSeconds(0);
    }
  }, [queueState]);

  if (!isOpen) return null;

  const startQueue = () => {
    soundFx.playLaser();
    setQueueState('SEARCHING');
  };

  const cancelQueue = () => {
    soundFx.playClick();
    setQueueState('IDLE');
  };

  const acceptMatch = () => {
    soundFx.playPowerUp();
    onClose();
    onLaunchGame(selectedGame);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#0e111d] border border-cyber-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative glow-cyan">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {queueState === 'IDLE' && (
          <div>
            <div className="flex items-center gap-2 text-cyber-neon mb-1">
              <Zap className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-widest">Matchmaking Queue</span>
            </div>
            <h2 className="text-2xl font-black orbitron text-white mb-6">SELECT ARENA & MODE</h2>

            {/* Game Selector */}
            <div className="space-y-2.5 mb-6">
              {[
                { type: GameType.CYBER_RACER, title: 'Cyber Racer 3D', icon: '🏎️', desc: 'High-speed anti-gravity procedural circuit' },
                { type: GameType.COSMO_STRIKE, title: 'Cosmo Strike', icon: '🚀', desc: 'Galactic bullet hell space dogfight' },
                { type: GameType.DUNGEON_ROGUE, title: 'Dungeon Rogue', icon: '⚔️', desc: 'Co-op crypt exploration & boss raid' },
                { type: GameType.NEXUS_CHESS, title: 'Nexus Chess', icon: '♟️', desc: 'Turn-based tactical cyberboard battle' }
              ].map((g) => (
                <button
                  key={g.type}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedGame(g.type);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-all ${
                    selectedGame === g.type
                      ? 'border-cyber-neon bg-cyber-neon/10 shadow-md'
                      : 'border-cyber-border bg-cyber-card/60 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white">{g.title}</div>
                    <div className="text-xs text-slate-400">{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { mode: GameMode.RANKED_1V1, label: '1v1 Competitive Ranked', elo: '+25 MMR' },
                { mode: GameMode.CASUAL_FFA, label: 'Casual Quickplay', elo: 'Unranked' }
              ].map((m) => (
                <button
                  key={m.mode}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedMode(m.mode);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMode === m.mode
                      ? 'border-cyber-pink bg-cyber-pink/10 text-white'
                      : 'border-cyber-border bg-cyber-card/40 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-cyber-pink mt-0.5">{m.elo}</div>
                </button>
              ))}
            </div>

            <button
              onClick={startQueue}
              className="w-full py-3.5 bg-gradient-to-r from-cyber-neon to-cyber-blue text-black font-black uppercase tracking-wider rounded-xl hover:opacity-95 transition-all glow-cyan flex items-center justify-center gap-2 shadow-xl"
            >
              <Globe className="w-4 h-4" /> Find Match Now
            </button>
          </div>
        )}

        {queueState === 'SEARCHING' && (
          <div className="py-12 flex flex-col items-center text-center">
            <Loader2 className="w-14 h-14 text-cyber-neon animate-spin mb-4" />
            <h3 className="text-xl font-bold orbitron text-white mb-1">SEARCHING FOR OPPONENTS...</h3>
            <p className="text-slate-400 text-xs mb-6">Scanning global matchmaking clusters (US-East, EU-Central)</p>
            <div className="text-3xl font-mono font-bold text-cyber-yellow mb-8">
              00:{timerSeconds.toString().padStart(2, '0')}
            </div>
            <button
              onClick={cancelQueue}
              className="px-8 py-2.5 bg-cyber-dark hover:bg-slate-800 border border-cyber-border text-slate-300 text-xs font-bold uppercase rounded-xl transition-all"
            >
              Cancel Queue
            </button>
          </div>
        )}

        {queueState === 'MATCH_FOUND' && (
          <div className="py-8 flex flex-col items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-cyber-neon mb-3 animate-bounce" />
            <h3 className="text-3xl font-black orbitron text-white mb-2 text-glow-cyan">MATCH READY!</h3>
            <p className="text-slate-300 text-sm mb-6">Opponent found: <strong className="text-cyber-neon">ShadowNinja (1,380 ELO)</strong></p>
            <button
              onClick={acceptMatch}
              className="w-full py-4 bg-gradient-to-r from-cyber-pink to-cyber-neon text-black text-sm font-black uppercase tracking-widest rounded-xl hover:opacity-95 transition-all glow-pink shadow-xl"
            >
              Enter Arena Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
