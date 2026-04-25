/** Валидирует обязательные поля frontmatter для RSS */
export function validatePostForRss(frontmatter: any, url: string): boolean {
  const errors: string[] = []

  if (!frontmatter.title) {
    errors.push('missing title')
  }

  if (!frontmatter.date) {
    errors.push('missing date')
  } else {
    // Проверяем что дата валидна
    const date = new Date(frontmatter.date)
    if (isNaN(date.getTime())) {
      errors.push('invalid date format')
    } else {
      // Проверяем что дата не в будущем (с небольшим допуском)
      const now = new Date()
      const futureLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000) // +1 день
      if (date > futureLimit) {
        errors.push('date is too far in the future')
      }
    }
  }

  if (errors.length > 0) {
    console.warn(`Post ${url} validation failed: ${errors.join(', ')}`)
    return false
  }

  return true
}

/** Создает уникальный GUID для поста */
export function createPostGuid(siteUrl: string, url: string, date?: string | Date): string {
  const dateStr = date ? new Date(date).toISOString().split('T')[0] : ''
  return `${siteUrl}${url}${dateStr ? `#${dateStr}` : ''}`
}

export interface RssCategory {
  name: string
  domain: string
}

/** Форматирует теги для использования в RSS категориях */
export function formatTagsForRss(tags: unknown, siteUrl: string): RssCategory[] {
  if (!tags || !Array.isArray(tags)) return []

  return (tags as unknown[])
    .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => ({
      name: tag.trim(),
      domain: `${siteUrl}/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    }))
}

/** Валидирует конфигурацию для генерации RSS */
export function validateRssConfig(config: any): boolean {
  const errors: string[] = []

  if (!config.site?.locales) {
    errors.push('missing site.locales configuration')
  }

  if (!config.userConfig?.siteUrl) {
    errors.push('missing siteUrl configuration')
  }

  if (!config.outDir) {
    errors.push('missing outDir configuration')
  }

  if (errors.length > 0) {
    console.error('RSS configuration validation failed:', errors.join(', '))
    return false
  }

  return true
}

export interface RssFormatInfo {
  mimeType: string
  title: string
  extension: string
  generator: (feed: any) => string
}

/** Возвращает информацию о формате RSS */
export function getFormatInfo(format: string): RssFormatInfo {
  const formats: Record<string, RssFormatInfo> = {
    rss: {
      mimeType: 'application/rss+xml',
      title: 'RSS Feed',
      extension: 'rss',
      generator: (feed) => feed.rss2(),
    },
    atom: {
      mimeType: 'application/atom+xml',
      title: 'Atom Feed',
      extension: 'atom',
      generator: (feed) => feed.atom1(),
    },
    json: {
      mimeType: 'application/feed+json',
      title: 'JSON Feed',
      extension: 'json',
      generator: (feed) => feed.json1(),
    },
  }

  return formats[format] ?? formats.rss!
}

/** Получает настройки форматов RSS из конфигурации */
export function getRssFormats(config: any): string[] {
  return config.userConfig.rssFormats || ['rss', 'atom', 'json']
}

export function makeAuthorForRss(
  config: any,
  frontmatter: any,
  siteUrl: string,
  localeIndex: string
): { name: string; link: string } | undefined {
  if (!frontmatter.authorId) return undefined

  const authors = config.userConfig.locales[localeIndex].themeConfig?.authors

  if (!Array.isArray(authors)) return

  const author = authors.find((item: any) => item.id === frontmatter.authorId)

  if (!author) return

  return {
    name: author.name,
    link: `${siteUrl}/${config.userConfig.themeConfig.authorsBaseUrl}/${author.id}/1`,
  }
}
