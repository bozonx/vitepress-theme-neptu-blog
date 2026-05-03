<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, watch, inject, onUnmounted, computed } from 'vue'

import { SIDEBAR_WIDTH } from '../../constants.ts'
import SideBarFooter from './SideBarFooter.vue'
import SideBarGroup from './SideBarGroup.vue'
import SideBarItems from './SideBarItems.vue'
import { Icon } from '@iconify/vue'
import SideBarTags from './SideBarTags.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

interface SideBarItem {
  header?: string
  href?: string
  icon?: string
  class?: string
  mobile?: boolean
  text?: string
  title?: string
}

const props = defineProps<{
  isMobile: boolean
  localePosts?: PostLite[]
}>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const animationTimeMs = 400
const drawerOpen = ref(!props.isMobile)
const animationLeftPx = ref(-SIDEBAR_WIDTH)
const backdropOpacity = ref(0)
let animationTimeout: ReturnType<typeof setTimeout> | null = null

const sideBarConfig = theme.value.sideBar || {}
const links = computed<SideBarItem[]>(() => {
  const cfg = theme.value.sideBar || {}
  const items: SideBarItem[] = [...(cfg.links || [])]

  if (cfg.recent) {
    items.push({
      text: theme.value.t.links.recent,
      href: `${theme.value.recentBaseUrl}/1`,
      icon: theme.value.recentIcon,
    })
  }
  if (cfg.popular) {
    items.push({
      text: theme.value.t.links.popular,
      href: `${theme.value.popularBaseUrl}/1`,
      icon: theme.value.popularIcon,
    })
  }
  if (cfg.archive) {
    items.push({
      text: theme.value.t.links.byDate,
      href: `${theme.value.archiveBaseUrl}`,
      icon: theme.value.byDateIcon,
    })
  }
  if (cfg.authors) {
    items.push({
      text: theme.value.t.links.authors,
      href: `${theme.value.authorsBaseUrl}`,
      icon: theme.value.authorsIcon,
    })
  }

  return items
})

const bottomLinks = computed<SideBarItem[]>(() => {
  const cfg = theme.value.sideBar || {}
  const items: SideBarItem[] = [...(cfg.bottomLinks || [])]

  if (cfg.donate && theme.value.donate) {
    items.push({
      text: theme.value.t.links.donate,
      href: `${theme.value.donate.url}`,
      icon: theme.value.donate.icon || theme.value.donateIcon,
      class: 'donate-icon',
    })
  }

  return items
})
const openDrawer = () => {
  if (!props.isMobile || drawerOpen.value) return

  drawerOpen.value = true

  // Small delay to guarantee CSS transition fires
  setTimeout(() => {
    animationLeftPx.value = 0
    backdropOpacity.value = 1
  }, 10)
}

const closeDrawer = () => {
  if (!props.isMobile || !drawerOpen.value) return

  animationLeftPx.value = -SIDEBAR_WIDTH
  backdropOpacity.value = 0

  if (animationTimeout) clearTimeout(animationTimeout)

  animationTimeout = setTimeout(() => {
    drawerOpen.value = false
    animationTimeout = null
  }, animationTimeMs)
}

defineExpose({
  openDrawer,
  handleLeftSwipe() {
    if (props.isMobile) closeDrawer()
  },
})

watch(
  () => props.isMobile,
  (isMobile) => {
    drawerOpen.value = !isMobile
  }
)

onUnmounted(() => {
  if (animationTimeout) clearTimeout(animationTimeout)
})
</script>

<template>
  <div :class="{ hidden: !drawerOpen }">
    <div
      :style="{
        left: props.isMobile ? `${animationLeftPx}px` : '0',
        width: `${SIDEBAR_WIDTH}px`,
      }"
      class="max-lg:overflow-y-auto max-lg:overflow-x-clip max-lg:fixed lg:h-fit app-drawer z-10 top-0 bottom-0 transition-[left] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
    >
      <div>
        <a
          v-if="theme.sidebarLogoSrc"
          :href="`/${localeIndex}/`"
          class="sidebar-logo block"
          :title="theme.t.toHome"
        >
          <img
            :src="theme.sidebarLogoSrc"
            loading="lazy"
            decoding="async"
            width="320"
            :height="theme.sidebarLogoHeight || 158"
            class="max-w-full h-auto"
            aria-hidden="true"
          />
        </a>
        <h4 v-if="theme.siteTitle" class="sidebar-site-title text-sm muted font-bold px-1 pt-[0.35rem] pb-3 pl-[0.65rem]">
          <a :href="`/${localeIndex}/`" :title="theme.t.toHome">
            {{ theme.siteTitle }}
          </a>
        </h4>

        <div class="sidebar-menu pt-1">
          <slot name="sidebar-top" />

          <SideBarGroup v-if="links.length">
            <SideBarItems
              :items="links"
              :is-mobile="props.isMobile"
              @click="closeDrawer"
            />
          </SideBarGroup>

          <SideBarGroup v-if="sideBarConfig.tags">
            <SideBarTags :locale-posts="localePosts" @item-click="closeDrawer" />
          </SideBarGroup>

          <slot name="sidebar-middle" />

          <SideBarGroup v-if="bottomLinks.length" class="mt-2">
            <SideBarItems
              :items="bottomLinks"
              :is-mobile="props.isMobile"
              @click="closeDrawer"
            />
          </SideBarGroup>

          <slot name="sidebar-bottom" />
        </div>
      </div>

      <SideBarFooter @click="closeDrawer" />

      <div class="sidebar-gradient max-lg:hidden w-full relative h-[200px]" aria-hidden="true">
        <div class="w-[calc(100%+1px)] h-[200px] absolute"></div>
      </div>
    </div>
    <div
      :style="{ opacity: backdropOpacity }"
      class="lg:hidden app-drawer-backdrop fixed inset-0 z-[9] cursor-pointer transition-opacity duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      @click="closeDrawer"
    >
      <div class="sidebar-closebtn-wrapper absolute h-0 right-0">
        <button
          :title="theme.t.closeMenu"
          class="py-6 px-6 cursor-pointer text-gray-300 hover:text-white"
          @click.prevent.stop="closeDrawer"
        >
          <Icon icon="fa6-solid:xmark" class="text-2xl" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div v-if="$slots['sub-sidebar']" class="max-lg:hidden sub-sidebar mt-80 flex w-full flex-col justify-center gap-y-4">
      <slot name="sub-sidebar" />
    </div>
  </div>
</template>

<style scoped>
.app-drawer {
  border-right: 1px solid var(--drawer-border-color);
  background: var(--drawer-bg);
  box-sizing: content-box;
}

.app-drawer-backdrop {
  background: var(--backdrop-bg);
}

.sidebar-gradient div {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}

.dark .sidebar-gradient div {
  background: rgb(17, 24, 39);
  background: linear-gradient(
    0deg,
    var(--gray-900) 0%,
    var(--gray-900-trans) 100%
  );
}

</style>
