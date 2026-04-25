import yaml from 'yaml'
import { omitUndefined } from '../helpers/squidlet.js'
import { ROOT_LANG } from '../constants.js'
import {
  isPost,
  generatePageUrlPath,
  isAuthorPage,
  isPage,
} from '../helpers/helpers.js'

function parseYamlToJsonLd(strYaml) {
  try {
    return yaml.parse(strYaml)
  } catch (error) {
    throw new Error('Error parsing frontmatter.jsonLd:', error)
  }
}

/** Создает JSON-LD структуру для поста */
function createPostJsonLd(
  pageData,
  siteConfig,
  siteUrl,
  localeIndexUrl,
  localeIndex,
  langConfig,
  pageUrl,
  publisher
) {
  const title = pageData.title
  const description = pageData.description
  const author =
    pageData.frontmatter.authorId &&
    langConfig.themeConfig.authors?.find(
      (item) => item.id === pageData.frontmatter.authorId
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
  const alternateLanguages = []

  // Собираем альтернативные языковые версии
  if (siteConfig.site.locales) {
    Object.entries(siteConfig.site.locales).forEach(([code, locale]) => {
      if (code === localeIndex || code === ROOT_LANG) return
      // Генерируем URL для альтернативной языковой версии
      const alternateUrl = generatePageUrlPath(pagePathWithoutLang)

      alternateLanguages.push({
        code: locale.lang || code,
        url: `${siteUrl}/${code}/${alternateUrl}`,
      })
    })
  }

  // Создаем базовую структуру статьи
  const article = {
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
        ? tags.map((tag) => tag.name).join(', ')
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

  // Если указан frontmatter.jsonLd, парсим его и переопределяем поля
  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
    // Переопределяем поля из customJsonLd
    if (customJsonLd && typeof customJsonLd === 'object') {
      Object.assign(article, customJsonLd)
    }
  }

  return article
}

function createAuthorJsonLd(
  pageData,
  siteConfig,
  siteUrl,
  localeIndex,
  langConfig
) {
  const authors = langConfig.themeConfig?.authors
  const author = authors?.find((item) => item.id === pageData.params.id)

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
    sameAs: links?.map((link) => link.url),
    ...rest,
  }
}

function createPageJsonLd(
  pageData,
  pageUrl,
  localeIndexUrl,
  publisher,
  siteName
) {
  const page = {
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

  // Если указан frontmatter.jsonLd, парсим его и переопределяем поля
  if (pageData.frontmatter.jsonLd) {
    const customJsonLd = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
    // Переопределяем поля из customJsonLd
    if (customJsonLd && typeof customJsonLd === 'object') {
      Object.assign(page, customJsonLd)
    }
  }

  return page
}

/**
 * Добавляет JSON-LD структурированные данные на страницу. pageData.description
 * has to be resolved before start this transformer. Где добавляет:
 *
 * - Во всех постах добавляется BlogPosting + дополнительные поля из
 *   frontmatter.jsonLd в виде yaml
 * - На странице автора добавляется Person. Данные берутся из\
 *   Site/site.[localeIndex].yaml authors
 * - На всех остальных страницах где указан frontmatter.jsonLd в виде yaml
 *
 * @param {Object} context { page, head, pageData, siteConfig }
 */
export function addJsonLd({ page, head, pageData, siteConfig }) {
  // Пропускаем корневые страницы и страницы без языкового префикса
  if (!page || page.indexOf('/') < 0) {
    return
  }

  let jsonLdData = null
  const localeIndex = page.split('/')[0]
  const langConfig = siteConfig.site.locales[localeIndex]

  if (!langConfig) return

  const siteUrl = siteConfig.userConfig.siteUrl
  const localeIndexUrl = `${siteUrl}/${localeIndex}`
  const pageUrl = `${siteUrl}/${generatePageUrlPath(page)}`
  // Формируем информацию об издателе для JSON-LD
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
      langConfig.title
    )
  } else if (pageData.frontmatter.jsonLd) {
    // all other pages witch have frontmatter.jsonLd
    jsonLdData = parseYamlToJsonLd(pageData.frontmatter.jsonLd)
  } else {
    return
  }

  if (typeof jsonLdData !== 'object' || Object.keys(jsonLdData).length === 0)
    return

  // Добавляем JSON-LD скрипт
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
