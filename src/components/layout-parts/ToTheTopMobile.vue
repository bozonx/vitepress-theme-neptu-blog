<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useData } from "vitepress";
import { watch } from "vue";
import { useToTheTop } from "../../composables/useToTheTop.ts";

const props = defineProps<{
  scrollY: number
}>();
const SCROLL_BREAKPOINT = 1080;
const { theme } = useData();
const { showed, opacity, show, hide, handleClick, animationMs } = useToTheTop();

watch(
  () => props.scrollY,
  (scrollY, prevScroll) => {
    const prev = prevScroll ?? 0;
    if (scrollY > SCROLL_BREAKPOINT) {
      if (scrollY > prev) {
        hide();
      } else {
        show();
      }
    } else {
      hide();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
:class="['bottom-0 right-0 fixed transition-opacity', !showed && 'hidden']"
    :style="{ opacity, 'transition-duration': `${animationMs}ms` }" aria-hidden="true">
    <div class="to-the-top-mobile flex justify-center items-center w-14 h-14 rounded-full text-white mr-12 mb-12" :title="theme.returnToTopLabel" @click.prevent.stop="handleClick">
      <Icon icon="fa6-solid:arrow-up" />
    </div>
  </div>
</template>

<style scoped>
.to-the-top-mobile {
  background: var(--primary-btn-bg);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
}
</style>
