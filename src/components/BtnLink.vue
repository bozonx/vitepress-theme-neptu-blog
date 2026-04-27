<script setup lang="ts">
import Btn from './Btn.vue'

interface Props {
  customClass?: unknown
}

const props = defineProps<Props>()
</script>

<template>
  <Btn v-bind="$attrs" :custom-class="['inline-flex p-0 bg-transparent! shadow-none! btn-link', props.customClass]">
    <slot />
  </Btn>
</template>

<style>
.btn-link.active {
  border: 0 none;
}

.btn-link.active .btn-base-inner {
  text-decoration: underline;
}
</style>
