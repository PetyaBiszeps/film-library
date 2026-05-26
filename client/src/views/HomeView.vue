<script setup lang="ts">
import CommonDropdown from '@/components/common/CommonDropdown.vue'
import CommonSearch from '@/components/common/CommonSearch.vue'
import CommonCard from '@/components/common/CommonCard.vue'
import CommonChip from '@/components/common/CommonChip.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import useMovies from '@/composables/useMovies.ts'
import HOME_CONTENT from '@/content/home.ts'
import {
  computed,
  onMounted
} from 'vue'
import { useRouter } from 'vue-router'
import type {
  IMovie
} from '@/types'

  // Init
const router = useRouter()
const {
  movies, hasMovies, isLoading, isLoadingMore, errorMessage, searchQuery, activeSort, activeFeed, moviesMeta, isSearchActive,
  canLoadMore, fetchSearchMovies, fetchDiscoveredMovies, fetchMovieFeed, loadMoreMovies
} = useMovies()

  // Constants
const sortItems = computed(() => HOME_CONTENT.main.sort.items.map((item) => ({
  ...item,
  active: item.key === activeSort.value
})))

  // Vue properties
onMounted(() => {
  void fetchMovieFeed()
})

  // Methods
function openMovieDetails(movie: IMovie): void {
  void router.push(`/movies/${movie.tmdbId}`)
}
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
          @keydown.enter="fetchSearchMovies(searchQuery)"
        />

        <CommonDropdown
          :label="HOME_CONTENT.main.sort.label"
          :title="HOME_CONTENT.main.sort.title"
          align="right"
          :items="sortItems"
          @select="fetchDiscoveredMovies($event.key)"
        />
      </div>

      <CommonSearch
        v-model="searchQuery"
        @search="fetchSearchMovies"
      />

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
            :active="!isSearchActive && item.key === activeFeed"
            @click="fetchMovieFeed(item.key)"
          />
        </main>
      </section>
    </header>

    <main class="home__main">
      <section class="home__main__recommended">
        <header class="home__main__recommended__header">
          <h2 class="home__main__recommended__header__title">
            {{ isSearchActive ? 'Search results' : HOME_CONTENT.main.recommended.title }}
          </h2>
        </header>

        <main class="home__main__recommended__main">
          <p
            v-if="isLoading"

            class="home__main__recommended__state"
          >
            Loading movies...
          </p>

          <p
            v-else-if="errorMessage && !hasMovies"

            class="home__main__recommended__state"
          >
            {{ errorMessage }}
          </p>

          <p
            v-else-if="!hasMovies"

            class="home__main__recommended__state"
          >
            No movies found.
          </p>

          <template v-else>
            <CommonCard
              v-for="movie in movies"
              :key="movie.tmdbId"
              :title="movie.title"
              :meta="[movie.year, movie.genre].filter(Boolean).join(' • ')"
              :poster-src="movie.posterUrl"
              @click="openMovieDetails(movie)"
            />
          </template>
        </main>

        <footer class="home__main__recommended__footer">
          <p class="home__main__recommended__footer__meta">
            {{ errorMessage && hasMovies ? errorMessage : moviesMeta }}
          </p>

          <BaseButton
            type="button"
            size="sm"
            variant="secondary"
            :disabled="!canLoadMore"
            class="home__main__recommended__footer__button"
            @click="loadMoreMovies()"
          >
            {{ isLoadingMore ? 'Loading...' : 'Load more' }}
          </BaseButton>
        </footer>
      </section>
    </main>
  </section>
</template>
