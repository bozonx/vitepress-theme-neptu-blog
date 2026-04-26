import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollY(): { scrollY: Ref<number> } {
  const scrollY = ref(0)
  let ticking = false

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollY.value = window.scrollY
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    if (!inBrowser) return
    scrollY.value = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('scroll', onScroll)
  })

  return { scrollY }
}
