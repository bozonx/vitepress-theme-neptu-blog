<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import Author from '../Author.vue'
import ListPageHeader from '../ListPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts, isPopularRoute } from '../../utils/shared/index.ts'
import UtilPageHeader from './UtilPageHeader.vue'

const props = defineProps<{
  localePosts?: any[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  authorId: string
  showPopularPostsSwitch?: boolean
}>()
const { localeIndex, theme, frontmatter } = useData()
const route = useRoute()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || [] || []
const curPage = Number(props.curPage)
// Фильтруем посты по автору
const filtered = localePosts.filter((post: any) => post.authorId === props.authorId)
const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path, theme)
)
const author = theme.value.authors.find((item: any) => item.id === props.authorId)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <Author :author="author" class="mb-15" />

  <ListPageHeader
    :base-url="`/${localeIndex}/${theme.authorsBaseUrl}/${props.authorId}`"
    :show-popular-posts-switch="showPopularPostsSwitch"
  >
    {{ theme.t.allPostsOfAuthor }} ({{ sorted.length }})
  </ListPageHeader>

  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />
</template>
