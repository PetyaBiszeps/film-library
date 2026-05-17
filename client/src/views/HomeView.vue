<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue'
import CommonChip from '@/components/common/CommonChip.vue'
import HOME_CONTENT from '@/content/home.ts'
</script>

<template>
  <section class="home">
    <header class="home__header">
      <div class="home__header__text">
        <h1 class="home__header__text__title">
          {{ HOME_CONTENT.header.title }}
        </h1>

        <p class="home__header__text__caption">
          {{ HOME_CONTENT.header.description }}
        </p>
      </div>

      <CommonSearch />

      <section class="home__header__filters">
        <header class="home__header__filters__header">
          <p class="home__header__filters__header__title">
            {{ HOME_CONTENT.main.filters.title }}
          </p>
        </header>

        <main class="home__header__filters__main">
          <CommonChip
            v-for="item in HOME_CONTENT.main.filters.items"
            :key="item.key"
            :label="item.label"
          />
        </main>
      </section>
    </header>

    <main class="home__main">
      Page content here!
    </main>
  </section>
</template>
