import { Vector2 } from '../math/vector2';

export interface Box2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle2D {
  x: number;
  y: number;
  radius: number;
}

export class Collision2D {
  public static pointInBox(px: number, py: number, box: Box2D): boolean {
    return px >= box.x && px <= box.x + box.width && py >= box.y && py <= box.y + box.height;
  }

  public static pointInCircle(px: number, py: number, circle: Circle2D): boolean {
    const dx = px - circle.x;
    const dy = py - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  public static aabbIntersectsAABB(a: Box2D, b: Box2D): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public static circleIntersectsCircle(a: Circle2D, b: Circle2D): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const rSum = a.radius + b.radius;
    return dx * dx + dy * dy <= rSum * rSum;
  }

  public static circleIntersectsAABB(circle: Circle2D, box: Box2D): boolean {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  public static raycastAABB(
    origin: Vector2,
    direction: Vector2,
    box: Box2D,
    maxDistance: number = 1000
  ): { hit: boolean; distance: number; point?: Vector2 } {
    let tMin = (box.x - origin.x) / (direction.x || 0.00001);
    let tMax = (box.x + box.width - origin.x) / (direction.x || 0.00001);

    if (tMin > tMax) [tMin, tMax] = [tMax, tMin];

    let tyMin = (box.y - origin.y) / (direction.y || 0.00001);
    let tyMax = (box.y + box.height - origin.y) / (direction.y || 0.00001);

    if (tyMin > tyMax) [tyMin, tyMax] = [tyMax, tyMin];

    if (tMin > tyMax || tyMin > tMax) {
      return { hit: false, distance: Infinity };
    }

    const tNear = Math.max(tMin, tyMin);
    const tFar = Math.min(tMax, tyMax);

    if (tFar < 0 || tNear > maxDistance) {
      return { hit: false, distance: Infinity };
    }

    const hitDistance = tNear < 0 ? tFar : tNear;
    const hitPoint = origin.clone().add(direction.clone().scale(hitDistance));

    return { hit: true, distance: hitDistance, point: hitPoint };
  }
}
