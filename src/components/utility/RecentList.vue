<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import type { PostLite } from '../../types.d.ts'

const { frontmatter, localeIndex } = useData()

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
