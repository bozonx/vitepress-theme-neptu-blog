<script setup lang="ts">
import PreviewListItem from './PreviewListItem.vue'
import Pagination from './Pagination.vue'
import { useData } from 'vitepress'

const { theme } = useData()

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  analyticsStats?: Record<string, number>
  [key: string]: unknown
}

const props = defineProps<{
  localePosts: PostLite[]
  curPage: number
  perPage?: number
  paginationMaxItems?: number
  paginationBaseUrl?: string
}>()
const perPage = props.perPage || theme.value.perPage
const start = props.curPage === 1 ? 0 : (props.curPage - 1) * perPage
const items = props.localePosts.slice(start, start + perPage)
const totalPages = Math.ceil(props.localePosts.length / perPage)
</script>

<template>
  <div v-if="items.length">
    <ul>
      <template v-for="item in items" :key="item.url">
        <li
          v-if="item"
          :data-popularity-value="
            item.analyticsStats?.[theme.popularPosts?.sortBy]
          "
        >
          <PreviewListItem :item="item" />
        </li>
      </template>
    </ul>

    <div v-if="totalPages > 1" class="mt-10">
      <Pagination
        :cur-page="props.curPage"
        :total-pages="totalPages"
        :pagination-max-items="props.paginationMaxItems"
        :pagination-base-url="props.paginationBaseUrl"
      />
    </div>
  </div>
</template>
