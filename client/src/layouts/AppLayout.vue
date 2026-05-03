<script setup lang="ts">
import AppNavigation from '@/components/app/AppNavigation.vue'
</script>

<template>
  <div :class="['appLayout']">
    <RouterView />
    <AppNavigation />
  </div>
</template>
