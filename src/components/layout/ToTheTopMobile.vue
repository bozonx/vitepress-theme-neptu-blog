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
    <div class="to-the-top-mobile" :title="theme.returnToTopLabel" @click.prevent.stop="handleClick">
      <Icon icon="fa6-solid:arrow-up" />
    </div>
  </div>
</template>

<style scoped>
.to-the-top-mobile {
  background: var(--primary-btn-bg);
  border-radius: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 3rem 3rem 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
  color: white;
}
</style>
