<script lang="ts" setup>
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import { Icon } from '@iconify/vue'
import { useContentLangs } from '../../composables/useContentLangs.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { theme } = useUiTheme()
const { currentLang, localeLinks } = useContentLangs({ correspondingLink: true })
const props = defineProps<{ noBg?: boolean | string }>()
</script>

<template>
  <DropdownButton
    v-if="localeLinks.length"
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
    <MenuItem :disabled="true" :title="theme.t.currentLang">
      {{ currentLang.label || theme.t.currentLang }}
    </MenuItem>
    <template v-for="locale in localeLinks" :key="locale.link">
      <MenuItem target="_self" :href="locale.link">
        {{ locale.text }}
      </MenuItem>
    </template>
  </DropdownButton>
</template>
