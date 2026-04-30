<template>
  <a
    :href="`/${localeIndex}/${theme.authorsBaseUrl}/${props.item.id}/1`"
    class="card-item author-preview"
  >
    <h2 class="card-item-header font-bold mb-3 text-2xl leading-8 tracking-tight">{{ props.item.name }}</h2>

    <div class="md:flex w-full">
      <!-- Author image -->
      <div v-if="props.item.image" class="card-item-img-col shrink-0 mr-4">
        <img
          :src="props.item.image"
          :height="props.item.imageHeight"
          :width="props.item.imageWidth"
          :alt="props.item.name"
          loading="lazy"
          decoding="async"
          class="card-item-img w-full h-auto rounded-[0.3125rem]"
        />
      </div>

      <!-- Author description -->
      <div class="max-md:mt-5 flex-1 author-content">
        <p v-if="props.item.description" class="card-item-description">
          {{ props.item.description }}
        </p>

        <div class="mt-4 muted">
          <span>{{ props.item.count }} {{ pluralize(props.item.count ?? 0, theme.t.postsCountForms) }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { pluralize } from '../utils/shared/index.ts'
import { useUiTheme } from '../composables/useUiTheme.ts'

interface AuthorItem {
  id: string
  name?: string
  image?: string
  imageHeight?: number
  imageWidth?: number
  description?: string
  count?: number
}

const props = defineProps<{ item: AuthorItem }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
</script>
