import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';

export class NexusChessRoom extends BaseGameRoom {
  private boardState: string[][] = [];
  private currentTurn: 'WHITE' | 'BLACK' = 'WHITE';

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.NEXUS_CHESS, io);
    this.tickRateHz = 5; // Turn-based low tick rate
    this.initialize();
  }

  public initialize(): void {
    // 8x8 Board setup
    this.boardState = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
  }

  public handlePlayerInput(frame: PlayerInputFrame): void {
    if (frame.inputs.specialAction && frame.inputs.rawVector) {
      // Chess move received
      const fromX = Math.floor(frame.inputs.rawVector.x);
      const fromY = Math.floor(frame.inputs.rawVector.y);
      const toX = (frame.inputs as any).toX || 0;
      const toY = (frame.inputs as any).toY || 0;

      const piece = this.boardState[fromY]?.[fromX];
      if (piece && piece !== '.') {
        this.boardState[toY][toX] = piece;
        this.boardState[fromY][fromX] = '.';
        this.currentTurn = this.currentTurn === 'WHITE' ? 'BLACK' : 'WHITE';
        this.eventsQueue.push({
          type: 'CHESS_MOVE',
          payload: { from: { x: fromX, y: fromY }, to: { x: toX, y: toY }, piece, turn: this.currentTurn },
          timestamp: Date.now()
        });
      }
    }
  }

  public tickUpdate(deltaTime: number): void {
    // Turn-based clock countdown
  }
}
