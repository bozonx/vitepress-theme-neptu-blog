<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'

import { Icon } from '@iconify/vue'

const { theme, title } = useData()
const siteFullTitle = encodeURIComponent(title.value)
const items = ref<any[]>([])
const attrs = {
  class: 'social-btn',
  target: '_blank',
  rel: 'nofollow noopener',
}

// Получаем список социальных сетей из конфигурации темы
const socialItems = (theme.value.socialMediaShares || '')
  .split(',')
  .filter((item: any) => Boolean(item))
  .map((item: any) => item.trim())

const makeItems = () => {
  // Безопасное получение URL документа с fallback
  const currentUrl = typeof document !== 'undefined' ? document.URL : ''
  const encodedDocUrl = encodeURIComponent(currentUrl)

  // Параметры для каждой социальной сети
  const itemsParams: Record<string, any> = {
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

  // Возвращаем только те социальные сети, которые указаны в конфигурации
  return socialItems.map((item: any) => itemsParams[item]).filter((item: any) => item) // Убираем undefined элементы
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
          class="hover-animation-rise"
        >
          <Icon :icon="item.icon" aria-hidden="true" />
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.social-btn svg {
  width: 2.25rem;
  height: 2.25rem;
}

.social-btn:hover {
  color: var(--vp-c-brand-1);
  filter: none; /* Убираем старый эффект brightness */
}

.social-vk {
  color: #0077ff;
}

.social-vk:hover {
  color: #0077ff;
}
</style>
