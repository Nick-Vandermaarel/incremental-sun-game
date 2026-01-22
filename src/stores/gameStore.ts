import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, Generator, Upgrade } from '../types/game';
import { saveGame, loadGame } from '../utils/saveLoad';

const DEFAULT_GENERATORS: Generator[] = [
  { id: 'solar_array', name: 'Solar Array', baseCost: 10, baseOutput: 0.1, owned: 0, unlocked: true },
  { id: 'lunar_collector', name: 'Lunar Collector', baseCost: 100, baseOutput: 1, owned: 0, unlocked: true },
  { id: 'fusion_plant', name: 'Fusion Plant', baseCost: 1000, baseOutput: 8, owned: 0, unlocked: true },
  { id: 'asteroid_harvester', name: 'Asteroid Harvester', baseCost: 10000, baseOutput: 50, owned: 0, unlocked: false },
  { id: 'gas_giant_siphon', name: 'Gas Giant Siphon', baseCost: 100000, baseOutput: 300, owned: 0, unlocked: false },
  { id: 'dyson_swarm', name: 'Dyson Swarm Node', baseCost: 1000000, baseOutput: 2000, owned: 0, unlocked: false },
  { id: 'dyson_sphere', name: 'Dyson Sphere', baseCost: 100000000, baseOutput: 20000, owned: 0, unlocked: false },
];

const DEFAULT_UPGRADES: Upgrade[] = [
  { id: 'focused_lens', name: 'Focused Lens', description: '+1 Power per click', cost: 50, purchased: false, type: 'click', effect: 1 },
  { id: 'solar_concentrators', name: 'Solar Concentrators', description: '+50% Power per click', cost: 500, purchased: false, type: 'click', multiplier: 1.5 },
  { id: 'quantum_tap', name: 'Quantum Tap', description: 'Click gains 1% of Power/sec', cost: 5000, purchased: false, type: 'click', effect: 0.01 },
  { id: 'efficiency_1', name: 'Efficiency I', description: '+25% output for Solar Array', cost: 100, purchased: false, type: 'generator', generatorId: 'solar_array', multiplier: 1.25 },
  { id: 'efficiency_2', name: 'Efficiency II', description: '+50% output for Solar Array', cost: 500, purchased: false, type: 'generator', generatorId: 'solar_array', multiplier: 1.5 },
  { id: 'efficiency_3', name: 'Efficiency III', description: '+100% output for Solar Array', cost: 2500, purchased: false, type: 'generator', generatorId: 'solar_array', multiplier: 2 },
  { id: 'lunar_efficiency_1', name: 'Lunar Efficiency I', description: '+25% output for Lunar Collector', cost: 1000, purchased: false, type: 'generator', generatorId: 'lunar_collector', multiplier: 1.25 },
  { id: 'fusion_efficiency_1', name: 'Fusion Efficiency I', description: '+25% output for Fusion Plant', cost: 10000, purchased: false, type: 'generator', generatorId: 'fusion_plant', multiplier: 1.25 },
  { id: 'synergy', name: 'Synergy', description: 'Each generator type boosts others by 1%', cost: 50000, purchased: false, type: 'global', multiplier: 1.01 },
];

export const useGameStore = defineStore('game', () => {
  const power = ref(0);
  const totalPower = ref(0);
  const generators = ref<Generator[]>(JSON.parse(JSON.stringify(DEFAULT_GENERATORS)));
  const upgrades = ref<Upgrade[]>(JSON.parse(JSON.stringify(DEFAULT_UPGRADES)));
  const lastSave = ref(Date.now());
  const loaded = ref(false);

  const clickPower = computed(() => {
    let base = 1;
    const focusedLens = upgrades.value.find(u => u.id === 'focused_lens' && u.purchased);
    const solarConc = upgrades.value.find(u => u.id === 'solar_concentrators' && u.purchased);
    
    if (focusedLens) base += focusedLens.effect!;
    if (solarConc) base *= solarConc.multiplier!;
    
    return base;
  });

  const powerPerSecond = computed(() => {
    let total = 0;
    const activeGenerators = generators.value.filter(g => g.unlocked);
    const synergy = upgrades.value.find(u => u.id === 'synergy' && u.purchased);
    
    for (const generator of activeGenerators) {
      let output = generator.baseOutput;
      const efficiencyUpgrade = upgrades.value.find(
        u => u.type === 'generator' && u.generatorId === generator.id && u.purchased
      );
      
      if (efficiencyUpgrade) {
        output *= efficiencyUpgrade.multiplier!;
      }
      
      total += output * generator.owned;
    }
    
    if (synergy) {
      const generatorCount = generators.value.filter(g => g.owned > 0).length;
      total *= Math.pow(synergy.multiplier!, generatorCount);
    }
    
    return total;
  });

  function getGeneratorCost(generator: Generator): number {
    return Math.floor(generator.baseCost * Math.pow(1.15, generator.owned));
  }

  function canAffordGenerator(generator: Generator): boolean {
    return power.value >= getGeneratorCost(generator);
  }

  function buyGenerator(id: string): boolean {
    const generator = generators.value.find(g => g.id === id);
    if (!generator) return false;
    
    const cost = getGeneratorCost(generator);
    if (power.value < cost) return false;
    
    power.value -= cost;
    generator.owned++;
    
    checkUnlocks();
    saveGame(gameState.value);
    return true;
  }

  function canAffordUpgrade(upgrade: Upgrade): boolean {
    return power.value >= upgrade.cost;
  }

  function buyUpgrade(id: string): boolean {
    const upgrade = upgrades.value.find(u => u.id === id);
    if (!upgrade || upgrade.purchased) return false;
    if (power.value < upgrade.cost) return false;
    
    power.value -= upgrade.cost;
    upgrade.purchased = true;
    
    saveGame(gameState.value);
    return true;
  }

  function clickSun(): void {
    let gain = clickPower.value;
    const quantumTap = upgrades.value.find(u => u.id === 'quantum_tap' && u.purchased);
    
    if (quantumTap) {
      gain += powerPerSecond.value * quantumTap.effect!;
    }
    
    power.value += gain;
    totalPower.value += gain;
  }

  function addPower(amount: number): void {
    power.value += amount;
    totalPower.value += amount;
  }

  function checkUnlocks(): void {
    if (generators.value[2].owned > 0) generators.value[3].unlocked = true;
    if (generators.value[3].owned > 0) generators.value[4].unlocked = true;
    if (generators.value[4].owned > 0) generators.value[5].unlocked = true;
    if (generators.value[5].owned > 0) generators.value[6].unlocked = true;
  }

  const gameState = computed<GameState>(() => ({
    power: power.value,
    totalPower: totalPower.value,
    generators: generators.value,
    upgrades: upgrades.value,
    lastSave: lastSave.value,
  }));

  function initialize(): void {
    if (loaded.value) return;
    
    const saveData = loadGame();
    if (saveData) {
      power.value = saveData.power;
      totalPower.value = saveData.totalPower;
      lastSave.value = saveData.lastSave;
      
      for (const savedGen of saveData.generators) {
        const existingGen = generators.value.find(g => g.id === savedGen.id);
        if (existingGen) {
          existingGen.owned = savedGen.owned;
          existingGen.unlocked = savedGen.unlocked;
        }
      }
      
      for (const savedUp of saveData.upgrades) {
        const existingUp = upgrades.value.find(u => u.id === savedUp.id);
        if (existingUp) {
          existingUp.purchased = savedUp.purchased;
        }
      }
      
      const offlineSeconds = (Date.now() - saveData.lastSave) / 1000;
      const offlineProgress = upgrades.value.find(u => u.id === 'offline_progress');
      
      let offlineMultiplier = 0.5;
      if (offlineProgress && offlineProgress.purchased) {
        offlineMultiplier = 0.5;
      }
      
      if (offlineSeconds > 0) {
        const offlineGain = powerPerSecond.value * offlineSeconds * offlineMultiplier;
        if (offlineGain > 0) {
          power.value += offlineGain;
          totalPower.value += offlineGain;
        }
      }
    }
    
    loaded.value = true;
    checkUnlocks();
    
    setInterval(() => {
      saveGame(gameState.value);
      lastSave.value = Date.now();
    }, 30000);
  }

  function resetGame(): void {
    power.value = 0;
    totalPower.value = 0;
    lastSave.value = Date.now();
    
    generators.value = JSON.parse(JSON.stringify(DEFAULT_GENERATORS));
    upgrades.value = JSON.parse(JSON.stringify(DEFAULT_UPGRADES));
    
    localStorage.removeItem('solarGame');
  }

  return {
    power,
    totalPower,
    generators,
    upgrades,
    lastSave,
    loaded,
    clickPower,
    powerPerSecond,
    getGeneratorCost,
    canAffordGenerator,
    buyGenerator,
    canAffordUpgrade,
    buyUpgrade,
    clickSun,
    addPower,
    initialize,
    resetGame,
  };
});
