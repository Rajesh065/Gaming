import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { BaseGameRoom } from './rooms/game-room.js';
import { CyberRacerRoom } from './rooms/cyber-racer-room.js';
import { DungeonRogueRoom } from './rooms/dungeon-rogue-room.js';
import { CosmoStrikeRoom } from './rooms/cosmo-strike-room.js';
import { NexusChessRoom } from './rooms/nexus-chess-room.js';
import { MatchmakingService } from '../services/matchmaking.service.js';
import { InMemoryDB } from '../database/db.js';
import {
  GameType,
  PlayerInputFrame,
  ChatMessagePayload
} from '@nexusplay/shared-types';

export class SocketServerManager {
  private io: SocketIOServer;
  private matchmakingService: MatchmakingService;
  private gameRooms: Map<string, BaseGameRoom> = new Map();
  private db = InMemoryDB.getInstance();

  constructor(httpServer: HTTPServer, matchmakingService: MatchmakingService) {
    this.matchmakingService = matchmakingService;
    this.io = new SocketIOServer(httpServer, {
      cors: { origin: '*', methods: ['GET', 'POST'] }
    });
    this.setupEventHandlers();
    this.startMatchmakingLoop();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      let currentUserId: string | null = null;
      let currentUsername: string = 'Guest';

      socket.on('player:join_lobby', (token: string) => {
        const user = Array.from(this.db.store.users.values())[0];
        if (user) {
          currentUserId = user.id;
          currentUsername = user.username;
          socket.emit('system:init_state', { profile: user });
        }
      });

      socket.on('matchmaking:queue', (data: { gameType: GameType; gameMode: any }) => {
        if (!currentUserId) currentUserId = `guest-${socket.id.substring(0, 5)}`;
        const ticket = this.matchmakingService.enqueuePlayer(
          currentUserId,
          currentUsername,
          data.gameType,
          data.gameMode,
          1200
        );
        socket.emit('matchmaking:ticket_update', ticket);
      });

      socket.on('matchmaking:cancel', () => {
        if (currentUserId) {
          this.matchmakingService.dequeuePlayer(currentUserId);
        }
      });

      socket.on('game:join_room', (data: { matchId: string; gameType?: GameType }) => {
        const { matchId, gameType = GameType.CYBER_RACER } = data;
        let room = this.gameRooms.get(matchId);

        if (!room) {
          switch (gameType) {
            case GameType.CYBER_RACER:
              room = new CyberRacerRoom(matchId, this.io);
              break;
            case GameType.DUNGEON_ROGUE:
              room = new DungeonRogueRoom(matchId, this.io);
              break;
            case GameType.COSMO_STRIKE:
              room = new CosmoStrikeRoom(matchId, this.io);
              break;
            case GameType.NEXUS_CHESS:
              room = new NexusChessRoom(matchId, this.io);
              break;
            default:
              room = new CyberRacerRoom(matchId, this.io);
          }
          this.gameRooms.set(matchId, room);
          room.start();
        }

        const pId = currentUserId || `p-${socket.id.substring(0, 5)}`;
        room.addPlayer(pId, currentUsername);
        socket.join(`room-${matchId}`);
      });

      socket.on('game:send_input', (frame: PlayerInputFrame) => {
        const room = this.gameRooms.get(frame.matchId);
        if (room) {
          room.handlePlayerInput(frame);
        }
      });

      socket.on('chat:send_message', (payload: any) => {
        const msg: ChatMessagePayload = {
          id: `msg-${Date.now()}`,
          senderId: currentUserId || socket.id,
          senderName: currentUsername,
          channel: payload.channel || 'GLOBAL',
          content: payload.content,
          timestamp: Date.now()
        };
        this.io.emit('chat:new_message', msg);
      });

      socket.on('disconnect', () => {
        if (currentUserId) {
          this.matchmakingService.dequeuePlayer(currentUserId);
          for (const room of this.gameRooms.values()) {
            room.removePlayer(currentUserId);
          }
        }
      });
    });
  }

  private startMatchmakingLoop(): void {
    setInterval(() => {
      const matches = this.matchmakingService.checkMatches();
      for (const match of matches) {
        this.io.emit('matchmaking:match_found', match);
      }
    }, 1000);
  }

  public getActiveStats() {
    return {
      connectedSockets: this.io.engine.clientsCount,
      activeRooms: this.gameRooms.size
    };
  }
}
