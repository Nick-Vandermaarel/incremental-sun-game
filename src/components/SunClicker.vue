<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { formatNumber } from '../utils/formatNumber';

const store = useGameStore();
const isAnimating = ref(false);
const clickAmount = ref('');

function handleClick() {
  store.clickSun();
  isAnimating.value = true;
  clickAmount.value = `+${formatNumber(store.clickPower)}`;
  
  setTimeout(() => {
    isAnimating.value = false;
    clickAmount.value = '';
  }, 500);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8">
    <div class="relative">
      <button
        @click="handleClick"
        class="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 
               shadow-[0_0_60px_rgba(255,200,0,0.6)] hover:shadow-[0_0_80px_rgba(255,200,0,0.8)]
               transition-all duration-150 active:scale-95 cursor-pointer
               flex items-center justify-center border-4 border-yellow-200"
      >
        <div class="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400
                    opacity-50 animate-pulse"></div>
      </button>
      
      <div
        v-if="isAnimating"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          class="text-2xl font-bold text-white animate-float"
          style="text-shadow: 0 0 10px rgba(255, 200, 0, 0.8);"
        >
          {{ clickAmount }}
        </span>
      </div>
    </div>
    
    <p class="text-yellow-200 mt-4 text-sm">Click the Sun to harvest energy</p>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1.2);
  }
}

.animate-float {
  animation: float 0.5s ease-out forwards;
}
</style>
