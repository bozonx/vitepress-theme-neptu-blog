import fs from 'node:fs'
import path from 'node:path'
import {
  generatePageUrlPath,
  makeAbsoluteUrl,
  normalizeSiteUrl,
  replaceRelativePathLocale,
} from '../utils/shared/index.ts'
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
  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl || !pageData) return

  const locales = siteConfig.site.locales
  if (!locales || Object.keys(locales).length <= 1) return

  const relativePath = pageData.relativePath
  const srcDir = siteConfig.srcDir

  const alternates = Object.entries(locales).flatMap(([code, locale]: [string, any]) => {
    const localeRelativePath = replaceRelativePathLocale(relativePath, code)
    if (!localeRelativePath) return []

    if (srcDir && !fs.existsSync(path.join(srcDir, localeRelativePath))) {
      return []
    }

    const url = makeAbsoluteUrl(siteUrl, generatePageUrlPath(localeRelativePath))
    if (!url) return []

    const lang = locale.lang || code

    return [[
      'link',
      {
        rel: 'alternate',
        hreflang: lang,
        href: url,
      },
    ]]
  })

  if (alternates.length <= 1) return

  head.push(...alternates)
}
