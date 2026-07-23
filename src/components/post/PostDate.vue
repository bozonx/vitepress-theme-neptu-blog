<script lang="ts">
const EXCLUDED_WORDS = [
  'de', 'г', 'г.', 'of', 'van', 'der', 'den', 'del',
  'da', 'di', 'du', 'des', 'von', 'zu', 'zur',
  'the', 'a', 'an', 'in', 'on', 'at', 'word-break',
]

// Determine whether a token represents a year
function isYear(item: string): boolean {
  const cleanItem = item.replace(/[^\d]/g, '')
  return cleanItem.length === 4 && /^\d{4}$/.test(cleanItem)
}

// Determine whether a token represents a month name
function isMonth(item: string): boolean {
  const cleanItem = item.replace(/[^\wа-яё]/gi, '').toLowerCase()
  return (
    cleanItem.length >= 3 &&
    !EXCLUDED_WORDS.includes(cleanItem) &&
    /^[^\d.\-,]{3,}$/.test(item)
  )
}
</script>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

import { makeHumanDate } from '../../utils/shared/index.ts'
import BaseLink from '../BaseLink.vue'

const { page, lang } = useData()
const rawDate = computed(() => page.value.frontmatter.date)

// Extract year and month for link generation
const dateObj = computed(() => (rawDate.value ? new Date(rawDate.value) : null))
const year = computed(() => (dateObj.value ? dateObj.value.getUTCFullYear() : null))
const month = computed(() => (dateObj.value ? dateObj.value.getUTCMonth() + 1 : null))

const localeDate = computed(() => makeHumanDate(rawDate.value, lang.value || 'en') || '')
</script>

<template>
  <div v-if="rawDate" class="text-base muted post-date">
    <time :datetime="rawDate" class="space-x-1">
      <template v-for="item in localeDate.split(' ')" :key="item">
        <!-- Year link -->
        <BaseLink
          v-if="isYear(item)"
          :href="`archive/${year}/1`"
          class="underline hover:brightness-[1.4]"
        >
          {{ item }}
        </BaseLink>
        <!-- Month link -->
        <BaseLink
          v-else-if="isMonth(item)"
          :href="`archive/${year}/month/${month}`"
          class="underline hover:brightness-[1.4]"
        >
          {{ item }}
        </BaseLink>
        <!-- Plain text -->
        <span v-else>{{ item }}</span>
      </template>
    </time>
  </div>
</template>
