import yaml from 'yaml'
import { omitUndefined } from '../utils/shared/index.ts'
import {
  isPost,
  generatePageUrlPath,
  isAuthorPage,
  isPage,
  makeAbsoluteUrl,
  normalizeSiteUrl,
} from '../utils/shared/index.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  ThemeConfig,
  Author,
} from '../types.d.ts'

export interface AddJsonLdContext {
  page: string
  head: any[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const normalized = value.trim()
  return normalized || undefined
}

function toIsoDate(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return

  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime())) return

  return date.toISOString()
}

function parseYamlToJsonLd(strYaml: string): any {
  return yaml.parse(strYaml)
}

function warnInvalidJsonLd(pagePath: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  console.warn(`[addJsonLd] Failed to parse frontmatter.jsonLd for "${pagePath}": ${message}`)
}

function parseCustomJsonLd(
  rawJsonLd: unknown,
  pagePath: string
): Record<string, any> | any[] | undefined {
  if (typeof rawJsonLd !== 'string' || rawJsonLd.trim() === '') return

  try {
    const parsed = parseYamlToJsonLd(rawJsonLd)

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => item && typeof item === 'object' && !Array.isArray(item)
      )
    }

    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch (error) {
    warnInvalidJsonLd(pagePath, error)
  }
}

function hasJsonLdEntries(jsonLdData: unknown): boolean {
  if (Array.isArray(jsonLdData)) return jsonLdData.length > 0
  return !!jsonLdData && typeof jsonLdData === 'object' && Object.keys(jsonLdData).length > 0
}

function withSchemaContext(jsonLdData: Record<string, any> | any[]): Record<string, any> {
  if (Array.isArray(jsonLdData)) {
    return {
      '@context': 'https://schema.org',
      '@graph': jsonLdData,
    }
  }

  return {
    '@context': 'https://schema.org',
    ...jsonLdData,
  }
}

/** Creates JSON-LD structured data for a post. */
function createPostJsonLd(
  pageData: ExtendedPageData,
  siteConfig: ExtendedSiteConfig,
  siteUrl: string,
  localeIndexUrl: string,
  localeIndex: string,
  langConfig: any,
  pageUrl: string,
  publisher: any
): any {
  const title =
    normalizeText(pageData.frontmatter.title) ||
    normalizeText(pageData.title)
  const description =
    normalizeText(pageData.frontmatter.description) ||
    normalizeText(pageData.description)
  const author =
    pageData.frontmatter.authorId &&
    (langConfig.themeConfig as ThemeConfig).authors?.find(
      (item: Author) => item.id === pageData.frontmatter.authorId
    )

  const authorName = author?.name || author?.id
  const authorsBaseUrl =
    (langConfig.themeConfig as ThemeConfig).authorsBaseUrl ||
    siteConfig.userConfig.themeConfig.authorsBaseUrl
  const authorUrl = author?.aboutUrl
    ? makeAbsoluteUrl(siteUrl, author.aboutUrl)
    : authorsBaseUrl
    ? makeAbsoluteUrl(
        siteUrl,
        `${localeIndex}/${authorsBaseUrl}/${pageData.frontmatter.authorId}/1`
      )
    : undefined
  const cover = pageData.frontmatter.cover
  const tags = pageData.frontmatter.tags
  const lang = langConfig.lang

  const article: Record<string, any> = {
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: pageUrl,
    datePublished: pageData.frontmatter.date,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: lang,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${localeIndexUrl}/#website`,
      url: localeIndexUrl,
      inLanguage: lang,
    },
    author: authorName && {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    dateModified: toIsoDate(pageData.lastUpdated),
    keywords:
      tags && tags.length > 0
        ? (tags as any[]).map((tag: any) => tag.name || tag).join(', ')
        : undefined,
    image:
      cover &&
      omitUndefined({
        '@type': 'ImageObject',
        url: makeAbsoluteUrl(siteUrl, cover),
        height: pageData.frontmatter.coverHeight,
        width: pageData.frontmatter.coverWidth,
        caption:
          pageData.frontmatter.coverDescr ||
          pageData.frontmatter.coverAlt ||
          undefined,
      }),
  }

  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseCustomJsonLd(
      pageData.frontmatter.jsonLd,
      pageData.relativePath
    )
    if (customJsonLd && !Array.isArray(customJsonLd)) {
      Object.assign(article, customJsonLd)
    }
  }

  return article
}

function createAuthorJsonLd(
  pageData: ExtendedPageData,
  siteConfig: ExtendedSiteConfig,
  siteUrl: string,
  localeIndex: string,
  langConfig: any
): any {
  const authors = (langConfig.themeConfig as ThemeConfig)?.authors
  const author = authors?.find((item: Author) => item.id === pageData.params?.id)

  if (!author) return

  const {
    id,
    name,
    description,
    image,
    aboutUrl,
    links,
    imageHeight,
    imageWidth,
    ...rest
  } = author
  const authorName = name || id
  const authorsBaseUrl =
    (langConfig.themeConfig as ThemeConfig).authorsBaseUrl ||
    siteConfig.userConfig.themeConfig.authorsBaseUrl
  const authorUrl = aboutUrl
    ? makeAbsoluteUrl(siteUrl, aboutUrl)
    : authorsBaseUrl
    ? makeAbsoluteUrl(siteUrl, `${localeIndex}/${authorsBaseUrl}/${id}/1`)
    : undefined
  let imgUrl = image

  imgUrl = makeAbsoluteUrl(siteUrl, imgUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    url: authorUrl,
    description,
    image: imgUrl && {
      '@type': 'ImageObject',
      url: imgUrl,
      height: imageHeight,
      width: imageWidth,
      caption: authorName,
    },
    sameAs: links?.map((link: any) => link.url || link.link),
    ...rest,
  }
}

function createPageJsonLd(
  pageData: ExtendedPageData,
  pageUrl: string,
  localeIndexUrl: string,
  publisher: any,
  siteName: string
): any {
  const page: Record<string, any> = {
    '@type': 'WebPage',
    name: normalizeText(pageData.frontmatter.title) || normalizeText(pageData.title),
    url: pageUrl,
    description:
      normalizeText(pageData.frontmatter.description) ||
      normalizeText(pageData.description),
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${localeIndexUrl}/#website`,
      name: siteName,
      url: localeIndexUrl,
    },
    publisher,
  }

  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseCustomJsonLd(
      pageData.frontmatter.jsonLd,
      pageData.relativePath
    )
    if (customJsonLd && !Array.isArray(customJsonLd)) {
      Object.assign(page, customJsonLd)
    }
  }

  return page
}

/** Adds JSON-LD structured data to the page head. */
export function addJsonLd({
  page,
  head,
  pageData,
  siteConfig,
}: AddJsonLdContext): void {
  if (!page || page.indexOf('/') < 0) {
    return
  }

  let jsonLdData: any = null
  const localeIndex = page.split('/')[0]!
  const langConfig = siteConfig.site.locales[localeIndex] as {
    title?: string
    lang?: string
    themeConfig: ThemeConfig
  }

  if (!langConfig || !langConfig.themeConfig) return

  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl) {
    console.warn(`[addJsonLd] siteUrl is not configured. JSON-LD requires absolute URLs.`)
    return
  }

  const localeIndexUrl = makeAbsoluteUrl(siteUrl, localeIndex)
  const pageUrl = makeAbsoluteUrl(siteUrl, generatePageUrlPath(page))
  if (!localeIndexUrl || !pageUrl) return
  // siteName: fallback resolution matches createPageJsonLd usage.
  const siteName = langConfig.title || ''
  const publisher = langConfig.themeConfig.publisher && {
    '@type': 'Organization',
    name: langConfig.themeConfig.publisher?.name || siteName,
    url: makeAbsoluteUrl(siteUrl, langConfig.themeConfig.publisher?.url || siteUrl),
    logo: langConfig.themeConfig.publisher?.logo && {
      '@type': 'ImageObject',
      url: makeAbsoluteUrl(siteUrl, langConfig.themeConfig.publisher.logo),
    },
  }

  if (isAuthorPage(page, siteConfig)) {
    jsonLdData = createAuthorJsonLd(
      pageData,
      siteConfig,
      siteUrl,
      localeIndex,
      langConfig
    )
  } else if (isPost(pageData.frontmatter)) {
    jsonLdData = createPostJsonLd(
      pageData,
      siteConfig,
      siteUrl,
      localeIndexUrl,
      localeIndex,
      langConfig,
      pageUrl,
      publisher
    )
  } else if (isPage(pageData.frontmatter)) {
    jsonLdData = createPageJsonLd(
      pageData,
      pageUrl,
      localeIndexUrl,
      publisher,
      siteName
    )
  } else if (pageData.frontmatter.jsonLd) {
    jsonLdData = parseCustomJsonLd(pageData.frontmatter.jsonLd, pageData.relativePath)
  } else {
    return
  }

  if (!hasJsonLdEntries(jsonLdData)) return

  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(withSchemaContext(jsonLdData), null, 2),
  ])
}
