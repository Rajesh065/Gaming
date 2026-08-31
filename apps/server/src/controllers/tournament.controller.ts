import { Response } from 'express';
import { TournamentService } from '../services/tournament.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const tournamentService = new TournamentService();

export class TournamentController {
  public static getTournaments(req: AuthenticatedRequest, res: Response) {
    const tourneys = tournamentService.getTournaments();
    res.json(tourneys);
  }

  public static getTournamentById(req: AuthenticatedRequest, res: Response) {
    const tourney = tournamentService.getTournamentById(req.params.id);
    if (!tourney) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tourney);
  }

  public static register(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tourney = tournamentService.registerForTournament(req.params.id, req.user.id);
      res.json(tourney);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
