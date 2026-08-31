import { InMemoryDB } from '../database/db.js';
import { Tournament, TournamentStatus, GameType, TournamentFormat } from '@nexusplay/shared-types';

export class TournamentService {
  private db = InMemoryDB.getInstance();

  public getTournaments(): Tournament[] {
    return Array.from(this.db.store.tournaments.values());
  }

  public getTournamentById(id: string): Tournament | null {
    return this.db.store.tournaments.get(id) || null;
  }

  public registerForTournament(tournamentId: string, userId: string): Tournament {
    const tourney = this.db.store.tournaments.get(tournamentId);
    if (!tourney) throw new Error('Tournament not found');

    if (tourney.currentParticipants >= tourney.maxParticipants) {
      throw new Error('Tournament is full');
    }

    tourney.currentParticipants += 1;
    return tourney;
  }
}
