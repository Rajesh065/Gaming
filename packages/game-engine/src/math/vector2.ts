import { Vector2D } from '@nexusplay/shared-types';

export class Vector2 implements Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static up(): Vector2 {
    return new Vector2(0, 1);
  }

  public static right(): Vector2 {
    return new Vector2(1, 0);
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public add(v: Vector2D): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public subtract(v: Vector2D): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  public scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  public cross(v: Vector2D): number {
    return this.x * v.y - this.y * v.x;
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public distanceTo(v: Vector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public normalize(): this {
    const len = this.length();
    if (len > 0.00001) {
      this.scale(1 / len);
    } else {
      this.set(0, 0);
    }
    return this;
  }

  public rotate(radians: number): this {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rx = this.x * cos - this.y * sin;
    const ry = this.x * sin + this.y * cos;
    this.x = rx;
    this.y = ry;
    return this;
  }

  public lerp(target: Vector2D, alpha: number): this {
    this.x += (target.x - this.x) * alpha;
    this.y += (target.y - this.y) * alpha;
    return this;
  }
}
