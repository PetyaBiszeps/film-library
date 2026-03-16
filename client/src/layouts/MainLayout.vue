<script setup lang="ts">
import AppSidebar from '@/components/app/AppSidebar.vue'
</script>

<template>
  <div :class="['mainLayout']">
    <AppSidebar />
    <RouterView />
  </div>
</template>
