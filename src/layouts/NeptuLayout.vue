<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, provide } from 'vue'

import NotFound from '../components/layout-parts/NotFound.vue'
import { useScrollY } from '../composables/useScrollY.ts'
import ImageLightbox from '../components/doc-components/ImageLightbox.vue'
import BlogHome from './BlogHome.vue'
import DefaultLayout from './DefaultLayout.vue'
import { LightboxLocalesKey } from '../composables/useLightbox.ts'
import { resolveTranslationsByFilePath } from '../utils/shared/index.ts'

const { page, frontmatter } = useData()
const route = useRoute()
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

const lightboxLocales = computed(() => resolveTranslationsByFilePath(route.path).t.lightbox ?? {})
provide(LightboxLocalesKey, lightboxLocales)
</script>

<template>
  <div id="modals"></div>

  <ImageLightbox />

  <NotFound v-if="layoutKind === 'not-found'" />

  <Content v-else-if="layoutKind === 'raw'" />

  <BlogHome v-else-if="layoutKind === 'home'" :scroll-y="scrollY" />

  <DefaultLayout v-else>
    <template v-if="$slots['sidebar-top']" #sidebar-top>
      <slot name="sidebar-top" />
    </template>
    <template v-if="$slots['sidebar-middle']" #sidebar-middle>
      <slot name="sidebar-middle" />
    </template>
    <template v-if="$slots['sidebar-bottom']" #sidebar-bottom>
      <slot name="sidebar-bottom" />
    </template>
    <template v-if="$slots['sub-sidebar']" #sub-sidebar>
      <slot name="sub-sidebar" />
    </template>
    <template v-if="$slots['nav-bar-content-before']" #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>
    <template v-if="$slots['footer-before']" #footer-before>
      <slot name="footer-before" />
    </template>
    <template v-if="$slots['aside']" #aside>
      <slot name="aside" />
    </template>
  </DefaultLayout>
</template>
