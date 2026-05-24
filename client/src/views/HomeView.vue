<script setup lang="ts">
import CommonDropdown from '@/components/common/CommonDropdown.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import CommonCard from '@/components/common/CommonCard.vue'
import CommonChip from '@/components/common/CommonChip.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import HOME_CONTENT from '@/content/home.ts'
import {
  ref
} from 'vue'

  // Constants
const searchQuery = ref<string>('')
const sortItems = [{
  key: 'recommended',
  label: 'Recommended',
  active: true
}, {
  key: 'newest',
  label: 'Newest'
}, {
  key: 'rating',
  label: 'Rating'
}, {
  key: 'title',
  label: 'Title A-Z'
}]
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

      <div class="home__header__actions">
        <BaseInput
          v-model="searchQuery"

          name="desktop-search"
          type="search"
          size="sm"
          placeholder="Search title, cast, or keyword"
          class="home__header__actions__search"
          style="width: 220px;"
        />

        <CommonDropdown
          label="Sort"
          title="Sort by"
          align="right"
          :items="sortItems"
        />
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
