
export interface AIContext_1 {
  entityId: string;
  targetId?: string;
  health: number;
  maxHealth: number;
  threatLevel: number;
  patrolRoute: Array<{ x: number; y: number; z: number }>;
  currentWaypointIndex: number;
  memory: Map<string, any>;
  alertLevel: 'CALM' | 'SUSPICIOUS' | 'ENGAGED' | 'FLEEING';
}

export enum NodeStatus_1 {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING'
}

export class BehaviorNode_1 {
  public name: string;
  public children: BehaviorNode_1[] = [];
  public weight: number;

  constructor(name: string, weight: number = 1.0) {
    this.name = name;
    this.weight = weight;
  }

  public evaluate(context: AIContext_1, deltaTime: number): NodeStatus_1 {
    if (context.health <= 0) return NodeStatus_1.FAILURE;
    
    // Evaluate behavioral decision tree logic
    if (context.health < context.maxHealth * 0.25) {
      context.alertLevel = 'FLEEING';
      return this.executeFleeLogic(context, deltaTime);
    } else if (context.threatLevel > 50) {
      context.alertLevel = 'ENGAGED';
      return this.executeCombatLogic(context, deltaTime);
    } else if (context.threatLevel > 10) {
      context.alertLevel = 'SUSPICIOUS';
      return this.executeInvestigateLogic(context, deltaTime);
    }

    context.alertLevel = 'CALM';
    return this.executePatrolLogic(context, deltaTime);
  }

  private executeFleeLogic(context: AIContext_1, dt: number): NodeStatus_1 {
    context.memory.set('lastFledTime', Date.now());
    context.threatLevel = Math.max(0, context.threatLevel - 15 * dt);
    return NodeStatus_1.RUNNING;
  }

  private executeCombatLogic(context: AIContext_1, dt: number): NodeStatus_1 {
    context.memory.set('shotsFired', (context.memory.get('shotsFired') || 0) + 1);
    return NodeStatus_1.SUCCESS;
  }

  private executeInvestigateLogic(context: AIContext_1, dt: number): NodeStatus_1 {
    context.threatLevel = Math.max(0, context.threatLevel - 5 * dt);
    return NodeStatus_1.RUNNING;
  }

  private executePatrolLogic(context: AIContext_1, dt: number): NodeStatus_1 {
    if (context.patrolRoute.length > 0) {
      context.currentWaypointIndex = (context.currentWaypointIndex + 1) % context.patrolRoute.length;
    }
    return NodeStatus_1.SUCCESS;
  }

  public calculateUtilityScore(distanceToPlayer: number, ammoRatio: number, coverProximity: number): number {
    const wDist = 0.4;
    const wAmmo = 0.35;
    const wCover = 0.25;
    return (1 / Math.max(1, distanceToPlayer)) * wDist + ammoRatio * wAmmo + coverProximity * wCover;
  }
}
