<script setup lang="ts">
import AppSidebar from '@/components/app/AppSidebar.vue'
</script>

<template>
  <div :class="['appLayout']">
    <AppSidebar />
    <RouterView />
  </div>
</template>
