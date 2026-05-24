<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type {
  ICommonChip
} from '@/types'

const {
  label,
  href = '',
  active = false,
  disabled = false,
  marker = 'square'
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
    :size="'sm'"
    :variant="'tertiary'"
    :href="href"
    :disabled="disabled"

    :class="['commonChip', {
      active: active
    }]"
    @click="handleClick"
  >
    <template #left>
      <span :class="`commonChip__${marker}`" />
    </template>

    {{ label }}
  </BaseButton>
</template>
