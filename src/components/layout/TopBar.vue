<script setup lang="ts">
import { useData } from 'vitepress'

import Btn from '../Btn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import SwitchLang from './SwitchLang.vue'

const { theme } = useData()
const props = defineProps<{
  isMobile?: boolean
}>()
const emit = defineEmits<{
  (e: 'openSearch'): void
  (e: 'openDrawer'): void
}>()
const resolveItemShowClass = (item: any) => {
  if (item.desktopOnly) return 'max-lg:hidden'
  else if (item.mobileOnly) return 'lg:hidden'
  // both
  return ''
}
const links = theme.value.topBar
  ? [
      ...(theme.value.topBar.links || []),
      theme.value.topBar.donate && {
        text: theme.value.t.links.donate,
        href: `${theme.value.donate.url}`,
        icon: theme.value.donate.icon || theme.value.donateIcon,
        iconClass: 'donate-icon',
      },
    ].filter(Boolean)
  : []
</script>

<template>
  <nav
    :class="[
      'flex w-full py-2 px-2 gap-x-1 top-bar',
      props.isMobile && 'topbar--mobile',
    ]"
  >
    <div class="flex-1 flex gap-x-3">
      <Btn
        icon="fa6-solid:bars"
        :no-bg="true"
        class="lg:hidden topbar-item"
        icon-class="muted"
        :text="theme.sidebarMenuLabel"
        @click="emit('openDrawer')"
      />

      <slot name="nav-bar-content-before" />
    </div>

    <ul v-if="links.length" class="flex space-x-1">
      <li v-for="item in links" :class="resolveItemShowClass(item)">
        <Btn
          v-bind="item"
          :no-bg="true"
          :class="[item.class, 'topbar-item']"
          :icon-class="item.iconClass || 'muted'"
        />
      </li>
    </ul>

    <div class="max-lg:hidden">
      <SwitchLang :no-bg="true" />
    </div>

    <div class="max-lg:hidden">
      <SwitchAppearance />
    </div>

    <ul v-if="theme.topBar?.socialLinks?.length" class="flex space-x-1">
      <li
        v-for="item in theme.topBar.socialLinks"
        :class="resolveItemShowClass(item)"
      >
        <Btn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.top-bar {
  padding-left: 0.675rem;
}

.topbar--mobile {
  display: flex;
  position: fixed;
  z-index: 1;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.07);
  background: var(--topbar-mobile-bg);
  border-bottom: 1px solid var(--topbar-mobile-border);
}

.dark .topbar--mobile {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.topbar-item {
  padding-left: 0.7rem;
  padding-right: 0.7rem;
}
</style>
