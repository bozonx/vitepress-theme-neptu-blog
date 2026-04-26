<script setup lang="ts">
import Badge from './Badge.vue'
import SimpleLink from './SimpleLink.vue'

interface Props {
  text?: string
  count?: number
}

// Declare only the props handled by this component
const props = defineProps<Props>()
</script>

<template>
  <SimpleLink
    v-bind="$attrs"
    class="no-underline text-2xl my-5 inline-flex gap-x-2"
  >
    <span>{{ props.text }}</span>
    <Badge v-if="typeof props.count === 'number'" :count="props.count" />
  </SimpleLink>
</template>
