<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { makeHumanDate } from '../helpers/helpers.ts'
import PreviewWithImg from './PreviewWithImg.vue'
import PreviewNoImg from './PreviewNoImg.vue'

const { lang, theme } = useData()
const props = defineProps(['item'])
const params = computed(() => ({
  tags: props.item.tags,
  date: props.item.date,
  localeDate: makeHumanDate(props.item.date, lang.value),
  preview: String(props.item?.preview).trim().replace(/\.$/, '') + ' ...',
  authorName:
    theme.value.showAuthorInPostList &&
    theme.value.authors?.find((item: any) => item.id === props.item.authorId)?.name,
}))
</script>

<template>
  <a :href="props.item.url" class="card-item preview">
    <h2 class="card-item-header">{{ props.item.title }}</h2>

    <PreviewWithImg
      v-if="item.thumbnail"
      v-bind="params"
      :thumbnail="props.item.thumbnail"
      :cover-height="props.item.coverHeight"
      :cover-width="props.item.coverWidth"
    />
    <PreviewNoImg v-else v-bind="params" />
  </a>
</template>
