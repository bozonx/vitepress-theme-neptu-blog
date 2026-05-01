<template>
  <div class="side-bar-tags pr-1 pl-3">
    <TagsList
      :tags="tags"
      :size-sm="true"
      class="mb-2 side-bar-tags-list gap-x-1 gap-y-3 [&_.tag-item]:py-[3px] [&_.tag-item]:px-[9px]"
      active-compare-method="softPagination"
      @item-click="emit('itemClick')"
    />
    <div class="mt-2">
      <NeptuBtnLink
        v-if="showAllTags"
        :href="allTagsUrl"
        :icon="theme.tagsIcon"
        >{{ theme.t.allTagsCall }}</NeptuBtnLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeTagsList } from '../../list-helpers/listHelpers.ts'
import NeptuBtnLink from '../NeptuBtnLink.vue'
import TagsList from '../TagsList.vue'
import { useData } from 'vitepress'
import { useUiTheme } from '../../composables/useUiTheme.ts'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{ localePosts?: PostLite[] }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allTags = makeTagsList(props.localePosts)
const tags = allTags
  .map(({ count: _count, ...tag }) => tag)
  .slice(0, theme.value.sidebarTagsCount || 0)
const allTagsUrl = `/${localeIndex.value}/${theme.value.tagsBaseUrl}`
const showAllTags = allTags.length > (theme.value.sidebarTagsCount || 0)
const emit = defineEmits(['itemClick'])
</script>
