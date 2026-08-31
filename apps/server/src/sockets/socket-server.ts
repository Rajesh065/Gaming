import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { MatchmakingService } from '../services/matchmaking.service.js';
import { CyberRacerRoom } from './rooms/cyber-racer-room.js';
import { DungeonRogueRoom } from './rooms/dungeon-rogue-room.js';
import { CosmoStrikeRoom } from './rooms/cosmo-strike-room.js';
import { NexusChessRoom } from './rooms/nexus-chess-room.js';
import { BaseGameRoom } from './rooms/game-room.js';
import { GameType, GameMode, ChatMessagePayload, PlayerInputFrame } from '@nexusplay/shared-types';

export class SocketServerManager {
  private io: Server;
  private matchmakingService = new MatchmakingService();
  private activeRooms: Map<string, BaseGameRoom> = new Map();
  private userSocketMap: Map<string, string> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupListeners();
    this.startMatchmakingTick();
  }

  private setupListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      let currentUserId: string | null = null;
      let currentUsername: string | null = null;

      socket.on('player:join_lobby', (token: string) => {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          currentUserId = decoded.id;
          currentUsername = decoded.username;
          this.userSocketMap.set(currentUserId!, socket.id);
          socket.join('lobby');
        } catch (err) {
          socket.emit('error:notification', { code: 'AUTH_FAILED', message: 'Socket auth failed' });
        }
      });

      socket.on('matchmaking:queue', (data: { gameType: GameType; gameMode: GameMode; ratingElo?: number }) => {
        if (!currentUserId || !currentUsername) return;
        const ticket = this.matchmakingService.enqueuePlayer(
          currentUserId,
          currentUsername,
          data.gameType,
          data.gameMode,
          data.ratingElo || 1200
        );
        socket.emit('matchmaking:ticket_update', ticket);
      });

      socket.on('matchmaking:cancel', () => {
        if (currentUserId) {
          this.matchmakingService.dequeuePlayer(currentUserId);
        }
      });

      socket.on('game:join_room', (data: { matchId: string; gameType: GameType }) => {
        if (!currentUserId || !currentUsername) return;
        let room = this.activeRooms.get(data.matchId);
        if (!room) {
          if (data.gameType === GameType.CYBER_RACER) {
            room = new CyberRacerRoom(data.matchId, this.io);
          } else if (data.gameType === GameType.DUNGEON_ROGUE) {
            room = new DungeonRogueRoom(data.matchId, this.io);
          } else if (data.gameType === GameType.COSMO_STRIKE) {
            room = new CosmoStrikeRoom(data.matchId, this.io);
          } else {
            room = new NexusChessRoom(data.matchId, this.io);
          }
          this.activeRooms.set(data.matchId, room);
          room.start();
        }

        socket.join(`room-${data.matchId}`);
        room.addPlayer(currentUserId, currentUsername);
      });

      socket.on('game:send_input', (frame: PlayerInputFrame) => {
        const room = this.activeRooms.get(frame.matchId);
        if (room) {
          room.handlePlayerInput(frame);
        }
      });

      socket.on('game:leave_room', (matchId: string) => {
        if (currentUserId) {
          const room = this.activeRooms.get(matchId);
          if (room) {
            room.removePlayer(currentUserId);
          }
          socket.leave(`room-${matchId}`);
        }
      });

      socket.on('chat:send_message', (payload: any) => {
        const message: ChatMessagePayload = {
          id: `msg-${Date.now()}`,
          senderId: currentUserId || 'anon',
          senderName: currentUsername || 'Anonymous',
          clanTag: payload.clanTag,
          channel: payload.channel || 'GLOBAL',
          content: payload.content,
          timestamp: Date.now()
        };

        if (message.channel === 'GLOBAL') {
          this.io.emit('chat:new_message', message);
        } else if (payload.roomMatchId) {
          this.io.to(`room-${payload.roomMatchId}`).emit('chat:new_message', message);
        }
      });

      socket.on('disconnect', () => {
        if (currentUserId) {
          this.matchmakingService.dequeuePlayer(currentUserId);
          this.userSocketMap.delete(currentUserId);
          for (const room of this.activeRooms.values()) {
            room.removePlayer(currentUserId);
          }
        }
      });
    });
  }

  private startMatchmakingTick(): void {
    setInterval(() => {
      const matches = this.matchmakingService.checkMatches();
      for (const match of matches) {
        for (const player of match.players) {
          const socketId = this.userSocketMap.get(player.playerId);
          if (socketId) {
            this.io.to(socketId).emit('matchmaking:match_found', match);
          }
        }
      }
    }, config.matchmakingCheckIntervalMs);
  }

  public getActiveRoomCount(): number {
    return this.activeRooms.size;
  }

  public getConnectedSocketCount(): number {
    return this.io.sockets.sockets.size;
  }
}
