import { generatePageUrlPath, isPost } from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig, ThemeConfig, Author } from '../types.d.ts'

export interface AddOgMetaTagsContext {
  head: any[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

/** Adds Open Graph and Twitter meta tags to the page head. */
export function addOgMetaTags({
  head,
  pageData,
  siteConfig,
}: AddOgMetaTagsContext): void {
  const siteUrl = siteConfig.userConfig.siteUrl
  if (!siteUrl) return

  const localeIndex = pageData.filePath.split('/')[0]!
  const langConfig = siteConfig.site.locales[localeIndex]
  if (!langConfig) return

  const themeConfig = langConfig.themeConfig as ThemeConfig
  const pageUrl = `${siteUrl}/${generatePageUrlPath(pageData.relativePath)}`
  const title = pageData.frontmatter.title || langConfig.title
  const description = pageData.frontmatter.description || langConfig.description
  const cover = pageData.frontmatter.cover
  const imageUrl = cover
    ? cover.includes('://')
      ? cover
      : `${siteUrl}${cover}`
    : themeConfig.mainHeroImg
    ? themeConfig.mainHeroImg.includes('://')
      ? themeConfig.mainHeroImg
      : `${siteUrl}${themeConfig.mainHeroImg}`
    : undefined

  const author =
    pageData.frontmatter.authorId &&
    themeConfig.authors?.find(
      (item: Author) => item.id === pageData.frontmatter.authorId
    )

  const tags = [
    ['property', 'og:site_name', langConfig.title || ''],
    ['property', 'og:type', isPost(pageData.frontmatter) ? 'article' : 'website'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', pageUrl],
    ['property', 'og:locale', langConfig.lang || localeIndex],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]

  if (imageUrl) {
    tags.push(['property', 'og:image', imageUrl])
    tags.push(['name', 'twitter:image', imageUrl])
  }

  if (isPost(pageData.frontmatter)) {
    if (pageData.frontmatter.date) {
      tags.push([
        'property',
        'article:published_time',
        new Date(pageData.frontmatter.date).toISOString(),
      ])
    }
    if (pageData.frontmatter.tags) {
      (pageData.frontmatter.tags as any[]).forEach((tag: any) => {
        tags.push(['property', 'article:tag', tag.name || tag])
      })
    }
    if (author) {
      tags.push(['property', 'article:author', author.name])
    }
  }

  tags.forEach(([type, name, content]) => {
    if (content) {
      head.push(['meta', { [type]: name, content }])
    }
  })
}
