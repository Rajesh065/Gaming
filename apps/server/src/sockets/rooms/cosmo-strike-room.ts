import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';

export class CosmoStrikeRoom extends BaseGameRoom {
  private playerInputs: Map<string, PlayerInputFrame['inputs']> = new Map();
  private lastEnemySpawn: number = 0;

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.COSMO_STRIKE, io);
    this.initialize();
  }

  public initialize(): void {}

  public override addPlayer(playerId: string, username: string): void {
    super.addPlayer(playerId, username);
    this.entities[playerId] = {
      id: playerId,
      type: 'COSMO_STARFIGHTER',
      position: { x: 0, y: 0, z: -20 },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      isAlive: true,
      score: 0,
      meta: { username, shield: 50, combo: 1 }
    };
  }

  public handlePlayerInput(frame: PlayerInputFrame): void {
    this.playerInputs.set(frame.playerId, frame.inputs);
  }

  public tickUpdate(deltaTime: number): void {
    const now = Date.now();
    if (now - this.lastEnemySpawn > 2000) {
      this.lastEnemySpawn = now;
      const enemyId = `alien-${now}`;
      this.entities[enemyId] = {
        id: enemyId,
        type: 'ALIEN_DRONE',
        position: { x: (Math.random() - 0.5) * 40, y: 0, z: 35 },
        velocity: { x: 0, y: 0, z: -15 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 30,
        maxHealth: 30,
        isAlive: true,
        score: 25
      };
    }

    for (const [id, entity] of Object.entries(this.entities)) {
      if (entity.type === 'ALIEN_DRONE' && entity.isAlive) {
        entity.position.z += entity.velocity.z * deltaTime;
        if (entity.position.z < -30) {
          delete this.entities[id];
        }
      }
    }

    for (const playerId of this.players) {
      const ship = this.entities[playerId];
      if (!ship || !ship.isAlive) continue;

      const input = this.playerInputs.get(playerId) || {};
      if (input.left) ship.position.x -= 25 * deltaTime;
      if (input.right) ship.position.x += 25 * deltaTime;
      ship.position.x = Math.max(-20, Math.min(20, ship.position.x));

      if (input.primaryAction) {
        for (const [alienId, alien] of Object.entries(this.entities)) {
          if (alien.type === 'ALIEN_DRONE' && alien.isAlive) {
            if (Math.abs(alien.position.x - ship.position.x) < 3.5) {
              alien.health -= 30;
              if (alien.health <= 0) {
                alien.isAlive = false;
                ship.score += 50;
                this.eventsQueue.push({
                  type: 'ALIEN_DESTROYED',
                  payload: { alienId, killerId: playerId },
                  timestamp: Date.now()
                });
              }
            }
          }
        }
      }
    }
  }
}
