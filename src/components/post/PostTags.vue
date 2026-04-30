<script setup lang="ts">
import { useData } from 'vitepress'
import TagsList from '../TagsList.vue'
import BtnLink from '../BtnLink.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { frontmatter } = useData()
const { theme } = useUiTheme()
const tags = [...(frontmatter.value.tags || [])].sort((a, b) =>
  String(a.name).localeCompare(b.name)
)
</script>

<template>
  <div v-if="frontmatter.tags?.length">
    <div class="md:flex">
      <p class="md:mt-1 md:mr-2 max-md:mb-3 muted">{{ theme.t.tags }}:</p>

      <TagsList :tags="tags" />
    </div>

    <div class="mt-3">
      <BtnLink :href="theme.tagsBaseUrl" :icon="theme.tagsIcon">{{
        theme.t.allTagsCall
      }}</BtnLink>
    </div>
  </div>
</template>
