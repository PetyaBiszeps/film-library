<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
import BaseLink from '@/components/base/BaseLink.vue'
</script>

<template>
  <nav
    class="dock"
    :aria-label="`${NavigationContent.brand.title} mobile navigation`"
  >
    <ul class="dock__list">
      <li
        v-for="tab in NavigationContent.tabs"
        :key="tab.name"
        class="dock__list__item"
      >
        <BaseLink
          :name="tab.name"
          :href="tab.href"
          :exact="true"

          size="sm"
          variant="tertiary"
          style="font-size: 0.6875rem;"
        />
      </li>
    </ul>
  </nav>
</template>
