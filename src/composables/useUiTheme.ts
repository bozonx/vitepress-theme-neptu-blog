import { useData } from 'vitepress'
import { computed, type ComputedRef } from 'vue'
import type { ThemeConfig } from '../types.d.ts'

export function useUiTheme(): {
  theme: ComputedRef<ThemeConfig>
} {
  const { theme: baseTheme } = useData<ThemeConfig>()

  return {
    theme: computed(() => baseTheme.value),
  }
}
