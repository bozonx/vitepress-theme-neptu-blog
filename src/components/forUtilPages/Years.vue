<script setup lang="ts">
import { useData } from 'vitepress'
import { inject } from 'vue'
import { makeYearsList } from '../../list-helpers/listHelpers.ts'
import ListItemWithBadge from '../ListItemWithBadge.vue'
import UtilPageHeader from './UtilPageHeader.vue'

const props = defineProps<{
  localePosts?: any[]
}>()
const { theme, frontmatter, localeIndex } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || [] || []
const yearsList = makeYearsList(localePosts)
</script>

<template>
  <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>
  <ul v-if="yearsList.length">
    <template v-for="item in yearsList">
      <li v-if="item.count">
        <ListItemWithBadge
          :href="`${theme.archiveBaseUrl}/${item.year}/1`"
          :text="String(item.year)"
          :count="item.count"
        />
      </li>
    </template>
  </ul>
</template>
