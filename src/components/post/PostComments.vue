<script setup lang="ts">
import { useData } from 'vitepress'

import BtnLink from '../BtnLink.vue'
import { useUiTheme } from '../../composables/useUiLocale.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
</script>

<template>
  <div v-if="frontmatter.commentUrl">
    <BtnLink
      :href="frontmatter.commentUrl"
      :text="theme.t.commentCall"
      target="_blank"
      icon="fa6-solid:comment-dots"
      class="underline"
    />
  </div>
</template>
