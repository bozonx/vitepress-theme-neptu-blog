import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

import { MOBILE_BREAKPOINT } from '../constants.js'

export function useBreakpoint(breakpoint: number = MOBILE_BREAKPOINT): {
  windowWidth: Ref<number>
  isMobile: Ref<boolean>
} {
  const windowWidth = ref(0)
  const isMobile = ref(true)

  function onResize() {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < breakpoint
  }

  onMounted(() => {
    if (!inBrowser) return
    onResize()
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('resize', onResize)
  })

  return { windowWidth, isMobile }
}
