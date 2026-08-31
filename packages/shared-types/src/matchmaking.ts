import { GameType, GameMode } from './game';

export interface MatchmakingTicket {
  ticketId: string;
  playerId: string;
  username: string;
  gameType: GameType;
  gameMode: GameMode;
  ratingElo: number;
  region: string;
  queuedAt: number;
  searchRadiusElo: number;
  status: 'QUEUED' | 'MATCH_FOUND' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
}

export interface MatchmakingMatch {
  matchId: string;
  gameType: GameType;
  gameMode: GameMode;
  serverRegion: string;
  serverSocketRoom: string;
  players: Array<{
    playerId: string;
    username: string;
    team: number;
    ratingElo: number;
    hasAccepted: boolean;
  }>;
  createdAt: number;
  expiresAt: number;
}
