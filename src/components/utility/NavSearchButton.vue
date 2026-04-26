<template>
  <div class="nav-search-button">
    <button class="search-input-btn" :title="theme.t?.searchInBlog">
      <Icon icon="fa6-solid:magnifying-glass" class="search-icon" />
      <span class="search-placeholder">{{ theme.t?.search }}...</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<style>
:root,
.dark {
  --search-input-btn-border-color: var(--vp-c-divider);
}
</style>

<style scoped>
.nav-search-button {
  display: flex;
  align-items: center;
  height: 100%;
  width: 160px;
}

.search-input-btn {
  text-align: left;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid var(--search-input-btn-border-color);
  background-color: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
}

.search-input-btn:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.search-icon {
  width: 16px;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.search-placeholder {
  color: var(--vp-c-text-2);
  font-size: 14px;
  flex: 1;
}

@media (max-width: 490px) {
  .nav-search-button {
    width: 120px;
  }
}

@media (max-width: 439px) {
  .nav-search-button {
    width: 100%;
  }

  .search-input-wrapper {
    padding: 8px 10px;
  }

  .search-placeholder {
    display: none;
  }
}
</style>
