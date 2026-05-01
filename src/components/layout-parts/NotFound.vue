<script setup lang="ts">
import { useData } from 'vitepress'

const { localeIndex, theme } = useData()
const pageNotFoundText = theme.value.t?.pageNotFound || 'Page not found'
const toHomeText = theme.value.t?.toHome || 'Home'
</script>

<template>
  <div class="notfound-page bg-[var(--gray-900)] flex items-center justify-center h-screen">
    <div>
      <h1 class="text-white text-4xl">{{ pageNotFoundText }}</h1>
      <div class="text-xl mt-1">
        <a class="simple-link" :href="`/${localeIndex}/`">{{ toHomeText }}</a>
      </div>
    </div>
  </div>
</template>
