<template>
  <a
    :href="`/${localeIndex}/${theme.authorsBaseUrl}/${props.item.id}/1`"
    class="card-item author-preview"
  >
    <h2 class="card-item-header">{{ props.item.name }}</h2>

    <div class="md:flex w-full">
      <!-- Картинка автора -->
      <div v-if="props.item.image" class="card-item-img-col">
        <img
          :src="props.item.image"
          :height="props.item.imageHeight"
          :width="props.item.imageWidth"
          :sizes="`(max-width: ${LIST_ITEM_THUMB_WIDTH}px) 100vw, ${LIST_ITEM_THUMB_WIDTH}px`"
          :alt="props.item.name"
          loading="lazy"
          class="card-item-img"
        />
      </div>

      <!-- Описание автора -->
      <div class="max-md:mt-5 flex-1 author-content">
        <p v-if="props.item.description" class="card-item-description">
          {{ props.item.description }}
        </p>

        <div class="mt-4 muted">
          <span>{{ theme.t.postsCount }}: {{ props.item.count }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { LIST_ITEM_THUMB_WIDTH } from '../constants.ts'

const props = defineProps(['item'])
const { theme, localeIndex } = useData()
</script>
