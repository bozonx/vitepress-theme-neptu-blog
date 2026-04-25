<template>
  <div @click="showSearchModal" class="pagefind-search-wrapper">
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { GLOBAL_MODALS_CONTAINER_ID } from '../../constants.js'

const MODAL_ID = 'search-modal'
const CLOSE_BUTTON_CLASS = 'search-modal-close-button'
const MOBILE_CLOSE_BUTTON_CLASS = 'search-modal-mobile-close-button'
const pageFind = ref(null)
// Флаг для отслеживания состояния модального окна
const isModalOpen = ref(false)

// Внешняя функция для показа модального окна поиска
const show = () => {
  showSearchModal()
}

// Экспортируем функцию show для использования извне
defineExpose({ show })

const showSearchModal = () => {
  const searchModal = document.getElementById(MODAL_ID)

  if (searchModal) {
    // Показываем модальное окно и добавляем классы для анимации
    searchModal.style.display = 'flex'
    searchModal.classList.add('active', 'fade-in')
    isModalOpen.value = true

    // Добавляем класс modal-open к body для блокировки скролла
    document.body.classList.add('modal-open')

    // Добавляем запись в историю браузера для обработки кнопки "Назад"
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
      )
      searchInput.focus()
    }, 100)
  } else {
    console.warn('Search modal not found')
  }
}

const hideSearchModal = () => {
  const searchModal = document.getElementById(MODAL_ID)

  if (searchModal) {
    // Добавляем анимацию исчезновения
    searchModal.classList.remove('fade-in')
    searchModal.classList.add('fade-out')

    // Ждем завершения анимации перед скрытием
    setTimeout(() => {
      searchModal.style.display = 'none'
      searchModal.classList.remove('active', 'fade-out')
      isModalOpen.value = false

      // Удаляем класс modal-open с body для разблокировки скролла
      document.body.classList.remove('modal-open')
    }, 300) // 300ms = длительность анимации
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

  // Добавляем содержимое модального окна
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

  searchModal.addEventListener('click', (e) => {
    if (
      e.target === searchModal ||
      e.target.classList.contains(CLOSE_BUTTON_CLASS) ||
      e.target.classList.contains(MOBILE_CLOSE_BUTTON_CLASS) ||
      e.target.classList.contains('pagefind-ui__result-link')
    ) {
      hideSearchModal()
    }
  })

  document.getElementById(GLOBAL_MODALS_CONTAINER_ID).appendChild(searchModal)
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (isModalOpen.value) hideSearchModal()
  }
}

// Обработчик события popstate для кнопки "Назад" браузера
const handlePopState = (event) => {
  // Если модальное окно открыто и пользователь нажал "Назад"
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
