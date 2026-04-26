<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../utils/shared/index.ts'

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
const { frontmatter, theme, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
const sorted = sortPosts(localePosts, theme.value.popularPosts?.sortBy, true)
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
