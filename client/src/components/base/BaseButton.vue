<script setup lang="ts">
import { computed } from 'vue'
import type {
  IBaseButton
} from '@/types'

const {
  type = 'button',
  disabled = false,
  size = 'md',
  variant = 'primary',
  href = ''
} = defineProps<IBaseButton>()

const emit = defineEmits<{
  (e: 'click', event: PointerEvent): void
}>()

// Constants
const isLink = computed(() => Boolean(href))
const isExternal = computed(() => {
  return href.startsWith('http')
})

const attributes = computed(() => {
  const classes = ['baseButton', size, variant, {
    disabled: disabled
  }]

  if (!isLink.value) {
    return {
      is: 'button',
      type: type,
      disabled: disabled,
      class: classes
    }
  }

  if (isExternal.value) {
    return {
      is: 'a',
      href: href,
      class: classes
    }
  }

  return {
    is: 'RouterLink',
    to: href,
    class: classes
  }
})

// Methods
function handleClick(e: PointerEvent): void {
  if (disabled) {
    return
  }
  return emit('click', e)
}
</script>

<template>
  <component
    :is="attributes.is"
    v-bind="attributes"

    @click="handleClick"
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </component>
</template>
