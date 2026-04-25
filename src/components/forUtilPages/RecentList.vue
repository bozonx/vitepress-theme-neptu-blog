<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'

const { frontmatter, localeIndex } = useData()
const props = defineProps<{
  localePosts?: any[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
}>()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || [] || []
const curPage = Number(props.curPage || 1)
const sorted = [...(localePosts || [])].sort(
  (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
