<template>
  <div class="pagefind-search-wrapper" @click="showSearchModal">
    <slot />
  </div>

  <Teleport v-if="isMounted" :to="`#${GLOBAL_MODALS_CONTAINER_ID}`">
    <div
      v-show="isModalVisible"
      :id="MODAL_ID"
      class="search-modal"
      :class="{
        active: isActive,
        'fade-in': isAnimatingIn,
        'fade-out': isAnimatingOut
      }"
      :style="{ display: isModalVisible ? 'flex' : 'none' }"
      @click="handleBackdropClick"
    >
      <div class="search-modal-inner-wrapper">
        <button class="search-modal-close-button">×</button>
        <div class="search-modal-content">
          <div class="search-modal-top-bar">
            <button class="search-modal-mobile-close-button">×</button>
          </div>
          <div id="pagefind-search"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { GLOBAL_MODALS_CONTAINER_ID } from '../../constants.ts'

declare global {
  interface Window {
    PagefindUI: {
      new (options: unknown): { destroy(): void }
    }
  }
}

const MODAL_ID = 'search-modal'
const CLOSE_BUTTON_CLASS = 'search-modal-close-button'
const MOBILE_CLOSE_BUTTON_CLASS = 'search-modal-mobile-close-button'

const pageFind = ref<InstanceType<typeof window.PagefindUI> | null>(null)
const isModalOpen = ref(false)
const isModalVisible = ref(false)
const isActive = ref(false)
const isAnimatingIn = ref(false)
const isAnimatingOut = ref(false)
const isMounted = ref(false)

const showSearchModal = async () => {
  if (isModalOpen.value) return

  isModalVisible.value = true
  isModalOpen.value = true

  await nextTick()

  isActive.value = true
  isAnimatingIn.value = true
  isAnimatingOut.value = false

  document.body.classList.add('modal-open')
  history.pushState({ modalOpen: true }, '', window.location.href)

  if (window.PagefindUI && !pageFind.value) {
    pageFind.value = new window.PagefindUI({
      element: '#pagefind-search',
      showSubResults: true,
      showImages: true,
    })
  }

  setTimeout(() => {
    const searchModal = document.getElementById(MODAL_ID)
    if (searchModal) {
      const searchInput = searchModal.querySelector('.pagefind-ui__search-input') as HTMLInputElement | null
      if (searchInput) searchInput.focus()
    }
  }, 100)
}

const hideSearchModal = () => {
  if (!isModalOpen.value) return

  isAnimatingIn.value = false
  isAnimatingOut.value = true

  setTimeout(() => {
    isModalVisible.value = false
    isActive.value = false
    isAnimatingOut.value = false
    isModalOpen.value = false

    document.body.classList.remove('modal-open')

    if (pageFind.value) {
      pageFind.value.destroy()
      pageFind.value = null
    }
  }, 300)
}

const handleBackdropClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    target.id === MODAL_ID ||
    target.classList.contains(CLOSE_BUTTON_CLASS) ||
    target.classList.contains(MOBILE_CLOSE_BUTTON_CLASS) ||
    target.classList.contains('pagefind-ui__result-link') ||
    target.closest('.pagefind-ui__result-link')
  ) {
    hideSearchModal()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isModalOpen.value) hideSearchModal()
  }
}

const handlePopState = (event: PopStateEvent) => {
  if (isModalOpen.value && (!event.state || !event.state.modalOpen)) {
    hideSearchModal()
  }
}

onMounted(() => {
  isMounted.value = true
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('popstate', handlePopState)
})

// Expose show for external usage
const show = () => {
  showSearchModal()
}
defineExpose({ show })
</script>
