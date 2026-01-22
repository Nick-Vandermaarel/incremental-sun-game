<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { formatNumber, formatNumberDetailed } from '../utils/formatNumber';

const store = useGameStore();

const displayPower = computed(() => formatNumber(store.power));
const displayRate = computed(() => formatNumberDetailed(store.powerPerSecond));
</script>

<template>
  <div class="text-center py-6">
    <h1 class="text-4xl font-bold text-yellow-400 drop-shadow-lg">
      {{ displayPower }} Power
    </h1>
    <p class="text-lg text-yellow-200 mt-2">
      +{{ displayRate }}/sec
    </p>
  </div>
</template>
