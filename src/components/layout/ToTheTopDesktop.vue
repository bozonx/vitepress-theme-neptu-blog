<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useData } from "vitepress";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  scrollY: number
}>();
const { theme } = useData();
const SCROLL_BREAKPOINT = 1080;
const animationTimeMs = 1000;
let showed = ref(false);
let opacity = ref(0);
let animationTimeout: any = null;

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
    show();
  } else {
    hide();
  }
});
</script>

<template>
  <div
:class="[
    'bottom-0 fixed transition-opacity to-the-top-desk',
    !showed && 'hidden',
  ]" :style="{ opacity, 'transition-duration': `${animationTimeMs}ms` }" aria-hidden="true">
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
