<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
import CommonChip from '@/components/common/CommonChip.vue'
import useMovies from '@/composables/useMovies.ts'
import HOME_CONTENT from '@/content/home.ts'

const {
  activeFeed,
  isSearchActive,
  fetchMovieFeed
} = useMovies()
</script>

<template>
  <aside
    class="sidebar"
    :aria-label="`${NavigationContent.brand.title} desktop navigation`"
  >
    <header class="sidebar__header">
      <h3 class="sidebar__header__title">
        {{ NavigationContent.brand.title }}
      </h3>
    </header>

    <main class="sidebar__content">
      <nav
        class="sidebar__nav"
        aria-label="Primary navigation"
      >
        <ul class="sidebar__nav__list">
          <li
            v-for="tab in NavigationContent.tabs"
            :key="tab.name"
            class="sidebar__nav__list__item"
          >
            <CommonChip
              :label="tab.name"
              :href="tab.href"
              :marker="'bar'"
            />
          </li>
        </ul>
      </nav>

      <section
        class="sidebar__filters"
        aria-labelledby="sidebar-filters-title"
      >
        <h4
          id="sidebar-filters-title"
          class="sidebar__sectionTitle"
        >
          {{ HOME_CONTENT.main.filters.title }}
        </h4>

        <ul class="sidebar__filters__list">
          <li
            v-for="filter in HOME_CONTENT.main.filters.items"
            :key="filter.key"
            class="sidebar__filters__list__item"
          >
            <CommonChip
              :label="filter.label"
              :active="!isSearchActive && filter.key === activeFeed"
              @click="fetchMovieFeed(filter.key)"
            />
          </li>
        </ul>
      </section>

      <div
        class="sidebar__spacer"
        aria-hidden="true"
      />
    </main>

    <footer
      class="sidebar__footer"
      aria-labelledby="sidebar-summary-title"
    >
      <h4
        id="sidebar-summary-title"
        class="sidebar__sectionTitle"
      >
        Summary
      </h4>

      <dl class="sidebar__summary">
        <div
          v-for="stat in NavigationContent.stats"
          :key="stat.label"
          :class="['sidebar__summary__item', {
            active: stat.active
          }]"
        >
          <dt class="sidebar__summary__item__label">
            {{ stat.label }}
          </dt>

          <dd class="sidebar__summary__item__value">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </footer>
  </aside>
</template>
