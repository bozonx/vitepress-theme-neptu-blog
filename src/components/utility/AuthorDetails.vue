<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import Author from '../Author.vue'
import ListPageHeader from '../ListPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts, isPopularRoute, pluralize } from '../../utils/shared/index.ts'
import UtilPageHeader from './UtilPageHeader.vue'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

interface Author {
  id: string
  name?: string
}

const props = defineProps<{
  localePosts?: PostLite[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  authorId: string
  showPopularPostsSwitch?: boolean
}>()
const { localeIndex, theme, frontmatter } = useData()
const route = useRoute()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
// Filter posts by author
const filtered = localePosts.filter((post) => post.authorId === props.authorId)
const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path, theme)
)
const author = theme.value.authors.find((item: Author) => item.id === props.authorId)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <Author :author="author" class="mb-15" />

  <ListPageHeader
    :base-url="`/${localeIndex}/${theme.authorsBaseUrl}/${props.authorId}`"
    :show-popular-posts-switch="showPopularPostsSwitch"
  >
    {{ sorted.length }} {{ pluralize(sorted.length, theme.t.postsCountForms) }}
  </ListPageHeader>

  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />
</template>
