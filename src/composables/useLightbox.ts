import { inBrowser } from 'vitepress'
import { inject, isRef, onMounted, onUnmounted, ref, type Ref, type InjectionKey, type ComputedRef } from 'vue'

import {
  addBodyClass,
  bodyHasClass,
  buildItems,
  getClickIndex,
  getLightboxLinks,
  removeBodyClass,
} from '../utils/client/lightboxDOM.ts'

export interface LightboxItem {
  src: string
  alt: string
}

export interface UseLightboxReturn {
  isOpen: Ref<boolean>
  currentIndex: Ref<number>
  items: Ref<LightboxItem[]>
  open: (index: number) => void
  close: () => void
  next: () => void
  prev: () => void
}

export const LightboxLocalesKey: InjectionKey<Record<string, string> | ComputedRef<Record<string, string>>> = Symbol('lightbox-locales')

export function useLightbox(doc: Document = document): UseLightboxReturn {
  const isOpen = ref(false)
  const currentIndex = ref(0)
  const items = ref<LightboxItem[]>([])

  let links: HTMLAnchorElement[] = []
  let observer: MutationObserver | null = null

  const refreshItems = () => {
    links = getLightboxLinks(doc)
    items.value = buildItems(links)
  }

  const open = (index: number) => {
    if (index < 0 || index >= items.value.length) return
    currentIndex.value = index
    isOpen.value = true
    if (inBrowser) {
      addBodyClass(doc, 'modal-open')
    }
  }

  const close = () => {
    isOpen.value = false
    if (inBrowser) {
      removeBodyClass(doc, 'modal-open')
    }
  }

  const next = () => {
    if (items.value.length <= 1) return
    currentIndex.value = (currentIndex.value + 1) % items.value.length
  }

  const prev = () => {
    if (items.value.length <= 1) return
    currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length
  }

  const onClick = (e: MouseEvent) => {
    const idx = getClickIndex(e.target, links)
    if (idx !== -1) {
      e.preventDefault()
      open(idx)
    }
  }

  onMounted(() => {
    if (!inBrowser) return
    refreshItems()
    doc.addEventListener('click', onClick, true)

    observer = new MutationObserver(() => {
      refreshItems()
    })
    observer.observe(doc.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    doc.removeEventListener('click', onClick, true)
    observer?.disconnect()
    if (bodyHasClass(doc, 'modal-open')) {
      removeBodyClass(doc, 'modal-open')
    }
  })

  return {
    isOpen,
    currentIndex,
    items,
    open,
    close,
    next,
    prev,
  }
}

export function useLightboxLocales(): Record<string, string> {
  const val = inject(LightboxLocalesKey, {})
  return isRef(val) ? val.value : val
}
