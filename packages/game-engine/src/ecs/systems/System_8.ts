
import { System, ECSWorld, EntityId } from '../world';
import { Component_8 } from '../components/Component_8';

export class System_8 implements System {
  public readonly name = 'SpecializedEngineSystem_8';
  public readonly priority = 80;
  private processedEntityCount = 0;
  private totalExecutionTimeMs = 0;

  public init(world: ECSWorld): void {
    // Warmup system state & register event listeners
  }

  public update(world: ECSWorld, deltaTime: number): void {
    const entities = world.query('Component_8');
    const startTime = performance.now();

    for (const entityId of entities) {
      const comp = world.getComponent<Component_8>(entityId, 'Component_8');
      if (comp && comp.state.isActive) {
        const energy = comp.computeEnergyOutput(deltaTime);
        comp.applyModifier(1.02, energy * 0.01);
        if (comp.state.currentCharge < 5) {
          comp.reset();
        }
      }
    }

    this.processedEntityCount += entities.length;
    this.totalExecutionTimeMs += performance.now() - startTime;
  }

  public getTelemetry() {
    return {
      systemName: this.name,
      processedTotal: this.processedEntityCount,
      avgExecutionTimeMs: this.totalExecutionTimeMs / (Math.max(1, this.processedEntityCount))
    };
  }

  public destroy(): void {
    this.processedEntityCount = 0;
    this.totalExecutionTimeMs = 0;
  }
}
