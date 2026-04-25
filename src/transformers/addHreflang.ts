import { ROOT_LANG } from '../constants.ts'
import { generatePageUrlPath } from '../helpers/helpers.ts'

export interface AddHreflangContext {
  page: string
  head: any[]
  pageData?: any
  siteConfig: any
}

/** Добавляет метатеги hreflang в head страницы для SEO и многоязычности. */
export function addHreflang({ page, head, siteConfig }: AddHreflangContext): void {
  if (!page || page.indexOf('/') < 0) {
    return
  }

  const availableLocales = siteConfig.site.locales
  const siteUrl = siteConfig.userConfig.siteUrl

  if (!siteUrl || !availableLocales) return

  const localesIndexes = Object.keys(availableLocales).filter(
    (lang) => lang !== ROOT_LANG
  )

  if (localesIndexes.length === 0) return

  const [, ...restPath] = page.split('/')
  const pagePathWithoutLang = restPath.join('/')
  const cleanPath = generatePageUrlPath(pagePathWithoutLang)
  const finalPath = cleanPath ? `/${cleanPath}` : ''

  localesIndexes.forEach((lang) => {
    const langCode = availableLocales[lang]?.lang || lang

    head.push([
      'link',
      {
        rel: 'alternate',
        hreflang: langCode,
        href: `${siteUrl}/${lang}${finalPath}`,
      },
    ])
  })

  const defaultLocale = siteConfig.userConfig?.themeConfig?.defaultLocale
  const rootLang = siteConfig.userConfig?.locales?.root?.lang
  const mainLang =
    localesIndexes.find((lang) => lang === defaultLocale) ||
    localesIndexes.find((lang) => availableLocales[lang]?.lang === rootLang) ||
    localesIndexes[0]

  if (!mainLang) {
    console.warn(
      `[addHreflang] Не удалось определить основной язык для страницы: ${page}`
    )
    return
  }

  head.push([
    'link',
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}/${mainLang}${finalPath}`,
    },
  ])
}
