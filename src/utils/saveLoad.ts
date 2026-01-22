import type { SaveData, GameState } from '../types/game';

const SAVE_KEY = 'solarGame';

export function saveGame(state: GameState): void {
  const saveData: SaveData = {
    power: state.power,
    totalPower: state.totalPower,
    generators: state.generators,
    upgrades: state.upgrades,
    lastSave: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

export function loadGame(): SaveData | null {
  const saveString = localStorage.getItem(SAVE_KEY);
  if (!saveString) return null;
  
  try {
    return JSON.parse(saveString) as SaveData;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
