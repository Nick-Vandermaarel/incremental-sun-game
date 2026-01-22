export interface Generator {
  id: string;
  name: string;
  baseCost: number;
  baseOutput: number;
  owned: number;
  unlocked: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  type: 'click' | 'generator' | 'global';
  generatorId?: string;
  multiplier?: number;
  effect?: number;
}

export interface GameState {
  power: number;
  totalPower: number;
  generators: Generator[];
  upgrades: Upgrade[];
  lastSave: number;
}

export interface SaveData {
  power: number;
  totalPower: number;
  generators: Generator[];
  upgrades: Upgrade[];
  lastSave: number;
}
