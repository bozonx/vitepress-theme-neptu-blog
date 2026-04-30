<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import UtilSubPageHeader from './UtilSubPageHeader.vue'

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
  header?: string
}>()
const { localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const tagList = makeTagsList(localePosts)
</script>

<template>
  <UtilSubPageHeader class="home-hero-tags-header">{{
    props.header
  }}</UtilSubPageHeader>
  <TagsList :tags="tagList" class="mb-12 home-hero-tags [&_.tag-item]:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.3)]" />
</template>

<style scoped>
.home-hero-tags-header {
  text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.8);
}
</style>
