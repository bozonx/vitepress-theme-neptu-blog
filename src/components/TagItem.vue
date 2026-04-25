<script setup lang="ts">
import { useData } from 'vitepress'
import BaseLink from './BaseLink.vue'
import Badge from './Badge.vue'

const { theme } = useData()
const props = defineProps([
  'name',
  'count',
  'slug',
  'sizeXl',
  'sizeSm',
  'activeCompareMethod',
])
const href = `${theme.value.tagsBaseUrl}/${props.slug}/1`
const className =
  'text-center rounded-full text-lg py-1 px-4 ' +
  'justify-center inline-flex space-x-2 items-center text-white ' +
  (props.sizeXl ? `text-xl ` : '') +
  (props.sizeSm ? `text-sm ` : '') +
  (props.count ? 'pr-2 ' : '') +
  `tag-item`
</script>

<template>
  <BaseLink
    :href="href"
    :class="className"
    :activeCompareMethod="props.activeCompareMethod"
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.tag-item.active {
  background: var(--tag-item-bg-active);
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  filter: brightness(115%);
}

.dark .tag-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  filter: brightness(110%);
}
</style>
