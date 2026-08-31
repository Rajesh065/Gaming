import { Response } from 'express';
import { PlayerService } from '../services/player.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const playerService = new PlayerService();

export class PlayerController {
  public static getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id || req.user?.id;
      if (!id) return res.status(400).json({ error: 'Player ID required' });
      const profile = playerService.getProfile(id);
      res.json(profile);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  public static updateAvatar(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const updated = playerService.updateAvatar(req.user.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static getLeaderboard(req: AuthenticatedRequest, res: Response) {
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const leaders = playerService.getLeaderboard(limit);
    res.json(leaders);
  }
}
