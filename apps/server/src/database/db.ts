import {
  UserProfile,
  UserRole,
  PlayerStatus,
  GameItem,
  ItemType,
  ItemRarity,
  Clan,
  ClanRole,
  Tournament,
  TournamentFormat,
  TournamentStatus,
  GameType,
  MarketplaceListing
} from '@nexusplay/shared-types';
import bcrypt from 'bcryptjs';

export interface DBStore {
  users: Map<string, UserProfile & { passwordHash: string }>;
  items: Map<string, GameItem>;
  inventory: Map<string, { id: string; userId: string; itemId: string; quantity: number; durability: number; isEquipped: boolean }>;
  clans: Map<string, Clan>;
  tournaments: Map<string, Tournament>;
  marketplace: Map<string, MarketplaceListing>;
}

export class InMemoryDB {
  private static instance: InMemoryDB;
  public store: DBStore;

  private constructor() {
    this.store = {
      users: new Map(),
      items: new Map(),
      inventory: new Map(),
      clans: new Map(),
      tournaments: new Map(),
      marketplace: new Map()
    };
    this.seedDefaultData();
  }

  public static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  private seedDefaultData(): void {
    const defaultItems: GameItem[] = [
      {
        id: 'item-1',
        name: 'Apex Cyber Runner V1',
        description: 'Aerodynamic carbon-fiber racing chassis with neon underglow.',
        type: ItemType.VEHICLE_CHASSIS,
        rarity: ItemRarity.LEGENDARY,
        icon: '🏎️',
        basePriceGold: 2500,
        basePriceCrystals: 50,
        tradable: true,
        attributes: { speedBoost: 25, acceleration: 15, handling: 20 },
        requiredLevel: 5
      },
      {
        id: 'item-2',
        name: 'Plasma Ion Thruster',
        description: 'High-thrust afterburner providing instant speed surges.',
        type: ItemType.VEHICLE_BOOSTER,
        rarity: ItemRarity.EPIC,
        icon: '🚀',
        basePriceGold: 1200,
        basePriceCrystals: 20,
        tradable: true,
        attributes: { speedBoost: 35, acceleration: 40 },
        requiredLevel: 3
      },
      {
        id: 'item-3',
        name: 'Quantum Particle Blaster',
        description: 'Fires high-velocity ionized plasma bolts.',
        type: ItemType.WEAPON_BLASTER,
        rarity: ItemRarity.MYTHIC,
        icon: '⚡',
        basePriceGold: 5000,
        basePriceCrystals: 100,
        tradable: true,
        attributes: { damage: 85, critChanceBonus: 0.25 },
        requiredLevel: 10
      },
      {
        id: 'item-4',
        name: 'Shadow Katana of Void',
        description: 'Forged from dark matter, bypasses 30% of armor.',
        type: ItemType.WEAPON_MELEE,
        rarity: ItemRarity.EPIC,
        icon: '🗡️',
        basePriceGold: 1800,
        basePriceCrystals: 30,
        tradable: true,
        attributes: { damage: 65, critChanceBonus: 0.15 },
        requiredLevel: 4
      },
      {
        id: 'item-5',
        name: 'Aegis Force Shield',
        description: 'Hard-light kinetic barrier with instant recharging.',
        type: ItemType.ARMOR_SHIELD,
        rarity: ItemRarity.RARE,
        icon: '🛡️',
        basePriceGold: 800,
        basePriceCrystals: 15,
        tradable: true,
        attributes: { defense: 45 },
        requiredLevel: 2
      },
      {
        id: 'item-6',
        name: 'Cyber Hologram Visor',
        description: 'Augmented reality heads-up display.',
        type: ItemType.AVATAR_COSMETIC,
        rarity: ItemRarity.UNCOMMON,
        icon: '🥽',
        basePriceGold: 300,
        basePriceCrystals: 5,
        tradable: true,
        attributes: {},
        requiredLevel: 1
      },
      {
        id: 'item-7',
        name: 'Nano Repair Potion',
        description: 'Instantly regenerates 100 hit points.',
        type: ItemType.CONSUMABLE_POTION,
        rarity: ItemRarity.COMMON,
        icon: '🧪',
        basePriceGold: 50,
        basePriceCrystals: 1,
        tradable: true,
        attributes: {},
        requiredLevel: 1
      }
    ];

    for (const item of defaultItems) {
      this.store.items.set(item.id, item);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Password123!', salt);

    const demoUsers: Array<UserProfile & { passwordHash: string }> = [
      {
        id: 'user-admin',
        username: 'CyberAdmin',
        displayName: 'Nexus Archon',
        email: 'admin@nexusplay.gg',
        passwordHash: hash,
        role: UserRole.ADMIN,
        status: PlayerStatus.ONLINE,
        avatar: {
          chassisColor: '#6366f1',
          trailColor: '#06b6d4',
          visorType: 'TITAN_HELM',
          glowIntensity: 2.0,
          particleEffect: 'QUANTUM_AURA'
        },
        stats: {
          level: 50,
          currentXp: 45000,
          nextLevelXp: 50000,
          totalGamesPlayed: 450,
          totalWins: 380,
          totalLosses: 70,
          winRate: 0.84,
          killDeathRatio: 4.2,
          ratingElo: 2450,
          seasonRank: 'GRANDMASTER',
          reputationScore: 99,
          achievementsUnlocked: 28
        },
        currency: { gold: 50000, nexusCrystals: 1200, credits: 15000 },
        clanId: 'clan-1',
        clanTag: 'NEXUS',
        clanRole: 'LEADER',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      },
      {
        id: 'user-player1',
        username: 'ViperStrike',
        displayName: 'Viper Strike',
        email: 'viper@nexusplay.gg',
        passwordHash: hash,
        role: UserRole.PLAYER,
        status: PlayerStatus.ONLINE,
        avatar: {
          chassisColor: '#06b6d4',
          trailColor: '#f43f5e',
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
        currency: { gold: 4250, nexusCrystals: 95, credits: 1400 },
        clanId: 'clan-1',
        clanTag: 'NEXUS',
        clanRole: 'OFFICER',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      },
      {
        id: 'user-player2',
        username: 'ShadowNinja',
        displayName: 'Shadow Ninja',
        email: 'shadow@nexusplay.gg',
        passwordHash: hash,
        role: UserRole.PLAYER,
        status: PlayerStatus.ONLINE,
        avatar: {
          chassisColor: '#f59e0b',
          trailColor: '#8b5cf6',
          visorType: 'VOID_MASK',
          glowIntensity: 1.2,
          particleEffect: 'VOID_SMOKE'
        },
        stats: {
          level: 8,
          currentXp: 1800,
          nextLevelXp: 3000,
          totalGamesPlayed: 42,
          totalWins: 24,
          totalLosses: 18,
          winRate: 0.57,
          killDeathRatio: 1.4,
          ratingElo: 1380,
          seasonRank: 'PLATINUM',
          reputationScore: 88,
          achievementsUnlocked: 9
        },
        currency: { gold: 1800, nexusCrystals: 30, credits: 600 },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
    ];

    for (const u of demoUsers) {
      this.store.users.set(u.id, u);
      this.store.inventory.set(`inv-${u.id}-1`, {
        id: `inv-${u.id}-1`,
        userId: u.id,
        itemId: 'item-1',
        quantity: 1,
        durability: 100,
        isEquipped: true
      });
      this.store.inventory.set(`inv-${u.id}-2`, {
        id: `inv-${u.id}-2`,
        userId: u.id,
        itemId: 'item-2',
        quantity: 1,
        durability: 100,
        isEquipped: true
      });
      this.store.inventory.set(`inv-${u.id}-3`, {
        id: `inv-${u.id}-3`,
        userId: u.id,
        itemId: 'item-7',
        quantity: 5,
        durability: 100,
        isEquipped: false
      });
    }

    const defaultClan: Clan = {
      id: 'clan-1',
      name: 'Nexus Vanguard',
      tag: 'NEXUS',
      description: 'Elite competitive esports organization dominating global leaderboards.',
      badgeEmblem: '🛡️',
      level: 15,
      totalXp: 85000,
      memberCount: 2,
      maxMembers: 50,
      leaderId: 'user-admin',
      members: [
        {
          userId: 'user-admin',
          username: 'CyberAdmin',
          role: ClanRole.LEADER,
          contributionXp: 50000,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        },
        {
          userId: 'user-player1',
          username: 'ViperStrike',
          role: ClanRole.OFFICER,
          contributionXp: 35000,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        }
      ],
      isRecruiting: true,
      minRatingRequired: 1300,
      createdAt: new Date().toISOString()
    };
    this.store.clans.set(defaultClan.id, defaultClan);

    const defaultTournament: Tournament = {
      id: 'tourney-1',
      title: 'Neon Grand Prix Championship 2026',
      description: 'Annual 3D Cyber Racer championship with massive gold and crystal prize pool.',
      gameType: GameType.CYBER_RACER,
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.LIVE,
      prizePoolGold: 25000,
      prizePoolCrystals: 1000,
      maxParticipants: 8,
      currentParticipants: 4,
      startDate: new Date(Date.now() + 86400000).toISOString(),
      bracket: [
        { id: 'm1', round: 1, matchIndex: 1, player1Id: 'user-admin', player2Id: 'user-player2', player1Score: 2, player2Score: 1, winnerId: 'user-admin', isCompleted: true },
        { id: 'm2', round: 1, matchIndex: 2, player1Id: 'user-player1', player2Id: 'user-player3', winnerId: 'user-player1', isCompleted: true },
        { id: 'm3', round: 2, matchIndex: 1, player1Id: 'user-admin', player2Id: 'user-player1', isCompleted: false }
      ]
    };
    this.store.tournaments.set(defaultTournament.id, defaultTournament);
  }
}
