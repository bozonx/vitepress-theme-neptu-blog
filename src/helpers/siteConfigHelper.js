import { standardTemplate } from './squidlet.js'
import {
  loadConfigYamlFile,
  parseLocaleSite,
} from '../helpers/parseSiteFileTranslations.js'
import { isExternalUrl } from './helpers.js'
import { common } from '../configs/siteConfigBase.js'
import en from '../configs/siteLocalesBase/en.js'
import ru from '../configs/siteLocalesBase/ru.js'

const baseLocales = { en, ru }

export async function loadSiteLocale(localeIndex, config) {
  const baseLocale = baseLocales[localeIndex]
  const params = {
    localeIndex,
    config,
    theme: { ...common.themeConfig, ...config.themeConfig },
    t: baseLocale.t,
  }
  const site = parseLocaleSite(config.srcDir, params)
  const {
    lang,
    title,
    description,
    t,
    editLink,
    lastUpdated,
    search,
    ...themeConfig
  } = site

  const sidebar = parseLocaleSidebar(config.srcDir, params)

  return {
    lang,
    label: baseLocale.label,
    title,
    description,
    search: { ...baseLocale.search, ...search },
    themeConfig: {
      ...baseLocale.themeConfig,
      ...themeConfig,
      editLink: {
        pattern: `${params.config.repo}/edit/main/src/:path`,
        ...baseLocale.themeConfig.editLink,
        ...editLink,
      },
      lastUpdated: {
        ...common.themeConfig.lastUpdated,
        ...baseLocale.themeConfig.lastUpdated,
        ...lastUpdated,
      },
      t: { ...baseLocale.t, ...t },
      sidebar,
    },
  }
}

export function parseLocaleSidebar(srcDir, params) {
  const sidebar = loadConfigYamlFile(
    srcDir,
    `sidebar.${params.localeIndex}.yaml`
  )

  function menuRecursive(items, linkPrePath) {
    for (const item of items) {
      item.text = standardTemplate(item.text, params)

      if (typeof item.link === 'string') {
        item.link = standardTemplate(item.link, params)

        if (item.link.indexOf('/') !== 0 && !isExternalUrl(item.link)) {
          item.link = linkPrePath + item.link
        }
      }

      if (item.items) {
        item.items = menuRecursive(item.items, linkPrePath)
      }
    }

    return items
  }

  const newSidebar = {}

  for (const key of Object.keys(sidebar)) {
    const linkPrePath = `/${params.localeIndex}/${key}/`

    newSidebar[linkPrePath] = menuRecursive(sidebar[key], linkPrePath)
  }

  return newSidebar
}
