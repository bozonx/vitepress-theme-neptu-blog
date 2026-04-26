<template>
  <div class="pagefind-search-wrapper" @click="showSearchModal">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { GLOBAL_MODALS_CONTAINER_ID } from '../../constants.ts'

declare global {
  interface Window {
    PagefindUI: any
  }
}

const MODAL_ID = 'search-modal'
const CLOSE_BUTTON_CLASS = 'search-modal-close-button'
const MOBILE_CLOSE_BUTTON_CLASS = 'search-modal-mobile-close-button'
const pageFind = ref<InstanceType<typeof window.PagefindUI> | null>(null)
// Flag for tracking modal state
const isModalOpen = ref(false)

// External function to show the search modal
const show = () => {
  showSearchModal()
}

// Expose show for external usage
defineExpose({ show })

const showSearchModal = () => {
  const searchModal = document.getElementById(MODAL_ID)

  if (searchModal) {
    // Show modal and add animation classes
    searchModal.style.display = 'flex'
    searchModal.classList.add('active', 'fade-in')
    isModalOpen.value = true

    // Add modal-open class to body to lock scroll
    document.body.classList.add('modal-open')

    // Push browser history entry for Back button handling
    history.pushState({ modalOpen: true }, '', window.location.href)

    if (window.PagefindUI) {
      pageFind.value = new window.PagefindUI({
        element: '#pagefind-search',
        showSubResults: true,
        showImages: true,
      })
    }

    setTimeout(() => {
      const searchInput = searchModal.querySelector(
        '.pagefind-ui__search-input'
      ) as HTMLInputElement
      if (searchInput) searchInput.focus()
    }, 100)
  } else {
    console.warn('Search modal not found')
  }
}

const hideSearchModal = () => {
  const searchModal = document.getElementById(MODAL_ID)

  if (searchModal) {
    // Add fade-out animation
    searchModal.classList.remove('fade-in')
    searchModal.classList.add('fade-out')

    // Wait for animation to finish before hiding
    setTimeout(() => {
      searchModal.style.display = 'none'
      searchModal.classList.remove('active', 'fade-out')
      isModalOpen.value = false

      // Remove modal-open class from body to unlock scroll
      document.body.classList.remove('modal-open')
    }, 300)
  }

  if (pageFind.value) {
    pageFind.value.destroy()
  }
}

const createSearchModal = () => {
  if (document.getElementById(MODAL_ID)) return

  const searchModal = document.createElement('div')
  searchModal.id = MODAL_ID
  searchModal.className = 'search-modal'

  // Add modal content
  searchModal.innerHTML = `
  <div class="search-modal-inner-wrapper">
    <button class="${CLOSE_BUTTON_CLASS}">×</button>
    <div class="search-modal-content">
      <div class="search-modal-top-bar">
        <button class="${MOBILE_CLOSE_BUTTON_CLASS}">×</button>
      </div>
      <div id="pagefind-search"></div>
    </div>
  </div>
  `

  searchModal.addEventListener('click', (e: any) => {
    if (
      e.target === searchModal ||
      e.target.classList.contains(CLOSE_BUTTON_CLASS) ||
      e.target.classList.contains(MOBILE_CLOSE_BUTTON_CLASS) ||
      e.target.classList.contains('pagefind-ui__result-link')
    ) {
      hideSearchModal()
    }
  })

  const container = document.getElementById(GLOBAL_MODALS_CONTAINER_ID)
  if (container) {
    container.appendChild(searchModal)
  }
}

const handleKeydown = (e: any) => {
  if (e.key === 'Escape') {
    if (isModalOpen.value) hideSearchModal()
  }
}

// Handle popstate for the browser Back button
const handlePopState = (event: PopStateEvent) => {
  // If modal is open and user pressed Back
  if (isModalOpen.value && (!event.state || !event.state.modalOpen)) {
    hideSearchModal()
  }
}

onMounted(() => {
  createSearchModal()
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('popstate', handlePopState)
})
</script>
