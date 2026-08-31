import { Server } from 'socket.io';
import { BaseGameRoom } from './game-room.js';
import { GameType, PlayerInputFrame } from '@nexusplay/shared-types';
import { DungeonGenerator, GeneratedDungeon } from '@nexusplay/game-engine';

export class DungeonRogueRoom extends BaseGameRoom {
  private dungeon: GeneratedDungeon;
  private playerInputs: Map<string, PlayerInputFrame['inputs']> = new Map();

  constructor(matchId: string, io: Server) {
    super(matchId, GameType.DUNGEON_ROGUE, io);
    this.dungeon = DungeonGenerator.generate(40, 40, 10);
    this.initialize();
  }

  public initialize(): void {
    for (let i = 0; i < 6; i++) {
      const room = this.dungeon.rooms[(i + 1) % this.dungeon.rooms.length];
      const mobId = `mob-${i + 1}`;
      this.entities[mobId] = {
        id: mobId,
        type: 'DUNGEON_SKELETON_WARRIOR',
        position: { x: room.centerX, y: 0, z: room.centerY },
        velocity: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 80,
        maxHealth: 80,
        isAlive: true,
        score: 50,
        meta: { aggroRange: 8, attackDamage: 12 }
      };
    }
  }

  public override addPlayer(playerId: string, username: string): void {
    super.addPlayer(playerId, username);
    this.entities[playerId] = {
      id: playerId,
      type: 'ROGUE_HERO',
      position: { x: this.dungeon.spawnPoint.x, y: 0, z: this.dungeon.spawnPoint.y },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 150,
      maxHealth: 150,
      isAlive: true,
      score: 0,
      meta: { username, potions: 3 }
    };
  }

  public handlePlayerInput(frame: PlayerInputFrame): void {
    this.playerInputs.set(frame.playerId, frame.inputs);
  }

  public tickUpdate(deltaTime: number): void {
    for (const playerId of this.players) {
      const hero = this.entities[playerId];
      if (!hero || !hero.isAlive) continue;

      const input = this.playerInputs.get(playerId) || {};
      let moveX = 0;
      let moveZ = 0;

      if (input.forward) moveZ -= 1;
      if (input.backward) moveZ += 1;
      if (input.left) moveX -= 1;
      if (input.right) moveX += 1;

      const speed = 6;
      hero.position.x += moveX * speed * deltaTime;
      hero.position.z += moveZ * speed * deltaTime;

      if (input.primaryAction) {
        for (const [id, mob] of Object.entries(this.entities)) {
          if (id !== playerId && mob.isAlive && mob.type.includes('SKELETON')) {
            const dx = mob.position.x - hero.position.x;
            const dz = mob.position.z - hero.position.z;
            if (dx * dx + dz * dz < 4) {
              mob.health -= 35;
              if (mob.health <= 0) {
                mob.isAlive = false;
                hero.score += 100;
                this.eventsQueue.push({
                  type: 'MOB_SLAIN',
                  payload: { mobId: id, killerId: playerId },
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
