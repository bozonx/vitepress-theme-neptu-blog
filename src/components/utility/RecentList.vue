<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'

const { frontmatter, localeIndex } = useData()
interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
}>()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage || 1)
const sorted = [...(localePosts || [])].sort(
  (a, b) => new Date(b.date as string | number | Date).getTime() - new Date(a.date as string | number | Date).getTime()
)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />
</template>
