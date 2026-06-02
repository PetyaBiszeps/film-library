<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import useMovieDetails from '@/composables/useMovieDetails.ts'
import { useRoute } from 'vue-router'
import {
  computed,
  onMounted
} from 'vue'

// Init
const route = useRoute()
const {
  movie, isLoading, errorMessage, fetchMovieDetails
} = useMovieDetails()

// Constants
const movieID = computed(() => String(route.params.id ?? ''))
const runtimeLabel = computed(() => {
  if (!movie.value?.runtime) {
    return ''
  }

  const hours = Math.floor(movie.value.runtime / 60)
  const minutes = movie.value.runtime % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
})
const ratingLabel = computed(() => {
  if (!movie.value?.rating) {
    return ''
  }

  return `${movie.value.rating.toFixed(1)} / 10`
})
const detailMeta = computed(() => [movie.value?.year, runtimeLabel.value].filter(Boolean).join(' • '))

// Vue properties
onMounted(() => {
  void fetchMovieDetails(movieID.value)
})
</script>

<template>
  <section class="movieDetails">
    <BaseButton
      href="/"
      size="sm"
      variant="secondary"
      class="movieDetails__back"
    >
      Back to Home
    </BaseButton>

    <p
      v-if="isLoading"

      class="movieDetails__state"
    >
      Loading movie details...
    </p>

    <p
      v-else-if="errorMessage"

      class="movieDetails__state"
    >
      {{ errorMessage }}
    </p>

    <article
      v-else-if="movie"

      class="movieDetails__content"
    >
      <section
        v-if="movie.backdropUrl"

        class="movieDetails__hero"
      >
        <img
          :src="movie.backdropUrl"
          :alt="`${movie.title} backdrop`"
          class="movieDetails__hero__image"
        >
      </section>

      <section class="movieDetails__body">
        <aside
          v-if="movie.posterUrl"

          class="movieDetails__poster"
        >
          <img
            :src="movie.posterUrl"
            :alt="`${movie.title} poster`"
            class="movieDetails__poster__image"
          >
        </aside>

        <main class="movieDetails__main">
          <p
            v-if="detailMeta"

            class="movieDetails__main__eyebrow"
          >
            {{ detailMeta }}
          </p>

          <h1 class="movieDetails__main__title">
            {{ movie.title }}
          </h1>

          <div class="movieDetails__main__stats">
            <span v-if="ratingLabel">Rating {{ ratingLabel }}</span>
            <span v-if="movie.releaseDate">Released {{ movie.releaseDate }}</span>
          </div>

          <ul
            v-if="movie.genres?.length"

            class="movieDetails__main__genres"
          >
            <li
              v-for="genre in movie.genres"
              :key="genre"
              class="movieDetails__main__genres__item"
            >
              {{ genre }}
            </li>
          </ul>

          <p
            v-if="movie.overview"

            class="movieDetails__main__overview"
          >
            {{ movie.overview }}
          </p>
        </main>
      </section>
    </article>
  </section>
</template>
