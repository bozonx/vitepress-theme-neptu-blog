<script setup lang="ts">
///// Не используется как отдельный компонент, используется в других компонентах
import { useData, useRoute } from 'vitepress'
import { ref, watchEffect, computed } from 'vue'
import { resolveI18Href, isExternalUrl } from '../helpers/helpers.js'

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
// Функция для нормализации пути - убирает последний элемент если путь заканчивается на /\d+
const normalizePath = (path = '') => {
  // Проверяем, заканчивается ли путь на слеш и цифры
  const match = path.match(/^(.+\/)\d+$/)
  return match ? match[1] : path
}

let prevPath = route.path
const active = ref(checkActive())

function checkActive(): boolean {
  prevPath = route.path

  switch (props.activeCompareMethod) {
    case 'soft':
      // Используется startsWith()
      return route.path.startsWith(resolvedHref.value)

    case 'pagination':
      // Учитывается число на конце
      const routeEndsWithDigit = /\d+$/.test(route.path)

      if (routeEndsWithDigit) {
        // Если текущий путь заканчивается цифрой, то href тоже должен заканчиваться цифрой
        const hrefEndsWithDigit = /\d+$/.test(resolvedHref.value)
        if (!hrefEndsWithDigit) {
          return false
        }

        // Сравниваем пути без цифр на конце
        const normalizedRoutePath = normalizePath(route.path)
        const normalizedHref = normalizePath(resolvedHref.value)
        return normalizedRoutePath === normalizedHref
      } else {
        // Если текущий путь не заканчивается цифрой, используем обычное сравнение
        return route.path.startsWith(resolvedHref.value)
      }

    case 'softPagination':
      // Убираем цифру в конце path если она есть и сравниваем с route.path
      const normalizedHrefForSoft = normalizePath(resolvedHref.value)
      return route.path.startsWith(normalizedHrefForSoft)

    case 'none':
      // Отключает определение активного элемента
      return false

    case 'strict':
      // Строгое сравнение один к одному
      return route.path === resolvedHref.value

    default:
      // По умолчанию используем строгое сравнение
      return route.path === resolvedHref.value
  }
}

watchEffect(async () => {
  if (route.path !== prevPath) {
    active.value = checkActive()
  }
})
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
