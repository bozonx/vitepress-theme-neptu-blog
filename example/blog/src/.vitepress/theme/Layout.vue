<script setup>
import { NavSearchButton } from 'vitepress-theme-neptu-blog/components'
import { PageFindSearch } from 'vitepress-theme-neptu-blog/components'
import Theme from 'vitepress-theme-neptu-blog'
import { provide } from 'vue'
import { data as enData } from '../../en/loadPosts.data.js'

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
