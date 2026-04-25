<template>
  <BtnLink
    v-if="allowEditLink"
    :href="editLinkHref"
    rel="nofollow"
    icon="bx:edit"
  >
    {{ theme.editLink?.text }}
  </BtnLink>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { isPost, isPage } from '../helpers/helpers.js'
import BtnLink from './BtnLink.vue'

const { page, frontmatter, theme } = useData()

const allowEditLink = computed(() => {
  return (
    theme.value?.editLink &&
    frontmatter.value?.editLink !== false &&
    (isPost(frontmatter.value) || isPage(frontmatter.value))
  )
})

const editLinkHref = computed(() => {
  return theme.value?.editLink?.pattern.replace(
    ':path',
    page.value.relativePath
  )
})
</script>
