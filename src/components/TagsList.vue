<script setup lang="ts">
import { computed } from 'vue'
import TagItem from './TagItem.vue'

const props = defineProps<{
  tags: any[]
  sizeXl?: boolean | string
  sizeSm?: boolean | string
  class?: any
  activeCompareMethod?: any
}>()
const emit = defineEmits<{
  (e: 'itemClick'): void
}>()
const sizeClasses: Record<string, string> = {
  xl: 'gap-x-3 gap-y-4',
  md: 'gap-x-2 gap-y-3',
  sm: 'gap-x-2 gap-y-3',
}
const sizeClass = computed(() => {
  const sizeKey = (props.sizeXl && 'xl') || (props.sizeSm && 'sm') || 'md'
  return sizeClasses[sizeKey]
})
</script>

<template>
  <ul
    v-if="props.tags.length"
    :class="['flex flex-wrap', sizeClass, props.class]"
  >
    <li v-for="item in props.tags">
      <TagItem
        v-bind="item"
        :size-xl="props.sizeXl"
        :size-sm="props.sizeSm"
        :active-compare-method="props.activeCompareMethod"
        @click="emit('itemClick')"
      />
    </li>
  </ul>
</template>
