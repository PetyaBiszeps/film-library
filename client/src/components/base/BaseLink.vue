<script setup lang="ts">
import { computed } from 'vue'
import type {
  IBaseLink
} from '@/types'

const {
  name = '',
  href,
  exact,
  size = 'sm',
  variant = 'primary'
} = defineProps<IBaseLink>()

// Constants
const isExternal = computed(() => {
  return href.startsWith('http')
})

const attributes = computed(() => {
  if (!isExternal.value) {
    return {
      is: 'RouterLink',
      name: name,
      to: href,
      class: ['baseLink', size, variant],
      activeClass: 'active',
      exactActiveClass: exact ? 'active' : ''
    }
  }

  return {
    is: 'a',
    name: name,
    href: href,
    class: ['baseLink', size, variant],
    target: '_blank',
    rel: 'noopener noreferrer'
  }
})
</script>

<template>
  <component
    :is="attributes.is"
    v-bind="attributes"
  >
    <slot name="left" />
    <slot>
      {{ attributes.name }}
    </slot>
    <slot name="right" />
  </component>
</template>
