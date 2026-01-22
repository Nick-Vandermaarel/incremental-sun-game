<script setup lang="ts">
import { computed } from 'vue';
import type { Upgrade } from '../types/game';
import { useGameStore } from '../stores/gameStore';
import { formatNumber } from '../utils/formatNumber';

const props = defineProps<{
  upgrade: Upgrade;
}>();

const store = useGameStore();

const canAfford = computed(() => store.canAffordUpgrade(props.upgrade));
const formattedCost = computed(() => formatNumber(props.upgrade.cost));

function handleBuy() {
  if (!props.upgrade.purchased && canAfford.value) {
    store.buyUpgrade(props.upgrade.id);
  }
}
</script>

<template>
  <div
    v-if="!upgrade.purchased"
    class="p-4 rounded-lg border transition-all duration-200 bg-gray-800 border-purple-600 hover:border-purple-400"
    :class="[
      canAfford ? 'cursor-pointer hover:bg-gray-750' : 'opacity-70'
    ]"
    @click="handleBuy()"
  >
    <div class="flex justify-between items-center">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-purple-300">{{ upgrade.name }}</h3>
        <p class="text-sm text-gray-400 mt-1">{{ upgrade.description }}</p>
      </div>
      
      <div class="text-right">
        <button
          :disabled="!canAfford"
          class="px-4 py-2 rounded font-semibold transition-all duration-200"
          :class="[
            canAfford
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
        >
          Buy
          <span class="block text-xs opacity-80">{{ formattedCost }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
