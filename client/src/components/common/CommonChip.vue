<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type {
  ICommonChip
} from '@/types'

const {
  label,
  tone = 'gray',
  active = false,
  disabled = false
} = defineProps<ICommonChip>()

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
  <BaseButton
    size="sm"
    variant="tertiary"

    :class="['commonChip', `tone-${tone}`, {
      active: active
    }]"
    @click="handleClick"
  >
    <template #left>
      <span class="commonChip__square" />
    </template>

    {{ label }}
  </BaseButton>
</template>
