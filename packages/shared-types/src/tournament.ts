import { GameType } from './game';

export enum TournamentFormat {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  ROUND_ROBIN = 'ROUND_ROBIN',
  SWISS = 'SWISS'
}

export enum TournamentStatus {
  REGISTRATION = 'REGISTRATION',
  SEEDED = 'SEEDED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface TournamentMatchNode {
  id: string;
  round: number;
  matchIndex: number;
  player1Id?: string;
  player2Id?: string;
  player1Score?: number;
  player2Score?: number;
  winnerId?: string;
  isCompleted: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  format: TournamentFormat;
  status: TournamentStatus;
  prizePoolGold: number;
  prizePoolCrystals: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  bracket: TournamentMatchNode[];
}
