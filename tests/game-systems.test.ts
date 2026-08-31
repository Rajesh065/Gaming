import { describe, it, expect } from 'vitest';
import { DungeonGenerator, CombatCalculator, SimplexNoise } from '../packages/game-engine/src/index';

describe('Game Systems & Procedural Generation', () => {
  it('should generate valid dungeon layouts with rooms and chests', () => {
    const dungeon = DungeonGenerator.generate(40, 40, 8);
    expect(dungeon.rooms.length).toBeGreaterThan(0);
    expect(dungeon.spawnPoint).toBeDefined();
    expect(dungeon.exitPoint).toBeDefined();
  });

  it('should calculate combat mitigation and critical strikes', () => {
    const attacker = {
      id: 'p1',
      attackPower: 50,
      defense: 20,
      critChance: 1.0,
      critMultiplier: 2.0,
      elementalType: 'KINETIC' as const,
      level: 10
    };
    const defender = {
      id: 'm1',
      attackPower: 20,
      defense: 100,
      critChance: 0,
      critMultiplier: 1.0,
      elementalType: 'KINETIC' as const,
      level: 8
    };

    const result = CombatCalculator.calculateDamage(attacker, defender);
    expect(result.finalDamage).toBeGreaterThan(0);
    expect(result.isCritical).toBe(true);
  });
});
