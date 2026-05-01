export const DEFAULT_UI_LOCALE = 'en'
export const DEFAULT_UI_LOCALE_STORAGE_KEY = 'neptu-ui-locale'

export const BUILTIN_UI_LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
}

export interface ResolveUiLocaleKeyParams {
  availableLocales: string[]
  contentLocale?: string
  preferredLocale?: string | null
  defaultLocale?: string
}

export interface UiLocaleOption {
  key: string
  label: string
}

interface UiLocaleLabelSource {
  label?: string
}

type UiLocaleLabelsInput = Record<string, string | UiLocaleLabelSource | undefined>

export function resolveUiLocaleKey({
  availableLocales,
  contentLocale,
  preferredLocale,
  defaultLocale,
}: ResolveUiLocaleKeyParams): string {
  const available = new Set(availableLocales)
  const normalizedDefault = defaultLocale || DEFAULT_UI_LOCALE

  if (preferredLocale && available.has(preferredLocale)) {
    return preferredLocale
  }

  if (contentLocale && available.has(contentLocale)) {
    return contentLocale
  }

  const baseFromContent = contentLocale?.split('-')[0]
  if (baseFromContent && available.has(baseFromContent)) {
    return baseFromContent
  }

  if (available.has(normalizedDefault)) {
    return normalizedDefault
  }

  if (available.has(DEFAULT_UI_LOCALE)) {
    return DEFAULT_UI_LOCALE
  }

  return availableLocales[0] || DEFAULT_UI_LOCALE
}

export function readStoredUiLocale(
  storage: Pick<Storage, 'getItem'> | undefined,
  storageKey: string = DEFAULT_UI_LOCALE_STORAGE_KEY
): string | null {
  try {
    return storage?.getItem(storageKey) || null
  } catch {
    return null
  }
}

export function writeStoredUiLocale(
  storage: Pick<Storage, 'setItem'> | undefined,
  locale: string,
  storageKey: string = DEFAULT_UI_LOCALE_STORAGE_KEY
): void {
  try {
    storage?.setItem(storageKey, locale)
  } catch {
    // Ignore storage errors in private mode or locked-down browsers.
  }
}

export function buildUiLocaleOptions(
  availableLocales: string[],
  customLabels: UiLocaleLabelsInput = {}
): UiLocaleOption[] {
  return availableLocales.map((key) => ({
    key,
    label:
      (typeof customLabels[key] === 'string'
        ? customLabels[key]
        : customLabels[key]?.label) ||
      BUILTIN_UI_LOCALE_LABELS[key] ||
      key,
  }))
}
