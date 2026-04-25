<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import PreviewList from '../PreviewList.vue'
import ListPageHeader from '../ListPageHeader.vue'
import { sortPosts, isPopularRoute } from '../../helpers/helpers'
import BtnLink from '../BtnLink.vue'

const props = defineProps<{
  localePosts?: any[]
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  tagSlug: string
  tagName: string
  showPopularPostsSwitch?: boolean
}>()
const { theme, localeIndex, frontmatter } = useData()
const route = useRoute()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || [] || []
const curPage = Number(props.curPage)
// Фильтруем посты по тегу
const filtered = localePosts.filter((item: any) =>
  item.tags?.map((item: any) => item.name).includes(props.tagName)
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
