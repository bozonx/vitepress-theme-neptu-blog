import { getFeedUrl, getFormatInfo, getRssFormats, normalizeSiteUrl } from '../utils/node/index.ts'
import { isHomePage } from '../utils/shared/index.ts'

export interface AddRssLinksContext {
  page: string
  head: any[]
  pageData: any
  siteConfig: any
}

/** Adds RSS feed links to the head of the home page */
export function addRssLinks({ page, head, pageData, siteConfig }: AddRssLinksContext): void {
  if (!isHomePage(pageData.frontmatter)) return

  const rawSiteUrl = siteConfig.userConfig.siteUrl
  if (!rawSiteUrl) {
    console.warn('[addRssLinks] siteUrl is not configured. RSS links were not added.')
    return
  }

  const siteUrl = normalizeSiteUrl(rawSiteUrl)
  const localeIndex = page.split('/')[0]!
  const supportedLocales = Object.keys(siteConfig.site.locales)

  const rssFormats = getRssFormats(siteConfig)

  for (const locale of supportedLocales) {
    for (const format of rssFormats) {
      const feedUrl = getFeedUrl(siteUrl, locale, format)
      const formatInfo = getFormatInfo(format)
      head.push([
        'link',
        {
          rel: 'alternate',
          type: formatInfo.mimeType,
          title: `${siteConfig.site.locales[locale].title} - ${formatInfo.title}`,
          href: feedUrl,
          hreflang: locale,
        },
      ])
    }
  }
}
