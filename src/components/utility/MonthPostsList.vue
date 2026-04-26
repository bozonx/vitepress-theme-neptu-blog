<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makePostOfMonthList } from '../../list-helpers/listHelpers.ts'
import PreviewListItem from '../PreviewListItem.vue'
import UtilPageHeader from './UtilPageHeader.vue'

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
  year: string | number
  month: string | number
}>()
const { frontmatter, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const items = makePostOfMonthList(localePosts, props.year, props.month)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <ul v-if="items.length">
    <li v-for="item in items" :key="item.url">
      <PreviewListItem :item="item" />
    </li>
  </ul>
</template>
