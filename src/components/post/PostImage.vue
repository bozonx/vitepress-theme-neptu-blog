<script setup lang="ts">
const props = defineProps<{
  src?: string
  description?: string
  alt?: string
  height?: number | string
  width?: number | string
}>()
</script>

<template>
  <figure v-if="props.src">
    <a :href="props.src" class="lightbox">
      <img
        :src="props.src"
        :alt="props.alt || undefined"
        :height="props.height"
        :width="props.width"
      />
    </a>
    <figcaption
      v-if="props.description"
      class="vp-doc"
      v-html="props.description"
    ></figcaption>
  </figure>
</template>
