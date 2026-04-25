<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import TagsList from '../TagsList.vue'
import UtilPageHeader from './UtilPageHeader.vue'

const props = defineProps(['localePosts'])
const { frontmatter, localeIndex } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const tagList = makeTagsList(localePosts)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <TagsList :tags="tagList" :size-xl="true" class="flex-col" />
</template>
