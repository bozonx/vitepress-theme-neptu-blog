<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import PreviewList from '../PreviewList.vue'
import ListPageHeader from '../ListPageHeader.vue'
import { sortPosts, isPopularRoute } from '../../utils/shared/index.ts'
import BtnLink from '../BtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

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
  tagSlug: string
  tagName: string
  showPopularPostsSwitch?: boolean
}>()
const { localeIndex, frontmatter } = useData()
const { theme } = useUiTheme()
const route = useRoute()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
// Filter posts by tag
const filtered = localePosts.filter((item) =>
  item.tags?.map((tag) => tag.name).includes(props.tagName)
)
const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path, theme)
)
</script>

<template>
  <ListPageHeader
    :base-url="`/${localeIndex}/${theme.tagsBaseUrl}/${props.tagSlug}`"
    :show-popular-posts-switch="showPopularPostsSwitch"
  >
    {{ frontmatter.title }}
  </ListPageHeader>

  <PreviewList
    :locale-posts="sorted"
    :cur-page="curPage"
    :per-page="props.perPage"
    :pagination-max-items="props.paginationMaxItems"
  />

  <div class="mt-8">
    <BtnLink :href="theme.tagsBaseUrl" :icon="theme.tagsIcon">{{
      theme.t.allTagsCall
    }}</BtnLink>
  </div>
</template>
