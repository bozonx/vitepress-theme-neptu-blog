<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useData } from 'vitepress'
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import PodcastIcon from './PodcastIcon.vue'

import type { ThemeConfig, PostFrontmatter } from '../../types.d.ts'

const { frontmatter, theme } = useData<ThemeConfig>()
const fm = frontmatter.value as PostFrontmatter
const btnText = theme.value.t.listenPodcast
</script>

<template>
  <DropdownButton v-if="frontmatter.podcasts" class="podcasts-btn w-fit">
    <template #btn-text>
      <span class="mr-1" aria-hidden="true">
        <Icon
          icon="material-symbols:headphones-outline"
          width="1.6rem"
          height="1.6rem"
        />
      </span>
      {{ btnText }}
    </template>

    <template v-for="(link, name) in (fm.podcasts || {})" :key="String(name)">
      <MenuItem v-if="link" :href="link" :hide-external-icon="true">
        <span class="flex">
          <span class="mr-2">
            <PodcastIcon :name="String(name)" :alt="String(name) + ' podcast service icon'" />
          </span>
          {{ (theme.t.podcasts || {})[name] }}
        </span>
      </MenuItem>
    </template>
  </DropdownButton>
</template>

<style scoped>
</style>

<style>
.podcasts-btn > .btn-base {
  background: var(--podcast-btn-bg) !important;
  color: white;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.podcasts-btn > .btn-base:hover {
  filter: brightness(110%);
}
</style>
