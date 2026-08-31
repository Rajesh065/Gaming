import { InMemoryDB } from '../database/db.js';
import { UserProfile, PlayerAvatarConfig } from '@nexusplay/shared-types';

export class PlayerService {
  private db = InMemoryDB.getInstance();

  public getProfile(userId: string): UserProfile {
    const user = this.db.store.users.get(userId);
    if (!user) throw new Error('Player not found');
    const { passwordHash: _, ...profile } = user;
    return profile;
  }

  public updateAvatar(userId: string, avatarConfig: Partial<PlayerAvatarConfig>): UserProfile {
    const user = this.db.store.users.get(userId);
    if (!user) throw new Error('Player not found');
    user.avatar = { ...user.avatar, ...avatarConfig };
    const { passwordHash: _, ...profile } = user;
    return profile;
  }

  public getLeaderboard(limit: number = 20): UserProfile[] {
    const allUsers = Array.from(this.db.store.users.values()).map(
      ({ passwordHash: _, ...profile }) => profile
    );
    return allUsers
      .sort((a, b) => b.stats.ratingElo - a.stats.ratingElo)
      .slice(0, limit);
  }

  public grantRewards(userId: string, xp: number, gold: number, eloDelta: number): UserProfile {
    const user = this.db.store.users.get(userId);
    if (!user) throw new Error('Player not found');

    user.stats.currentXp += xp;
    while (user.stats.currentXp >= user.stats.nextLevelXp) {
      user.stats.currentXp -= user.stats.nextLevelXp;
      user.stats.level += 1;
      user.stats.nextLevelXp = Math.floor(user.stats.nextLevelXp * 1.3);
      user.currency.nexusCrystals += 5;
    }

    user.currency.gold += gold;
    user.stats.ratingElo = Math.max(0, user.stats.ratingElo + eloDelta);

    const { passwordHash: _, ...profile } = user;
    return profile;
  }
}
