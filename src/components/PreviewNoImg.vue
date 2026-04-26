<script setup lang="ts">
import PreviewWithImg from './PreviewWithImg.vue'

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
  <PreviewWithImg v-bind="props" />
</template>
