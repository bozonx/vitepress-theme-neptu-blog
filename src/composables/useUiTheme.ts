import { inBrowser, useData } from 'vitepress'
import {
  computed,
  onMounted,
  shallowRef,
  watch,
  type ComputedRef,
} from 'vue'
import type { DeepPartial, ThemeConfig, UiLocaleDefinition } from '../types.d.ts'
import { deepMerge } from '../utils/shared/merge.ts'
import {
  BUILTIN_UI_LOCALE_LABELS,
  DEFAULT_UI_LOCALE,
  DEFAULT_UI_LOCALE_STORAGE_KEY,
  buildUiLocaleOptions,
  readStoredUiLocale,
  resolveUiLocaleKey,
  writeStoredUiLocale,
  type UiLocaleOption,
} from '../utils/client/uiLocale.ts'

interface LoadedUiLocale {
  key: string
  label: string
  themeConfig: Record<string, any>
  t: Record<string, any>
}

const activeUiLocale = shallowRef<LoadedUiLocale | null>(null)

const initialStoredKey =
  typeof window !== 'undefined'
    ? readStoredUiLocale(window.localStorage, DEFAULT_UI_LOCALE_STORAGE_KEY)
    : null

const activeUiLocaleKey = shallowRef(initialStoredKey || DEFAULT_UI_LOCALE)
let syncToken = 0

const builtInLocaleLoaders: Record<string, () => Promise<any>> = {
  en: async () => (await import('../configs/blogLocalesBase/en.ts')).default,
  ru: async () => (await import('../configs/blogLocalesBase/ru.ts')).default,
}

function normalizeUiLocaleDefinition(raw?: DeepPartial<UiLocaleDefinition>): UiLocaleDefinition {
  return {
    extends: raw?.extends,
    label: raw?.label,
    themeConfig: raw?.themeConfig,
    t: raw?.t,
  }
}

function getAvailableUiLocaleKeys(uiLocales?: Record<string, UiLocaleDefinition>): string[] {
  const set = new Set<string>(Object.keys(BUILTIN_UI_LOCALE_LABELS))
  for (const key of Object.keys(uiLocales || {})) {
    set.add(key)
  }
  return Array.from(set)
}

async function loadBuiltInUiLocale(key: string): Promise<LoadedUiLocale | null> {
  const loader = builtInLocaleLoaders[key]
  if (!loader) return null

  const locale = await loader()
  return {
    key,
    label: locale.label || BUILTIN_UI_LOCALE_LABELS[key] || key,
    themeConfig: locale.themeConfig || {},
    t: locale.t || {},
  }
}

async function resolveLoadedUiLocale(
  key: string,
  uiLocales: Record<string, UiLocaleDefinition> = {},
  visited = new Set<string>()
): Promise<LoadedUiLocale> {
  if (visited.has(key)) {
    return {
      key,
      label: BUILTIN_UI_LOCALE_LABELS[key] || key,
      themeConfig: {},
      t: {},
    }
  }
  visited.add(key)

  const custom = normalizeUiLocaleDefinition(uiLocales[key])
  let base: LoadedUiLocale =
    (await loadBuiltInUiLocale(key)) || {
      key,
      label: custom.label || BUILTIN_UI_LOCALE_LABELS[key] || key,
      themeConfig: {},
      t: {},
    }

  if (custom.extends) {
    base = await resolveLoadedUiLocale(custom.extends, uiLocales, visited)
  }

  return {
    key,
    label: custom.label || base.label || BUILTIN_UI_LOCALE_LABELS[key] || key,
    themeConfig: deepMerge(base.themeConfig, custom.themeConfig || {}),
    t: deepMerge(base.t, custom.t || {}),
  }
}

async function syncUiLocale(
  contentLocale: string,
  themeConfig: ThemeConfig,
  explicitLocale?: string
): Promise<void> {
  const token = ++syncToken
  const uiLocaleSettings = themeConfig.uiLocale || {}
  const storageKey = uiLocaleSettings.storageKey || DEFAULT_UI_LOCALE_STORAGE_KEY
  const availableLocales = getAvailableUiLocaleKeys(themeConfig.uiLocales)
  const storedLocale = inBrowser
    ? readStoredUiLocale(window.localStorage, storageKey)
    : null
  const resolvedKey = resolveUiLocaleKey({
    availableLocales,
    contentLocale,
    preferredLocale: explicitLocale || storedLocale,
    defaultLocale: uiLocaleSettings.default || DEFAULT_UI_LOCALE,
  })

  const loaded = await resolveLoadedUiLocale(resolvedKey, themeConfig.uiLocales || {})
  if (token !== syncToken) return

  activeUiLocaleKey.value = resolvedKey
  activeUiLocale.value = loaded
}

export function getActiveUiLocale(): LoadedUiLocale | null {
  return activeUiLocale.value
}

export function useUiLocaleController(): void {
  const { theme, localeIndex } = useData<ThemeConfig>()

  const runSync = () => syncUiLocale(localeIndex.value, theme.value)

  onMounted(runSync)
  watch(
    [
      localeIndex,
      () => theme.value.uiLocale?.default,
      () => theme.value.uiLocale?.storageKey,
      () => theme.value.uiLocales,
    ],
    runSync,
    { deep: true }
  )
}

export function useUiTheme(): {
  theme: ComputedRef<ThemeConfig>
  currentUiLocaleKey: ComputedRef<string>
  currentUiLocaleLabel: ComputedRef<string>
  availableUiLocales: ComputedRef<UiLocaleOption[]>
  setUiLocale: (key: string) => Promise<void>
} {
  const { theme: baseTheme, localeIndex } = useData<ThemeConfig>()

  const theme = computed(() => {
    if (!activeUiLocale.value) return baseTheme.value
    return deepMerge(baseTheme.value, {
      ...activeUiLocale.value.themeConfig,
      t: activeUiLocale.value.t,
    })
  })

  const availableUiLocales = computed(() => {
    const available = getAvailableUiLocaleKeys(baseTheme.value.uiLocales)
    const customLabels = Object.fromEntries(
      Object.entries(baseTheme.value.uiLocales || {}).map(([key, value]) => [
        key,
        value.label,
      ])
    )
    return buildUiLocaleOptions(available, customLabels)
  })

  const currentUiLocaleKey = computed(() => activeUiLocaleKey.value)
  const currentUiLocaleLabel = computed(() => {
    return (
      activeUiLocale.value?.label ||
      availableUiLocales.value.find((item) => item.key === activeUiLocaleKey.value)?.label ||
      activeUiLocaleKey.value
    )
  })

  const setUiLocale = async (key: string) => {
    const storageKey =
      baseTheme.value.uiLocale?.storageKey || DEFAULT_UI_LOCALE_STORAGE_KEY
    if (inBrowser) {
      writeStoredUiLocale(window.localStorage, key, storageKey)
    }
    await syncUiLocale(localeIndex.value, baseTheme.value, key)
  }

  return {
    theme,
    currentUiLocaleKey,
    currentUiLocaleLabel,
    availableUiLocales,
    setUiLocale,
  }
}
