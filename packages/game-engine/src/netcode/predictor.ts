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

    // Discard old inputs already acknowledged by server
    this.pendingInputs = this.pendingInputs.filter(
      (input) => input.tick > serverAcknowledgedTick
    );

    // Replay remaining pending inputs on top of server state
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
