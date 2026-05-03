<script setup lang="ts">
import { computed } from 'vue'
import PreviewListItem from './PreviewListItem.vue'
import NeptuPagination from './NeptuPagination.vue'
import { useData } from 'vitepress'
import type { PostLite } from '../types.d.ts'

const { theme } = useData()

const props = defineProps<{
  localePosts: PostLite[]
  curPage: number
  perPage?: number
  paginationMaxItems?: number
  paginationBaseUrl?: string
}>()
const perPage = computed(() => props.perPage || theme.value.perPage || 1)
const start = computed(() =>
  props.curPage === 1 ? 0 : (props.curPage - 1) * perPage.value
)
const items = computed(() =>
  props.localePosts.slice(start.value, start.value + perPage.value)
)
const totalPages = computed(() => Math.ceil(props.localePosts.length / perPage.value))
</script>

<template>
  <div v-if="items.length">
    <ul>
      <template v-for="item in items" :key="item.url">
        <li
          v-if="item"
          :data-popularity-value="
            theme.popularPosts?.sortBy && item.analyticsStats?.[theme.popularPosts.sortBy]
          "
        >
          <PreviewListItem :item="item" />
        </li>
      </template>
    </ul>

    <div v-if="totalPages > 1" class="mt-10">
      <NeptuPagination
        :cur-page="props.curPage"
        :total-pages="totalPages"
        :pagination-max-items="props.paginationMaxItems"
        :pagination-base-url="props.paginationBaseUrl"
      />
    </div>
  </div>
</template>
