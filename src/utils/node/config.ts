import { standardTemplate } from '../shared/string.ts'
import { isExternalUrl } from '../shared/url.ts'
import { parseLocaleSite, loadConfigYamlFile } from './i18n.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import { common as siteCommon } from '../../configs/siteConfigBase.ts'
import siteEn from '../../configs/siteLocalesBase/en.ts'
import siteRu from '../../configs/siteLocalesBase/ru.ts'

const siteBaseLocales: Record<string, any> = { en: siteEn, ru: siteRu }

export async function loadBlogLocale(localeIndex: string, config: any): Promise<any> {
  const baseLocale = (blogBaseLocales as Record<string, any>)[localeIndex]
  const params = {
    localeIndex,
    config,
    theme: { ...blogCommon.themeConfig, ...config.themeConfig },
    t: baseLocale.t,
  }
  const site = parseLocaleSite(config.srcDir, params) as any
  const { lang, title, description, t, editLink, ...themeConfig } = site

  const authors = themeConfig.authors?.map((item: any) => {
    const imageDimensions = item.image
      ? getImageDimensions(item.image, config.srcDir)
      : null

    return {
      ...item,
      description: mdToHtml(item.description),
      imageHeight: imageDimensions?.height,
      imageWidth: imageDimensions?.width,
    }
  })

  return {
    lang,
    label: baseLocale.label,
    title,
    description,
    themeConfig: {
      ...baseLocale.themeConfig,
      ...themeConfig,
      editLink: {
        pattern: `${config.repo}/edit/main/src/:path`,
        ...baseLocale.themeConfig.editLink,
        ...editLink,
      },
      t: { ...baseLocale.t, ...t },
      authors,
    },
  }
}

export async function loadSiteLocale(localeIndex: string, config: any): Promise<any> {
  const baseLocale = siteBaseLocales[localeIndex]
  const params = {
    localeIndex,
    config,
    theme: { ...siteCommon.themeConfig, ...config.themeConfig },
    t: baseLocale.t,
  }
  const site = parseLocaleSite(config.srcDir, params) as any
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
        ...(siteCommon.themeConfig as any).lastUpdated,
        ...baseLocale.themeConfig.lastUpdated,
        ...lastUpdated,
      },
      t: { ...baseLocale.t, ...t },
      sidebar,
    },
  }
}

export function parseLocaleSidebar(srcDir: string, params: any): Record<string, any> {
  const sidebar = loadConfigYamlFile(
    srcDir,
    `sidebar.${params.localeIndex}.yaml`
  ) as Record<string, any[]>

  function menuRecursive(items: any[], linkPrePath: string): any[] {
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

  const newSidebar: Record<string, any> = {}

  for (const key of Object.keys(sidebar)) {
    const linkPrePath = `/${params.localeIndex}/${key}/`

    newSidebar[linkPrePath] = menuRecursive(sidebar[key]!, linkPrePath)
  }

  return newSidebar
}
