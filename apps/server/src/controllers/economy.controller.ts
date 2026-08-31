import { Response } from 'express';
import { EconomyService } from '../services/economy.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const economyService = new EconomyService();

export class EconomyController {
  public static getCatalog(req: AuthenticatedRequest, res: Response) {
    const catalog = economyService.getCatalog();
    res.json(catalog);
  }

  public static getInventory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const inventory = economyService.getInventory(req.user.id);
      res.json(inventory);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static purchaseItem(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { itemId, currencyType } = req.body;
      const result = economyService.purchaseItem(req.user.id, itemId, currencyType || 'gold');
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static openLootBox(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const drop = economyService.openLootBox(req.user.id);
      res.json(drop);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
