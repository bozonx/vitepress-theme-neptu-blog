<script lang="ts" setup>
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import { Icon } from '@iconify/vue'
import { useUiTheme } from '../../composables/useUiLocale.ts'

const { theme, availableUiLocales, currentUiLocaleKey, currentUiLocaleLabel, setUiLocale } =
  useUiTheme()
const props = defineProps<{ noBg?: boolean | string }>()
</script>

<template>
  <DropdownButton
    v-if="availableUiLocales.length"
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
      {{ currentUiLocaleLabel }}
    </MenuItem>
    <template v-for="locale in availableUiLocales" :key="locale.key">
      <MenuItem
        :disabled="locale.key === currentUiLocaleKey"
        @click="setUiLocale(locale.key)"
      >
        {{ locale.label }}
      </MenuItem>
    </template>
  </DropdownButton>
</template>
