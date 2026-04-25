<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import PreviewList from '../PreviewList.vue'
import { sortSimilarPosts } from '../../helpers/helpers'

const props = defineProps(['localePosts'])
const { frontmatter, theme } = useData()
const route = useRoute()

// Получаем похожие посты используя хэлпер
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
