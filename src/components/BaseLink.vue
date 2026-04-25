<script setup lang="ts">
// Internal component — consumed by other components only.
import { useData, useRoute } from 'vitepress'
import { ref, watch, computed } from 'vue'
import { resolveI18Href, isExternalUrl } from '../utils/shared/index.ts'

interface Props {
  customClass?: unknown
  tag?: string
  href?: string
  target?: string
  disabled?: boolean
  activeCompareMethod?: 'soft' | 'pagination' | 'softPagination' | 'none' | 'strict'
}

const { theme, localeIndex } = useData()
const route = useRoute()
const props = defineProps<Props>()
// Реактивные вычисляемые свойства
const resolvedHref = computed(() =>
  resolveI18Href(props.href || '', localeIndex.value, theme.value.i18nRouting)
)
const isExternal = computed(() => isExternalUrl(props.href))
const tag = computed(() => props.tag || 'a')
const target = computed(() => {
  if (tag.value === 'a') {
    if (typeof props.target === 'undefined') {
      return isExternal.value ? '_blank' : props.target
    } else {
      return props.target
    }
  }
  return undefined
})
// Normalize path — removes the trailing numeric segment if path ends with /\d+
const normalizePath = (path = '') => {
  // Check if path ends with a slash followed by digits
  const match = path.match(/^(.+\/)\d+$/)
  return match ? match[1] : path
}

const active = ref(checkActive())

function checkActive(): boolean {
  switch (props.activeCompareMethod) {
    case 'soft':
      return route.path.startsWith(resolvedHref.value)

    case 'pagination': {
      const routeEndsWithDigit = /\d+$/.test(route.path)

      if (routeEndsWithDigit) {
        const hrefEndsWithDigit = /\d+$/.test(resolvedHref.value)
        if (!hrefEndsWithDigit) return false

        const normalizedRoutePath = normalizePath(route.path)
        const normalizedHref = normalizePath(resolvedHref.value)
        return normalizedRoutePath === normalizedHref
      }
      return route.path.startsWith(resolvedHref.value)
    }

    case 'softPagination': {
      const normalizedHrefForSoft = normalizePath(resolvedHref.value)
      return route.path.startsWith(normalizedHrefForSoft)
    }

    case 'none':
      return false

    case 'strict':
      return route.path === resolvedHref.value

    default:
      return route.path === resolvedHref.value
  }
}

watch(
  () => route.path,
  () => {
    active.value = checkActive()
  }
)
</script>

<template>
  <component
    :is="tag"
    :target="target"
    :href="resolvedHref"
    :disabled="props.disabled"
    :class="[active && 'active', props.customClass]"
  >
    <slot />
  </component>
</template>
