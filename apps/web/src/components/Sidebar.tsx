import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Mic,
  Headphones,
  Plus,
  Circle,
  Radio,
  Send,
  Sparkles
} from 'lucide-react';
import { AudioSynthesizer } from './AudioSynthesizer';

interface FriendStatus {
  id: string;
  name: string;
  avatarBg: string;
  status: 'ONLINE' | 'IN_GAME' | 'AWAY';
  activity: string;
  gameType?: string;
}

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'chat'>('friends');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', user: 'ViperStrike', text: 'Anyone up for 3D Cyber Racer ranked?', time: '10:42 PM' },
    { id: '2', user: 'ShadowNinja', text: 'Floor 5 in Dungeon Rogue is intense! Got a mythic sword drop 🔥', time: '10:44 PM' },
    { id: '3', user: 'GhostRider', text: 'Tournament starts in 15 mins. Ready up!', time: '10:45 PM' }
  ]);

  const friends: FriendStatus[] = [
    { id: '1', name: 'ViperStrike', avatarBg: '#06b6d4', status: 'IN_GAME', activity: 'Cyber Racer 3D • Lap 2/3', gameType: 'CYBER_RACER' },
    { id: '2', name: 'ShadowNinja', avatarBg: '#f59e0b', status: 'IN_GAME', activity: 'Dungeon Rogue • Floor 5', gameType: 'DUNGEON_ROGUE' },
    { id: '3', name: 'GhostRider', avatarBg: '#8b5cf6', status: 'ONLINE', activity: 'Lobby • Ready for Queue' },
    { id: '4', name: 'NovaPulse', avatarBg: '#10b981', status: 'ONLINE', activity: 'Browsing Store & Armory' },
    { id: '5', name: 'KronoX', avatarBg: '#64748b', status: 'AWAY', activity: 'AFK • 12m' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    AudioSynthesizer.playLaser();
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        user: 'You',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <aside className="w-72 bg-[#0E121B] border-l border-slate-800/80 flex flex-col h-[calc(100vh-61px)] select-none">
      {/* Header Tabs */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex bg-[#141926] p-1 rounded-xl border border-slate-800 w-full">
          <button
            onClick={() => {
              AudioSynthesizer.playClick();
              setActiveTab('friends');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'friends'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Social (5)</span>
          </button>
          <button
            onClick={() => {
              AudioSynthesizer.playClick();
              setActiveTab('chat');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Global Chat</span>
          </button>
        </div>
      </div>

      {/* Friends List Tab */}
      {activeTab === 'friends' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Party Voice Box */}
          <div className="bg-[#141926] border border-indigo-500/20 rounded-2xl p-3 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Party Voice Channel</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                CONNECTED
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#0B0E14] px-3 py-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice Auto-Muted</span>
              </div>
              <Headphones className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Active Friends Roster */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Online Friends (4)
              </span>
              <button
                onClick={() => AudioSynthesizer.playClick()}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="group flex items-center justify-between p-2 rounded-xl bg-[#141926]/60 hover:bg-[#141926] border border-transparent hover:border-slate-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: f.avatarBg }}
                      >
                        {f.name.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0E121B] ${
                          f.status === 'IN_GAME'
                            ? 'bg-indigo-400'
                            : f.status === 'ONLINE'
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {f.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{f.activity}</p>
                    </div>
                  </div>
                  {f.status === 'IN_GAME' && (
                    <button
                      onClick={() => AudioSynthesizer.playClick()}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded border border-indigo-500/40 transition-all"
                    >
                      Spectate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="bg-[#141926] p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-400">{m.user}</span>
                  <span className="text-[9px] text-slate-500 font-mono">{m.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed break-words">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/80 bg-[#0B0E14]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to global lobby..."
                className="flex-1 bg-[#141926] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
