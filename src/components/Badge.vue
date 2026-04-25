<script setup lang="ts">
interface Props {
  count?: string | number
  title?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span class="rounded-full text-sm badge-item" :title="props.title">
    {{ props.count }}
  </span>
</template>

<style scoped>
.badge-item {
  color: white;
  padding: 0.5rem;
  line-height: 0.5rem !important;
  height: 1.5rem;
  background: var(--primary-btn-bg);
  filter: brightness(120%);
}
</style>
