import { generatePageUrlPath } from '../utils/shared/index.ts'
import { ROOT_LANG } from '../constants.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

export interface AddHreflangContext {
  head: any[]
  pageData?: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

/**
 * Adds hreflang link tags to the page head for multilingual SEO.
 */
export function addHreflang({ head, pageData, siteConfig }: AddHreflangContext): void {
  const siteUrl = siteConfig.userConfig.siteUrl
  if (!siteUrl || !pageData) return

  const locales = siteConfig.site.locales
  if (!locales || Object.keys(locales).length <= 1) return

  const relativePath = pageData.relativePath
  const segments = relativePath.split('/')
  const currentLocale = segments[0]!
  const pathWithoutLocale = segments.slice(1).join('/')

  Object.entries(locales).forEach(([code, locale]: [string, any]) => {
    const isRoot = code === ROOT_LANG
    const lang = locale.lang || code
    
    // Construct URL for this locale
    let localePath = pathWithoutLocale
    if (!isRoot) {
      localePath = `${code}/${pathWithoutLocale}`
    }
    
    const url = `${siteUrl}/${generatePageUrlPath(localePath)}`

    head.push([
      'link',
      {
        rel: 'alternate',
        hreflang: lang,
        href: url,
      },
    ])

    // Add x-default (usually the root language or a specific fallback)
    if (isRoot) {
      head.push([
        'link',
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: url,
        },
      ])
    }
  })
}
