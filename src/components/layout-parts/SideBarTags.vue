<template>
  <div class="side-bar-tags">
    <TagsList
      :tags="tags"
      :size-sm="true"
      class="mb-2 side-bar-tags-list"
      active-compare-method="softPagination"
      @item-click="emit('itemClick')"
    />
    <div class="mt-2">
      <BtnLink
        v-if="showAllTags"
        :href="allTagsUrl"
        :icon="theme.tagsIcon"
        class="text-sm"
        >{{ theme.t.allTagsCall }}</BtnLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import BtnLink from '../BtnLink.vue'
import TagsList from '../TagsList.vue'
import { useData } from 'vitepress'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{ localePosts?: PostLite[] }>()
const { theme, localeIndex } = useData()
const allTags = makeTagsList(props.localePosts)
const tags = allTags
  .map(({ count, ...tag }) => tag)
  .slice(0, theme.value.sidebarTagsCount)
const allTagsUrl = `/${localeIndex.value}/${theme.value.tagsBaseUrl}`
const showAllTags = allTags.length > theme.value.sidebarTagsCount
const emit = defineEmits(['itemClick'])
</script>

<style scoped>
.side-bar-tags {
  padding: 0 0.25rem 0 0.75rem;
}

.side-bar-tags-list {
  column-gap: 4px;
  row-gap: 12px;
}
</style>

<style>
.side-bar-tags .tag-item {
  padding: 3px 9px;
}
</style>
