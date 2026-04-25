<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeAuthorsList } from '../../list-helpers/listHelpers'
import AuthorItem from '../AuthorItem.vue'
import UtilPageHeader from './UtilPageHeader.vue'

const props = defineProps(['localePosts'])
const { frontmatter, theme, localeIndex } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const authorsList = makeAuthorsList(localePosts, theme.value.authors)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <ul v-if="authorsList.length">
    <template v-for="item in authorsList">
      <li v-if="item.count">
        <AuthorItem :item="item" />
      </li>
    </template>
  </ul>
</template>
