<script setup lang="ts">
import NAV_CONTENT from '@/content/Navigation.content.ts'
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <h2 class="header__nav__title">
        {{ NAV_CONTENT.brand.title }}
      </h2>

      <ul class="header__nav__list">
        <li class="header__nav__list__item">
          <BaseButton
            size="sm"
            variant="secondary"
          >
            F
          </BaseButton>
        </li>

        <li class="header__nav__list__item">
          <BaseButton
            size="sm"
            variant="secondary"
          >
            U
          </BaseButton>
        </li>
      </ul>
    </nav>
  </header>
</template>
