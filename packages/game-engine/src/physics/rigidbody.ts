import { Vector3 } from '../math/vector3';

export class RigidBody3D {
  public position: Vector3;
  public velocity: Vector3;
  public acceleration: Vector3;
  public mass: number;
  public drag: number;
  public useGravity: boolean;
  public gravity: Vector3;
  public isGrounded: boolean;

  constructor(position: Vector3 = new Vector3(), mass: number = 1.0) {
    this.position = position.clone();
    this.velocity = new Vector3();
    this.acceleration = new Vector3();
    this.mass = Math.max(0.001, mass);
    this.drag = 0.98;
    this.useGravity = true;
    this.gravity = new Vector3(0, -9.81, 0);
    this.isGrounded = false;
  }

  public applyForce(force: Vector3): void {
    this.acceleration.add(force.clone().scale(1 / this.mass));
  }

  public applyImpulse(impulse: Vector3): void {
    this.velocity.add(impulse.clone().scale(1 / this.mass));
  }

  public update(deltaTime: number): void {
    if (this.useGravity && !this.isGrounded) {
      this.acceleration.add(this.gravity);
    }

    this.velocity.add(this.acceleration.clone().scale(deltaTime));
    this.velocity.scale(Math.pow(this.drag, deltaTime * 60));
    this.position.add(this.velocity.clone().scale(deltaTime));

    this.acceleration.set(0, 0, 0);
  }
}
