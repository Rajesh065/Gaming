import { Vector3 } from '../math/vector3';
import { SimplexNoise } from './noise';

export interface TrackPoint {
  position: Vector3;
  tangent: Vector3;
  normal: Vector3;
  binormal: Vector3;
  width: number;
  bankAngle: number;
  speedMultiplier: number;
  obstacleType?: 'NONE' | 'SPEED_BOOST' | 'ENERGY_SHIELD' | 'HAZARD_MINE';
}

export interface GeneratedTrack {
  points: TrackPoint[];
  totalLength: number;
  checkpoints: number[];
  lapCount: number;
}

export class TrackGenerator {
  public static generateCyberTrack(
    numSegments: number = 200,
    segmentLength: number = 10,
    seed: number = 42
  ): GeneratedTrack {
    const noise = new SimplexNoise(seed);
    const points: TrackPoint[] = [];
    let currentPos = new Vector3(0, 0, 0);
    let totalLength = 0;
    const checkpoints: number[] = [];

    for (let i = 0; i < numSegments; i++) {
      const t = i / numSegments;
      const angle = t * Math.PI * 2;

      const radiusX = 300 + noise.noise2D(Math.cos(angle) * 2, Math.sin(angle) * 2) * 80;
      const radiusZ = 500 + noise.noise2D(Math.sin(angle) * 2, Math.cos(angle) * 2) * 120;
      const heightY = noise.noise2D(i * 0.05, seed) * 40;

      const px = Math.cos(angle) * radiusX;
      const pz = Math.sin(angle) * radiusZ;
      const py = heightY;

      currentPos = new Vector3(px, py, pz);

      const nextAngle = ((i + 1) % numSegments) * ((Math.PI * 2) / numSegments);
      const nextPx = Math.cos(nextAngle) * (300 + noise.noise2D(Math.cos(nextAngle) * 2, Math.sin(nextAngle) * 2) * 80);
      const nextPz = Math.sin(nextAngle) * (500 + noise.noise2D(Math.sin(nextAngle) * 2, Math.cos(nextAngle) * 2) * 120);
      const nextPy = noise.noise2D((i + 1) * 0.05, seed) * 40;

      const tangent = new Vector3(nextPx - px, nextPy - py, nextPz - pz).normalize();
      const normal = new Vector3(0, 1, 0);
      const binormal = tangent.cross(normal).normalize();

      let obstacleType: TrackPoint['obstacleType'] = 'NONE';
      if (i % 25 === 0 && i !== 0) {
        obstacleType = 'SPEED_BOOST';
      } else if (i % 37 === 0) {
        obstacleType = 'HAZARD_MINE';
      } else if (i % 53 === 0) {
        obstacleType = 'ENERGY_SHIELD';
      }

      if (i % 50 === 0) {
        checkpoints.push(i);
      }

      points.push({
        position: currentPos,
        tangent,
        normal,
        binormal,
        width: 14,
        bankAngle: noise.noise2D(i * 0.1, 0) * 0.3,
        speedMultiplier: obstacleType === 'SPEED_BOOST' ? 1.5 : 1.0,
        obstacleType
      });

      totalLength += segmentLength;
    }

    return {
      points,
      totalLength,
      checkpoints,
      lapCount: 3
    };
  }
}
