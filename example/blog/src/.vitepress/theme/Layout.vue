<script setup lang="ts">
import { NavSearchButton } from 'vitepress-theme-neptu-blog/components'
import { PageFindSearch } from 'vitepress-theme-neptu-blog/components'
import Theme from 'vitepress-theme-neptu-blog'
import { provide } from 'vue'
// @ts-ignore
import { data as enData } from '../../en/loadPosts.data'

const posts = { en: enData.posts }

provide("posts", posts);

const { Layout } = Theme;
</script>

<template>
  <Layout>
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
  </Layout>
</template>
