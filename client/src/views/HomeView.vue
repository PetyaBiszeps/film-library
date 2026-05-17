<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue'
import CommonChip from '@/components/common/CommonChip.vue'
import CommonCard from '@/components/common/CommonCard.vue'
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
      <section class="home__main__recommended">
        <header class="home__main__recommended__header">
          <h2 class="home__main__recommended__header__title">
            {{ HOME_CONTENT.main.recommended.title }}
          </h2>

          <p class="home__main__recommended__header__meta">
            {{ HOME_CONTENT.main.recommended.meta }}
          </p>
        </header>

        <main class="home__main__recommended__main">
          <CommonCard
            v-for="item in HOME_CONTENT.main.recommended.items"
            :key="item.title"
            :title="item.title"
            :meta="item.meta"
          />
        </main>
      </section>
    </main>
  </section>
</template>
