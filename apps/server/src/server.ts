import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/index.js';
import { apiRouter } from './routes/api.router.js';
import { errorHandler } from './middleware/error.middleware.js';
import { antiCheatSanityCheck } from './middleware/anticheat.middleware.js';
import { SocketServerManager } from './sockets/socket-server.js';
import { MatchmakingService } from './services/matchmaking.service.js';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(antiCheatSanityCheck);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NexusPlay Game Backend'
  });
});

app.use('/api', apiRouter);
app.use(errorHandler);

const matchmakingService = new MatchmakingService();
const socketManager = new SocketServerManager(httpServer, matchmakingService);

httpServer.listen(config.port, () => {
  console.log(`🚀 [NexusPlay Server] Online & listening on http://localhost:${config.port}`);
});

export { app, httpServer };
