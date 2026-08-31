import { Vector3D } from '@nexusplay/shared-types';

export class Vector3 implements Vector3D {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static up(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  public static forward(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public add(v: Vector3D): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public subtract(v: Vector3D): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  public scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  public dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vector3D): Vector3 {
    const cx = this.y * v.z - this.z * v.y;
    const cy = this.z * v.x - this.x * v.z;
    const cz = this.x * v.y - this.y * v.x;
    return new Vector3(cx, cy, cz);
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public distanceTo(v: Vector3D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public normalize(): this {
    const len = this.length();
    if (len > 0.00001) {
      this.scale(1 / len);
    } else {
      this.set(0, 0, 0);
    }
    return this;
  }

  public lerp(target: Vector3D, alpha: number): this {
    this.x += (target.x - this.x) * alpha;
    this.y += (target.y - this.y) * alpha;
    this.z += (target.z - this.z) * alpha;
    return this;
  }
}
