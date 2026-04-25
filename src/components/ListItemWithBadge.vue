<script setup lang="ts">
import Badge from './Badge.vue'
import SimpleLink from './SimpleLink.vue'

interface Props {
  text?: string
  count?: number
}

// Объявляем только те пропсы, которые обрабатываем в этом компоненте
const props = defineProps<Props>()
</script>

<template>
  <SimpleLink
    v-bind="$attrs"
    class="no-underline text-2xl my-5 inline-flex gap-x-2"
  >
    <span>{{ props.text }}</span>
    <Badge :count="props.count" v-if="typeof props.count === 'number'" />
  </SimpleLink>
</template>
