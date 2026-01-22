<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import UpgradeItem from './UpgradeItem.vue';

const store = useGameStore();

const availableUpgrades = computed(() => {
  return store.upgrades.filter(u => !u.purchased);
});

const hasUpgrades = computed(() => availableUpgrades.value.length > 0);
</script>

<template>
  <div v-if="hasUpgrades" class="space-y-3">
    <h2 class="text-xl font-bold text-purple-300 mb-4">Upgrades</h2>
    <UpgradeItem
      v-for="upgrade in availableUpgrades"
      :key="upgrade.id"
      :upgrade="upgrade"
    />
  </div>
</template>
