export interface CombatEntity {
  id: string;
  attackPower: number;
  defense: number;
  critChance: number;
  critMultiplier: number;
  elementalType: 'KINETIC' | 'ENERGY' | 'PLASMA' | 'VOID';
  level: number;
}

export interface DamageResult {
  rawDamage: number;
  mitigatedDamage: number;
  isCritical: boolean;
  elementalMultiplier: number;
  finalDamage: number;
}

export class CombatCalculator {
  private static elementalMatrix: Record<string, Record<string, number>> = {
    KINETIC: { KINETIC: 1.0, ENERGY: 0.8, PLASMA: 1.2, VOID: 1.0 },
    ENERGY: { KINETIC: 1.2, ENERGY: 1.0, PLASMA: 0.8, VOID: 1.1 },
    PLASMA: { KINETIC: 0.8, ENERGY: 1.3, PLASMA: 1.0, VOID: 1.2 },
    VOID: { KINETIC: 1.1, ENERGY: 1.1, PLASMA: 1.1, VOID: 1.0 }
  };

  public static calculateDamage(
    attacker: CombatEntity,
    defender: CombatEntity,
    skillBasePower: number = 0
  ): DamageResult {
    const raw = attacker.attackPower + skillBasePower;
    const defenseMitigation = 100 / (100 + Math.max(0, defender.defense));
    const mitigatedDamage = raw * defenseMitigation;

    const isCritical = Math.random() < attacker.critChance;
    const critMult = isCritical ? Math.max(1.5, attacker.critMultiplier) : 1.0;

    const elemMult =
      this.elementalMatrix[attacker.elementalType]?.[defender.elementalType] || 1.0;

    const finalDamage = Math.max(1, Math.round(mitigatedDamage * critMult * elemMult));

    return {
      rawDamage: raw,
      mitigatedDamage,
      isCritical,
      elementalMultiplier: elemMult,
      finalDamage
    };
  }

  public static calculateXpGain(winnerLevel: number, loserLevel: number): number {
    const levelDiff = loserLevel - winnerLevel;
    const base = 100;
    const multiplier = Math.max(0.2, 1 + levelDiff * 0.15);
    return Math.round(base * multiplier);
  }
}
