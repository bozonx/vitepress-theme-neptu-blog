<script setup lang="ts">
import Btn from '../Btn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import SwitchLang from './SwitchLang.vue'
import { useUiTheme } from '../../composables/useUiLocale.ts'

const { theme } = useUiTheme()
const props = defineProps<{
  isMobile?: boolean
}>()
const emit = defineEmits<{
  (e: 'openSearch'): void
  (e: 'openDrawer'): void
}>()
interface LinkItem {
  desktopOnly?: boolean
  mobileOnly?: boolean
  class?: string
  iconClass?: string
  text?: string
  href?: string
  icon?: string
}

const resolveItemShowClass = (item: LinkItem) => {
  if (item.desktopOnly) return 'max-lg:hidden'
  else if (item.mobileOnly) return 'lg:hidden'
  // both
  return ''
}
const links: LinkItem[] = [...(theme.value.topBar?.links || [])]
if (theme.value.topBar?.donate && theme.value.donate) {
  links.push({
    text: theme.value.t.links.donate,
    href: `${theme.value.donate.url}`,
    icon: theme.value.donate.icon || theme.value.donateIcon,
    iconClass: 'donate-icon',
  })
}
const socialLinks: LinkItem[] = (theme.value.topBar?.socialLinks || []).map((item) => ({
  href: item.url || item.link,
  icon: item.icon,
  class: item.class,
  desktopOnly: item.desktopOnly,
  mobileOnly: item.mobileOnly,
})).filter((item) => Boolean(item.href))
</script>

<template>
  <nav
    :class="[
      'flex w-full py-2 px-2 gap-x-1 top-bar pl-[0.675rem]',
      props.isMobile && 'fixed z-[1] topbar--mobile bg-[var(--topbar-mobile-bg)] border-b border-[var(--topbar-mobile-border)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.07)] dark:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.2)]',
    ]"
  >
    <div class="flex-1 flex gap-x-3">
      <Btn
        icon="fa6-solid:bars"
        :no-bg="true"
        class="lg:hidden px-[0.7rem]"
        icon-class="muted"
        :text="theme.sidebarMenuLabel"
        @click="emit('openDrawer')"
      />

      <slot name="nav-bar-content-before" />
    </div>

    <ul v-if="links.length" class="flex space-x-1">
      <li v-for="(item, index) in links" :key="item.href || index" :class="resolveItemShowClass(item)">
        <Btn
          v-bind="item"
          :no-bg="true"
          :class="[item.class, 'px-[0.7rem]']"
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

    <ul v-if="socialLinks.length" class="flex space-x-1">
      <li
        v-for="(item, index) in socialLinks"
        :key="item.href || index"
        :class="resolveItemShowClass(item)"
      >
        <Btn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>
  </nav>
</template>
