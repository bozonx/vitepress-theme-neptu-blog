<script setup lang="ts">
import TagsList from './TagsList.vue'
import { LIST_ITEM_THUMB_WIDTH } from '../constants.ts'

const props = defineProps([
  'date',
  'localeDate',
  'tags',
  'preview',
  'authorName',
  'thumbnail',
  'coverHeight',
  'coverWidth',
])
</script>

<template>
  <div class="md:flex w-full">
    <div v-if="props.thumbnail" class="card-item-img-col">
      <img
        :src="props.thumbnail"
        :height="coverHeight"
        :width="coverWidth"
        :sizes="`(max-width: ${LIST_ITEM_THUMB_WIDTH}px) 100vw, ${LIST_ITEM_THUMB_WIDTH}px`"
        loading="lazy"
        aria-hidden="true"
        class="card-item-img"
        alt=""
      />

      <div class="mt-2 space-x-2 muted card-item-author-date">
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>

      <TagsList
        :tags="tags"
        class="mt-2"
        :size-sm="true"
        active-compare-method="none"
      />
    </div>

    <p class="max-md:mt-5 flex-1 card-item-description">
      {{ props.preview }}
    </p>
  </div>
</template>
