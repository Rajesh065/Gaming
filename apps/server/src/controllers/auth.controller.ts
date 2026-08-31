import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const authService = new AuthService();

export class AuthController {
  public static register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }
      const result = authService.register(username, email, password);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const result = authService.login(username, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  public static me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = authService.getUserById(req.user.id);
    if (!profile) return res.status(404).json({ error: 'User not found' });
    res.json(profile);
  }
}
