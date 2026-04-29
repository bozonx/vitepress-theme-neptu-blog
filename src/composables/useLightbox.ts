import { inBrowser } from 'vitepress'
import {
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  type Ref,
} from 'vue'

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

function getLightboxLinks(): HTMLAnchorElement[] {
  if (!inBrowser) return []
  return Array.from(document.querySelectorAll('a.lightbox'))
}

function buildItems(links: HTMLAnchorElement[]): LightboxItem[] {
  return links.map((el) => ({
    src: el.getAttribute('href') || '',
    alt: el.querySelector('img')?.getAttribute('alt') || '',
  }))
}

function getClickIndex(target: EventTarget | null, links: HTMLAnchorElement[]): number {
  if (!(target instanceof Element)) return -1
  const anchor = target.closest('a.lightbox')
  if (!anchor) return -1
  return links.indexOf(anchor as HTMLAnchorElement)
}

export function useLightbox(): UseLightboxReturn {
  const isOpen = ref(false)
  const currentIndex = ref(0)
  const items = ref<LightboxItem[]>([])

  let links: HTMLAnchorElement[] = []
  let observer: MutationObserver | null = null

  const refreshItems = () => {
    links = getLightboxLinks()
    items.value = buildItems(links)
  }

  const open = (index: number) => {
    if (index < 0 || index >= items.value.length) return
    currentIndex.value = index
    isOpen.value = true
    if (inBrowser) {
      document.body.classList.add('modal-open')
    }
  }

  const close = () => {
    isOpen.value = false
    if (inBrowser) {
      document.body.classList.remove('modal-open')
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
    document.addEventListener('click', onClick, true)

    observer = new MutationObserver(() => {
      refreshItems()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    document.removeEventListener('click', onClick, true)
    observer?.disconnect()
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open')
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
  const instance = getCurrentInstance()
  const getLocales = instance?.appContext.config.globalProperties.getLocales as
    | (() => { t: { lightbox: Record<string, string> } })
    | undefined

  return getLocales?.().t.lightbox ?? {}
}
