import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatBox } from './components/ChatBox';
import { MatchmakingModal } from './components/MatchmakingModal';
import { DashboardPage } from './pages/DashboardPage';
import { GamesHubPage } from './pages/GamesHubPage';
import { StorePage } from './pages/StorePage';
import { ClansPage } from './pages/ClansPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { GameType, UserProfile, UserRole, PlayerStatus } from '@nexusplay/shared-types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.CYBER_RACER);

  const [user, setUser] = useState<UserProfile>({
    id: 'user-player1',
    username: 'ViperStrike',
    displayName: 'Viper Strike',
    email: 'viper@nexusplay.gg',
    role: UserRole.PLAYER,
    status: PlayerStatus.ONLINE,
    avatar: {
      chassisColor: '#00ffcc',
      trailColor: '#ff007f',
      visorType: 'CYBER_HEX',
      glowIntensity: 1.5,
      particleEffect: 'NEON_SPARKS'
    },
    stats: {
      level: 14,
      currentXp: 3800,
      nextLevelXp: 5000,
      totalGamesPlayed: 92,
      totalWins: 58,
      totalLosses: 34,
      winRate: 0.63,
      killDeathRatio: 1.95,
      ratingElo: 1580,
      seasonRank: 'DIAMOND',
      reputationScore: 95,
      achievementsUnlocked: 16
    },
    currency: {
      gold: 4250,
      nexusCrystals: 95,
      credits: 1400
    },
    clanId: 'clan-1',
    clanTag: 'NEXUS',
    clanRole: 'OFFICER',
    createdAt: '2026-01-15',
    lastLoginAt: new Date().toISOString()
  });

  const launchGame = (gameType: GameType) => {
    setSelectedGame(gameType);
    setActiveTab('games');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-['Rajdhani',sans-serif]">
      {/* Top Cyber Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenMatchmaking={() => setIsMatchmakingOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            user={user}
            onSelectGame={launchGame}
            onOpenMatchmaking={() => setIsMatchmakingOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'games' && <GamesHubPage initialGame={selectedGame} />}
        {activeTab === 'store' && <StorePage user={user} onUpdateUser={setUser} />}
        {activeTab === 'clans' && <ClansPage user={user} />}
        {activeTab === 'tournaments' && <TournamentsPage onLaunchGame={launchGame} />}
        {activeTab === 'leaderboard' && <LeaderboardPage />}
        {activeTab === 'profile' && <ProfilePage user={user} onUpdateUser={setUser} />}
        {activeTab === 'admin' && <AdminPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border/80 bg-[#06080c] py-6 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold orbitron text-white">NEXUS<span className="text-cyber-neon">PLAY</span></span>
            <span>• Next-Gen Esports Platform Monorepo</span>
          </div>
          <div className="flex gap-6 font-mono text-[11px]">
            <span>ENGINE: THREE.JS + CANVAS</span>
            <span>NETCODE: 30Hz SOCKET.IO</span>
            <span>DATABASE: PRISMA ORM</span>
          </div>
        </div>
      </footer>

      {/* Global Real-Time Chat Box */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Matchmaking Queue Modal */}
      <MatchmakingModal
        isOpen={isMatchmakingOpen}
        onClose={() => setIsMatchmakingOpen(false)}
        onLaunchGame={launchGame}
      />
    </div>
  );
};
