import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';

export class CosmoStrikeRoom extends BaseGameRoom {
  private playerInputs: Map<string, PlayerInputFrame['inputs']> = new Map();
  private projectileCounter = 0;

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.COSMO_STRIKE, io);
    this.initialize();
  }

  public initialize(): void {
    // Spawn initial enemy armada
    for (let i = 0; i < 8; i++) {
      const alienId = `alien-${i}`;
      this.entities[alienId] = {
        id: alienId,
        type: 'ALIEN_DRONE',
        position: { x: (i % 4) * 80 - 120, y: 0, z: -200 - Math.floor(i / 4) * 60 },
        velocity: { x: 30, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 40,
        maxHealth: 40,
        isAlive: true,
        score: 100,
        meta: { direction: 1 }
      };
    }
  }

  public override addPlayer(playerId: string, username: string): void {
    super.addPlayer(playerId, username);
    this.entities[playerId] = {
      id: playerId,
      type: 'STARFIGHTER',
      position: { x: 0, y: 0, z: 150 },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      isAlive: true,
      score: 0,
      meta: { username, weaponLevel: 1 }
    };
  }

  public handlePlayerInput(frame: PlayerInputFrame): void {
    this.playerInputs.set(frame.playerId, frame.inputs);
  }

  public tickUpdate(deltaTime: number): void {
    // Player movements & shooting
    for (const playerId of this.players) {
      const ship = this.entities[playerId];
      if (!ship || !ship.isAlive) continue;

      const input = this.playerInputs.get(playerId) || {};
      const speed = 180;

      if (input.left) ship.position.x -= speed * deltaTime;
      if (input.right) ship.position.x += speed * deltaTime;
      if (input.forward) ship.position.z -= speed * deltaTime;
      if (input.backward) ship.position.z += speed * deltaTime;

      ship.position.x = Math.max(-200, Math.min(200, ship.position.x));
      ship.position.z = Math.max(-50, Math.min(200, ship.position.z));

      if (input.primaryAction && this.tick % 5 === 0) {
        this.projectileCounter++;
        const projId = `laser-${this.projectileCounter}`;
        this.entities[projId] = {
          id: projId,
          type: 'LASER_BEAM',
          position: { x: ship.position.x, y: 0, z: ship.position.z - 10 },
          velocity: { x: 0, y: 0, z: -400 },
          rotation: { x: 0, y: 0, z: 0 },
          health: 1,
          maxHealth: 1,
          isAlive: true,
          score: 0,
          meta: { ownerId: playerId }
        };
      }
    }

    // Update projectiles & alien movement
    for (const [id, entity] of Object.entries(this.entities)) {
      if (entity.type === 'LASER_BEAM') {
        entity.position.z += entity.velocity.z * deltaTime;
        if (entity.position.z < -400) {
          delete this.entities[id];
          continue;
        }

        // Collision against aliens
        for (const [alienId, alien] of Object.entries(this.entities)) {
          if (alien.type === 'ALIEN_DRONE' && alien.isAlive) {
            const dx = Math.abs(entity.position.x - alien.position.x);
            const dz = Math.abs(entity.position.z - alien.position.z);
            if (dx < 20 && dz < 20) {
              alien.health -= 20;
              delete this.entities[id];
              if (alien.health <= 0) {
                alien.isAlive = false;
                const owner = this.entities[entity.meta?.ownerId];
                if (owner) owner.score += alien.score;
              }
              break;
            }
          }
        }
      } else if (entity.type === 'ALIEN_DRONE' && entity.isAlive) {
        entity.position.x += entity.meta.direction * 50 * deltaTime;
        if (entity.position.x > 180 || entity.position.x < -180) {
          entity.meta.direction *= -1;
          entity.position.z += 20;
        }
      }
    }
  }
}
