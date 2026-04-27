import type { PostFrontmatter, ThemeConfig, ExtendedSiteConfig } from '../../types.d.ts'

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
  return UTIL_LAYOUTS.has(frontmatter?.layout as string)
}

export function isPopularRoute(routPath: string, theme: ThemeRef): boolean {
  const themeValue = 'value' in theme ? theme.value : theme
  return routPath.includes(`/${themeValue.popularBaseUrl}/`)
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function isAuthorPage(filePath: string | null | undefined, siteConfig: ExtendedSiteConfig): boolean {
  if (!filePath) return false

  const authorsBaseUrl = siteConfig.userConfig.themeConfig.authorsBaseUrl

  if (!authorsBaseUrl) return false

  const escaped = escapeRegExp(authorsBaseUrl)

  return (
    !!filePath.match(new RegExp(`^[^/]+\/${escaped}\/`)) &&
    !filePath.endsWith(`${authorsBaseUrl}/index.md`)
  )
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

export function resolveBodyMarker(theme: ThemeConfig, frontmatter: Frontmatter): string | undefined {
  const bodyMarker = (theme.search as { bodyMarker?: string })?.bodyMarker

  if (!bodyMarker) return undefined

  // By default util pages are excluded from search
  const allowed = isUtilPage(frontmatter)
    ? frontmatter.searchIncluded || false
    : (frontmatter.searchIncluded ?? true)

  return allowed ? bodyMarker : undefined
}
