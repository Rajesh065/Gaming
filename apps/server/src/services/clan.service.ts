import { InMemoryDB } from '../database/db.js';
import { Clan, ClanRole } from '@nexusplay/shared-types';

export class ClanService {
  private db = InMemoryDB.getInstance();

  public getClans(): Clan[] {
    return Array.from(this.db.store.clans.values());
  }

  public getClanById(id: string): Clan | null {
    return this.db.store.clans.get(id) || null;
  }

  public createClan(leaderId: string, name: string, tag: string, description: string): Clan {
    const user = this.db.store.users.get(leaderId);
    if (!user) throw new Error('User not found');
    if (user.currency.gold < 1000) {
      throw new Error('Creating a clan costs 1,000 gold');
    }

    user.currency.gold -= 1000;

    const clanId = `clan-${Date.now()}`;
    const newClan: Clan = {
      id: clanId,
      name,
      tag: tag.toUpperCase(),
      description,
      badgeEmblem: '⚔️',
      level: 1,
      totalXp: 0,
      memberCount: 1,
      maxMembers: 30,
      leaderId,
      members: [
        {
          userId: leaderId,
          username: user.username,
          role: ClanRole.LEADER,
          contributionXp: 0,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        }
      ],
      isRecruiting: true,
      minRatingRequired: 1000,
      createdAt: new Date().toISOString()
    };

    user.clanId = clanId;
    user.clanTag = newClan.tag;
    user.clanRole = 'LEADER';

    this.db.store.clans.set(clanId, newClan);
    return newClan;
  }

  public joinClan(userId: string, clanId: string): Clan {
    const user = this.db.store.users.get(userId);
    const clan = this.db.store.clans.get(clanId);
    if (!user || !clan) throw new Error('User or clan not found');

    if (clan.memberCount >= clan.maxMembers) {
      throw new Error('Clan is full');
    }

    if (clan.members.some((m) => m.userId === userId)) {
      throw new Error('Already a member of this clan');
    }

    clan.members.push({
      userId,
      username: user.username,
      role: ClanRole.MEMBER,
      contributionXp: 0,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    });
    clan.memberCount = clan.members.length;

    user.clanId = clanId;
    user.clanTag = clan.tag;
    user.clanRole = 'MEMBER';

    return clan;
  }
}
