<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'

import { Icon } from '@iconify/vue'

const { theme, title } = useData()
const siteFullTitle = encodeURIComponent(title.value)
interface ShareItem {
  href: string
  icon: string
  title: string
  attrs: Record<string, string>
}

const items = ref<ShareItem[]>([])
const attrs = {
  class: 'social-btn',
  target: '_blank',
  rel: 'nofollow noopener',
}

// Get social networks list from theme config
const socialItems = (theme.value.socialMediaShares || '')
  .split(',')
  .filter((item: string) => Boolean(item))
  .map((item: string) => item.trim())

const makeItems = () => {
  // Safely get the document URL with a fallback
  const currentUrl = typeof document !== 'undefined' ? document.URL : ''
  const encodedDocUrl = encodeURIComponent(currentUrl)

  // Parameters for each social network
  const itemsParams: Record<string, ShareItem> = {
    telegram: {
      href: `https://t.me/share/url?url=${encodedDocUrl}&text=${siteFullTitle}`,
      icon: 'logos:telegram',
      title: 'Telegram',
      attrs,
    },
    whatsapp: {
      href: `https://api.whatsapp.com/send?text=${siteFullTitle}&url=${encodedDocUrl}`,
      icon: 'logos:whatsapp-icon',
      title: 'WhatsApp',
      attrs,
    },
    vk: {
      href: `https://vk.com/share.php?url=${encodedDocUrl}&title=${siteFullTitle}`,
      icon: 'cib:vk',
      title: 'VK',
      attrs: { ...attrs, class: `${attrs.class} social-vk` },
    },
    x: {
      href: `https://x.com/intent/tweet?text=${siteFullTitle}&url=${encodedDocUrl}`,
      icon: 'ri:twitter-x-fill',
      title: 'X (Twitter)',
      attrs,
    },
    facebook: {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedDocUrl}`,
      icon: 'logos:facebook',
      title: 'Facebook',
      attrs,
    },
  }

  // Return only social networks specified in config
  return socialItems.map((item: string) => itemsParams[item]).filter((item: ShareItem | undefined): item is ShareItem => Boolean(item))
}

onMounted(() => {
  items.value = makeItems()
})
</script>

<template>
  <div
    v-if="theme.socialMediaShares && items.length > 0"
    class="flex gap-y-3 max-sm:flex-col sm:items-center"
  >
    <div class="mr-2 muted">{{ theme.t.shareSocialMedia }}:</div>
    <div class="flex gap-x-2">
      <template v-for="item in items" :key="item.title">
        <a
          :href="item.href"
          :title="item.title"
          v-bind="item.attrs"
          :class="[
            'hover-animation-rise inline-flex items-center justify-center w-12 h-12 rounded-lg no-underline social-btn transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:filter-none',
            item.title === 'VK' && 'text-[#0077ff] hover:text-[#0077ff]',
          ]">
          <Icon :icon="item.icon" aria-hidden="true" class="w-9 h-9" />
        </a>
      </template>
    </div>
  </div>
</template>
