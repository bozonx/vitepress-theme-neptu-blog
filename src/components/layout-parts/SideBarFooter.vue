<script setup lang="ts">
import { useData } from 'vitepress'

import NeptuBtn from '../NeptuBtn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

interface SocialLinkItem {
  href: string
  icon?: string
  title?: string
  target?: string
  class?: string
}

const props = defineProps<{
  class?: string
}>()
const { localeIndex, site } = useData()
const { theme } = useUiTheme()
const configuredFormats = Array.isArray((site.value as Record<string, any>).rssFormats)
  ? ((site.value as Record<string, any>).rssFormats as string[])
      .filter((format) => typeof format === 'string')
      .map((format) => format.trim().toLowerCase())
  : ['rss', 'atom', 'json']
const hasFormat = (format: string) => configuredFormats.includes(format)
const socialLinks: SocialLinkItem[] = [
  ...(theme.value.sideBar?.socialLinks || []).map((item) => ({
    href: item.url || item.link,
    icon: item.icon,
    class: item.class,
  })),
].filter((item) => Boolean(item.href)) as SocialLinkItem[]

if (theme.value.sideBar?.rssFeed && hasFormat('rss')) {
  socialLinks.push({
    href: `/${localeIndex.value}/feed.rss`,
    icon: theme.value.rssIcon,
    title: theme.value.t.links.rssFeed,
    target: '_blank',
  })
}

if (theme.value.sideBar?.atomFeed && hasFormat('atom')) {
  socialLinks.push({
    href: `/${localeIndex.value}/feed.atom`,
    icon: theme.value.atomIcon,
    title: theme.value.t.links.atomFeed,
    target: '_blank',
  })
}
</script>

<template>
  <div :class="['w-full flex pt-6 pb-3 pr-2 pl-2', props.class]">
    <ul v-if="socialLinks.length" class="flex space-x-1">
      <li v-for="(item, index) in socialLinks" :key="item.href || index">
        <NeptuBtn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>

    <div class="flex-1 flex justify-end">
      <div class="lg:hidden">
        <SwitchAppearance @click.stop />
      </div>
    </div>
  </div>
</template>
