<template>
  <div v-if="theme.popularPosts?.enabled" class="home-popular-posts">
    <UtilSubPageHeader class="home-popular-posts-header mb-3">
      {{ theme.t.popularPosts }}
    </UtilSubPageHeader>

    <PreviewList :locale-posts="posts" :cur-page="1" />

    <div v-if="showMorePosts" class="mt-8 flex">
      <span class="mr-2">... </span>
      <BtnLink
        :href="`${theme.popularBaseUrl}/2`"
        :text="theme.t.showMorePosts"
        class="more-posts-btn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import UtilSubPageHeader from './UtilSubPageHeader.vue'
import BtnLink from '../BtnLink.vue'
import PreviewList from '../PreviewList.vue'
import { sortPosts } from '../../utils/shared/index.ts'

const props = defineProps(['localePosts'])
const { localeIndex, theme } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const sorted = sortPosts(localePosts, theme.value.popularPosts?.sortBy, true)
const posts = sorted.slice(0, theme.value.perPage)
const showMorePosts = localePosts.length > theme.value.perPage
</script>

<style>
/* Эффект матового стекла для популярных постов */
.home-popular-posts {
  position: relative;
}

.dark .home-popular-posts .card-item,
.home-popular-posts .card-item {
  background: rgba(0, 0, 0, 0.27);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  animation: glassmorphism-fade-in 0.6s ease-out;
}

/* Эффекты при наведении */
.dark .home-popular-posts .card-item:hover,
.home-popular-posts .card-item:hover {
  background: rgba(0, 0, 0, 0.4);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.home-popular-posts-header {
  text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.8);
}

.home-popular-posts .more-posts-btn {
  color: var(--gray-300);
  text-decoration: underline;
}

@keyframes glassmorphism-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(8px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(15px);
  }
}
</style>
