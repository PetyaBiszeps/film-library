<script setup lang="ts">
import { computed } from 'vue'
import type {
  IBaseIcon
} from '@/types'

const {
  src,
  size = {
    x: '16px',
    y: '20px'
  }
} = defineProps<IBaseIcon>()

// Init
const icons = import.meta.glob('/src/assets/svgs/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>

// Constants
const attributes = computed(() => {
  if (!src) {
    return {
      component: null,
      class: ['baseIcon'],
      style: {}
    }
  }
  let finalComponent

  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) {
    finalComponent = icons[src]
  } else {
    const normalized = src
      .replace(/^@\//, '/src/')

    finalComponent = icons[normalized] || null
  }

  return {
    component: finalComponent,
    class: ['baseIcon'],
    style: {
      '--icon-width': size.x,
      '--icon-height': size.y
    }
  }
})
</script>

<template>
  <span
    :class="attributes.class"
    :style="attributes.style"
  >
    <component :is="attributes.component" />
  </span>
</template>
