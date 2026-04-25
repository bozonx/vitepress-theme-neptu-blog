import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollY(): { scrollY: Ref<number> } {
  const scrollY = ref(0)

  function onScroll() {
    scrollY.value = window.scrollY
  }

  onMounted(() => {
    if (!inBrowser) return
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('scroll', onScroll)
  })

  return { scrollY }
}
