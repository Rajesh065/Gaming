import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { InMemoryDB } from '../database/db.js';
import { config } from '../config/index.js';
import { UserRole, PlayerStatus, UserProfile } from '@nexusplay/shared-types';

export class AuthService {
  private db = InMemoryDB.getInstance();

  public register(username: string, email: string, password: string): { user: UserProfile; token: string } {
    for (const existing of this.db.store.users.values()) {
      if (existing.username.toLowerCase() === username.toLowerCase()) {
        throw new Error('Username is already taken');
      }
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        throw new Error('Email is already registered');
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const id = `user-${Date.now()}`;

    const newUser: UserProfile & { passwordHash: string } = {
      id,
      username,
      displayName: username,
      email,
      passwordHash,
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
        level: 1,
        currentXp: 0,
        nextLevelXp: 1000,
        totalGamesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
        killDeathRatio: 0,
        ratingElo: 1200,
        seasonRank: 'BRONZE',
        reputationScore: 100,
        achievementsUnlocked: 0
      },
      currency: {
        gold: 1000,
        nexusCrystals: 50,
        credits: 500
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.db.store.users.set(id, newUser);

    this.db.store.inventory.set(`inv-${id}-1`, {
      id: `inv-${id}-1`,
      userId: id,
      itemId: 'item-1',
      quantity: 1,
      durability: 100,
      isEquipped: true
    });

    const token = this.generateToken(newUser);
    const { passwordHash: _, ...userWithoutHash } = newUser;
    return { user: userWithoutHash, token };
  }

  public login(usernameOrEmail: string, password: string): { user: UserProfile; token: string } {
    let foundUser: (UserProfile & { passwordHash: string }) | undefined;

    for (const u of this.db.store.users.values()) {
      if (
        u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      ) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const isValid = bcrypt.compareSync(password, foundUser.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    foundUser.status = PlayerStatus.ONLINE;
    foundUser.lastLoginAt = new Date().toISOString();

    const token = this.generateToken(foundUser);
    const { passwordHash: _, ...userWithoutHash } = foundUser;
    return { user: userWithoutHash, token };
  }

  public getUserById(id: string): UserProfile | null {
    const u = this.db.store.users.get(id);
    if (!u) return null;
    const { passwordHash: _, ...userWithoutHash } = u;
    return userWithoutHash;
  }

  private generateToken(user: UserProfile): string {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }
}
