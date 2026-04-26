<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useData } from "vitepress";
import { watch } from "vue";
import { useToTheTop } from "../../composables/useToTheTop.ts";

const props = defineProps<{
  scrollY: number
}>();
const { theme } = useData();
const SCROLL_BREAKPOINT = 1080;
const { showed, opacity, show, hide, handleClick, animationMs } = useToTheTop();

watch(
  () => props.scrollY,
  (scrollY) => {
    if (scrollY > SCROLL_BREAKPOINT) {
      show();
    } else {
      hide();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
:class="[
    'bottom-0 fixed transition-opacity to-the-top-desk',
    !showed && 'hidden',
  ]" :style="{ opacity, 'transition-duration': `${animationMs}ms` }" aria-hidden="true">
    <div class="mb-9 ml-4 flex gap-x-2 px-2 py-2" @click.prevent.stop="handleClick">
      <Icon icon="fa6-solid:arrow-up" width="1.3rem" height="1.3rem" />
      {{ theme.returnToTopLabel }}
    </div>
  </div>
</template>

<style scoped>
.to-the-top-desk div {
  cursor: pointer;
  color: var(--gray-600);
}

.to-the-top-desk div:hover {
  color: black;
}

.dark .to-the-top-desk div {
  color: var(--gray-300);
}

.dark .to-the-top-desk div:hover {
  color: white;
}
</style>
