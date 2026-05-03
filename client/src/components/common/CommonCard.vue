<script setup lang="ts">
import { computed } from 'vue'
import type {
  ICommonCard
} from '@/types'

const {
  title,
  meta,
  year,
  genre,
  duration,
  posterSrc,
  posterAlt,
  disabled = false
} = defineProps<ICommonCard>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent | KeyboardEvent): void
}>()

  // Constants
const card = computed(() => {
  return {
    title: title,
    meta: meta ?? [year, genre, duration].filter(Boolean).join(' • '),
    year: year,
    genre: genre,
    duration: duration,
    posterSrc: posterSrc,
    posterAlt: posterAlt ?? `${title} poster`,
    disabled: disabled ?? false
  }
})

  // Methods
function handleSelect(e: MouseEvent | KeyboardEvent): void {
  if (disabled) {
    return
  }
  return emit('click', e)
}
</script>

<template>
  <article
    :class="['commonCard', {
      disabled: card.disabled
    }]"
    :aria-disabled="card.disabled"

    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <div class="commonCard__poster">
      <img
        v-if="card.posterSrc"

        :src="card.posterSrc"
        :alt="card.posterAlt"

        loading="lazy"
        class="commonCard__poster__image"
      >
    </div>

    <h3 class="commonCard__title">
      {{ title }}
    </h3>

    <p class="commonCard__meta">
      {{ card.meta }}
    </p>
  </article>
</template>
