<script setup lang="ts">
import { useData } from 'vitepress'
import { useAttrs, computed } from 'vue'
import { isExternalUrl } from '../utils/shared/index.ts'
import BaseLink from './BaseLink.vue'

interface Props {
  customClass?: unknown
  hideExternalIcon?: boolean
}

const props = defineProps<Props>()
const $attrs = useAttrs()

const { theme } = useData()
const isExternal = computed(
  () => !props.hideExternalIcon && isExternalUrl($attrs.href as string | undefined)
)
</script>

<template>
  <BaseLink
    v-bind="$attrs"
    :custom-class="[
      'simple-link',
      theme.externalLinkIcon && isExternal && 'vp-external-link-icon',
      props.customClass,
    ]"
  >
    <slot />
  </BaseLink>
</template>

<style>
.simple-link {
  text-decoration: underline;
  color: var(--link-a-text);
}

.simple-link:visited {
  color: var(--link-a-visited);
}

.simple-link:hover {
  filter: brightness(130%);
}
</style>
