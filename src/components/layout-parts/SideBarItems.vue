<script setup lang="ts">
import SideBarHeader from './SideBarHeader.vue'
import MenuItem from '../MenuItem.vue'

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
  items: SideBarItem[]
  isMobile?: boolean
}>()
</script>

<template>
  <ul v-if="props.items?.length" class="space-y-1">
    <template v-for="(item, index) in props.items" :key="item.href || item.header || index">
      <li :class="{ hidden: item.mobile ? !props.isMobile : false }">
        <SideBarHeader
          v-if="item.header"
          :text="item.header"
          :href="item.href"
          :icon="item.icon"
          :class="item.class"
        />
        <MenuItem v-else v-bind="item" active-compare-method="softPagination" />
      </li>
    </template>
  </ul>
</template>
