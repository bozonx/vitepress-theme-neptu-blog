import { pathTrimExt } from './string.ts'

export function isExternalUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.match(/^[a-z\d]+:\/\//i))
}

/**
 * Resolves URLs for multilingual sites by adding a language prefix to
 * internal links.
 */
export function resolveI18Href(
  rawHref: string,
  localeIndex: string
): string {
  const trimmed = String(rawHref).trim()

  if (typeof rawHref !== 'string') return trimmed
  if (!trimmed) return rawHref
  // Main page
  else if (trimmed === '/') return '/' + localeIndex

  const isExternal = isExternalUrl(trimmed)

  if (isExternal) return trimmed
  // Already includes language prefix
  if (trimmed.indexOf('/') === 0) return trimmed
  // Add language prefix — insert a slash between localeIndex and trimmed.
  // Remove leading slash from trimmed to avoid double slashes.
  const cleanHref = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `/${localeIndex}/${cleanHref}`
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
