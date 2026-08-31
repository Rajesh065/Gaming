import { MatchmakingTicket, MatchmakingMatch, GameType, GameMode } from '@nexusplay/shared-types';

export class MatchmakingService {
  private queue: Map<string, MatchmakingTicket> = new Map();
  private activeMatches: Map<string, MatchmakingMatch> = new Map();

  public enqueuePlayer(playerId: string, username: string, gameType: GameType, gameMode: GameMode, ratingElo: number): MatchmakingTicket {
    const ticket: MatchmakingTicket = {
      ticketId: `tkt-${Date.now()}-${playerId}`,
      playerId,
      username,
      gameType,
      gameMode,
      ratingElo,
      region: 'GLOBAL-US-EAST',
      queuedAt: Date.now(),
      searchRadiusElo: 100,
      status: 'QUEUED'
    };

    this.queue.set(playerId, ticket);
    return ticket;
  }

  public dequeuePlayer(playerId: string): boolean {
    return this.queue.delete(playerId);
  }

  public checkMatches(): MatchmakingMatch[] {
    const matched: MatchmakingMatch[] = [];
    const tickets = Array.from(this.queue.values()).filter((t) => t.status === 'QUEUED');

    // Group by gameType and gameMode
    const groups = new Map<string, MatchmakingTicket[]>();
    for (const t of tickets) {
      const key = `${t.gameType}_${t.gameMode}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    }

    for (const [key, groupTickets] of groups.entries()) {
      if (groupTickets.length >= 2) {
        const p1 = groupTickets[0];
        const p2 = groupTickets[1];

        const matchId = `match-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const match: MatchmakingMatch = {
          matchId,
          gameType: p1.gameType,
          gameMode: p1.gameMode,
          serverRegion: p1.region,
          serverSocketRoom: `room-${matchId}`,
          players: [
            { playerId: p1.playerId, username: p1.username, team: 1, ratingElo: p1.ratingElo, hasAccepted: true },
            { playerId: p2.playerId, username: p2.username, team: 2, ratingElo: p2.ratingElo, hasAccepted: true }
          ],
          createdAt: Date.now(),
          expiresAt: Date.now() + 60000
        };

        p1.status = 'MATCH_FOUND';
        p2.status = 'MATCH_FOUND';

        this.queue.delete(p1.playerId);
        this.queue.delete(p2.playerId);
        this.activeMatches.set(matchId, match);
        matched.push(match);
      }
    }

    return matched;
  }

  public getQueueSize(): number {
    return this.queue.size;
  }
}
