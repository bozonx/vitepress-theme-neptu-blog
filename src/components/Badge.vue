<script setup lang="ts">
interface Props {
  count?: string | number
  title?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span class="badge-item rounded-full text-sm text-white p-2 leading-2! h-6 brightness-[0.7]" :title="props.title">
    {{ props.count }}
  </span>
</template>

<style scoped>
.badge-item {
  background: var(--primary-btn-bg);
}
</style>
