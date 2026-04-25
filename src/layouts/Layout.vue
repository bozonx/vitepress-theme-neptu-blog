<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

import NotFound from '../components/layout/NotFound.vue'
import { useScrollY } from '../composables/useScrollY.js'
import BlogHome from './BlogHome.vue'
import DefaultLayout from './DefaultLayout.vue'

const { page, frontmatter } = useData()
const { scrollY } = useScrollY()

// `layout: false` -> raw <Content />
// `layout: home`  -> BlogHome (parallax full-takeover)
// otherwise (`post`, `page`, `util`, `tag`, `archive`, `author`, undefined) -> DefaultLayout chrome,
// inner content is dispatched by PageContent.vue based on the same `frontmatter.layout`.
const layoutKind = computed(() => {
  if (page.value.isNotFound) return 'not-found'
  const l = frontmatter.value?.layout
  if (l === false) return 'raw'
  if (l === 'home') return 'home'
  return 'default'
})
</script>

<template>
  <div id="modals"></div>

  <NotFound v-if="layoutKind === 'not-found'" />

  <Content v-else-if="layoutKind === 'raw'" />

  <BlogHome v-else-if="layoutKind === 'home'" :scrollY="scrollY" />

  <DefaultLayout v-else>
    <template #sidebar-top v-if="$slots['sidebar-top']">
      <slot name="sidebar-top" />
    </template>
    <template #sidebar-middle v-if="$slots['sidebar-middle']">
      <slot name="sidebar-middle" />
    </template>
    <template #sidebar-bottom v-if="$slots['sidebar-bottom']">
      <slot name="sidebar-bottom" />
    </template>
    <template #sub-sidebar v-if="$slots['sub-sidebar']">
      <slot name="sub-sidebar" />
    </template>
    <template #nav-bar-content-before v-if="$slots['nav-bar-content-before']">
      <slot name="nav-bar-content-before" />
    </template>
    <template #footer-before v-if="$slots['footer-before']">
      <slot name="footer-before" />
    </template>
    <template #aside v-if="$slots['aside']">
      <slot name="aside" />
    </template>
  </DefaultLayout>
</template>
