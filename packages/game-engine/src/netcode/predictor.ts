import { GameEntityState, PlayerInputFrame } from '@nexusplay/shared-types';
import { Vector3 } from '../math/vector3';

export class ClientPredictionEngine {
  private pendingInputs: PlayerInputFrame[] = [];
  private lastAcknowledgedTick: number = 0;

  public addInput(frame: PlayerInputFrame): void {
    this.pendingInputs.push(frame);
  }

  public reconcile(
    serverAuthoritativeState: GameEntityState,
    serverAcknowledgedTick: number,
    physicsStepFn: (state: GameEntityState, input: PlayerInputFrame) => GameEntityState
  ): GameEntityState {
    this.lastAcknowledgedTick = serverAcknowledgedTick;

    this.pendingInputs = this.pendingInputs.filter(
      (input) => input.tick > serverAcknowledgedTick
    );

    let reconciledState: GameEntityState = {
      ...serverAuthoritativeState,
      position: { ...serverAuthoritativeState.position },
      velocity: { ...serverAuthoritativeState.velocity },
      rotation: { ...serverAuthoritativeState.rotation }
    };

    for (const input of this.pendingInputs) {
      reconciledState = physicsStepFn(reconciledState, input);
    }

    return reconciledState;
  }
}
