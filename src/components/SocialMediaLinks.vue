<template>
  <div class="flex gap-x-2">
    <NeptuBtn
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
import NeptuBtn from './NeptuBtn.vue'

interface SocialLink {
  url: string
  title?: string
  type: string
}

defineProps<{
  links: SocialLink[]
}>()

// Resolve the correct icon name based on link type
const getIconName = (type: string) => {
  const iconMap: Record<string, string> = {
    site: 'mdi:web',
    youtube: 'mdi:youtube',
    x: 'mdi:twitter', // X (formerly Twitter)
    facebook: 'mdi:facebook',
    instagram: 'mdi:instagram',
    tiktok: 'mdi:tiktok',
    vk: 'mdi:vk',
    mastodon: 'mdi:mastodon',
    diaspora: 'mdi:diaspora',
    // bastyon, odysee, threads icons unavailable in @iconify/vue, using fallback
  }

  return iconMap[type] || iconMap.site // fallback to site if type is unrecognized
}
</script>
