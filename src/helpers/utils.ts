/** Common utils for using in blog and site */

export function handleFastRedirectToRecentPosts(window: Window): void {
  const locale = window.location.search.slice(1)

  if (locale) window.location.replace(`/${locale}/recent/1`)
}

/**
 * Resolve language by comparing navigator.language with supported locales.
 *
 * - "en" covers en-US.
 * - "es" covers Latin American Spanish (es-419).
 *   All other locales are matched as-is; if no exact match, the short form
 *   (e.g. "ru") is tried. Falls back to "en".
 */
export function resolveNavigatorLang(
  supportedLocales: readonly string[] = [],
  navLang: string = ''
): string {
  const navLangLow = String(navLang).trim().toLowerCase()
  const locales = supportedLocales.map((item) =>
    String(item).trim().toLowerCase()
  )

  if (navLangLow === 'en-us') {
    // en is a default lang for English, it is an en-US
    return 'en'
  } else if (navLangLow === 'es-419') {
    // default "es" means Latin America Spanish
    return 'es'
  }

  if (navLangLow.indexOf('-') > 1) {
    // Language code with country, e.g. en-US
    const foundExact = locales.find((item) => item === navLangLow)

    if (foundExact) return navLangLow
  }

  // No match yet; try the 2-letter short form
  const navLangSlice = navLangLow.slice(0, 2)
  const localesSlice = locales.map((item) => item.slice(0, 2))
  const found = localesSlice.find((item) => item === navLangSlice)

  if (found) return found
  // Fallback to default language
  return 'en'
}
