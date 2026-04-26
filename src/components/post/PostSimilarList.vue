<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import PreviewList from '../PreviewList.vue'
import { sortSimilarPosts } from '../../utils/shared/index.ts'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{ localePosts?: PostLite[] }>()
const { frontmatter, theme } = useData()
const route = useRoute()

// Get similar posts using the helper
const items = frontmatter.value.tags
  ? sortSimilarPosts(
      props.localePosts || [],
      frontmatter.value.tags,
      route.path,
      theme.value.popularPosts?.enabled && theme.value.popularPosts?.sortBy,
      theme.value.similarPostsCount
    )
  : []
</script>

<template>
  <div v-if="items.length">
    <h2 class="text-xl font-bold mb-4">{{ theme.t.similarPosts }}</h2>

    <PreviewList
      :locale-posts="items"
      :cur-page="1"
      :per-page="theme.similarPostsCount"
      :pagination-max-items="theme.paginationMaxItems"
    />
  </div>
</template>
