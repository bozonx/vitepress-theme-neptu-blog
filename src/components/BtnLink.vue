<script setup lang="ts">
import Btn from './Btn.vue'

interface Props {
  customClass?: unknown
}

const props = defineProps<Props>()
</script>

<template>
  <Btn v-bind="$attrs" :customClass="['btn-link', props.customClass]">
    <slot />
  </Btn>
</template>

<style>
.btn-link {
  display: inline-flex;
  padding: 0;
  background: transparent !important;
  box-shadow: none !important;
}
.btn-link.active {
  border: 0 none;
}

.btn-link.active .btn-base-inner {
  text-decoration: underline;
}
</style>
