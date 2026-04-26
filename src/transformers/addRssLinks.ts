import { getFormatInfo, getRssFormats } from '../utils/node/index.ts'
import { isHomePage } from '../utils/shared/index.ts'
import { ROOT_LANG } from '../constants.ts'

export interface AddRssLinksContext {
  page: string
  head: any[]
  pageData: any
  siteConfig: any
}

/** Adds RSS feed links to the head of the home page */
export function addRssLinks({ page, head, pageData, siteConfig }: AddRssLinksContext): void {
  if (!isHomePage(pageData.frontmatter)) return

  const siteUrl = siteConfig.userConfig.siteUrl
  const localeIndex = page.split('/')[0]!
  const supportedLocales = Object.keys(siteConfig.site.locales).filter(
    (locale) => locale !== ROOT_LANG
  )

  const rssFormats = getRssFormats(siteConfig)

  for (const format of rssFormats) {
    const feedUrl = `${siteUrl}/feed-${localeIndex}.${format}`
    const formatInfo = getFormatInfo(format)

    head.push([
      'link',
      {
        rel: 'alternate',
        type: formatInfo.mimeType,
        title: `${siteConfig.site.locales[localeIndex].title} - ${formatInfo.title}`,
        href: feedUrl,
        hreflang: localeIndex,
      },
    ])
  }

  for (const locale of supportedLocales) {
    if (locale !== localeIndex) {
      const feedUrl = `${siteUrl}/feed-${locale}.rss`

      head.push([
        'link',
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: `${siteConfig.site.locales[locale].title} - RSS Feed`,
          href: feedUrl,
          hreflang: locale,
        },
      ])
    }
  }
}
