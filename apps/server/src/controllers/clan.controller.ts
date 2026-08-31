import { Response } from 'express';
import { ClanService } from '../services/clan.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const clanService = new ClanService();

export class ClanController {
  public static getClans(req: AuthenticatedRequest, res: Response) {
    const clans = clanService.getClans();
    res.json(clans);
  }

  public static getClanById(req: AuthenticatedRequest, res: Response) {
    const clan = clanService.getClanById(req.params.id);
    if (!clan) return res.status(404).json({ error: 'Clan not found' });
    res.json(clan);
  }

  public static createClan(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { name, tag, description } = req.body;
      const clan = clanService.createClan(req.user.id, name, tag, description);
      res.status(201).json(clan);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static joinClan(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const clan = clanService.joinClan(req.user.id, req.params.id);
      res.json(clan);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
