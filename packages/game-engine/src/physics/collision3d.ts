import { Vector3 } from '../math/vector3';

export interface BoundingBox3D {
  min: Vector3;
  max: Vector3;
}

export interface BoundingSphere3D {
  center: Vector3;
  radius: number;
}

export class Collision3D {
  public static aabbIntersectsAABB(a: BoundingBox3D, b: BoundingBox3D): boolean {
    return (
      a.min.x <= b.max.x &&
      a.max.x >= b.min.x &&
      a.min.y <= b.max.y &&
      a.max.y >= b.min.y &&
      a.min.z <= b.max.z &&
      a.max.z >= b.min.z
    );
  }

  public static sphereIntersectsSphere(a: BoundingSphere3D, b: BoundingSphere3D): boolean {
    const distSq = a.center.distanceTo(b.center) ** 2;
    const radSum = a.radius + b.radius;
    return distSq <= radSum * radSum;
  }

  public static sphereIntersectsAABB(sphere: BoundingSphere3D, box: BoundingBox3D): boolean {
    const closestX = Math.max(box.min.x, Math.min(sphere.center.x, box.max.x));
    const closestY = Math.max(box.min.y, Math.min(sphere.center.y, box.max.y));
    const closestZ = Math.max(box.min.z, Math.min(sphere.center.z, box.max.z));

    const dx = sphere.center.x - closestX;
    const dy = sphere.center.y - closestY;
    const dz = sphere.center.z - closestZ;

    return dx * dx + dy * dy + dz * dz <= sphere.radius * sphere.radius;
  }
}
