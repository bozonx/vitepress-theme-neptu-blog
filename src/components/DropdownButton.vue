<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { Icon } from '@iconify/vue'
import Btn from './Btn.vue'

const props = defineProps<{
  dropUp?: boolean | string
  dropLeft?: boolean | string
  title?: string
  noBg?: boolean | string
}>()
const animationTimeMs = 400
const mouseLeaveDelayMs = 400
const listOpen = ref(false)
const opacity = ref(0)
const mouseOverWholeEl = ref(false)
let animationTimeout: ReturnType<typeof setTimeout> | null = null
let leaveTimeout: ReturnType<typeof setTimeout> | null = null

const toggleList = () => {
  if (listOpen.value) {
    closeList()
  } else {
    openList()
  }
}

const openList = () => {
  if (listOpen.value) return

  listOpen.value = true
  // Run on the next tick to guarantee CSS transition fires
  setTimeout(() => (opacity.value = Number(listOpen.value)), 50)
}

const closeList = () => {
  if (!listOpen.value) return

  opacity.value = 0

  if (animationTimeout) clearTimeout(animationTimeout)

  animationTimeout = setTimeout(() => {
    listOpen.value = false
    animationTimeout = null
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
    <Btn
      :no-bg="props.noBg"
      :title="props.title"
      class="w-full"
      @click.prevent.stop="toggleList"
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
    </Btn>
    <div
      :style="{ opacity, 'transition-duration': `${animationTimeMs}ms` }"
      :class="[
        `dropdown-list space-y-1 transition-opacity absolute z-100 min-w-[100px] py-[0.4rem] rounded-lg mt-[1px]`,
        props.dropUp && 'dropdown--drop-up bottom-full',
        props.dropLeft && 'dropdown--drop-left right-0',
        !listOpen && 'hidden',
      ]"
      @click="closeList"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown-list {
  background: var(--dropdown-list-bg);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
}

.dark .dropdown-list {
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.5);
}
</style>
