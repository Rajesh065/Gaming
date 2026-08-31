import { ServerTelemetry, AntiCheatReport, GameBalanceConfig } from '@nexusplay/shared-types';
import { InMemoryDB } from '../database/db.js';
import { suspiciousPacketsLog } from '../middleware/anticheat.middleware.js';

export class AdminService {
  private db = InMemoryDB.getInstance();

  private balanceConfig: GameBalanceConfig = {
    cyberRacer: { maxSpeed: 280, turboMultiplier: 1.8, driftHandling: 1.4 },
    dungeonRogue: { basePlayerHealth: 150, enemyDamageScale: 1.1, dropRateMultiplier: 1.25 },
    cosmoStrike: { fireRateCap: 15, bossHealthMultiplier: 2.0, shieldRegenDelayMs: 2500 }
  };

  public getTelemetry(activeSocketsCount: number = 14, activeRoomsCount: number = 3): ServerTelemetry {
    const mem = process.memoryUsage();
    return {
      uptimeSeconds: Math.floor(process.uptime()),
      cpuUsagePercent: 8.4 + Math.random() * 4,
      memoryUsageMb: Math.round(mem.heapUsed / 1024 / 1024),
      activeSocketConnections: activeSocketsCount,
      activeGameRooms: activeRoomsCount,
      matchmakingQueueSize: 2,
      messagesPerSecond: Math.floor(18 + Math.random() * 10),
      tickRateAverageHz: 29.98
    };
  }

  public getAntiCheatLogs(): AntiCheatReport[] {
    return suspiciousPacketsLog;
  }

  public getGameBalanceConfig(): GameBalanceConfig {
    return this.balanceConfig;
  }

  public updateGameBalanceConfig(config: Partial<GameBalanceConfig>): GameBalanceConfig {
    this.balanceConfig = { ...this.balanceConfig, ...config };
    return this.balanceConfig;
  }

  public listAllUsers() {
    return Array.from(this.db.store.users.values()).map(({ passwordHash: _, ...u }) => u);
  }
}
