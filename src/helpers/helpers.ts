import { pathTrimExt, arraysIntersection } from './squidlet.ts'

import type { Post, PostFrontmatter, ThemeConfig } from '../types.d.ts'

export type Frontmatter = PostFrontmatter
export type ThemeRef = { value: ThemeConfig } | ThemeConfig

const UTIL_LAYOUTS = new Set(['util', 'tag', 'archive', 'author'])

/** True for posts: explicit `layout: post` or no layout set. */
export function isPost(frontmatter: Frontmatter | null | undefined): boolean | undefined {
  if (!frontmatter) return
  if (frontmatter.layout === 'post') return true
  return frontmatter.layout == null
}

export function isHomePage(frontmatter: Frontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'home'
}

/** Plain content page (no post chrome, no util chrome). Explicit only. */
export function isPage(frontmatter: Frontmatter | null | undefined): boolean {
  return frontmatter?.layout === 'page'
}

/** True for layout: util / tag / archive / author. */
export function isUtilPage(frontmatter: Frontmatter | null | undefined): boolean {
  return UTIL_LAYOUTS.has(frontmatter?.layout)
}

export function isPopularRoute(routPath: string, theme: ThemeRef): boolean {
  const themeValue = 'value' in theme ? theme.value : theme
  return routPath.includes(`/${themeValue.popularBaseUrl}/`)
}

import type { ExtendedSiteConfig } from '../types.d.ts'

export function isAuthorPage(filePath: string | null | undefined, siteConfig: ExtendedSiteConfig): boolean {
  if (!filePath) return false

  const authorsBaseUrl = siteConfig.userConfig.themeConfig.authorsBaseUrl

  return (
    !!filePath.match(new RegExp(`^\\w+\/${authorsBaseUrl}\/`)) &&
    !filePath.endsWith(`${authorsBaseUrl}/index.md`)
  )
}

export function makeHumanDate(
  rawDate: string | number | Date | null | undefined,
  lang?: string,
  toTimeZone: string = 'UTC'
): string | undefined {
  if (!rawDate) return

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: toTimeZone,
  }

  return new Date(rawDate).toLocaleDateString(lang, options)
}

/**
 * Resolves URLs for multilingual sites by adding a language prefix to
 * internal links.
 */
export function resolveI18Href(
  rawHref: string,
  localeIndex: string,
  i18nRouting: boolean
): string {
  const trimmed = String(rawHref).trim()

  if (typeof rawHref !== 'string' || !trimmed) return rawHref
  // Main page
  else if (trimmed === '/') return '/' + localeIndex

  const isExternal = isExternalUrl(trimmed)

  if (isExternal || !i18nRouting) return trimmed
  // Already includes language prefix
  if (trimmed.indexOf('/') === 0) return trimmed
  // Add language prefix — insert a slash between localeIndex and trimmed.
  // Remove leading slash from trimmed to avoid double slashes.
  const cleanHref = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `/${localeIndex}/${cleanHref}`
}

export function isExternalUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.match(/^[\a-z\d]+\:\/\//))
}

/** Resolve article preview text inside article. Or return undefined */
export function resolveArticlePreview(frontmatter: Frontmatter): string | undefined {
  const { previewText, descrAsPreview, description } = frontmatter

  if (previewText) {
    return previewText
  } else if (descrAsPreview && description) {
    return description
  }
  return undefined
}

/** Generates the full URL path from pageData.relativePath. */
export function generatePageUrlPath(relativePath: string): string {
  // Remove file extension
  const cleanPath = pathTrimExt(relativePath)

  // Remove trailing /index
  let finalPath = cleanPath.replace(/\/index$/, '')

  if (finalPath === 'index') finalPath = ''

  return finalPath
}

/** Sorts posts by popularity or by date. */
export function sortPosts(
  posts: Post[] | null | undefined,
  sortBy?: string,
  sortByPopularity: boolean = false
): Post[] {
  if (!posts || !Array.isArray(posts)) return []

  if (sortByPopularity && !sortBy) {
    console.warn('⚠️ Warning: function sortPosts: sortBy is not defined')
    return posts
  }

  return [...posts].sort((a, b) => {
    if (sortByPopularity && sortBy) {
      // Sort by popularity
      const aHasStats = Number.isFinite(a.analyticsStats?.[sortBy])
      const bHasStats = Number.isFinite(b.analyticsStats?.[sortBy])

      if (aHasStats && bHasStats) {
        const aValue = a.analyticsStats[sortBy] as number
        const bValue = b.analyticsStats[sortBy] as number
        return bValue - aValue
      }

      if (aHasStats && !bHasStats) return -1
      if (!aHasStats && bHasStats) return 1

      return +new Date(b.date || 0) - +new Date(a.date || 0)
    } else {
      return +new Date(b.date) - +new Date(a.date)
    }
  })
}

/**
 * Sorts posts to display similar ones. Priority: number of matching
 * tags > popularity > date
 */
export function sortSimilarPosts(
  posts: Post[] | null | undefined,
  currentPostTags: Array<{ slug?: string }> | null | undefined,
  currentPostUrl: string,
  sortBy?: string,
  limit: number = 5
): Post[] {
  if (!posts || !Array.isArray(posts)) return []
  if (!currentPostTags || !Array.isArray(currentPostTags)) return []

  const getTagsIntersection = (
    tags1: Array<{ slug?: string }> | undefined,
    tags2: Array<{ slug?: string }> | undefined
  ): string[] => {
    if (!Array.isArray(tags1) || !Array.isArray(tags2)) {
      return []
    }

    const slugs1 = tags1.map((tag) => tag?.slug).filter(Boolean) as string[]
    const slugs2 = tags2.map((tag) => tag?.slug).filter(Boolean) as string[]

    return arraysIntersection(slugs1, slugs2)
  }

  const getPopularityValue = (post: Post): number => {
    if (!sortBy) return 0

    const stats = post.analyticsStats?.[sortBy]
    return stats !== undefined && stats !== null ? stats : 0
  }

  return [...posts]
    .filter((item) => {
      const isCurrentPost = item.url === currentPostUrl
      if (isCurrentPost) return false

      if (!item.tags || !Array.isArray(item.tags)) return false

      const intersection = getTagsIntersection(item.tags, currentPostTags)
      return intersection.length > 0
    })
    .sort((a, b) => {
      const aIntersection = getTagsIntersection(a.tags, currentPostTags).length
      const bIntersection = getTagsIntersection(b.tags, currentPostTags).length

      if (aIntersection !== bIntersection) {
        return bIntersection - aIntersection
      }

      const aPopularity = getPopularityValue(a)
      const bPopularity = getPopularityValue(b)

      if (aPopularity !== bPopularity) {
        return bPopularity - aPopularity
      }

      return +new Date(b.date) - +new Date(a.date)
    })
    .slice(0, limit)
}

export function resolveBodyMarker(theme: ThemeConfig, frontmatter: Frontmatter): string | undefined {
  const bodyMarker = theme.search?.bodyMarker

  if (!bodyMarker) return undefined

  // By default util pages are excluded from search
  let allowed = true

  if (isUtilPage(frontmatter)) {
    allowed = frontmatter.searchIncluded || false
  } else {
    // All other pages are included in search by default
    allowed = frontmatter.searchIncluded ?? true
  }

  return allowed ? bodyMarker : undefined
}
