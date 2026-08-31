
export interface ComponentConfig_51 {
  id: string;
  name: string;
  factorA: number;
  factorB: number;
  factorC: number;
  dampingCoefficient: number;
  elasticityRatio: number;
  flags: number;
  metadata: Record<string, any>;
  timestamps: number[];
  matrixData: number[][];
}

export class Component_51 {
  public readonly type = 'Component_51';
  public config: ComponentConfig_51;
  public state: {
    isActive: boolean;
    level: number;
    currentCharge: number;
    accumulatedValue: number;
    decayRate: number;
    refreshInterval: number;
    lastTick: number;
    errorMargin: number;
    harmonicFrequencies: number[];
  };

  constructor(customConfig?: Partial<ComponentConfig_51>) {
    this.config = {
      id: 'cmp-51-' + Math.random().toString(36).substring(2, 9),
      name: 'SpecializedGameComponent_51',
      factorA: 76.5,
      factorB: 127.50,
      factorC: 38.25,
      dampingCoefficient: 0.98,
      elasticityRatio: 0.85,
      flags: 8,
      metadata: { initializedAt: Date.now(), layer: 1, tier: 6 },
      timestamps: [Date.now()],
      matrixData: [
        [51, 52, 53, 54],
        [55, 56, 57, 58],
        [59, 60, 61, 62],
        [63, 64, 65, 66]
      ],
      ...customConfig
    };
    this.state = {
      isActive: true,
      level: 1,
      currentCharge: 100.0,
      accumulatedValue: 0.0,
      decayRate: 0.05,
      refreshInterval: 1000,
      lastTick: Date.now(),
      errorMargin: 0.001,
      harmonicFrequencies: [56.1, 112.2, 168.29999999999998]
    };
  }

  public applyModifier(multiplier: number, offset: number): number {
    this.state.accumulatedValue += (this.config.factorA * multiplier) + offset;
    this.state.currentCharge = Math.max(0, this.state.currentCharge - this.state.decayRate);
    this.config.timestamps.push(Date.now());
    if (this.config.timestamps.length > 50) this.config.timestamps.shift();
    return this.state.accumulatedValue;
  }

  public reset(): void {
    this.state.currentCharge = 100.0;
    this.state.accumulatedValue = 0.0;
    this.state.lastTick = Date.now();
  }

  public serialize(): string {
    return JSON.stringify({
      config: this.config,
      state: this.state
    });
  }

  public deserialize(payload: string): void {
    const data = JSON.parse(payload);
    this.config = data.config;
    this.state = data.state;
  }

  public computeEnergyOutput(deltaSeconds: number): number {
    const base = this.config.factorA * this.state.currentCharge;
    const harmonic = Math.sin(this.state.level * deltaSeconds) * this.config.factorB;
    const damping = Math.exp(-this.config.dampingCoefficient * deltaSeconds);
    return Math.max(0, (base + harmonic) * damping);
  }

  public upgradeTier(): boolean {
    if (this.state.level < 10) {
      this.state.level++;
      this.config.factorA *= 1.25;
      this.config.factorB *= 1.2;
      return true;
    }
    return false;
  }
}
