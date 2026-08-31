import { Server } from 'socket.io';
import {
  GameSnapshot,
  MatchState,
  PlayerInputFrame,
  GameType,
  GameEntityState
} from '@nexusplay/shared-types';

export abstract class BaseGameRoom {
  public matchId: string;
  public gameType: GameType;
  public state: MatchState = MatchState.LOBBY;
  public tick: number = 0;
  public players: Set<string> = new Set();
  public entities: Record<string, GameEntityState> = {};
  public eventsQueue: Array<{ type: string; payload: any; timestamp: number }> = [];
  protected io: Server;
  protected intervalHandle: NodeJS.Timeout | null = null;
  protected tickRateHz: number = 30;

  constructor(matchId: string, gameType: GameType, io: Server) {
    this.matchId = matchId;
    this.gameType = gameType;
    this.io = io;
  }

  public abstract initialize(): void;
  public abstract handlePlayerInput(frame: PlayerInputFrame): void;
  public abstract tickUpdate(deltaTime: number): void;

  public addPlayer(playerId: string, username: string): void {
    this.players.add(playerId);
    this.eventsQueue.push({
      type: 'PLAYER_JOINED',
      payload: { playerId, username },
      timestamp: Date.now()
    });
  }

  public removePlayer(playerId: string): void {
    this.players.delete(playerId);
    delete this.entities[playerId];
    this.eventsQueue.push({
      type: 'PLAYER_LEFT',
      payload: { playerId },
      timestamp: Date.now()
    });

    if (this.players.size === 0) {
      this.stop();
    }
  }

  public start(): void {
    this.state = MatchState.IN_PROGRESS;
    const intervalMs = 1000 / this.tickRateHz;
    let lastTime = Date.now();

    this.intervalHandle = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      this.tick += 1;
      this.tickUpdate(dt);
      this.broadcastSnapshot();
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.state = MatchState.TERMINATED;
  }

  protected broadcastSnapshot(): void {
    const snapshot: GameSnapshot = {
      tick: this.tick,
      timestamp: Date.now(),
      matchId: this.matchId,
      state: this.state,
      entities: { ...this.entities },
      events: [...this.eventsQueue]
    };
    this.eventsQueue = []; // Clear queued events

    this.io.to(`room-${this.matchId}`).emit('game:state_snapshot', snapshot);
  }
}
