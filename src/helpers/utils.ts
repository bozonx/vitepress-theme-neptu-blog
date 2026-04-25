/** Common utils for using in blog and site */

export function handleFastRedirectToRecentPosts(window: Window): void {
  const locale = window.location.search.slice(1)

  if (locale) window.location.replace(`/${locale}/recent/1`)
}

/**
 * Resolve language. Compare lang from navigator.language with our languiges
 *
 * - En means en-US
 * - Es means Latin America Spanish - es-419 All other languige we try to compare
 *   as is. If can't find use short form - 'ru'. If can't resolve then return
 *   'en'.
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
    // means lang code and country like en-us
    const foundExact = locales.find((item) => item === navLangLow)

    if (foundExact) return navLangLow
  }

  // if not found or it is short form 2 letters
  const navLangSlice = navLangLow.slice(0, 2)
  const localesSlice = locales.map((item) => item.slice(0, 2))
  const found = localesSlice.find((item) => item === navLangSlice)

  if (found) return found
  // return default language
  return 'en'
}
