<template>
  <div v-if="url" class="video-responsive mt-4 overflow-hidden relative aspect-video">
    <iframe
      class="absolute inset-0 w-full h-full"
      :src="url"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
// Got from https://github.com/lando/vitepress-theme-default-plus/blob/main/components/VPLYouTube.vue
// also see https://github.com/miletorix/vitepress-youtube-embed/blob/main/packages/src/YouTubeEmbed.vue

import { computed } from 'vue'

const props = defineProps<{ id: string }>()

/** Validates a YouTube video ID (11 chars, alphanumeric, hyphens, underscores). */
function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id)
}

const url = computed(() => {
  if (!isValidYouTubeId(props.id)) {
    console.warn(`Invalid YouTube ID: ${props.id}`)
    return ''
  }
  return `https://www.youtube.com/embed/${props.id}`
})
</script>

<style scoped>
@media (max-width: 767px) {
  .video-responsive {
    padding-left: 0;
    padding-right: 0;
    border-radius: 0;
    width: auto;
    margin: 0.85rem -1.5rem;
    border-radius: 0;
  }
}
</style>
