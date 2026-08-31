import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';

export class NexusChessRoom extends BaseGameRoom {
  private board: string[][];
  private turn: 'WHITE' | 'BLACK' = 'WHITE';

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.NEXUS_CHESS, io);
    this.board = this.initializeBoard();
    this.initialize();
  }

  private initializeBoard(): string[][] {
    return [
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

  public initialize(): void {}

  public handlePlayerInput(frame: PlayerInputFrame): void {
    const move = frame.inputs.rawVector;
    if (move) {
      this.eventsQueue.push({
        type: 'CHESS_MOVE_PLAYED',
        payload: { playerId: frame.playerId, move },
        timestamp: Date.now()
      });
      this.turn = this.turn === 'WHITE' ? 'BLACK' : 'WHITE';
    }
  }

  public tickUpdate(deltaTime: number): void {}
}
