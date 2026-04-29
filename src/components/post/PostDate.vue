<script setup lang="ts">
import { useData } from 'vitepress'

import { makeHumanDate } from '../../utils/shared/index.ts'
import BaseLink from '../BaseLink.vue'

const { page, theme, lang } = useData()
const rawDate = page.value.frontmatter.date

// Extract year and month for link generation
const dateObj = rawDate ? new Date(rawDate) : null
const year = dateObj ? dateObj.getUTCFullYear() : null
const month = dateObj ? dateObj.getUTCMonth() + 1 : null

const localeDate = makeHumanDate(rawDate, lang.value || 'en') || ''

// Determine whether a token represents a year
const isYear = (item: string) => {
  // Strip non-digit characters for year validation
  const cleanItem = item.replace(/[^\d]/g, '')
  return cleanItem.length === 4 && /^\d{4}$/.test(cleanItem)
}

// Determine whether a token represents a month name
const isMonth = (item: string) => {
  // Exclude prepositions and short tokens
  const excludedWords = [
    'de',
    'г',
    'г.',
    'of',
    'van',
    'der',
    'den',
    'del',
    'da',
    'di',
    'du',
    'des',
    'von',
    'zu',
    'zur',
    'van',
    'den',
    'der',
    'des',
    'del',
    'da',
    'di',
    'du',
    'of',
    'the',
    'a',
    'an',
    'in',
    'on',
    'at',
    'word-break',
  ]
  const cleanItem = item.replace(/[^\wа-яё]/gi, '').toLowerCase()

  // Ensure it is not a preposition and is long enough
  return (
    cleanItem.length >= 3 &&
    !excludedWords.includes(cleanItem) &&
    /^[^\d\.\-\,]{3,}$/.test(item)
  )
}

</script>

<template>
  <div v-if="rawDate" class="text-base muted post-date">
    <time :datetime="rawDate" class="space-x-1">
      <template v-for="item in localeDate.split(' ')" :key="item">
        <!-- Year link -->
        <BaseLink
          v-if="isYear(item)"
          :href="`${theme.archiveBaseUrl}/${year}/1`"
          class="underline hover:brightness-[1.4]"
        >
          {{ item }}
        </BaseLink>
        <!-- Month link -->
        <BaseLink
          v-else-if="isMonth(item)"
          :href="`${theme.archiveBaseUrl}/${year}/month/${month}`"
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
