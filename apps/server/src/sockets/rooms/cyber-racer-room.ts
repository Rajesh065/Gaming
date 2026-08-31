import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';

export class CyberRacerRoom extends BaseGameRoom {
  private playerInputs: Map<string, PlayerInputFrame['inputs']> = new Map();

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.CYBER_RACER, io);
    this.initialize();
  }

  public initialize(): void {}

  public override addPlayer(playerId: string, username: string): void {
    super.addPlayer(playerId, username);
    this.entities[playerId] = {
      id: playerId,
      type: 'CYBER_RACER_VEHICLE',
      position: { x: (this.players.size - 1) * 10 - 5, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      isAlive: true,
      score: 0,
      meta: {
        currentLap: 1,
        speed: 0,
        boostFuel: 100,
        username
      }
    };
  }

  public handlePlayerInput(frame: PlayerInputFrame): void {
    this.playerInputs.set(frame.playerId, frame.inputs);
  }

  public tickUpdate(deltaTime: number): void {
    for (const playerId of this.players) {
      const entity = this.entities[playerId];
      if (!entity || !entity.isAlive) continue;

      const input = this.playerInputs.get(playerId) || {};
      const speed = entity.meta?.speed || 0;
      let targetSpeed = speed;

      if (input.forward) {
        targetSpeed += 80 * deltaTime;
      } else if (input.backward) {
        targetSpeed -= 60 * deltaTime;
      } else {
        targetSpeed *= Math.pow(0.95, deltaTime * 30);
      }

      if (input.specialAction && entity.meta.boostFuel > 0) {
        targetSpeed += 120 * deltaTime;
        entity.meta.boostFuel = Math.max(0, entity.meta.boostFuel - 25 * deltaTime);
      } else {
        entity.meta.boostFuel = Math.min(100, entity.meta.boostFuel + 5 * deltaTime);
      }

      targetSpeed = Math.max(0, Math.min(300, targetSpeed));
      entity.meta.speed = targetSpeed;

      if (input.left) {
        entity.position.x -= 35 * deltaTime;
        entity.rotation.z = Math.min(0.3, entity.rotation.z + 2 * deltaTime);
      } else if (input.right) {
        entity.position.x += 35 * deltaTime;
        entity.rotation.z = Math.max(-0.3, entity.rotation.z - 2 * deltaTime);
      } else {
        entity.rotation.z *= 0.85;
      }

      entity.position.x = Math.max(-25, Math.min(25, entity.position.x));
      entity.position.z += targetSpeed * deltaTime;
      entity.score += Math.round(targetSpeed * deltaTime * 10);
    }
  }
}
