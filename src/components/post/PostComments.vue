<script setup lang="ts">
import { useData } from 'vitepress'

import NeptuBtnLink from '../NeptuBtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
</script>

<template>
  <div v-if="frontmatter.commentUrl">
    <NeptuBtnLink
      :href="frontmatter.commentUrl"
      :text="theme.t.commentCall"
      target="_blank"
      icon="fa6-solid:comment-dots"
      class="underline"
    />
  </div>
</template>
