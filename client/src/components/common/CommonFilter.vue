<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

  // Constants
const isOpen = ref<boolean>(false)
const filterRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

  // Methods
function closeMenu(): void {
  isOpen.value = false
}

function toggleMenu(): void {
  isOpen.value = !isOpen.value
}

function onDocumentPointerDown(e: PointerEvent): void {
  const target = e.target

  if (!(target instanceof Node)) {
    return
  }

  if (filterRef.value?.contains(target) || menuRef.value?.contains(target)) {
    return
  }

  closeMenu()
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    closeMenu()
  }
}

  // Vue properties
onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    ref="filterRef"
    class="commonFilter"
  >
    <BaseButton
      class="commonFilter__trigger"
      size="sm"
      variant="tertiary"
      aria-haspopup="menu"
      aria-controls="common-filter-menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      Filters
    </BaseButton>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="commonFilter__overlay"
        >
          <section
            ref="menuRef"
            id="common-filter-menu"
            class="commonFilter__menu"
            aria-label="Filter menu"
            role="dialog"
          >
            <div
              class="commonFilter__menu__handle"
              aria-hidden="true"
            />

            <header class="commonFilter__menu__header">
              <h2 class="commonFilter__menu__header__title">
                Filters / Sort
              </h2>

              <button
                class="commonFilter__menu__header__clear"
                type="button"
              >
                Clear
              </button>
            </header>

            <section class="commonFilter__menu__section">
              <h3 class="commonFilter__menu__section__label">
                Genre
              </h3>

              <div class="commonFilter__menu__options">
                <button
                  class="commonFilter__menu__options__item active"
                  type="button"
                >
                  Sci-Fi
                </button>

                <button
                  class="commonFilter__menu__options__item"
                  type="button"
                >
                  Drama
                </button>

                <button
                  class="commonFilter__menu__options__item"
                  type="button"
                >
                  Thriller
                </button>

                <button
                  class="commonFilter__menu__options__item"
                  type="button"
                >
                  Mystery
                </button>
              </div>
            </section>

            <section class="commonFilter__menu__section">
              <h3 class="commonFilter__menu__section__label">
                Year range
              </h3>

              <div
                class="commonFilter__menu__range"
                aria-hidden="true"
              >
                <span class="commonFilter__menu__range__track" />
                <span class="commonFilter__menu__range__active" />
                <span class="commonFilter__menu__range__thumb start" />
                <span class="commonFilter__menu__range__thumb end" />
              </div>

              <p class="commonFilter__menu__rangeText">
                2020 - 2024
              </p>
            </section>

            <section class="commonFilter__menu__section">
              <h3 class="commonFilter__menu__section__label">
                Sort by
              </h3>

              <div class="commonFilter__menu__options sort">
                <button
                  class="commonFilter__menu__options__item active"
                  type="button"
                >
                  Popularity
                </button>

                <button
                  class="commonFilter__menu__options__item"
                  type="button"
                >
                  Rating
                </button>

                <button
                  class="commonFilter__menu__options__item"
                  type="button"
                >
                  Year
                </button>
              </div>
            </section>

            <BaseButton
              class="commonFilter__menu__apply"
              size="md"
              variant="primary"
              @click="closeMenu"
            >
              Apply filters
            </BaseButton>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
