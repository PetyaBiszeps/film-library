<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
</script>

<template>
  <nav
    class="navbar"
    :aria-label="`${NavigationContent.brand.title} mobile navigation`"
  >
    <button
      v-for="item in NavigationContent.main"
      :key="item.key"

      :type="'button'"
      :class="['navbar__item', {
        active: item.key === 'library'
      }]"
    >
      <span class="navbar__item__indicator" />

      <span class="navbar__item__label">
        {{ item.label }}
      </span>
    </button>
  </nav>
</template>
