import { deepMerge } from '../shared/merge.ts'
import { parseLocaleSite } from './i18n.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { resolveBaseLocaleKey } from '../shared/i18n.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import type { BlogUserConfig } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import type { UiLocaleDefinition } from '../../types.d.ts'

function resolveInitialUiLocaleKey(
  localeIndex: string,
  uiLocales: Record<string, UiLocaleDefinition> = {},
  defaultLocale?: string
): string {
  if (uiLocales[localeIndex]) return localeIndex

  const baseLocale = localeIndex.split('-')[0]
  if (baseLocale && uiLocales[baseLocale]) return baseLocale

  if (defaultLocale && uiLocales[defaultLocale]) return defaultLocale

  return resolveBaseLocaleKey(localeIndex, blogBaseLocales as Record<string, unknown>)
}

function resolveUiLocaleDefinition(
  localeKey: string,
  builtIns: Record<string, any>,
  uiLocales: Record<string, UiLocaleDefinition> = {},
  visited = new Set<string>()
): UiLocaleDefinition {
  if (visited.has(localeKey)) return {}
  visited.add(localeKey)

  const builtIn = builtIns[localeKey]
  const custom = uiLocales[localeKey] || {}
  const parent = custom.extends
    ? resolveUiLocaleDefinition(custom.extends, builtIns, uiLocales, visited)
    : builtIn
    ? {
        label: builtIn.label,
        themeConfig: builtIn.themeConfig,
        t: builtIn.t,
      }
    : {}

  return {
    label: custom.label || parent.label,
    themeConfig: deepMerge(
      (parent.themeConfig || {}) as Record<string, unknown>,
      custom.themeConfig || {}
    ),
    t: deepMerge((parent.t || {}) as Record<string, unknown>, custom.t || {}),
  }
}

export async function loadBlogLocale(localeIndex: string, config: BlogUserConfig): Promise<any> {
  const localeMap = blogBaseLocales as Record<string, any>
  const baseLocaleKey = resolveBaseLocaleKey(localeIndex, localeMap)
  const baseLocale = localeMap[baseLocaleKey]
  const uiLocaleKey = resolveInitialUiLocaleKey(
    localeIndex,
    config.themeConfig?.uiLocales,
    config.themeConfig?.uiLocale?.default
  )
  const uiLocale = resolveUiLocaleDefinition(
    uiLocaleKey,
    localeMap,
    config.themeConfig?.uiLocales
  )
  const resolvedTheme = deepMerge(
    { ...blogCommon.themeConfig, ...config.themeConfig } as Record<string, unknown>,
    {
      ...(baseLocale.themeConfig || {}),
      ...(uiLocale.themeConfig || {}),
      t: {
        ...baseLocale.t,
        ...(uiLocale.t || {}),
      },
    }
  )
  const params = {
    localeIndex,
    config,
    theme: resolvedTheme,
    t: (resolvedTheme as Record<string, any>).t,
  }
  const site = parseLocaleSite(config.srcDir || '', params) as any
  const { lang, title, description, t, editLink, ...themeConfig } = site

  const authors = themeConfig.authors?.map((item: any) => {
    const imageDimensions = item.image
      ? getImageDimensions(item.image as string, config.srcDir || '')
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
      ...(uiLocale.themeConfig || {}),
      ...themeConfig,
      editLink: {
        pattern: `${config.repo}/edit/main/src/:path`,
        ...baseLocale.themeConfig.editLink,
        ...((uiLocale.themeConfig || {}) as Record<string, any>).editLink,
        ...editLink,
      },
      t: { ...baseLocale.t, ...(uiLocale.t || {}), ...t },
      authors,
    },
  }
}
