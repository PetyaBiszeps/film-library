<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
import BaseLink from '@/components/base/BaseLink.vue'
</script>

<template>
  <nav
    class="navbar"
    :aria-label="`${NavigationContent.brand.title} mobile navigation`"
  >
    <ul class="navbar__list">
      <li
        v-for="tab in NavigationContent.tabs"
        :key="tab.name"
        class="navbar__list__item"
      >
        <BaseLink
          :name="tab.name"
          :href="tab.href"
          :exact="true"

          size="sm"
          variant="tertiary"
        />
      </li>
    </ul>
  </nav>
</template>
