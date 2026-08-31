import { describe, it, expect } from 'vitest';
import { Vector2, Vector3, Collision2D, Collision3D } from '../packages/game-engine/src/index';

describe('Engine Physics & Math Tests', () => {
  it('should accurately calculate Vector3 length and normalization', () => {
    const v = new Vector3(3, 4, 0);
    expect(v.length()).toBe(5);
    v.normalize();
    expect(v.length()).toBeCloseTo(1, 4);
  });

  it('should detect 2D AABB collisions', () => {
    const boxA = { x: 0, y: 0, width: 10, height: 10 };
    const boxB = { x: 5, y: 5, width: 10, height: 10 };
    const boxC = { x: 20, y: 20, width: 5, height: 5 };

    expect(Collision2D.aabbIntersectsAABB(boxA, boxB)).toBe(true);
    expect(Collision2D.aabbIntersectsAABB(boxA, boxC)).toBe(false);
  });

  it('should detect 3D Sphere collisions', () => {
    const s1 = { center: new Vector3(0, 0, 0), radius: 5 };
    const s2 = { center: new Vector3(8, 0, 0), radius: 5 };
    const s3 = { center: new Vector3(20, 0, 0), radius: 2 };

    expect(Collision3D.sphereIntersectsSphere(s1, s2)).toBe(true);
    expect(Collision3D.sphereIntersectsSphere(s1, s3)).toBe(false);
  });
});
