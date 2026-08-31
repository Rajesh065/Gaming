export interface ServerTelemetry {
  uptimeSeconds: number;
  cpuUsagePercent: number;
  memoryUsageMb: number;
  activeSocketConnections: number;
  activeGameRooms: number;
  matchmakingQueueSize: number;
  messagesPerSecond: number;
  tickRateAverageHz: number;
}

export interface AntiCheatReport {
  id: string;
  userId: string;
  username: string;
  gameType: string;
  violationType: 'SPEED_HACK' | 'TELEPORT_DETECTED' | 'INVALID_PACKET_RATE' | 'DAMAGE_SPOOF' | 'MEMORY_TAMPER';
  confidenceScore: number;
  snapshotData: Record<string, any>;
  timestamp: string;
  isReviewed: boolean;
  actionTaken?: 'NONE' | 'WARNED' | 'TEMP_BAN' | 'PERM_BAN';
}

export interface GameBalanceConfig {
  cyberRacer: {
    maxSpeed: number;
    turboMultiplier: number;
    driftHandling: number;
  };
  dungeonRogue: {
    basePlayerHealth: number;
    enemyDamageScale: number;
    dropRateMultiplier: number;
  };
  cosmoStrike: {
    fireRateCap: number;
    bossHealthMultiplier: number;
    shieldRegenDelayMs: number;
  };
}
