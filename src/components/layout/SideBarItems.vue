<script setup lang="ts">
import SideBarHeader from './SideBarHeader.vue'
import MenuItem from '../MenuItem.vue'

const props = defineProps(['items', 'isMobile'])
</script>

<template>
  <ul v-if="props.items?.length" class="space-y-1">
    <template v-for="item in props.items">
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
