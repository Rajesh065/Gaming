import { GameEntityState, Vector3D } from '@nexusplay/shared-types';
import { Vector3 } from '../math/vector3';

export interface TimestampedEntitySnapshot {
  timestamp: number;
  entities: Record<string, GameEntityState>;
}

export class EntityInterpolator {
  private buffer: TimestampedEntitySnapshot[] = [];
  private interpolationDelayMs: number;

  constructor(interpolationDelayMs: number = 100) {
    this.interpolationDelayMs = interpolationDelayMs;
  }

  public pushSnapshot(timestamp: number, entities: Record<string, GameEntityState>): void {
    this.buffer.push({ timestamp, entities });
    if (this.buffer.length > 60) {
      this.buffer.shift();
    }
  }

  public getInterpolatedEntities(renderTimestamp: number): Record<string, GameEntityState> {
    const targetTime = renderTimestamp - this.interpolationDelayMs;

    if (this.buffer.length === 0) return {};
    if (this.buffer.length === 1) return this.buffer[0].entities;

    let olderIndex = -1;
    for (let i = this.buffer.length - 1; i >= 0; i--) {
      if (this.buffer[i].timestamp <= targetTime) {
        olderIndex = i;
        break;
      }
    }

    if (olderIndex === -1) {
      return this.buffer[0].entities;
    }
    if (olderIndex === this.buffer.length - 1) {
      return this.buffer[this.buffer.length - 1].entities;
    }

    const s0 = this.buffer[olderIndex];
    const s1 = this.buffer[olderIndex + 1];

    const timeDiff = s1.timestamp - s0.timestamp;
    const alpha = timeDiff > 0 ? (targetTime - s0.timestamp) / timeDiff : 0;
    const clampedAlpha = Math.max(0, Math.min(1, alpha));

    const result: Record<string, GameEntityState> = {};

    for (const id of Object.keys(s0.entities)) {
      const e0 = s0.entities[id];
      const e1 = s1.entities[id];

      if (!e1) {
        result[id] = { ...e0 };
        continue;
      }

      const p0 = new Vector3(e0.position.x, e0.position.y, e0.position.z);
      const p1 = new Vector3(e1.position.x, e1.position.y, e1.position.z);
      const interpPos = p0.lerp(p1, clampedAlpha);

      const r0 = new Vector3(e0.rotation.x, e0.rotation.y, e0.rotation.z);
      const r1 = new Vector3(e1.rotation.x, e1.rotation.y, e1.rotation.z);
      const interpRot = r0.lerp(r1, clampedAlpha);

      result[id] = {
        ...e1,
        position: { x: interpPos.x, y: interpPos.y, z: interpPos.z },
        rotation: { x: interpRot.x, y: interpRot.y, z: interpRot.z }
      };
    }

    return result;
  }
}
