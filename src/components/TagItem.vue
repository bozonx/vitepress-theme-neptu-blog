<script setup lang="ts">
import BaseLink from './BaseLink.vue'
import Badge from './Badge.vue'
import { useUiTheme } from '../composables/useUiLocale.ts'

const { theme } = useUiTheme()

interface Props {
  name?: string
  count?: number
  slug?: string
  sizeXl?: boolean | string
  sizeSm?: boolean | string
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
}

const props = defineProps<Props>()
const href = `${theme.value.tagsBaseUrl}/${props.slug}/1`
const className =
  'text-center rounded-full text-lg py-1 px-4 ' +
  'justify-center inline-flex space-x-2 items-center text-white ' +
  'transition-all duration-200 ease-[ease] hover:-translate-y-0.5 ' +
  (props.sizeXl ? `text-xl ` : '') +
  (props.sizeSm ? `text-sm ` : '') +
  (props.count ? 'pr-2 ' : '') +
  `tag-item`
</script>

<template>
  <BaseLink
    :href="href"
    :class="className"
    :active-compare-method="props.activeCompareMethod"
  >
    <span>{{ props.name }}</span>
    <Badge
      v-if="props.count"
      :count="props.count"
      :title="theme.t.tagBadgeCount"
    />
  </BaseLink>
</template>

<style scoped>
.tag-item {
  background: var(--tag-item-bg);
}

.tag-item.active {
  filter: brightness(90%);
  transform: scale(0.96) translateY(1px);
}

.tag-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  filter: brightness(115%);
}

.dark .tag-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  filter: brightness(110%);
}
</style>
