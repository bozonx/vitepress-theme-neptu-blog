import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Calls `handler` when a pointer event occurs outside the referenced element.
 * Listens on `document` for `pointerdown` (covers mouse + touch) and is
 * cleaned up automatically on unmount.
 */
export function useOnClickOutside(
  target: Ref<HTMLElement | null>,
  handler: (event: PointerEvent) => void
): void {
  const listener = (event: PointerEvent) => {
    const el = target.value
    if (!el || el.contains(event.target as Node)) return
    handler(event)
  }

  onMounted(() => {
    document.addEventListener('pointerdown', listener, true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', listener, true)
  })
}
