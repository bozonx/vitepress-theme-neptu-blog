<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { inject } from 'vue'
import { makeMonthsList } from '../../list-helpers/listHelpers'
import { sortPosts, isPopularRoute } from '../../helpers/helpers'
import ListItemWithBadge from '../ListItemWithBadge.vue'
import PreviewList from '../PreviewList.vue'
import UtilPageHeader from './UtilPageHeader.vue'
import ListPageHeader from '../ListPageHeader.vue'

const props = defineProps<{
  localePosts?: any[]
  year: string | number
  curPage?: string | number
  perPage?: number
  paginationMaxItems?: number
  showPopularPostsSwitch?: boolean
}>()
const { theme, frontmatter, localeIndex } = useData()
const route = useRoute()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || [] || []
const monthsList = makeMonthsList(localePosts, props.year)

const curPage = Number(props.curPage || 1)
// Фильтруем посты по году
const filtered = localePosts.filter((item: any) => {
  const postYear = new Date(item.date).getUTCFullYear()
  return postYear === Number(props.year)
})

const sorted = sortPosts(
  filtered,
  theme.value.popularPosts?.sortBy,
  isPopularRoute(route.path, theme)
)
</script>

<template>
  <div>
    <UtilPageHeader>{{ frontmatter.title }}</UtilPageHeader>

    <ul v-if="monthsList.length" class="flex flex-wrap gap-x-8">
      <template v-for="item in monthsList">
        <li v-if="item.count">
          <ListItemWithBadge
            :href="`${theme.archiveBaseUrl}/${props.year}/month/${item.month}`"
            :text="theme.t.months[item.month - 1]"
            :count="item.count"
          />
        </li>
      </template>
    </ul>

    <ListPageHeader
      :show-popular-posts-switch="showPopularPostsSwitch"
      :base-url="`/${localeIndex}/${theme.archiveBaseUrl}/${props.year}`"
      class="mt-10"
    >
      {{ theme.t.allPostsOfYear }}
    </ListPageHeader>

    <PreviewList
      :locale-posts="sorted"
      :cur-page="curPage"
      :per-page="props.perPage"
      :pagination-max-items="props.paginationMaxItems"
    />
  </div>
</template>
