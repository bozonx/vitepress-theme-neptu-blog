import {
  generatePageUrlPath,
  isPost,
  makeAbsoluteUrl,
  normalizeSiteUrl,
} from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig, ThemeConfig, Author } from '../types.d.ts'

export interface AddOgMetaTagsContext {
  head: any[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const normalized = value.trim()
  return normalized || undefined
}

/** Adds Open Graph and Twitter meta tags to the page head. */
export function addOgMetaTags({
  head,
  pageData,
  siteConfig,
}: AddOgMetaTagsContext): void {
  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl) return

  const localeIndex = pageData.filePath.split('/')[0]!
  const langConfig = siteConfig.site.locales[localeIndex]
  if (!langConfig) return

  const themeConfig = langConfig.themeConfig as ThemeConfig
  const pageUrl = makeAbsoluteUrl(siteUrl, generatePageUrlPath(pageData.relativePath))
  const title =
    normalizeText(pageData.frontmatter.title) ||
    normalizeText(pageData.title) ||
    normalizeText(langConfig.title)
  const description =
    normalizeText(pageData.frontmatter.description) ||
    normalizeText(pageData.description) ||
    normalizeText(langConfig.description)
  const cover = pageData.frontmatter.cover
  const imageUrl = makeAbsoluteUrl(siteUrl, cover || themeConfig.mainHeroImg)
  const imageAlt = normalizeText(pageData.frontmatter.coverAlt)
  const imageWidth = pageData.frontmatter.coverWidth
  const imageHeight = pageData.frontmatter.coverHeight

  const author = pageData.frontmatter.authorId
    ? themeConfig.authors?.find((item: Author) => item.id === pageData.frontmatter.authorId)
    : undefined

  const authorUrl = author?.aboutUrl
    ? makeAbsoluteUrl(siteUrl, author.aboutUrl)
    : themeConfig.authorsBaseUrl && pageData.frontmatter.authorId
    ? makeAbsoluteUrl(
        siteUrl,
        `${localeIndex}/${themeConfig.authorsBaseUrl}/${pageData.frontmatter.authorId}/1`
      )
    : undefined

  const tags = [
    ['property', 'og:site_name', langConfig.title || ''],
    ['property', 'og:type', isPost(pageData.frontmatter) ? 'article' : 'website'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', pageUrl],
    ['property', 'og:locale', langConfig.lang || localeIndex],
    ['name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]

  if (imageUrl) {
    tags.push(['property', 'og:image', imageUrl])
    tags.push(['property', 'og:image:width', imageWidth ? String(imageWidth) : undefined])
    tags.push(['property', 'og:image:height', imageHeight ? String(imageHeight) : undefined])
    tags.push(['property', 'og:image:alt', imageAlt])
    tags.push(['name', 'twitter:image', imageUrl])
    tags.push(['name', 'twitter:image:alt', imageAlt])
  }

  if (isPost(pageData.frontmatter)) {
    if (pageData.frontmatter.date) {
      const publishedAt = new Date(pageData.frontmatter.date)
      if (!Number.isNaN(publishedAt.getTime())) {
        tags.push([
          'property',
          'article:published_time',
          publishedAt.toISOString(),
        ])
      }
    }
    if (pageData.lastUpdated) {
      const updatedAt = new Date(pageData.lastUpdated)
      if (!Number.isNaN(updatedAt.getTime())) {
        tags.push(['property', 'article:modified_time', updatedAt.toISOString()])
        tags.push(['property', 'og:updated_time', updatedAt.toISOString()])
      }
    }
    if (pageData.frontmatter.tags) {
      const tagsList = Array.isArray(pageData.frontmatter.tags)
        ? pageData.frontmatter.tags
        : [pageData.frontmatter.tags]

      tagsList.forEach((tag: any) => {
        tags.push(['property', 'article:tag', tag.name || tag])
      })
    }
    if (authorUrl) {
      tags.push(['property', 'article:author', authorUrl])
    }
  }

  const filteredTags = tags.filter(
    (tag): tag is [string, string, string] => Boolean(tag[0] && tag[1] && tag[2])
  )

  filteredTags.forEach(([type, name, content]) => {
    head.push(['meta', { [type]: name, content }])
  })
}

