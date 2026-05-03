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
        v-for="item in NavigationContent.main"
        :key="item.key"
        class="navbar__list__item"
      >
        <BaseLink
          :name="item.label"
          :href="''"

          size="sm"
          variant="tertiary"
        />
      </li>
    </ul>
  </nav>
</template>
