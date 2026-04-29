<script setup lang="ts">
import { useData } from 'vitepress'

import SimpleLink from '../SimpleLink.vue'
import { useUiTheme } from '../../composables/useUiLocale.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
interface Author {
  id: string
  name?: string
  aboutUrl?: string
}

const themeAuthor = frontmatter.value.authorId
  ? theme.value.authors?.find((item: Author) => item.id === frontmatter.value.authorId)
  : undefined
const authorUrl = themeAuthor?.aboutUrl
  ? themeAuthor.aboutUrl
  : `${theme.value.authorsBaseUrl}/${frontmatter.value.authorId}/1`
</script>

<template>
  <address v-if="themeAuthor?.name" class="flex gap-x-1">
    <span class="muted">{{ theme.t.author }}: </span>
    <SimpleLink rel="author" :href="authorUrl">{{
      themeAuthor.name
    }}</SimpleLink>
  </address>
</template>
