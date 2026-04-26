<script setup lang="ts">
import { useData } from 'vitepress'

import { makeHumanDate } from '../../utils/shared/index.ts'
import BaseLink from '../BaseLink.vue'

const { page, theme, localeIndex } = useData()
const rawDate = page.value.frontmatter.date

// List of supported languages (European + Middle Eastern)
const supportedLanguages = [
  'en',
  'ru',
  'de',
  'fr',
  'es',
  'it',
  'pt',
  'nl',
  'pl',
  'cs',
  'sk',
  'hu',
  'sv',
  'no',
  'da',
  'fi',
  'ar',
  'he',
  'uk',
  'be',
  'bg',
  'hr',
  'sr',
  'sl',
  'et',
  'lv',
  'lt',
  'ro',
  'el',
  'tr',
]

// Check if the language is supported
const isLanguageSupported = (language: string) => supportedLanguages.includes(language)

// Extract year and month for link generation
const dateObj = rawDate ? new Date(rawDate) : null
const year = dateObj ? dateObj.getUTCFullYear() : null
const month = dateObj ? dateObj.getUTCMonth() + 1 : null

// Use supported language or fallback to English
const effectiveLang = isLanguageSupported(localeIndex.value)
  ? localeIndex.value
  : 'en'
const localeDate = makeHumanDate(rawDate, effectiveLang) || ''

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

// Warn in dev mode for unsupported languages
if ((import.meta as any).env.DEV && !isLanguageSupported(localeIndex.value)) {
  console.warn(
    `[PostDate] Language "${localeIndex.value}" is not fully supported. Using English fallback. ` +
      `Supported languages: ${supportedLanguages.join(', ')}`
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
        >
          {{ item }}
        </BaseLink>
        <!-- Month link -->
        <BaseLink
          v-else-if="isMonth(item)"
          :href="`${theme.archiveBaseUrl}/${year}/month/${month}`"
        >
          {{ item }}
        </BaseLink>
        <!-- Plain text -->
        <span v-else>{{ item }}</span>
      </template>
    </time>
  </div>
</template>

<style scoped>
.post-date a {
  text-decoration: underline;
}

.post-date a:hover {
  filter: brightness(140%);
}
</style>
