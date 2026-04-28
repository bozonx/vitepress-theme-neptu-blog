<script setup lang="ts">
import { useData } from 'vitepress'

import Btn from '../Btn.vue'

const { frontmatter, theme } = useData()
const text =
  theme.value.t.postVideoButton +
  (frontmatter.value.videoLinkLang
    ? ` (${frontmatter.value.videoLinkLang})`
    : '')
</script>

<template>
  <Btn
    :href="frontmatter.videoLink"
    :text="text"
    :icon="theme.youtubeIcon"
    target="_blank"
    class="video-link w-fit py-3 text-white! bg-[var(--video-link-bg)]! hover:brightness-110"
    :hide-external-icon="true"
  />
</template>
