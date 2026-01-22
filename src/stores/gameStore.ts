import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, Generator, Upgrade } from '../types/game';
import { saveGame, loadGame } from '../utils/saveLoad';
import { getDefaultGenerators, getDefaultUpgrades } from '../utils/configLoader';

export const useGameStore = defineStore('game', () => {
  const power = ref(0);
  const totalPower = ref(0);
  const generators = ref<Generator[]>(getDefaultGenerators());
  const upgrades = ref<Upgrade[]>(getDefaultUpgrades());
  const lastSave = ref(Date.now());
  const loaded = ref(false);

  function getUpgrade(id: string): Upgrade | undefined {
    return upgrades.value.find(u => u.id === id);
  }

  function isUpgradePurchased(id: string): boolean {
    const upgrade = getUpgrade(id);
    return upgrade ? upgrade.purchased : false;
  }

  function getGeneratorMultipliers(generatorId: string): number[] {
    return upgrades.value
      .filter(u => u.type === 'generator' && u.generatorId === generatorId && u.purchased && u.multiplier)
      .map(u => u.multiplier!);
  }

  function getAppliedGeneratorMultiplier(generatorId: string): number {
    const multipliers = getGeneratorMultipliers(generatorId);
    if (multipliers.length === 0) return 1;
    return multipliers.reduce((acc, m) => acc * m, 1);
  }

  const clickPower = computed(() => {
    let base = 1;

    const focusedLens = getUpgrade('focused_lens');
    if (focusedLens?.purchased && focusedLens.effect) base += focusedLens.effect;

    const solarConc = getUpgrade('solar_concentrators');
    if (solarConc?.purchased && solarConc.multiplier) base *= solarConc.multiplier;

    return base;
  });

  const quantumTapBonus = computed(() => {
    const quantumTap = getUpgrade('quantum_tap');
    return (quantumTap?.purchased && quantumTap.effect) ? quantumTap.effect : 0;
  });

  const synergyActive = computed(() => isUpgradePurchased('synergy'));
  const synergyMultiplier = computed(() => getUpgrade('synergy')?.multiplier ?? 1.01);

  const offlineProgressActive = computed(() => isUpgradePurchased('offline_progress'));

  const powerPerSecond = computed(() => {
    let total = 0;
    const activeGenerators = generators.value.filter(g => g && g.unlocked);

    for (const generator of activeGenerators) {
      if (!generator) continue;
      const multiplier = getAppliedGeneratorMultiplier(generator.id);
      const output = (generator.baseOutput || 0) * multiplier;
      total += output * (generator.owned || 0);
    }

    if (synergyActive.value) {
      const generatorCount = generators.value.filter(g => g && g.owned > 0).length;
      total *= Math.pow(synergyMultiplier.value, generatorCount);
    }

    return isNaN(total) ? 0 : total;
  });

  function getGeneratorCost(generator: Generator): number {
    if (!generator) return 0;
    return Math.floor((generator.baseCost || 10) * Math.pow(1.15, generator.owned || 0));
  }

  function getGeneratorCostForAmount(generator: Generator, amount: number): number {
    if (!generator || amount <= 0) return 0;
    const owned = generator.owned || 0;
    let totalCost = 0;
    for (let i = 0; i < amount; i++) {
      totalCost += Math.floor((generator.baseCost || 10) * Math.pow(1.15, owned + i));
    }
    return totalCost;
  }

  function canAffordGenerator(generator: Generator): boolean {
    if (!generator) return false;
    return power.value >= getGeneratorCost(generator);
  }

  function canAffordGeneratorBulk(generator: Generator, amount: number): boolean {
    if (!generator) return false;
    return power.value >= getGeneratorCostForAmount(generator, amount);
  }

  function buyGenerator(id: string): boolean {
    const generator = generators.value.find(g => g && g.id === id);
    if (!generator) return false;

    const cost = getGeneratorCost(generator);
    if (power.value < cost) return false;

    power.value -= cost;
    generator.owned = (generator.owned || 0) + 1;

    checkUnlocks();
    saveGame(gameState.value);
    return true;
  }

  function buyGeneratorBulk(id: string, amount: number): boolean {
    const generator = generators.value.find(g => g && g.id === id);
    if (!generator || amount <= 0) return false;

    const cost = getGeneratorCostForAmount(generator, amount);
    if (power.value < cost) return false;

    power.value -= cost;
    generator.owned = (generator.owned || 0) + amount;

    checkUnlocks();
    saveGame(gameState.value);
    return true;
  }

  function canAffordUpgrade(upgrade: Upgrade): boolean {
    if (!upgrade) return false;
    return power.value >= upgrade.cost;
  }

  function buyUpgrade(id: string): boolean {
    const upgrade = getUpgrade(id);
    if (!upgrade || upgrade.purchased) return false;
    if (power.value < upgrade.cost) return false;

    power.value -= upgrade.cost;
    upgrade.purchased = true;

    saveGame(gameState.value);
    return true;
  }

  function clickSun(): void {
    let gain = clickPower.value;
    gain += powerPerSecond.value * quantumTapBonus.value;

    if (isNaN(gain) || !isFinite(gain)) gain = 0;

    power.value += gain;
    totalPower.value += gain;
  }

  function addPower(amount: number): void {
    if (isNaN(amount) || !isFinite(amount)) return;
    power.value += amount;
    totalPower.value += amount;
  }

  function checkUnlocks(): void {
    if (generators.value[2]?.owned && generators.value[2].owned > 0) generators.value[3].unlocked = true;
    if (generators.value[3]?.owned && generators.value[3].owned > 0) generators.value[4].unlocked = true;
    if (generators.value[4]?.owned && generators.value[4].owned > 0) generators.value[5].unlocked = true;
    if (generators.value[5]?.owned && generators.value[5].owned > 0) generators.value[6].unlocked = true;
  }

  const gameState = computed<GameState>(() => ({
    power: power.value || 0,
    totalPower: totalPower.value || 0,
    generators: generators.value,
    upgrades: upgrades.value,
    lastSave: lastSave.value,
  }));

  function initialize(): void {
    if (loaded.value) return;

    const saveData = loadGame();
    if (saveData) {
      power.value = saveData.power || 0;
      totalPower.value = saveData.totalPower || 0;
      lastSave.value = saveData.lastSave || Date.now();

      if (saveData.generators) {
        for (const savedGen of saveData.generators) {
          const existingGen = generators.value.find(g => g && g.id === savedGen.id);
          if (existingGen) {
            existingGen.owned = savedGen.owned || 0;
            existingGen.unlocked = savedGen.unlocked || false;
          }
        }
      }

      if (saveData.upgrades) {
        for (const savedUp of saveData.upgrades) {
          const existingUp = getUpgrade(savedUp.id);
          if (existingUp) {
            existingUp.purchased = savedUp.purchased || false;
          }
        }
      }

      const offlineSeconds = (Date.now() - lastSave.value) / 1000;
      const offlineMultiplier = offlineProgressActive.value ? 1.0 : 0.5;

      if (offlineSeconds > 0) {
        const pps = powerPerSecond.value;
        const offlineGain = pps * offlineSeconds * offlineMultiplier;
        if (offlineGain > 0 && isFinite(offlineGain)) {
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

    generators.value = getDefaultGenerators();
    upgrades.value = getDefaultUpgrades();

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
    quantumTapBonus,
    powerPerSecond,
    getGeneratorCost,
    getGeneratorCostForAmount,
    getAppliedGeneratorMultiplier,
    canAffordGenerator,
    canAffordGeneratorBulk,
    buyGenerator,
    buyGeneratorBulk,
    canAffordUpgrade,
    buyUpgrade,
    clickSun,
    addPower,
    initialize,
    resetGame,
  };
});
