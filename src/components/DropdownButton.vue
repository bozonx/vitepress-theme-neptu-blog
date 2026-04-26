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
    class="dropdown-btn"
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
        <span class="dropdown-caret" aria-hidden="true">
          <span
            :class="[
              'dropdown-caret-rotate',
              listOpen && 'dropdown-caret--open',
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
        `dropdown-list space-y-1 transition-opacity`,
        props.dropUp && 'dropdown--drop-up',
        props.dropLeft && 'dropdown--drop-left',
        !listOpen && 'hidden',
      ]"
      @click="closeList"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown-btn {
  display: inline-block;
  position: relative;
}

.dropdown-caret {
  margin-left: 0.25rem;
  margin-right: -10px;
}

.dropdown-list {
  position: absolute;
  z-index: 100;
  min-width: 100px;
  padding: 0.4rem 0;
  border-radius: 0.5rem;
  margin-top: 1px;
  background: var(--dropdown-list-bg);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
}

.dark .dropdown-list {
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.5);
}

.dropdown--drop-up {
  bottom: 100%;
}

.dropdown--drop-left {
  right: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

.dropdown-caret-rotate {
  display: block;
  transition: transform 400ms;
  transform: rotate(0deg);
}

.dropdown-caret--open {
  transform: rotate(180deg);
}
</style>
