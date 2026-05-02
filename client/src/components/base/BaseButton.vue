<script setup lang="ts">
import type {
  IBaseButton
} from '@/types'

const {
  type = 'button',
  disabled = false,
  size = 'md',
  variant = 'primary'
} = defineProps<IBaseButton>()

const emit = defineEmits<{
  (e: 'click', event: PointerEvent): void
}>()

  // Methods
function handleClick(e: PointerEvent): void {
  if (disabled) {
    return
  }
  return emit('click', e)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['baseButton', size, variant]"

    @click="handleClick"
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </button>
</template>
