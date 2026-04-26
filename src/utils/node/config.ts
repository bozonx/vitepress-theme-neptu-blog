import { standardTemplate } from '../shared/string.ts'
import { isExternalUrl } from '../shared/url.ts'
import { parseLocaleSite } from './i18n.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'

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

