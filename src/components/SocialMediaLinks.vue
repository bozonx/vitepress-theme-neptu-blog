<template>
  <div class="flex gap-x-2">
    <Btn
      v-for="link in links"
      :key="link.url"
      :href="link.url"
      :title="link.title"
      :icon="getIconName(link.type)"
      icon-class="text-2xl"
      target="_blank"
      class="social-link"
    />
  </div>
</template>

<script setup lang="ts">
import Btn from './Btn.vue'

const props = defineProps<{
  links: any[]
}>()

// Функция для получения правильного имени иконки в зависимости от типа
const getIconName = (type: string) => {
  const iconMap: Record<string, string> = {
    site: 'mdi:web',
    youtube: 'mdi:youtube',
    x: 'mdi:twitter', // X (бывший Twitter)
    facebook: 'mdi:facebook',
    instagram: 'mdi:instagram',
    tiktok: 'mdi:tiktok',
    vk: 'mdi:vk',
    mastodon: 'mdi:mastodon',
    diaspora: 'mdi:diaspora',
    // bastyon, odysee, threads - иконки недоступны в @iconify/vue, используем fallback
  }

  return iconMap[type] || iconMap.site // fallback на site если тип не распознан
}
</script>
