import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DiscoverStorePage } from './pages/DiscoverStorePage';
import { LibraryPage } from './pages/LibraryPage';
import { LiveArenaPage } from './pages/LiveArenaPage';
import { ClansTournamentsPage } from './pages/ClansTournamentsPage';
import { ProfileArmoryPage } from './pages/ProfileArmoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { UserProfile, UserRole, PlayerStatus } from '@nexusplay/shared-types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedGameKey, setSelectedGameKey] = useState('cyber-racer');

  const [user, setUser] = useState<UserProfile>({
    id: 'user-demo',
    username: 'ApexPilot',
    displayName: 'Apex Pilot',
    email: 'pilot@nexusplay.gg',
    role: UserRole.ADMIN,
    status: PlayerStatus.ONLINE,
    avatar: {
      chassisColor: '#6366f1',
      trailColor: '#06b6d4',
      visorType: 'TITAN_HELM',
      glowIntensity: 1.5,
      particleEffect: 'QUANTUM_AURA'
    },
    stats: {
      level: 18,
      currentXp: 4200,
      nextLevelXp: 6000,
      totalGamesPlayed: 142,
      totalWins: 98,
      totalLosses: 44,
      winRate: 0.69,
      killDeathRatio: 2.45,
      ratingElo: 1820,
      seasonRank: 'MASTER',
      reputationScore: 98,
      achievementsUnlocked: 22
    },
    currency: {
      gold: 8450,
      nexusCrystals: 240,
      credits: 3200
    },
    clanId: 'clan-1',
    clanTag: 'NEXUS',
    clanRole: 'OFFICER',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  });

  const handlePlayGame = (gameKey: string) => {
    setSelectedGameKey(gameKey);
    setActiveTab('arena');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Main Content Area + Social Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          {activeTab === 'discover' && (
            <DiscoverStorePage user={user} onPlayGame={handlePlayGame} />
          )}
          {activeTab === 'library' && (
            <LibraryPage onPlayGame={handlePlayGame} />
          )}
          {activeTab === 'arena' && (
            <LiveArenaPage initialGame={selectedGameKey} />
          )}
          {activeTab === 'esports' && <ClansTournamentsPage />}
          {activeTab === 'clans' && <ClansTournamentsPage />}
          {activeTab === 'profile' && (
            <ProfileArmoryPage
              user={user}
              onUpdateAvatar={(avatar) => setUser({ ...user, avatar })}
            />
          )}
          {activeTab === 'admin' && <AdminDashboardPage />}
        </main>

        {/* Discord-style Friends & Social Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};
export default App;
