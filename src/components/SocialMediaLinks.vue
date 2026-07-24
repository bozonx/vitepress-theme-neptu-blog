<script setup lang="ts">
import NeptuBtn from './NeptuBtn.vue'

interface AuthorSocialLink {
  url: string
  title?: string
  type: string
}

const SOCIAL_ICON_MAP: Record<string, string> = {
  site: 'mdi:web',
  youtube: 'mdi:youtube',
  x: 'mdi:twitter', // X (formerly Twitter)
  facebook: 'mdi:facebook',
  instagram: 'mdi:instagram',
  tiktok: 'simple-icons:tiktok',
  vk: 'mdi:vk',
  mastodon: 'mdi:mastodon',
  diaspora: 'simple-icons:diaspora',
  // bastyon, odysee, threads icons unavailable in @iconify/vue, using fallback
}

defineProps<{
  links: AuthorSocialLink[]
}>()

// Resolve the correct icon name based on link type
const getIconName = (type: string) => {
  return SOCIAL_ICON_MAP[type] || SOCIAL_ICON_MAP.site // fallback to site if type is unrecognized
}
</script>

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
