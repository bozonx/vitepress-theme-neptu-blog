<template>
  <div
    class="author-container flex flex-col md:flex-row gap-x-6 gap-y-1 items-start"
  >
    <!-- Author image -->
    <figure v-if="author?.image" class="author-image-container w-full mx-auto md:w-[280px] md:shrink-0">
      <a :href="author.image" class="lightbox">
        <img
          :src="author.image"
          :alt="author?.name"
          :height="author?.imageHeight"
          :width="author?.imageWidth"
          loading="lazy"
          decoding="async"
          class="w-full max-w-full h-auto rounded-md transition-[transform,box-shadow] duration-200 ease-in-out"
        />
      </a>
    </figure>

    <!-- Author content -->
    <div class="author-content flex-1">
      <div class="mb-6 vp-doc" v-html="author?.description"></div>
      <SocialMediaLinks v-if="author?.links" :links="author.links" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialMediaLinks from './SocialMediaLinks.vue'
import { LIST_ITEM_THUMB_WIDTH } from '../constants.ts'

interface Author {
  name?: string
  image?: string
  imageHeight?: number
  imageWidth?: number
  description?: string
  links?: Array<{ type: string; url: string }>
}

const props = defineProps<{ author?: Author }>()
</script>

