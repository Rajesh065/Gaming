import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/index.js';
import { apiRouter } from './routes/api.router.js';
import { errorHandler } from './middleware/error.middleware.js';
import { antiCheatSanityCheck } from './middleware/anticheat.middleware.js';
import { SocketServerManager } from './sockets/socket-server.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(antiCheatSanityCheck);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NexusPlay Game Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Real-Time Socket Server
const socketManager = new SocketServerManager(httpServer);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(config.port, () => {
    console.log(`🚀 [NexusPlay Server] Online & listening at http://localhost:${config.port}`);
    console.log(`⚡ Real-time WebSocket game tick engine active.`);
  });
}

export { app, httpServer, socketManager };
