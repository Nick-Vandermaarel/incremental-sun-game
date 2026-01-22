import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const TICK_RATE = 100;

export function useGameLoop() {
  const store = useGameStore();
  let intervalId: number | null = null;
  let lastTick = Date.now();

  function tick() {
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    store.addPower(store.powerPerSecond * delta);
  }

  onMounted(() => {
    intervalId = window.setInterval(tick, TICK_RATE);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    tickRate: TICK_RATE,
  };
}
