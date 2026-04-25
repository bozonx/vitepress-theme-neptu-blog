<script setup lang="ts">
import { useData } from 'vitepress'
import { ref } from 'vue'

import PageContent from '../components/PageContent.vue'
import Aside from '../components/layout/Aside.vue'
import Footer from '../components/layout/Footer.vue'
import SideBar from '../components/layout/SideBar.vue'
import ToTheTop from '../components/layout/ToTheTop.vue'
import TopBar from '../components/layout/TopBar.vue'
import { useBreakpoint } from '../composables/useBreakpoint.ts'
import { useScrollY } from '../composables/useScrollY.ts'
import { useSwipeDrawer } from '../composables/useSwipeDrawer.ts'
import { resolveBodyMarker } from '../helpers/helpers.ts'

const { theme, frontmatter } = useData()
const { isMobile } = useBreakpoint()
const { scrollY } = useScrollY()
const sidebarRef = ref<InstanceType<typeof SideBar> | null>(null)
const bodyMarker = resolveBodyMarker(theme.value, frontmatter.value)

useSwipeDrawer({
  enabled: () => isMobile.value,
  onOpen: () => sidebarRef.value?.openDrawer(),
  onClose: () => sidebarRef.value?.handleLeftSwipe(),
})
</script>

<template>
  <div class="min-h-screen lg:flex w-full">
    <!--  left col-->
    <SideBar ref="sidebarRef" :is-mobile="isMobile">
      <template v-if="$slots['sidebar-top']" #sidebar-top>
        <slot name="sidebar-top" />
      </template>
      <template v-if="$slots['sidebar-middle']" #sidebar-middle>
        <slot name="sidebar-middle" />
      </template>
      <template v-if="$slots['sidebar-bottom']" #sidebar-bottom>
        <slot name="sidebar-bottom" />
      </template>
      <template v-if="$slots['sub-sidebar']" #sub-sidebar>
        <slot name="sub-sidebar" />
      </template>
    </SideBar>
    <!-- right col-->
    <div class="flex-1 flex flex-col min-h-screen">
      <header>
        <TopBar :is-mobile="isMobile" @open-drawer="() => sidebarRef?.openDrawer()">
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
              <template v-if="$slots['footer-before']" #footer-before>
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

    <ToTheTop :scroll-y="scrollY" :is-mobile="isMobile" />
  </div>
</template>

<style scoped>
.app-page {
  width: 100%;
  max-width: var(--page-max-width);
}
</style>
