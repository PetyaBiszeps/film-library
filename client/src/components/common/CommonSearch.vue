<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import mocks from '@/content/mocks.ts'
import {
  watch,
  reactive,
  onMounted,
  onUnmounted
} from 'vue'

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

const model = defineModel<string>({
  default: ''
})

// Constants
const state = reactive({
  isSearching: false
})

// Methods
const openSearch = () => {
  state.isSearching = true
}

const closeSearch = () => {
  state.isSearching = false
  model.value = ''
  emit('search', '')
}

const submitSearch = () => {
  state.isSearching = false
  emit('search', model.value)
}

function onKeyEvent(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    return closeSearch()
  }
}

// Vue properties
onMounted(() => {
  window.addEventListener('keydown', onKeyEvent)
})

watch(() => state.isSearching, (isOpen) => {
  if (isOpen) {
    document.getElementById('search-overlay-input')?.focus()
  }
}, { flush: 'post' })

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyEvent)
})
</script>

<template>
  <div class="commonSearch">
    <button
      class="commonSearch__trigger"
      @click="openSearch"
    >
      <span class="commonSearch__trigger__label">
        Search
      </span>

      <input
        v-model="model"

        id="search-input"
        name="search-input"
        type="text"
        placeholder="Title, cast, or keyword"
        readonly
        class="commonSearch__trigger__input"
      >
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <section
          v-if="state.isSearching"
          class="commonSearch__overlay"
        >
          <header class="commonSearch__overlay__header">
            <BaseButton
              size="sm"
              variant="quaternary"
              @click="closeSearch"
            >
              Back
            </BaseButton>

            <BaseInput
              v-model="model"

              id="search-overlay-input"
              name="search-overlay-input"
              type="search"
              placeholder="Search..."
              size="sm"
              @keydown.enter="submitSearch"
            />

            <BaseButton
              size="sm"
              variant="quaternary"
              @click="closeSearch"
            >
              Cancel
            </BaseButton>
          </header>

          <main class="commonSearch__overlay__content">
            <p class="commonSearch__overlay__content__caption">
              Search TMDB
            </p>

            <div class="commonSearch__overlay__content__results">
              <h2 class="commonSearch__overlay__content__results__title">
                Top results
              </h2>

              <span class="commonSearch__overlay__content__results__count">
                {{ mocks.search.recents.length }} results
              </span>
            </div>

            <ul class="commonSearch__overlay__content__list">
              <li
                v-for="movie in mocks.search.results"
                :key="movie.id"
                class="commonSearch__overlay__content__list__item"
              >
                <div class="commonSearch__overlay__content__list__item__thumb" />

                <div class="commonSearch__overlay__content__list__item__info">
                  <h3 class="commonSearch__overlay__content__list__item__info__title">
                    {{ movie.title }}
                  </h3>

                  <p class="commonSearch__overlay__content__list__item__info__details">
                    {{ movie.year }} • {{ movie.genre }} • {{ movie.duration }}
                  </p>
                </div>

                <div class="commonSearch__overlay__content__list__item__rating">
                  {{ movie.rating }}
                </div>
              </li>
            </ul>

            <div class="commonSearch__overlay__content__recent">
              <p class="commonSearch__overlay__content__recent__caption">
                Recent searches
              </p>

              <div class="commonSearch__overlay__content__recent__tags">
                <span
                  v-for="tag in mocks.search.recents"
                  :key="tag"
                  class="commonSearch__overlay__content__recent__tags__item"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </main>

          <footer class="commonSearch__overlay__footer">
            <BaseButton
              style="width: 100%;"
              @click="submitSearch"
            >
              View all results
            </BaseButton>
          </footer>
        </section>
      </Transition>
    </Teleport>
  </div>
</template>
