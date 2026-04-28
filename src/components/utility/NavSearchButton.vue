<template>
  <div class="nav-search-button flex items-center h-full w-40 max-[490px]:w-[120px] max-[439px]:w-full">
    <button class="search-input-btn w-full flex items-center cursor-pointer text-left gap-2 p-[5px_12px] rounded-md transition-all duration-200 border border-[var(--search-input-btn-border-color)] bg-[var(--vp-c-bg-soft)] hover:border-[var(--vp-c-brand-1)] hover:bg-[var(--vp-c-bg)] text-[var(--vp-c-text-2)]" :title="theme.t?.searchInBlog">
      <Icon icon="fa6-solid:magnifying-glass" class="search-icon w-4 shrink-0" />
      <span class="search-placeholder text-sm flex-1 max-[439px]:hidden">{{ theme.t?.search }}...</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useData } from 'vitepress'

const { theme } = useData()
</script>
