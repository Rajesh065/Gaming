export enum UserRole {
  GUEST = 'GUEST',
  PLAYER = 'PLAYER',
  VIP = 'VIP',
  MODERATOR = 'MODERATOR',
  GAME_MASTER = 'GAME_MASTER',
  ADMIN = 'ADMIN'
}

export enum PlayerStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  IN_QUEUE = 'IN_QUEUE',
  IN_GAME = 'IN_GAME',
  SPECTATING = 'SPECTATING',
  AFK = 'AFK'
}

export interface PlayerStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  killDeathRatio: number;
  ratingElo: number;
  seasonRank: string;
  reputationScore: number;
  achievementsUnlocked: number;
}

export interface PlayerAvatarConfig {
  chassisColor: string;
  trailColor: string;
  visorType: string;
  glowIntensity: number;
  hatId?: string;
  weaponSkinId?: string;
  badgeId?: string;
  particleEffect: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  status: PlayerStatus;
  avatar: PlayerAvatarConfig;
  stats: PlayerStats;
  currency: {
    gold: number;
    nexusCrystals: number;
    credits: number;
  };
  clanId?: string;
  clanTag?: string;
  clanRole?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}
