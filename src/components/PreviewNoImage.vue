<script setup lang="ts">
import PreviewWithImage from './PreviewWithImage.vue'

interface TagItem {
  name: string
  slug?: string
  count?: number
}

const props = defineProps<{
  date?: string
  localeDate?: string
  tags?: TagItem[]
  preview?: string
  authorName?: string
}>()
</script>

<template>
  <PreviewWithImage v-bind="props" />
</template>
