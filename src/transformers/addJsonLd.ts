import yaml from 'yaml'
import { omitUndefined } from '../utils/shared/index.ts'
import { ROOT_LANG } from '../constants.ts'
import {
  isPost,
  generatePageUrlPath,
  isAuthorPage,
  isPage,
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

function parseYamlToJsonLd(strYaml: string): any {
  try {
    return yaml.parse(strYaml)
  } catch (error) {
    throw new Error('Error parsing frontmatter.jsonLd:', {
      cause: error as Error,
    })
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
  const title = pageData.title
  const description = pageData.description
  const author =
    pageData.frontmatter.authorId &&
    (langConfig.themeConfig as ThemeConfig).authors?.find(
      (item: Author) => item.id === pageData.frontmatter.authorId
    )

  const authorName = author?.name || author?.id
  const authorUrl = author?.aboutUrl
    ? author.aboutUrl
    : `${siteUrl}/${localeIndex}/${siteConfig.userConfig.themeConfig.authorsBaseUrl}/${pageData.frontmatter.authorId}/1`
  const cover = pageData.frontmatter.cover
  const tags = pageData.frontmatter.tags
  const lang = langConfig.lang
  const [, ...restPath] = pageData.relativePath.split('/')
  const pagePathWithoutLang = restPath.join('/')
  const alternateLanguages: Array<{ code: string; url: string }> = []

  if (siteConfig.site.locales) {
    Object.entries(siteConfig.site.locales).forEach(
      ([code, locale]: [string, any]) => {
        if (code === localeIndex || code === ROOT_LANG) return
        const alternateUrl = generatePageUrlPath(pagePathWithoutLang)

        alternateLanguages.push({
          code: locale.lang || code,
          url: `${siteUrl}/${code}/${alternateUrl}`,
        })
      }
    )
  }

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
      '@type': 'CreativeWork',
      '@id': `${localeIndexUrl}/#website`,
      inLanguage: lang,
      hasPart: alternateLanguages.map((altLang) => ({
        '@type': 'CreativeWork',
        '@id': altLang.url,
        inLanguage: altLang.code,
        url: altLang.url,
      })),
    },
    author: authorName && {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    updatedDate:
      pageData.lastUpdated && new Date(pageData.lastUpdated).toISOString(),
    keywords:
      tags && tags.length > 0
        ? (tags as any[]).map((tag: any) => tag.name || tag).join(', ')
        : undefined,
    image:
      cover &&
      omitUndefined({
        '@type': 'ImageObject',
        url: cover.includes('://') ? cover : `${siteUrl}${cover}`,
        height: pageData.frontmatter.coverHeight,
        width: pageData.frontmatter.coverWidth,
        caption:
          pageData.frontmatter.coverDescr ||
          pageData.frontmatter.coverAlt ||
          undefined,
      }),
  }

  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
    if (customJsonLd && typeof customJsonLd === 'object') {
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
  const authorUrl = aboutUrl
    ? aboutUrl
    : `${siteUrl}/${localeIndex}/${siteConfig.userConfig.themeConfig.authorsBaseUrl}/${id}/1`
  let imgUrl = image

  if (imgUrl && !imgUrl.includes('://')) {
    imgUrl = `${siteUrl}${imgUrl}`
  }

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
    name: pageData.title,
    url: pageUrl,
    description: pageData.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${localeIndexUrl}/#website`,
      name: siteName,
      url: localeIndexUrl,
    },
    publisher,
  }

  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
    if (customJsonLd && typeof customJsonLd === 'object') {
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

  const siteUrl = siteConfig.userConfig.siteUrl!
  const localeIndexUrl = `${siteUrl}/${localeIndex}`
  const pageUrl = `${siteUrl}/${generatePageUrlPath(page)}`
  // siteName: fallback resolution matches createPageJsonLd usage.
  const siteName = langConfig.title || ''
  const publisher = langConfig.themeConfig.publisher && {
    '@type': 'Organization',
    name: langConfig.themeConfig.publisher?.name || siteName,
    url: langConfig.themeConfig.publisher?.url || siteUrl,
    logo: langConfig.themeConfig.publisher?.logo && {
      '@type': 'ImageObject',
      url: langConfig.themeConfig.publisher.logo,
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
    jsonLdData = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
  } else {
    return
  }

  if (typeof jsonLdData !== 'object' || Object.keys(jsonLdData).length === 0)
    return

  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(
      { '@context': 'https://schema.org', ...jsonLdData },
      null,
      2
    ),
  ])
}
