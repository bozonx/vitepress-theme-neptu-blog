<script lang="ts" setup>
// see https://github.com/vuejs/vitepress/blob/9b1bb4ffc6423ef0f16a213133980fdb6e9bf552/src/client/theme-default/components/VPNavScreenTranslations.vue
import { useData } from 'vitepress'
import { useLangs } from 'vitepress/dist/client/theme-default/composables/langs.js'

import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import { Icon } from '@iconify/vue'

const { theme } = useData()
const { localeLinks, currentLang } = useLangs({ correspondingLink: true })
const props = defineProps<{ noBg?: boolean | string }>()
// redirect from specific tag to tags list
const resolveLink = (link: string) => {
  if (!link) return link

  const splat = link.split('/')

  if (splat[2] === theme.value.tagsBaseUrl) {
    return `/${splat[1]}/${theme.value.tagsBaseUrl}`
  }

  return link
}
</script>

<template>
  <DropdownButton
    v-if="localeLinks.length && currentLang.label"
    :no-bg="props.noBg"
    :title="theme.langMenuLabel || 'Change language'"
    class="switch-lang-btn px-0"
  >
    <template #btn-text>
      <span class="pt-1" aria-hidden="true">
        <Icon
          alt="Translation icon"
          icon="material-symbols:translate"
          width="1.2rem"
          height="1.2rem"
        />
      </span>
    </template>
    <template v-for="locale in localeLinks" :key="locale.link">
      <MenuItem
        v-if="!locale.text"
        :disabled="true"
        :title="theme.t.currentLang"
      >
        {{ currentLang.label }}
      </MenuItem>
      <MenuItem
        v-else
        target="_self"
        :href="resolveLink(locale.link)"
      >
        {{ locale.text }}
      </MenuItem>
    </template>
  </DropdownButton>
</template>

<style scoped>
</style>
