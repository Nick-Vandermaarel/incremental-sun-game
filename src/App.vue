<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from './stores/gameStore';
import { useGameLoop } from './composables/useGameLoop';
import PowerDisplay from './components/PowerDisplay.vue';
import SunClicker from './components/SunClicker.vue';
import GeneratorList from './components/GeneratorList.vue';
import UpgradeList from './components/UpgradeList.vue';

const store = useGameStore();
useGameLoop();

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-yellow-400">☀️ Solar Incremental Game</h1>
        <p class="text-gray-400 text-sm mt-2">Harvest energy from the sun and beyond</p>
      </header>
      
      <PowerDisplay />
      
      <SunClicker />
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <GeneratorList />
        </div>
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <UpgradeList />
        </div>
      </div>
      
      <footer class="text-center mt-12 text-gray-500 text-sm">
        <p>Game auto-saves every 30 seconds</p>
        <button 
          @click="store.resetGame()"
          class="mt-4 text-red-400 hover:text-red-300 text-xs underline"
        >
          Reset Game
        </button>
      </footer>
    </div>
  </div>
</template>
