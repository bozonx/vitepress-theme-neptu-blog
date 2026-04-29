<script setup lang="ts">
import { useLangs } from 'vitepress/dist/client/theme-default/composables/langs.js'
import { useUiTheme } from '../../composables/useUiLocale.ts'
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'

const { theme } = useUiTheme()
const { localeLinks, currentLang } = useLangs({ correspondingLink: true })
</script>

<template>
  <DropdownButton
    v-if="localeLinks.length"
    :title="theme.t.viewInAnotherLanguage"
    :no-bg="true"
    drop-left
    class="max-w-full"
  >
    <template #btn-text>
      <span class="truncate text-sm">{{ currentLang.label || theme.t.viewInAnotherLanguage }}</span>
    </template>
    <template v-for="locale in localeLinks" :key="locale.link">
      <MenuItem v-if="locale.text" target="_self" :href="locale.link">
        {{ locale.text }}
      </MenuItem>
    </template>
  </DropdownButton>
</template>
