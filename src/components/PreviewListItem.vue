<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { makeHumanDate } from '../utils/shared/index.ts'
import PreviewWithImage from './PreviewWithImage.vue'

const { lang, theme } = useData()
interface PreviewItem {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string; count?: number }>
  preview?: string
  authorId?: string
  thumbnail?: string
  coverHeight?: number | string
  coverWidth?: number | string
}

const props = defineProps<{ item: PreviewItem }>()
const params = computed(() => ({
  tags: props.item.tags,
  date: props.item.date ? String(props.item.date) : undefined,
  localeDate: makeHumanDate(props.item.date, lang.value),
  preview: String(props.item?.preview).trim().replace(/\.$/, '') + ' ...',
  authorName: theme.value.showAuthorInPostList
    ? theme.value.authors?.find((item: { id: string; name: string }) => item.id === props.item.authorId)?.name
    : undefined,
}))
</script>

<template>
  <a :href="props.item.url" class="card-item preview">
    <h2 class="card-item-header">{{ props.item.title }}</h2>

    <PreviewWithImage
      v-bind="params"
      :thumbnail="props.item.thumbnail"
      :cover-height="props.item.coverHeight"
      :cover-width="props.item.coverWidth"
    />
  </a>
</template>
