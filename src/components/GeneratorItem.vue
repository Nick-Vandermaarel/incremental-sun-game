<script setup lang="ts">
import { computed } from 'vue';
import type { Generator } from '../types/game';
import { useGameStore } from '../stores/gameStore';
import { formatNumber, formatNumberDetailed } from '../utils/formatNumber';

const props = defineProps<{
  generator: Generator;
}>();

const store = useGameStore();

const cost = computed(() => store.getGeneratorCost(props.generator));
const cost10 = computed(() => store.getGeneratorCostForAmount(props.generator, 10));
const cost100 = computed(() => store.getGeneratorCostForAmount(props.generator, 100));
const canAfford = computed(() => store.canAffordGenerator(props.generator));
const canAfford10 = computed(() => store.canAffordGeneratorBulk(props.generator, 10));
const canAfford100 = computed(() => store.canAffordGeneratorBulk(props.generator, 100));
const perGeneratorOutput = computed(() => {
  return props.generator.baseOutput * store.getAppliedGeneratorMultiplier(props.generator.id);
});
const totalOutput = computed(() => perGeneratorOutput.value * props.generator.owned);

function handleBuy() {
  store.buyGenerator(props.generator.id);
}

function handleBuy10() {
  store.buyGeneratorBulk(props.generator.id, 10);
}

function handleBuy100() {
  store.buyGeneratorBulk(props.generator.id, 100);
}
</script>

<template>
  <div
    class="p-4 rounded-lg border transition-all duration-200"
    :class="[
      generator.unlocked
        ? 'bg-gray-800 border-yellow-600 hover:border-yellow-400'
        : 'bg-gray-900 border-gray-700 opacity-50',
      canAfford && generator.unlocked
        ? 'cursor-pointer hover:bg-gray-750'
        : ''
    ]"
    @click="generator.unlocked && canAfford && handleBuy()"
  >
    <div class="flex justify-between items-center">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-yellow-300">{{ generator.name }}</h3>
        <p class="text-sm text-gray-400">
          Owned: <span class="text-white">{{ generator.owned }}</span>
        </p>
        <p class="text-sm text-gray-400">
          Output: <span class="text-green-400">{{ formatNumberDetailed(perGeneratorOutput) }}/sec each</span>
        </p>
        <p v-if="generator.owned > 0" class="text-sm text-green-300">
          Total: {{ formatNumberDetailed(totalOutput) }}/sec
        </p>
      </div>
      
      <div v-if="generator.unlocked" class="flex flex-row gap-2">
        <button
          :disabled="!canAfford"
          class="px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200"
          :class="[
            canAfford
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
          @click.stop="handleBuy"
        >
          1x
          <span class="block text-xs opacity-80">{{ formatNumber(cost) }}</span>
        </button>
        <button
          :disabled="!canAfford10"
          class="px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200"
          :class="[
            canAfford10
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
          @click.stop="handleBuy10"
        >
          10x
          <span class="block text-xs opacity-80">{{ formatNumber(cost10) }}</span>
        </button>
        <button
          :disabled="!canAfford100"
          class="px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200"
          :class="[
            canAfford100
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          ]"
          @click.stop="handleBuy100"
        >
          100x
          <span class="block text-xs opacity-80">{{ formatNumber(cost100) }}</span>
        </button>
      </div>
      
      <div v-else class="text-gray-500 text-sm">
        🔒 Locked
      </div>
    </div>
  </div>
</template>
