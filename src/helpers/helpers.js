import { pathTrimExt, arraysIntersection } from './squidlet.js'

// /**
//  * Returns [640, 320] from "some-file-name--640x320.avif"
//  * or undefined is it doesn't contain dimestions
//  */
// export function extractImgDimensionFromFileName(fileName) {
//   const res = String(fileName).match(/\-\-(\d{3,})x(\d{3,})\.[\w\d]+$/);
//
//   if (res) return [Number(res[1]), Number(res[2])];
// }

// export function extractDateFromPostPath(postPath = '') {
//   const pathSplit = postPath.split('/')
//
//   return pathSplit[pathSplit.length - 2]
// }

/**
 * Layout values supported by the theme.
 * - `home`            — full-takeover homepage (BlogHome layout)
 * - `post`            — post article view (DEFAULT when `layout` is omitted)
 * - `page`            — plain content page (vp-doc), explicit only
 * - `util`            — utility list page (tags, archive, authors lists)
 * - `tag` | `archive` | `author` — aliases for `util` (self-documenting)
 * - `false`           — raw <Content /> with no chrome
 */
const UTIL_LAYOUTS = new Set(['util', 'tag', 'archive', 'author'])

/** True for posts: explicit `layout: post` or no layout set. */
export function isPost(frontmatter) {
  if (!frontmatter) return
  if (frontmatter.layout === 'post') return true
  return frontmatter.layout == null
}

export function isHomePage(frontmatter) {
  return frontmatter?.layout === 'home'
}

/** Plain content page (no post chrome, no util chrome). Explicit only. */
export function isPage(frontmatter) {
  return frontmatter?.layout === 'page'
}

/** True for layout: util / tag / archive / author. */
export function isUtilPage(frontmatter) {
  return UTIL_LAYOUTS.has(frontmatter?.layout)
}

export function isPopularRoute(routPath, theme) {
  return routPath.includes(`/${theme.value.popularBaseUrl}/`)
}

export function isAuthorPage(filePath, siteConfig) {
  if (!filePath) return false

  const authorsBaseUrl = siteConfig.userConfig.themeConfig.authorsBaseUrl

  return (
    !!filePath.match(new RegExp(`^\\w+\/${authorsBaseUrl}\/`)) &&
    !filePath.endsWith(`${authorsBaseUrl}/index.md`)
  )
}

export function makeHumanDate(rawDate, lang, toTimeZone = 'UTC') {
  if (!rawDate) return

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: toTimeZone,
  }

  return new Date(rawDate).toLocaleDateString(lang, options)
}

/**
 * Обрабатывает URL-адреса для многоязычных сайтов, добавляя префикс языка к
 * внутренним ссылкам
 *
 * Функция анализирует входящую ссылку и в зависимости от её типа:
 *
 * - Для главной страницы (/) возвращает /{localeIndex}
 * - Для внешних ссылок возвращает исходную ссылку без изменений
 * - Для внутренних ссылок добавляет префикс языка в формате /{localeIndex}/{path}
 * - Для ссылок, уже содержащих префикс языка, возвращает без изменений
 *
 * @example
 *   // Главная страница
 *   resolveI18Href('/', 'en', true) // → '/en'
 *
 * @example
 *   // Внутренняя ссылка
 *   resolveI18Href('about', 'ru', true) // → '/ru/about'
 *
 * @example
 *   // Внешняя ссылка
 *   resolveI18Href('https://example.com', 'en', true) // → 'https://example.com'
 *
 * @example
 *   // Ссылка уже с префиксом
 *   resolveI18Href('/contact', 'en', true) // → '/contact'
 *
 * @param {string} rawHref - Исходная ссылка для обработки
 * @param {string} localeIndex - Индекс языка (например, 'en', 'ru')
 * @param {boolean} i18nRouting - Включена ли интернационализация маршрутизации
 * @returns {string} Обработанная ссылка с учетом языка или исходная ссылка
 */
export function resolveI18Href(rawHref, localeIndex, i18nRouting) {
  const trimmed = String(rawHref).trim()

  if (typeof rawHref !== 'string' || !trimmed) return rawHref
  // main page
  else if (trimmed === '/') return '/' + localeIndex

  const isExternal = isExternalUrl(trimmed)

  if (isExternal || !i18nRouting) return trimmed
  // already included language
  if (trimmed.indexOf('/') === 0) return trimmed
  // add language - добавляем слеш между localeIndex и trimmed
  // Убираем начальный слеш из trimmed если он есть, чтобы избежать двойных слешей
  const cleanHref = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `/${localeIndex}/${cleanHref}`
}

export function isExternalUrl(url) {
  return Boolean(url && url.match(/^[\a-z\d]+\:\/\//))
}

/** Resolve article preview text inside article. Or return undefined */
export function resolveArticlePreview(frontmatter) {
  const { previewText, descrAsPreview, description } = frontmatter

  if (previewText) {
    return previewText
  } else if (descrAsPreview && description) {
    return description
  }
}

/**
 * Генерирует полный URL для текущей страницы from pageData.relativePath
 *
 * @param {string} relativePath - Путь к файлу
 * @returns {string} Полный URL
 */
export function generatePageUrlPath(relativePath) {
  // Убираем расширение файла
  const cleanPath = pathTrimExt(relativePath)

  // Убираем индекс из пути
  let finalPath = cleanPath.replace(/\/index$/, '')

  if (finalPath === 'index') finalPath = ''

  return finalPath
}

/**
 * Сортирует посты по популярности или по дате
 *
 * @param {Array} posts - Массив постов для сортировки
 * @param {string} sortBy - Метрика для сортировки по популярности
 * @param {boolean} sortByPopularity - Сортировать ли по популярности (true) или
 *   по дате (false)
 * @returns {Array} Отсортированный массив постов
 */
export function sortPosts(posts, sortBy, sortByPopularity = false) {
  if (!posts || !Array.isArray(posts)) return []

  if (sortByPopularity && !sortBy) {
    console.warn('⚠️ Warning: function sortPosts: sortBy is not defined')
    return posts
  }

  return [...posts].sort((a, b) => {
    if (sortByPopularity) {
      // Сортировка по популярности
      // Проверяем наличие статистики (конечное число)
      const aHasStats = Number.isFinite(a.analyticsStats?.[sortBy])
      const bHasStats = Number.isFinite(b.analyticsStats?.[sortBy])

      // Если у обоих постов есть статистика, сортируем по ней
      if (aHasStats && bHasStats) {
        const aValue = a.analyticsStats[sortBy]
        const bValue = b.analyticsStats[sortBy]

        // сортируем по убыванию (больше = лучше)
        return bValue - aValue
      }

      // Если у одного есть статистика, а у другого нет - приоритет у того, у кого есть
      if (aHasStats && !bHasStats) return -1
      if (!aHasStats && bHasStats) return 1

      // Если у обоих нет статистики, сортируем по дате (новые сначала)
      return new Date(b.date || 0) - new Date(a.date || 0)
    } else {
      // Обычная сортировка по дате (новые сначала)
      return new Date(b.date) - new Date(a.date)
    }
  })
}

/**
 * Сортирует посты для отображения похожих постов Приоритет: количество
 * совпадающих тегов > популярность > дата
 *
 * @param {Array} posts - Массив всех постов
 * @param {Array} currentPostTags - Теги текущего поста
 * @param {string} currentPostUrl - URL текущего поста (для исключения)
 * @param {string} sortBy - Метрика для сортировки по популярности
 * @param {number} limit - Максимальное количество постов для возврата
 * @returns {Array} Отсортированный массив похожих постов
 */
export function sortSimilarPosts(
  posts,
  currentPostTags,
  currentPostUrl,
  sortBy,
  limit = 5
) {
  if (!posts || !Array.isArray(posts)) return []
  if (!currentPostTags || !Array.isArray(currentPostTags)) return []

  // Функция для получения пересечения тегов по slug
  const getTagsIntersection = (tags1, tags2) => {
    // Проверяем, что оба массива существуют и являются массивами
    if (!Array.isArray(tags1) || !Array.isArray(tags2)) {
      return []
    }

    const slugs1 = tags1.map((tag) => tag?.slug).filter(Boolean)
    const slugs2 = tags2.map((tag) => tag?.slug).filter(Boolean)

    return arraysIntersection(slugs1, slugs2)
  }

  // Функция для получения значения популярности поста
  const getPopularityValue = (post) => {
    if (!sortBy) return 0

    const stats = post.analyticsStats?.[sortBy]
    return stats !== undefined && stats !== null ? stats : 0
  }

  return [...posts]
    .filter((item) => {
      // Исключаем текущий пост
      const isCurrentPost = item.url === currentPostUrl
      if (isCurrentPost) return false

      // Проверяем наличие тегов у поста
      if (!item.tags || !Array.isArray(item.tags)) return false

      // Проверяем пересечение тегов
      const intersection = getTagsIntersection(item.tags, currentPostTags)
      return intersection.length > 0
    })
    .sort((a, b) => {
      // Сортируем по количеству совпадающих тегов (больше совпадений - выше)
      const aIntersection = getTagsIntersection(a.tags, currentPostTags).length
      const bIntersection = getTagsIntersection(b.tags, currentPostTags).length

      if (aIntersection !== bIntersection) {
        return bIntersection - aIntersection
      }

      // Если количество совпадений одинаковое, сортируем по популярности
      const aPopularity = getPopularityValue(a)
      const bPopularity = getPopularityValue(b)

      if (aPopularity !== bPopularity) {
        return bPopularity - aPopularity
      }

      // Если популярность одинаковая, сортируем по дате (новые сверху)
      return new Date(b.date) - new Date(a.date)
    })
    .slice(0, limit)
}

export function resolveBodyMarker(theme, frontmatter) {
  const bodyMarker = theme.search?.bodyMarker

  if (!bodyMarker) return undefined

  let allowed = true

  // by default util pages are excluded from search
  if (isUtilPage(frontmatter)) {
    allowed = frontmatter.searchIncluded || false
  } else {
    // all other pages are included in search by default
    allowed =
      typeof frontmatter.searchIncluded === 'undefined' ||
      frontmatter.searchIncluded === null
        ? true
        : frontmatter.searchIncluded || false
  }

  return allowed ? bodyMarker : undefined
}
