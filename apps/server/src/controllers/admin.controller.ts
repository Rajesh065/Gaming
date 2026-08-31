import { Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const adminService = new AdminService();

export class AdminController {
  public static getTelemetry(req: AuthenticatedRequest, res: Response) {
    const stats = adminService.getTelemetry();
    res.json(stats);
  }

  public static getAntiCheatLogs(req: AuthenticatedRequest, res: Response) {
    const logs = adminService.getAntiCheatLogs();
    res.json(logs);
  }

  public static getBalanceConfig(req: AuthenticatedRequest, res: Response) {
    const config = adminService.getGameBalanceConfig();
    res.json(config);
  }

  public static updateBalanceConfig(req: AuthenticatedRequest, res: Response) {
    const updated = adminService.updateGameBalanceConfig(req.body);
    res.json(updated);
  }

  public static listUsers(req: AuthenticatedRequest, res: Response) {
    const users = adminService.listAllUsers();
    res.json(users);
  }
}
