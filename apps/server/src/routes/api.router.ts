import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { PlayerController } from '../controllers/player.controller.js';
import { EconomyController } from '../controllers/economy.controller.js';
import { ClanController } from '../controllers/clan.controller.js';
import { TournamentController } from '../controllers/tournament.controller.js';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateJwt, requireRole } from '../middleware/auth.middleware.js';
import { UserRole } from '@nexusplay/shared-types';

export const apiRouter = Router();

// Auth Routes
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);
apiRouter.get('/auth/me', authenticateJwt, AuthController.me);

// Player Routes
apiRouter.get('/player/leaderboard', PlayerController.getLeaderboard);
apiRouter.get('/player/:id', PlayerController.getProfile);
apiRouter.put('/player/avatar', authenticateJwt, PlayerController.updateAvatar);

// Economy Routes
apiRouter.get('/economy/catalog', EconomyController.getCatalog);
apiRouter.get('/economy/inventory', authenticateJwt, EconomyController.getInventory);
apiRouter.post('/economy/purchase', authenticateJwt, EconomyController.purchaseItem);
apiRouter.post('/economy/lootbox/open', authenticateJwt, EconomyController.openLootBox);

// Clan Routes
apiRouter.get('/clans', ClanController.getClans);
apiRouter.get('/clans/:id', ClanController.getClanById);
apiRouter.post('/clans', authenticateJwt, ClanController.createClan);
apiRouter.post('/clans/:id/join', authenticateJwt, ClanController.joinClan);

// Tournament Routes
apiRouter.get('/tournaments', TournamentController.getTournaments);
apiRouter.get('/tournaments/:id', TournamentController.getTournamentById);
apiRouter.post('/tournaments/:id/register', authenticateJwt, TournamentController.register);

// Admin Routes
apiRouter.get('/admin/telemetry', authenticateJwt, requireRole([UserRole.ADMIN, UserRole.GAME_MASTER]), AdminController.getTelemetry);
apiRouter.get('/admin/anticheat-logs', authenticateJwt, requireRole([UserRole.ADMIN, UserRole.GAME_MASTER]), AdminController.getAntiCheatLogs);
apiRouter.get('/admin/balance', authenticateJwt, requireRole([UserRole.ADMIN, UserRole.GAME_MASTER]), AdminController.getBalanceConfig);
apiRouter.put('/admin/balance', authenticateJwt, requireRole([UserRole.ADMIN, UserRole.GAME_MASTER]), AdminController.updateBalanceConfig);
apiRouter.get('/admin/users', authenticateJwt, requireRole([UserRole.ADMIN, UserRole.GAME_MASTER]), AdminController.listUsers);
