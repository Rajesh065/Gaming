import { describe, it, expect } from 'vitest';
import { Vector2, Vector3, Collision2D, Collision3D, RigidBody3D } from '../packages/game-engine/src';

describe('Vector Mathematics & Physics', () => {
  it('should accurately compute 2D vector operations', () => {
    const v1 = new Vector2(3, 4);
    expect(v1.length()).toBe(5);
    const v2 = new Vector2(1, 2);
    v1.add(v2);
    expect(v1.x).toBe(4);
    expect(v1.y).toBe(6);
  });

  it('should detect 2D AABB intersections correctly', () => {
    const boxA = { x: 0, y: 0, width: 10, height: 10 };
    const boxB = { x: 5, y: 5, width: 10, height: 10 };
    const boxC = { x: 20, y: 20, width: 5, height: 5 };

    expect(Collision2D.aabbIntersectsAABB(boxA, boxB)).toBe(true);
    expect(Collision2D.aabbIntersectsAABB(boxA, boxC)).toBe(false);
  });

  it('should compute 3D sphere collisions', () => {
    const s1 = { center: new Vector3(0, 0, 0), radius: 5 };
    const s2 = { center: new Vector3(6, 0, 0), radius: 5 };
    const s3 = { center: new Vector3(20, 0, 0), radius: 2 };

    expect(Collision3D.sphereIntersectsSphere(s1, s2)).toBe(true);
    expect(Collision3D.sphereIntersectsSphere(s1, s3)).toBe(false);
  });

  it('should integrate rigid body velocities with gravity', () => {
    const rb = new RigidBody3D(new Vector3(0, 10, 0), 2.0);
    rb.update(0.1);
    expect(rb.velocity.y).toBeLessThan(0);
    expect(rb.position.y).toBeLessThan(10);
  });
});
