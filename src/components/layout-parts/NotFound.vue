<script setup lang="ts">
import { useData } from 'vitepress'

const { localeIndex, theme } = useData()
</script>

<template>
  <div class="notfound-page bg-[var(--gray-900)] flex items-center justify-center h-screen">
    <div>
      <h1 class="text-white text-4xl">{{ theme.t.pageNotFound }}</h1>
      <div class="text-xl mt-1">
        <a class="simple-link" :href="`/${localeIndex}/`">{{ theme.t.toHome }}</a>
      </div>
    </div>
  </div>
</template>
