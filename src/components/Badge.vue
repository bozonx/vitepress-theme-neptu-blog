<script setup lang="ts">
interface Props {
  count?: string | number
  title?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span class="rounded-full text-sm badge-item text-white p-2 leading-2! h-6" :title="props.title">
    {{ props.count }}
  </span>
</template>

<style scoped>
.badge-item {
  background: var(--primary-btn-bg);
  filter: brightness(120%);
}
</style>
