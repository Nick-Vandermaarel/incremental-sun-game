<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import GeneratorItem from './GeneratorItem.vue';

const store = useGameStore();
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-xl font-bold text-yellow-300 mb-4">Generators</h2>
    <GeneratorItem
      v-for="generator in store.generators"
      :key="generator.id"
      :generator="generator"
    />
  </div>
</template>
