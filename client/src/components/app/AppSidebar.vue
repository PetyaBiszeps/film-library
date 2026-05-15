<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <h3 class="sidebar__header__title">
        {{ NavigationContent.brand.title }}
      </h3>
    </header>

    <main class="sidebar__content" />

    <footer class="sidebar__footer" />
  </aside>
</template>
