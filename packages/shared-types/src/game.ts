export enum GameType {
  CYBER_RACER = 'CYBER_RACER',
  DUNGEON_ROGUE = 'DUNGEON_ROGUE',
  COSMO_STRIKE = 'COSMO_STRIKE',
  NEXUS_CHESS = 'NEXUS_CHESS'
}

export enum GameMode {
  SOLO_PRACTICE = 'SOLO_PRACTICE',
  RANKED_1V1 = 'RANKED_1V1',
  CASUAL_FFA = 'CASUAL_FFA',
  COOP_DUNGEON = 'COOP_DUNGEON',
  TOURNAMENT_MATCH = 'TOURNAMENT_MATCH'
}

export enum MatchState {
  LOBBY = 'LOBBY',
  COUNTDOWN = 'COUNTDOWN',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  ROUND_OVER = 'ROUND_OVER',
  GAME_OVER = 'GAME_OVER',
  TERMINATED = 'TERMINATED'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface GameEntityState {
  id: string;
  type: string;
  position: Vector3D;
  velocity: Vector3D;
  rotation: Vector3D;
  health: number;
  maxHealth: number;
  isAlive: boolean;
  score: number;
  meta?: Record<string, any>;
}

export interface GameSnapshot {
  tick: number;
  timestamp: number;
  matchId: string;
  state: MatchState;
  entities: Record<string, GameEntityState>;
  events: Array<{
    type: string;
    payload: any;
    timestamp: number;
  }>;
}

export interface PlayerInputFrame {
  tick: number;
  matchId: string;
  playerId: string;
  inputs: {
    forward?: boolean;
    backward?: boolean;
    left?: boolean;
    right?: boolean;
    primaryAction?: boolean;
    secondaryAction?: boolean;
    specialAction?: boolean;
    aimAngle?: number;
    rawVector?: Vector2D;
  };
  clientTimestamp: number;
}

export interface MatchResult {
  matchId: string;
  gameType: GameType;
  gameMode: GameMode;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  winnerId: string;
  participants: Array<{
    playerId: string;
    score: number;
    kills: number;
    deaths: number;
    accuracy: number;
    damageDealt: number;
    xpEarned: number;
    ratingDelta: number;
    currencyReward: number;
  }>;
}
