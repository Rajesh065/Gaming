import { describe, it, expect } from 'vitest';
import { NavigationGrid, AStarPathfinder, DungeonGenerator, CombatCalculator } from '../packages/game-engine/src';

describe('Pathfinding & Procedural Generation', () => {
  it('should find optimal path around obstacles using A*', () => {
    const grid = new NavigationGrid(10, 10);
    grid.setWalkable(1, 1, false);
    grid.setWalkable(1, 2, false);

    const path = AStarPathfinder.findPath(grid, 0, 0, 3, 3);
    expect(path.length).toBeGreaterThan(0);
    expect(path[0].x).toBe(0);
    expect(path[0].y).toBe(0);
    expect(path[path.length - 1].x).toBe(3);
    expect(path[path.length - 1].y).toBe(3);
  });

  it('should generate valid dungeon rooms with spawn and exit points', () => {
    const dungeon = DungeonGenerator.generate(40, 40, 6);
    expect(dungeon.rooms.length).toBeGreaterThan(0);
    expect(dungeon.spawnPoint).toBeDefined();
    expect(dungeon.exitPoint).toBeDefined();
  });
});

describe('Combat System', () => {
  it('should calculate mitigated damage and elemental multipliers', () => {
    const attacker = {
      id: 'atk-1',
      attackPower: 100,
      defense: 20,
      critChance: 0,
      critMultiplier: 1.5,
      elementalType: 'PLASMA' as const,
      level: 10
    };
    const defender = {
      id: 'def-1',
      attackPower: 50,
      defense: 50,
      critChance: 0,
      critMultiplier: 1.5,
      elementalType: 'ENERGY' as const,
      level: 10
    };

    const result = CombatCalculator.calculateDamage(attacker, defender);
    expect(result.finalDamage).toBeGreaterThan(0);
    expect(result.elementalMultiplier).toBe(1.3);
  });
});
