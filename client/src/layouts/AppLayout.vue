<script setup lang="ts">
import AppSidebar from '@/components/app/AppSidebar.vue'
import AppHeader from '@/components/app/AppHeader.vue'
import AppDock from '@/components/app/AppDock.vue'
</script>

<template>
  <div class="appLayout">
    <AppSidebar />

    <div class="appLayout__content">
      <AppHeader />

      <RouterView />

      <AppDock />
    </div>
  </div>
</template>
