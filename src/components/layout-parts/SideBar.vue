<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, watch, inject, onUnmounted, computed } from 'vue'

import { SIDEBAR_WIDTH } from '../../constants.ts'
import SideBarFooter from './SideBarFooter.vue'
import SideBarGroup from './SideBarGroup.vue'
import SideBarItems from './SideBarItems.vue'
import { Icon } from '@iconify/vue'
import SideBarTags from './SideBarTags.vue'

interface PostLite {
  url: string
  title?: string
  date?: string | number | Date
  tags?: Array<{ slug?: string; name?: string }>
  authorId?: string
  [key: string]: unknown
}

const props = defineProps<{
  isMobile: boolean
  localePosts?: PostLite[]
}>()
const { theme, localeIndex } = useData()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
const animationTimeMs = 400
const drawerOpen = ref(!props.isMobile)
const animationLeftPx = ref(-SIDEBAR_WIDTH)
const backdropOpacity = ref(0)
let animationTimeout: ReturnType<typeof setTimeout> | null = null

const sideBarConfig = theme.value.sideBar || {}

const links = computed(() => {
  const cfg = theme.value.sideBar || {}
  return cfg
    ? [
        ...(cfg.links || []),

        cfg.recent && {
          text: theme.value.t.links.recent,
          href: `${theme.value.recentBaseUrl}/1`,
          icon: theme.value.recentIcon,
        },
        cfg.popular && {
          text: theme.value.t.links.popular,
          href: `${theme.value.popularBaseUrl}/1`,
          icon: theme.value.popularIcon,
        },
        cfg.archive && {
          text: theme.value.t.links.byDate,
          href: `${theme.value.archiveBaseUrl}`,
          icon: theme.value.byDateIcon,
        },
        cfg.authors && {
          text: theme.value.t.links.authors,
          href: `${theme.value.authorsBaseUrl}`,
          icon: theme.value.authorsIcon,
        },
      ].filter(Boolean)
    : []
})

const bottomLinks = computed(() => {
  const cfg = theme.value.sideBar || {}
  return cfg
    ? [
        ...(cfg.bottomLinks || []),
        cfg.donate && {
          text: theme.value.t.links.donate,
          href: `${theme.value.donate.url}`,
          icon: theme.value.donate.icon || theme.value.donateIcon,
          iconClass: 'donate-icon',
        },
      ].filter(Boolean)
    : []
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
      class="max-lg:overflow-y-auto max-lg:overflow-x-clip max-lg:fixed lg:h-fit app-drawer"
    >
      <div>
        <a
          v-if="theme.sidebarLogoSrc"
          :href="`/${localeIndex}/`"
          class="sidebar-logo"
          :title="theme.t.toHome"
        >
          <img
            :src="theme.sidebarLogoSrc"
            loading="lazy"
            width="320"
            height="158"
            aria-hidden="true"
          />
        </a>
        <h4 v-if="theme.siteTitle" class="sidebar-site-title text-sm muted">
          <a :href="`/${localeIndex}/`" :title="theme.t.toHome">
            {{ theme.siteTitle }}
          </a>
        </h4>

        <div class="sidebar-menu">
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

      <div class="sidebar-gradient max-lg:hidden" aria-hidden="true">
        <div></div>
      </div>
    </div>
    <div
      :style="{ opacity: backdropOpacity }"
      class="lg:hidden app-drawer-backdrop"
      @click="closeDrawer"
    >
      <div class="sidebar-closebtn-wrapper">
        <button
          :title="theme.t.closeMenu"
          class="py-6 px-6 cursor-pointer text-gray-300 hover:text-white"
          @click.prevent.stop="closeDrawer"
        >
          <Icon icon="fa6-solid:xmark" class="text-2xl" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div v-if="$slots['sub-sidebar']" class="max-lg:hidden sub-sidebar">
      <slot name="sub-sidebar" />
    </div>
  </div>
</template>

<style scoped>
.app-drawer {
  border-right: 1px solid var(--drawer-border-color);
  background: var(--drawer-bg);
  box-sizing: content-box;
  z-index: 10;
  top: 0;
  bottom: 0;
  transition: left 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.app-drawer-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--backdrop-bg);
  z-index: 9;
  cursor: pointer;
  transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-closebtn-wrapper {
  position: absolute;
  height: 0;
  right: 0;
}

.sidebar-gradient {
  width: 100%;
  position: relative;
  height: 200px;
}

.sidebar-gradient div {
  width: calc(100% + 1px);
  height: 200px;
  position: absolute;
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

.sidebar-menu {
  padding-top: 0.25rem;
}

.sidebar-logo {
  display: block;
}

.sidebar-site-title {
  font-weight: bold;
  padding: 0.35rem 0.25rem 0.75rem 0.65rem;
}

.sub-sidebar {
  margin-top: 20rem;
  display: flex;
  width: 100%;
  flex-direction: column;
  row-gap: calc(var(--spacing) * 4);
  justify-content: center;
}
</style>
