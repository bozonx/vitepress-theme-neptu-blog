import { parseLocaleSite } from './parseSiteFileTranslations.js'
import { mdToHtml } from './mdWorks.js'
import { getImageDimensions } from './imageHelpers.js'
import { common } from '../configs/blogConfigBase.js'
import baseLocales from '../configs/blogLocalesBase/index.js'

export async function loadBlogLocale(localeIndex: string, config: any): Promise<any> {
  const baseLocale = (baseLocales as Record<string, any>)[localeIndex]
  const params = {
    localeIndex,
    config,
    theme: { ...common.themeConfig, ...config.themeConfig },
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
