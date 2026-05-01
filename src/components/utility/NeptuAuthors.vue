<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeAuthorsList } from '../../list-helpers/listHelpers.ts'
import AuthorItem from '../AuthorItem.vue'
import UtilPageHeader from './UtilPageHeader.vue'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{ localePosts?: PostLite[] }>()
const { frontmatter, theme, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const authorsList = makeAuthorsList(localePosts, theme.value.authors)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <ul v-if="authorsList.length">
    <template v-for="item in authorsList" :key="item.id">
      <li v-if="item.count">
        <AuthorItem :item="item" />
      </li>
    </template>
  </ul>
</template>
