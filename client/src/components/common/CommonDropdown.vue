<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import type {
  ICommonDropdown,
  ICommonDropdownItem
} from '@/types'

const {
  label,
  title = '',
  items,
  align = 'left',
  disabled = false
} = defineProps<ICommonDropdown>()

const emit = defineEmits<{
  (e: 'select', item: ICommonDropdownItem): void
}>()

// Constants
const isOpen = ref<boolean>(false)
const rootRef = ref<HTMLElement | null>(null)

// Methods
function closeMenu(): void {
  isOpen.value = false
}

function toggleMenu(): void {
  if (disabled) {
    return
  }

  isOpen.value = !isOpen.value
}

function selectItem(item: ICommonDropdownItem): void {
  if (item.disabled) {
    return
  }

  emit('select', item)
  closeMenu()
}

function onDocumentPointerDown(e: PointerEvent): void {
  const target = e.target

  if (!(target instanceof Node)) {
    return
  }

  if (rootRef.value?.contains(target)) {
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
    ref="rootRef"
    :class="['commonDropdown', `align-${align}`]"
  >
    <BaseButton
      class="commonDropdown__trigger"
      size="sm"
      variant="primary"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="toggleMenu"
    >
      {{ label }}
    </BaseButton>

    <div
      v-if="isOpen"
      class="commonDropdown__menu"
      role="menu"
      :aria-label="title || label"
    >
      <p
        v-if="title"
        class="commonDropdown__title"
      >
        {{ title }}
      </p>

      <button
        v-for="item in items"
        :key="item.key"
        :class="['commonDropdown__item', {
          active: item.active,
          disabled: item.disabled
        }]"
        type="button"
        role="menuitem"
        :disabled="item.disabled"
        @click="selectItem(item)"
      >
        <span class="commonDropdown__item__square" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
