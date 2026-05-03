<script setup lang="ts">
import { computed } from 'vue'
import TagItem from './TagItem.vue'

interface TagInfo {
  name?: string
  slug?: string
  count?: number
}

const props = defineProps<{
  tags: TagInfo[]
  sizeXl?: boolean | string
  sizeSm?: boolean | string
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
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
    <li v-for="(item, index) in props.tags" :key="item.slug || item.name || index">
      <TagItem
        v-bind="item"
        :size-xl="props.sizeXl"
        :size-sm="props.sizeSm"
        :active-compare-method="props.activeCompareMethod"
        @click="emit('itemClick')"
      />
    </li>
    <slot name="after" />
  </ul>
</template>
