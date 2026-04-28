<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import { ref, watchEffect } from 'vue'
import SwitchLang from '../components/layout-parts/SwitchLang.vue'

const props = defineProps<{
  scrollY: number
}>()
const { theme } = useData()
const valueY = ref(0)
const wrapperRef = ref<HTMLElement | null>(null)
const BG_HEIGHT_OFFSET = theme.value.homeBgParallaxOffset || 0

watchEffect(() => {
  if (!inBrowser) return

  const totalHeight = wrapperRef.value?.scrollHeight || 0
  const windowHeight = window.innerHeight
  const totalScroll = totalHeight - windowHeight

  // Avoid division by zero when there is no scroll
  if (totalScroll <= 0) {
    valueY.value = 0
    return
  }

  // Scroll progress from 0 to 1
  const scrollProgress = Math.min(Math.max(props.scrollY / totalScroll, 0), 1)

  // Parallax formula: background moves slower than content.
  // Initial position is 0, then it shifts upward on scroll.
  // At full scroll the background shifts by the full BG_HEIGHT_OFFSET
  // so the whole image is revealed (background size: 100vh + BG_HEIGHT_OFFSET).
  //
  // Logic:
  // - scrollProgress = 0: background at 0 (top of image visible)
  // - scrollProgress = 1: background at -BG_HEIGHT_OFFSET (bottom of image visible)
  valueY.value = -(BG_HEIGHT_OFFSET * scrollProgress)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="dark home-layout flex flex-col justify-center items-center w-full min-h-screen bg-no-repeat bg-center bg-fixed text-white! transition-[background-position-y] duration-100 ease-out"
    :style="`background-position-y: ${valueY}px; background-size: auto calc(100vh + ${BG_HEIGHT_OFFSET}px);`"
  >
    <div class="home-layout-topbar absolute top-0 right-0 pt-4 pr-6">
      <SwitchLang :drop-left="true" :no-bg="true" />
    </div>
    <div class="home-layout-page max-w-[800px] my-20 mx-7">
      <Content />
    </div>
  </div>
</template>
