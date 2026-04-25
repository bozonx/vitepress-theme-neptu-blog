<script setup>
import { inBrowser, useData } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'

import BlogHomeLayout from './BlogHomeLayout.vue'
import PageContent from './components/PageContent.vue'
import Aside from './components/layout/Aside.vue'
import Footer from './components/layout/Footer.vue'
import NotFound from './components/layout/NotFound.vue'
import SideBar from './components/layout/SideBar.vue'
import ToTheTop from './components/layout/ToTheTop.vue'
import TopBar from './components/layout/TopBar.vue'
import { MOBILE_BREAKPOINT, SWIPE_OFFSET } from './constants.js'
import { isHomePage, resolveBodyMarker } from './helpers/helpers.js'

const { page, theme, frontmatter } = useData()
const windowWidth = ref(0)
const isMobile = ref(true)
const scrollY = ref(0)
const touchInitialX = ref(null)
const touchInitialY = ref(null)
const sidebarRef = ref(null)
const gestureProcessed = ref(false)
const bodyMarker = resolveBodyMarker(theme.value, frontmatter.value)
let resizeListener
let scrollListener
let touchStartListener
let touchMoveListener
let touchEndListener
let touchCancelListener
let keydownListener

function onOpenDrawer() {
  sidebarRef.value.openDrawer()
}

function startTouch(e) {
  // Обрабатываем жесты только на мобильных устройствах
  if (!isMobile.value) return

  const touch = e.touches[0]
  touchInitialX.value = touch.clientX
  touchInitialY.value = touch.clientY
  gestureProcessed.value = false
}

function moveTouch(e) {
  // Обрабатываем жесты только на мобильных устройствах
  if (!isMobile.value || touchInitialX.value === null || gestureProcessed.value)
    return

  const touch = e.touches[0]
  const currentX = touch.clientX
  const currentY = touch.clientY
  const dx = currentX - touchInitialX.value
  const dy = currentY - touchInitialY.value

  // Проверяем, что движение достаточно горизонтальное (не вертикальное)
  if (Math.abs(dy) > Math.abs(dx)) {
    resetTouch()
    return
  }

  if (Math.abs(dx) < SWIPE_OFFSET) {
    return
  }

  // Помечаем жест как обработанный, чтобы избежать повторных вызовов
  gestureProcessed.value = true

  // Определяем направление свайпа
  if (dx > 0) {
    // Свайп вправо - открываем меню только если начали с левого края экрана
    if (touchInitialX.value <= 50 && sidebarRef.value) {
      // Проверяем, можно ли отменить событие
      if (e.cancelable) {
        e.preventDefault()
      }
      sidebarRef.value.openDrawer()
      resetTouch()
    }
  } else {
    // Свайп влево - закрываем меню
    if (sidebarRef.value) {
      // Проверяем, можно ли отменить событие
      if (e.cancelable) {
        e.preventDefault()
      }
      sidebarRef.value.handleLeftSwipe()
      resetTouch()
    }
  }
}

function resetTouch() {
  touchInitialX.value = null
  touchInitialY.value = null
  gestureProcessed.value = false
}

onMounted(() => {
  if (!inBrowser) return

  windowWidth.value = window.innerWidth
  isMobile.value = windowWidth.value < MOBILE_BREAKPOINT

  resizeListener = window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < MOBILE_BREAKPOINT
  })

  scrollListener = window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })

  touchStartListener = window.addEventListener('touchstart', startTouch, {
    passive: true,
  })
  touchMoveListener = window.addEventListener('touchmove', moveTouch, {
    passive: false,
  })
  touchEndListener = window.addEventListener('touchend', resetTouch, {
    passive: true,
  })
  touchCancelListener = window.addEventListener('touchcancel', resetTouch, {
    passive: true,
  })
})
onUnmounted(() => {
  if (!inBrowser) return

  window.removeEventListener('resize', resizeListener)
  window.removeEventListener('scroll', scrollListener)
  window.removeEventListener('touchstart', touchStartListener)
  window.removeEventListener('touchmove', touchMoveListener)
  window.removeEventListener('touchend', touchEndListener)
  window.removeEventListener('touchcancel', touchCancelListener)
  window.removeEventListener('keydown', keydownListener)
})
</script>

<template>
  <div id="modals"></div>

  <div v-if="page.isNotFound">
    <NotFound />
  </div>

  <Content v-else-if="frontmatter.layout === false" />

  <BlogHomeLayout v-else-if="isHomePage(frontmatter)" :scrollY="scrollY" />

  <!-- This is default layout -->
  <div v-else class="min-h-screen lg:flex w-full">
    <!--  left col-->
    <SideBar ref="sidebarRef" :isMobile="isMobile">
      <template #sidebar-top v-if="$slots['sidebar-top']">
        <slot name="sidebar-top" />
      </template>
      <template #sidebar-middle v-if="$slots['sidebar-middle']">
        <slot name="sidebar-middle" />
      </template>
      <template #sidebar-bottom v-if="$slots['sidebar-bottom']">
        <slot name="sidebar-bottom" />
      </template>
      <template #sub-sidebar v-if="$slots['sub-sidebar']">
        <slot name="sub-sidebar" />
      </template>
    </SideBar>
    <!-- right col-->
    <div class="flex-1 flex flex-col min-h-screen">
      <header>
        <TopBar @open-drawer="onOpenDrawer" :isMobile="isMobile">
          <template #nav-bar-content-before>
            <slot name="nav-bar-content-before" />
          </template>
        </TopBar>
      </header>

      <div class="flex flex-1">
        <main
          class="lg:ml-4 xl:ml-24 mt-20 lg:mt-4 px-4 sm:px-8 app-page flex flex-col"
        >
          <div class="flex-1" v-bind="bodyMarker ? { [bodyMarker]: true } : {}">
            <PageContent />
          </div>

          <div class="mt-30 pb-12">
            <Footer>
              <template #footer-before v-if="$slots['footer-before']">
                <slot name="footer-before" />
              </template>
            </Footer>
          </div>
        </main>

        <Aside>
          <slot name="aside" />
        </Aside>
      </div>
    </div>

    <ToTheTop :scrollY="scrollY" :isMobile="isMobile" />
  </div>
</template>

<style scoped>
.app-page {
  width: 100%;
  max-width: var(--page-max-width);
}
</style>
