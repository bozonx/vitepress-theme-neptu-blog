<script setup lang="ts">
import NeptuBtnLink from "../NeptuBtnLink.vue";
import { useData } from "vitepress";
import { computed } from "vue";

const { theme } = useData();
const footerLinksCount = computed(() => theme.value.footer?.links?.length || 0);
const hasMultipleFooterLinks = computed(
  () => footerLinksCount.value > 1
);
</script>

<template>
  <footer
    v-if="theme.footer"
    class="flex flex-wrap w-full items-start justify-between gap-x-10 gap-y-6 text-sm muted"
  >
    <div
      v-if="theme.footer?.message || theme.footer?.copyright"
      class="min-w-0 flex-1 basis-64"
    >
      <div>{{ theme.footer.message }}</div>
      <div>{{ theme.footer.copyright }}</div>
    </div>

    <nav
      v-if="theme.footer.links?.length"
      :class="[
        'min-w-0',
        hasMultipleFooterLinks ? 'flex-1 basis-64' : 'ml-auto',
      ]"
      aria-label="Footer navigation"
    >
      <ul
        :class="[
          'grid min-w-0 gap-x-9 gap-y-3',
          hasMultipleFooterLinks ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
          hasMultipleFooterLinks ? 'justify-start md:justify-end' : 'justify-end',
        ]"
      >
        <li
          v-for="(item, index) in theme.footer.links"
          :key="item.href + index"
          class="min-w-0"
        >
          <NeptuBtnLink :text="item.text" :href="item.href" class="underline" />
        </li>
      </ul>
    </nav>
  </footer>
</template>
