import { ROOT_LANG } from '../constants.js'
import { generatePageUrlPath } from '../helpers/helpers.js'

/**
 * Добавляет метатеги hreflang в head страницы для SEO и многоязычности
 * Генерирует ссылки на эту же страницу на всех доступных языках
 *
 * @param {Object} context { page, head, pageData, siteConfig }
 */
export function addHreflang({ page, head, siteConfig }) {
  // Пропускаем корневые страницы и страницы без языкового префикса
  if (!page || page.indexOf('/') < 0) {
    return
  }

  // Получаем доступные языки из конфигурации, исключая root
  const availableLocales = siteConfig.site.locales
  const siteUrl = siteConfig.userConfig.siteUrl

  if (!siteUrl || !availableLocales) return

  // Фильтруем языки, исключая root
  const localesIndexes = Object.keys(availableLocales).filter(
    (lang) => lang !== ROOT_LANG
  )

  // Если нет языков, не добавляем hreflang
  if (localesIndexes.length === 0) return

  // Получаем текущий язык из пути файла
  const [, ...restPath] = page.split('/')
  const pagePathWithoutLang = restPath.join('/')
  const cleanPath = generatePageUrlPath(pagePathWithoutLang)
  const finalPath = cleanPath ? `/${cleanPath}` : ''

  // Добавляем метатеги для всех языков, включая текущий
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
