import { generatePageUrlPath } from '../helpers/helpers.ts'

export interface AddCanonicalLinkContext {
  page: string
  head: any[]
  pageData: any
  siteConfig: any
}

/** Добавляет каноническую ссылку в head страницы если указан параметр canonical в frontmatter. */
export function addCanonicalLink({
  page,
  head,
  pageData,
  siteConfig,
}: AddCanonicalLinkContext): void {
  if (!page || page.indexOf('/') < 0) {
    return
  }

  const canonicalValue = pageData.frontmatter.canonical

  if (!canonicalValue) return

  try {
    let canonicalUrl: string | null = null

    if (canonicalValue === 'self') {
      const siteUrl = siteConfig.userConfig.siteUrl

      if (!siteUrl) {
        console.warn(
          'Canonical link not added: siteUrl not configured in siteConfig'
        )
        return
      }
      canonicalUrl = `${siteUrl}/${generatePageUrlPath(page)}`
    } else if (typeof canonicalValue === 'string') {
      try {
        new URL(canonicalValue)
        canonicalUrl = canonicalValue
      } catch {
        console.warn(`Invalid canonical URL in ${page}: ${canonicalValue}`)
        return
      }
    } else {
      return
    }

    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
  } catch (error) {
    console.error(`Error adding canonical link for ${page}:`, (error as Error).message)
  }
}
