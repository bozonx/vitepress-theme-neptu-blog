<template>
  <div v-if="url" class="video-responsive">
    <iframe
      width="100%"
      height="400"
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
.video-responsive {
  margin-top: 1em;
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
}

.video-responsive iframe {
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

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
