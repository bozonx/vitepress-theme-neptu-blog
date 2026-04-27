<script setup lang="ts">
import TagsList from './TagsList.vue'
import { LIST_ITEM_THUMB_WIDTH } from '../constants.ts'

interface TagItem {
  name?: string
  slug?: string
  count?: number
}

const props = defineProps<{
  date?: string
  localeDate?: string
  tags?: TagItem[]
  preview?: string
  authorName?: string
  thumbnail?: string
  coverHeight?: number | string
  coverWidth?: number | string
}>()
</script>

<template>
  <div v-if="props.thumbnail" class="md:flex w-full">
    <div class="card-item-img-col">
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
        :tags="props.tags || []"
        class="mt-2"
        :size-sm="true"
        :active-compare-method="'none'"
      />
    </div>

    <p class="max-md:mt-5 flex-1 card-item-description">
      {{ props.preview }}
    </p>
  </div>
  <div v-else>
    <p class="card-item-description">{{ props.preview }}</p>

    <div class="flex max-sm:flex-col-reverse sm:items-end sm:mt-4 gap-x-1">
      <TagsList
        :tags="props.tags || []"
        class="flex-1"
        :size-sm="true"
        :active-compare-method="'none'"
      />

      <div
        class="space-x-2 max-sm:mt-2 max-sm:mb-4 text-right muted card-item-author-date"
      >
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>
    </div>
  </div>
</template>
