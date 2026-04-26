interface TobiiLabels {
  prev: string
  next: string
  close: string
  dialogTitle: string
  loadingIndicatorLabel: string
}

interface TobiiContext {
  app: {
    config: {
      globalProperties: {
        getLocales: () => { t: { lightbox: TobiiLabels } }
      }
    }
  }
}

interface TobiiInstance {
  destroy: () => void
}

interface TobiiConstructor {
  new (opts: unknown): TobiiInstance
}

/** Tobii lightbox initialization and management */
export function tobiiLightboxPlugin(ctx: TobiiContext, Tobii: TobiiConstructor) {
  if (typeof window === 'undefined') return

  let tobiiInstance: InstanceType<typeof Tobii> | null = null

  // Initialize Tobii
  const initTobii = () => {
    if (tobiiInstance) tobiiInstance.destroy()

    const labels = ctx.app.config.globalProperties.getLocales().t.lightbox

    tobiiInstance = new Tobii({
      captions: false,
      navLabel: [labels.prev, labels.next],
      closeLabel: labels.close,
      dialogTitle: labels.dialogTitle,
      loadingIndicatorLabel: labels.loadingIndicatorLabel,
    })
  }

  // Reinitialize Tobii when lazy-loaded images finish loading
  const handleImageLoad = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'IMG' && target.closest('.lightbox')) {
      initTobii()
    }
  }

  document.addEventListener('load', handleImageLoad, true)

  // Observe new lightbox elements being added to the DOM
  const observer = new MutationObserver((mutations) => {
    let shouldReinit = false

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element
            if (
              el.classList?.contains('lightbox') ||
              el.querySelector?.('.lightbox')
            ) {
              shouldReinit = true
            }
          }
        }
      }
    }

    if (shouldReinit) {
      initTobii()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Disconnect observer when the page is unloaded to avoid memory leaks
  window.addEventListener('beforeunload', () => {
    observer.disconnect()
    document.removeEventListener('load', handleImageLoad, true)
  })

  // document.addEventListener('DOMContentLoaded', initTobii)

  // Reinitialize on VitePress navigation
  // window.addEventListener('popstate', () => {
  //   setTimeout(initTobii, 0)
  // })
}
