<script setup lang="ts">
import NeptuBtn from './NeptuBtn.vue'

interface Props {
  customClass?: unknown
}

const props = defineProps<Props>()
</script>

<template>
  <NeptuBtn
    v-bind="$attrs"
    :custom-class="['menu-item w-full border-0! shadow-none! transition-none! transform-none! rounded-none py-2.5 px-[1.125rem]', props.customClass]"
    icon-class="muted"
    :no-bg="true"
  >
    <slot />
  </NeptuBtn>
</template>

<style>
/**** Lighter Btn for use on lighter background */
.menu-item:hover {
  filter: brightness(99%);
}

.dark .menu-item:hover {
  filter: brightness(110%);
}

.menu-item.active {
  background: var(--btn-bg-active);
}

.menu-item.active:hover {
  filter: brightness(103%);
}

.dark .menu-item.active:hover {
  filter: brightness(107%);
}

.menu-item .btn-base-inner {
  will-change: transform;
  transition: transform 0.2s ease-in-out;
}

.menu-item:not([disabled]):hover .btn-base-inner {
  transform: translateX(3px);
}
</style>
