<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import UtilPageHeader from './UtilPageHeader.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../helpers/helpers.js'

const props = defineProps([
  'localePosts',
  'curPage',
  'perPage',
  'paginationMaxItems',
])
const { frontmatter, theme, localeIndex } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const curPage = Number(props.curPage)
const sorted = sortPosts(localePosts, theme.value.popularPosts?.sortBy, true)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <PreviewList
    :localePosts="sorted"
    :curPage="curPage"
    :perPage="props.perPage"
    :paginationMaxItems="props.paginationMaxItems"
  />
</template>
