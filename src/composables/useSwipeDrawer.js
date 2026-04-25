import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'

import { SWIPE_OFFSET } from '../constants.js'

/**
 * Horizontal edge-swipe gestures: open drawer on right-swipe from the left
 * edge, close on left-swipe. Only active while `enabled` is truthy.
 *
 * @param {object} opts
 * @param {() => boolean} opts.enabled    Gate, e.g. isMobile.
 * @param {() => void}   opts.onOpen     Called when user swipes to open.
 * @param {() => void}   opts.onClose    Called when user swipes to close.
 * @param {number}       [opts.edgePx=50] Left-edge trigger width.
 * @param {number}       [opts.threshold] Horizontal px required to trigger.
 */
export function useSwipeDrawer({
  enabled,
  onOpen,
  onClose,
  edgePx = 50,
  threshold = SWIPE_OFFSET,
}) {
  let initialX = null
  let initialY = null
  let processed = false

  function reset() {
    initialX = null
    initialY = null
    processed = false
  }

  function onTouchStart(e) {
    if (!enabled()) return
    const t = e.touches[0]
    initialX = t.clientX
    initialY = t.clientY
    processed = false
  }

  function onTouchMove(e) {
    if (!enabled() || initialX === null || processed) return

    const t = e.touches[0]
    const dx = t.clientX - initialX
    const dy = t.clientY - initialY

    if (Math.abs(dy) > Math.abs(dx)) {
      reset()
      return
    }
    if (Math.abs(dx) < threshold) return

    processed = true

    if (dx > 0) {
      if (initialX <= edgePx) {
        if (e.cancelable) e.preventDefault()
        onOpen?.()
        reset()
      }
    } else {
      if (e.cancelable) e.preventDefault()
      onClose?.()
      reset()
    }
  }

  onMounted(() => {
    if (!inBrowser) return
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', reset, { passive: true })
    window.addEventListener('touchcancel', reset, { passive: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', reset)
    window.removeEventListener('touchcancel', reset)
  })
}
