import React, { useState } from 'react';
import { Send, X, Users, MessageSquare } from 'lucide-react';
import { soundFx } from './AudioSynthesizer';

interface ChatMessage {
  id: string;
  sender: string;
  clanTag?: string;
  channel: string;
  content: string;
  time: string;
}

export const ChatBox: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [channel, setChannel] = useState<'GLOBAL' | 'PARTY' | 'CLAN'>('GLOBAL');
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'CyberAdmin', clanTag: 'NEXUS', channel: 'GLOBAL', content: 'Welcome to NexusPlay Alpha v1.0! Jump into Cyber Racer or Cosmo Strike.', time: '09:20' },
    { id: '2', sender: 'ViperStrike', clanTag: 'NEXUS', channel: 'GLOBAL', content: 'Anyone up for a 1v1 Ranked Grand Prix match?', time: '09:24' },
    { id: '3', sender: 'ShadowNinja', channel: 'GLOBAL', content: 'Just cleared Floor 5 in Crypt of Shadows! The loot drop was insane 🔥', time: '09:26' }
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    soundFx.playClick();
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'ViperStrike',
      clanTag: 'NEXUS',
      channel,
      content: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[480px] bg-[#0d101a]/95 backdrop-blur-xl border border-cyber-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-cyber-card border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyber-neon" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Nexus Global Comms</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Channel Switcher */}
      <div className="flex border-b border-cyber-border bg-cyber-darker text-[11px] font-bold">
        {(['GLOBAL', 'PARTY', 'CLAN'] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => setChannel(ch)}
            className={`flex-1 py-1.5 transition-all ${
              channel === ch
                ? 'text-cyber-neon border-b-2 border-cyber-neon bg-cyber-card/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto font-sans text-xs">
        {messages
          .filter((m) => channel === 'GLOBAL' || m.channel === channel)
          .map((m) => (
            <div key={m.id} className="bg-cyber-dark/50 p-2 rounded-lg border border-cyber-border/40">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-cyber-neon flex items-center gap-1">
                  {m.clanTag && <span className="text-[10px] text-cyber-pink font-mono">[{m.clanTag}]</span>}
                  {m.sender}
                </span>
                <span className="text-[10px] text-slate-500">{m.time}</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{m.content}</p>
            </div>
          ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-cyber-card border-t border-cyber-border flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Message #${channel.toLowerCase()}...`}
          className="flex-1 bg-cyber-darker border border-cyber-border rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-neon"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-cyber-neon text-black rounded-xl hover:opacity-90 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
