<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useData } from "vitepress";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  scrollY: number
}>();
const SCROLL_BREAKPOINT = 1080;
const animationTimeMs = 1000;
const { theme } = useData();
let showed = ref(false);
let opacity = ref(0);
let animationTimeout: any = null;
let prevScroll = 0;

const show = () => {
  if (showed.value) return;

  showed.value = true;

  setTimeout(() => (opacity.value = 1));
};

const hide = () => {
  if (!showed.value) return;

  opacity.value = 0;

  clearTimeout(animationTimeout);

  animationTimeout = setTimeout(() => {
    showed.value = false;

    animationTimeout = null;
  }, animationTimeMs);
};
const handleClick = () => {
  window.scrollTo(0, 0);
};

watchEffect(async () => {
  if (props.scrollY > SCROLL_BREAKPOINT) {
    if (props.scrollY > prevScroll) {
      hide();
    } else {
      show();
    }
  } else {
    hide();
  }

  prevScroll = props.scrollY;
});
</script>

<template>
  <div :class="['bottom-0 right-0 fixed transition-opacity', !showed && 'hidden']"
    :style="{ opacity, 'transition-duration': `${animationTimeMs}ms` }" aria-hidden="true">
    <div class="to-the-top-mobile" @click.prevent.stop="handleClick" :title="theme.returnToTopLabel">
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
