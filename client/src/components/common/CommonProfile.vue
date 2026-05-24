<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

  // Constants
const isOpen = ref<boolean>(false)
const profileRef = ref<HTMLElement | null>(null)
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

  if (profileRef.value?.contains(target) || menuRef.value?.contains(target)) {
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
    ref="profileRef"
    class="commonProfile"
  >
    <BaseButton
      class="commonProfile__trigger"
      size="sm"
      variant="tertiary"
      aria-haspopup="menu"
      aria-controls="common-profile-menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      YP00
    </BaseButton>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="commonProfile__overlay"
        >
          <section
            ref="menuRef"
            id="common-profile-menu"
            class="commonProfile__menu"
            aria-label="Profile menu"
            role="dialog"
          >
            <div
              class="commonProfile__menu__handle"
              aria-hidden="true"
            />

            <header class="commonProfile__menu__summary">
              <div
                class="commonProfile__menu__summary__avatar"
                aria-hidden="true"
              >
                YP
              </div>

              <div class="commonProfile__menu__summary__identity">
                <h2 class="commonProfile__menu__summary__identity__name">
                  YP00
                </h2>

                <p class="commonProfile__menu__summary__identity__caption">
                  Film collector
                </p>
              </div>

              <BaseButton
                class="commonProfile__menu__summary__edit"
                size="xs"
                variant="tertiary"
                role="menuitem"
                @click="closeMenu"
              >
                Edit
              </BaseButton>
            </header>

            <dl class="commonProfile__menu__stats">
              <div class="commonProfile__menu__stats__item">
                <dt class="commonProfile__menu__stats__item__label">
                  Total
                </dt>

                <dd class="commonProfile__menu__stats__item__value">
                  1,247
                </dd>
              </div>

              <div class="commonProfile__menu__stats__item">
                <dt class="commonProfile__menu__stats__item__label">
                  Bookmarks
                </dt>

                <dd class="commonProfile__menu__stats__item__value">
                  86
                </dd>
              </div>

              <div class="commonProfile__menu__stats__item active">
                <dt class="commonProfile__menu__stats__item__label">
                  Watched
                </dt>

                <dd class="commonProfile__menu__stats__item__value">
                  312
                </dd>
              </div>
            </dl>

            <p class="commonProfile__menu__label">
              Account
            </p>

            <div class="commonProfile__menu__actions">
              <button
                class="commonProfile__menu__actions__item wide active"
                type="button"
                role="menuitem"
              >
                <span class="commonProfile__menu__actions__item__dot" />
                <span>Open bookmarks</span>
                <span class="commonProfile__menu__actions__item__meta">86</span>
              </button>

              <button
                class="commonProfile__menu__actions__item wide"
                type="button"
                role="menuitem"
              >
                <span class="commonProfile__menu__actions__item__dot" />
                <span>Theme</span>
                <span class="commonProfile__menu__actions__item__meta">Light</span>
              </button>

              <button
                class="commonProfile__menu__actions__item"
                type="button"
                role="menuitem"
              >
                <span class="commonProfile__menu__actions__item__dot" />
                <span>Settings</span>
              </button>

              <button
                class="commonProfile__menu__actions__item"
                type="button"
                role="menuitem"
              >
                <span class="commonProfile__menu__actions__item__dot" />
                <span>Sign out</span>
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
