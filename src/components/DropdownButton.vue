<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { Icon } from '@iconify/vue'
import NeptuBtn from './NeptuBtn.vue'

const props = defineProps<{
  dropUp?: boolean | string
  dropLeft?: boolean | string
  title?: string
  noBg?: boolean | string
}>()
const animationTimeMs = 400
const mouseLeaveDelayMs = 400
const menuId = `dropdown-menu-${Math.random().toString(36).slice(2, 10)}`
const listOpen = ref(false)
const opacity = ref(0)
const mouseOverWholeEl = ref(false)
const triggerRef = ref<InstanceType<typeof NeptuBtn> | null>(null)
const menuRef = ref<{
  querySelectorAll: (
    selector: string
  ) => ArrayLike<{ focus?: () => void }>
} | null>(null)
let animationTimeout: ReturnType<typeof setTimeout> | null = null
let leaveTimeout: ReturnType<typeof setTimeout> | null = null

const toggleList = () => {
  if (listOpen.value) {
    closeList()
  } else {
    openList()
  }
}

const focusMenuItem = (position: 'first' | 'last' = 'first') => {
  const menu = menuRef.value
  if (!menu) return

  const items = menu.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  const item = position === 'last' ? items[items.length - 1] : items[0]
  item?.focus?.()
}

const focusTrigger = () => {
  const triggerEl = triggerRef.value?.$el as { focus?: () => void } | undefined
  triggerEl?.focus?.()
}

const openList = async (focusPosition?: 'first' | 'last') => {
  if (listOpen.value) return

  listOpen.value = true
  // Run on the next tick to guarantee CSS transition fires
  setTimeout(() => (opacity.value = Number(listOpen.value)), 50)

  if (focusPosition) {
    await nextTick()
    focusMenuItem(focusPosition)
  }
}

const closeList = (restoreFocus = false) => {
  if (!listOpen.value) return

  opacity.value = 0

  if (animationTimeout) clearTimeout(animationTimeout)

  animationTimeout = setTimeout(() => {
    listOpen.value = false
    animationTimeout = null
    if (restoreFocus) focusTrigger()
  }, animationTimeMs)
}

const handleWholeMouseEnter = () => {
  mouseOverWholeEl.value = true

  if (leaveTimeout) clearTimeout(leaveTimeout)

  leaveTimeout = null
  // Run on the next tick
  setTimeout(openList)
}

const handleWholeMouseLeave = () => {
  mouseOverWholeEl.value = false

  if (leaveTimeout) clearTimeout(leaveTimeout)

  leaveTimeout = setTimeout(() => {
    leaveTimeout = null

    if (!mouseOverWholeEl.value) closeList()
  }, mouseLeaveDelayMs)
}

const handleTriggerKeydown = (event: { key: string; preventDefault: () => void }) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (listOpen.value) {
        focusMenuItem('first')
      } else {
        void openList('first')
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (listOpen.value) {
        focusMenuItem('last')
      } else {
        void openList('last')
      }
      break
    case 'Escape':
      if (listOpen.value) {
        event.preventDefault()
        closeList(true)
      }
      break
  }
}

const handleMenuKeydown = (event: { key: string; preventDefault: () => void }) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeList(true)
  }
}

onUnmounted(() => {
  if (animationTimeout) clearTimeout(animationTimeout)
  if (leaveTimeout) clearTimeout(leaveTimeout)
})
</script>

<template>
  <div
    v-on-click-outside="closeList"
    class="dropdown-btn inline-block relative"
    @mouseenter="handleWholeMouseEnter"
    @mouseleave="handleWholeMouseLeave"
  >
    <NeptuBtn
      ref="triggerRef"
      :no-bg="props.noBg"
      :title="props.title"
      aria-haspopup="menu"
      :aria-expanded="listOpen"
      :aria-controls="menuId"
      class="w-full"
      @click.prevent.stop="toggleList"
      @keydown="handleTriggerKeydown"
    >
      <span class="flex">
        <slot name="btn-text" />
        <span class="dropdown-caret ml-1 -mr-[10px]" aria-hidden="true">
          <span
            :class="[
              'dropdown-caret-rotate block transition-transform duration-[400ms] rotate-0',
              listOpen && 'dropdown-caret--open rotate-180',
            ]"
          >
            <Icon icon="ci:caret-down-md" width="1.7rem" height="1.7rem" />
          </span>
        </span>
      </span>
    </NeptuBtn>
    <div
      :id="menuId"
      ref="menuRef"
      role="menu"
      :style="{ opacity, 'transition-duration': `${animationTimeMs}ms` }"
      :class="[
        `dropdown-list space-y-1 transition-opacity absolute z-100 min-w-[100px] py-[0.4rem] rounded-lg mt-[1px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.3)] dark:shadow-[0px_8px_16px_0px_rgba(0,0,0,0.5)] bg-[var(--dropdown-list-bg)]`,
        props.dropUp && 'dropdown--drop-up bottom-full',
        props.dropLeft && 'dropdown--drop-left right-0',
        !listOpen && 'hidden',
      ]"
      @click="closeList"
      @keydown="handleMenuKeydown"
    >
      <slot />
    </div>
  </div>
</template>
