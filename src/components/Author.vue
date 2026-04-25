<template>
  <div
    class="author-container flex flex-col md:flex-row gap-x-6 gap-y-1 items-start"
  >
    <!-- Картинка автора -->
    <figure v-if="author?.image" class="author-image-container">
      <a :href="author.image" class="lightbox">
        <img
          :src="author.image"
          :alt="author?.name"
          :sizes="`(min-width: ${LIST_ITEM_THUMB_WIDTH}px) ${LIST_ITEM_THUMB_WIDTH}px, 100vw`"
          :height="author?.imageHeight"
          :width="author?.imageWidth"
          class="w-full"
        />
      </a>
    </figure>

    <!-- Контент автора -->
    <div class="author-content flex-1">
      <div class="mb-6 vp-doc" v-html="author?.description"></div>
      <SocialMediaLinks v-if="author?.links" :links="author.links" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialMediaLinks from './SocialMediaLinks.vue'
import { LIST_ITEM_THUMB_WIDTH } from '../constants.js'

const props = defineProps(['author'])
</script>

<style scoped>
.author-image-container {
  width: 100%;
  margin: auto;
}

/* На экранах md и больше */
@media (min-width: 768px) {
  .author-image-container {
    width: 280px;
    flex-shrink: 0;
  }
}
</style>
