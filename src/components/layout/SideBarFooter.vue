<script setup lang="ts">
import { useData } from 'vitepress'

import Btn from '../Btn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import SwitchLang from './SwitchLang.vue'

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
const { theme, localeIndex } = useData()
const socialLinks = [
  ...(theme.value.sideBar.socialLinks || []),
  theme.value.sideBar.rssFeed && {
    href: `/feed-${localeIndex.value}.rss`,
    icon: theme.value.rssIcon,
    title: theme.value.t.links.rssFeed,
    target: '_blank',
  },
  theme.value.sideBar.atomFeed && {
    href: `/feed-${localeIndex.value}.atom`,
    icon: theme.value.atomIcon,
    title: theme.value.t.links.atomFeed,
    target: '_blank',
  },
]
</script>

<template>
  <div :class="['w-full flex pt-6 pb-3 pr-2 pl-2', props.class]">
    <ul v-if="socialLinks.length" class="flex space-x-1">
      <li v-for="(item, index) in socialLinks" :key="item.href || index">
        <Btn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>

    <div class="flex-1 flex justify-end">
      <div class="lg:hidden">
        <SwitchLang :drop-up="true" :no-bg="true" @click.stop />
      </div>

      <div class="lg:hidden">
        <SwitchAppearance @click.stop />
      </div>
    </div>
  </div>
</template>
