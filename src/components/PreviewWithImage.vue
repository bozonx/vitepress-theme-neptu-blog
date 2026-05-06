<script setup lang="ts">
import TagsList from './TagsList.vue'

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
    <div class="card-item-img-col shrink-0 mr-4">
      <img
        :src="props.thumbnail"
        :height="coverHeight"
        :width="coverWidth"
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        class="card-item-img w-full h-auto rounded-[0.3125rem]"
        alt=""
      />

      <div class="mt-2 space-x-2 muted card-item-author-date text-sm leading-5">
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>

      <TagsList
        :tags="props.tags || []"
        class="mt-2"
        :size-sm="true"
        :active-compare-method="'softPagination'"
      />
    </div>

    <p v-if="props.preview" class="max-md:mt-5 flex-1 card-item-description">
      {{ props.preview }}
    </p>
  </div>
  <div v-else>
    <p v-if="props.preview" class="card-item-description">
      {{ props.preview }}
    </p>

    <div
      class="flex max-sm:flex-col-reverse sm:items-end gap-x-1"
      :class="{ 'sm:mt-4': props.preview }"
    >
      <TagsList
        :tags="props.tags || []"
        class="flex-1"
        :size-sm="true"
        :active-compare-method="'softPagination'"
      />

      <div
        class="space-x-2 max-sm:mt-2 max-sm:mb-4 text-right muted card-item-author-date text-sm leading-5"
      >
        <span v-if="props.authorName">{{ props.authorName }}.</span>
        <time v-if="props.date" :datetime="props.date">
          {{ props.localeDate }}
        </time>
      </div>
    </div>
  </div>
</template>
