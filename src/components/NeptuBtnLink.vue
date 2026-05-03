<script setup lang="ts">
import NeptuBtn from './NeptuBtn.vue'

interface Props {
  customClass?: unknown
}

const props = defineProps<Props>()
</script>

<template>
  <NeptuBtn v-bind="$attrs" :custom-class="['inline-flex p-0! bg-transparent! shadow-none! border-0! btn-link', props.customClass]">
    <slot v-if="$slots.default" />
  </NeptuBtn>
</template>

<style>
.btn-link.active .btn-base-inner {
  text-decoration: underline;
}

.btn-link .btn-base.active {
  outline: none;
  color: var(--gray-400);
}

.btn-link .btn-base.active .btn-base-inner {
  text-decoration: none;
}
</style>
