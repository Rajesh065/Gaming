import { Vector3 } from './vector3';

export class Quaternion {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 1
  ) {}

  public static identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1);
  }

  public static fromAxisAngle(axis: Vector3, angleRadians: number): Quaternion {
    const halfAngle = angleRadians / 2;
    const s = Math.sin(halfAngle);
    const normalizedAxis = axis.clone().normalize();
    return new Quaternion(
      normalizedAxis.x * s,
      normalizedAxis.y * s,
      normalizedAxis.z * s,
      Math.cos(halfAngle)
    );
  }

  public set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  public clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  public multiply(q: Quaternion): this {
    const ax = this.x, ay = this.y, az = this.z, aw = this.w;
    const bx = q.x, by = q.y, bz = q.z, bw = q.w;

    this.x = ax * bw + aw * bx + ay * bz - az * by;
    this.y = ay * bw + aw * by + az * bx - ax * bz;
    this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  public slerp(target: Quaternion, t: number): this {
    if (t === 0) return this;
    if (t === 1) return this.set(target.x, target.y, target.z, target.w);

    let cosHalfTheta = this.w * target.w + this.x * target.x + this.y * target.y + this.z * target.z;

    let targetX = target.x;
    let targetY = target.y;
    let targetZ = target.z;
    let targetW = target.w;

    if (cosHalfTheta < 0) {
      targetW = -targetW;
      targetX = -targetX;
      targetY = -targetY;
      targetZ = -targetZ;
      cosHalfTheta = -cosHalfTheta;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) {
      return this;
    }

    const halfTheta = Math.acos(cosHalfTheta);
    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      this.w = 0.5 * (this.w + targetW);
      this.x = 0.5 * (this.x + targetX);
      this.y = 0.5 * (this.y + targetY);
      this.z = 0.5 * (this.z + targetZ);
      return this;
    }

    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this.w = this.w * ratioA + targetW * ratioB;
    this.x = this.x * ratioA + targetX * ratioB;
    this.y = this.y * ratioA + targetY * ratioB;
    this.z = this.z * ratioA + targetZ * ratioB;

    return this;
  }
}
