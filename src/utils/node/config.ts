import { deepMerge } from '../shared/merge.ts'
import { parseLocaleSite, parseSharedSite } from './i18n.ts'
import { mdToHtml } from './markdown.ts'
import { getImageDimensions } from './image.ts'
import { resolveBaseLocaleKey } from '../shared/i18n.ts'
import { common as blogCommon } from '../../configs/blogConfigBase.ts'
import blogBaseLocales from '../../configs/blogLocalesBase/index.ts'
import { resolveEditLinkPattern } from './editLink.ts'
import type {
  UiLocaleDefinition,
  LocaleDefinition,
  Author,
  BlogUserConfig,
  ThemeConfig,
  I18n,
} from '../../types.d.ts'

type EditLinkConfig = NonNullable<ThemeConfig['editLink']>

/**
 * Extracts the `themeConfig` block from a site YAML payload.
 *
 * Both `<srcDir>/site.yaml` (shared) and `<srcDir>/<locale>/_site.yaml`
 * (per-locale) follow the canonical `Partial<BlogUserConfig>` shape:
 * top-level keys for VitePress identity (`lang`, `title`, `titleTemplate`,
 * `description`) and a nested `themeConfig:` block for everything else.
 */
function extractThemeConfig(
  site: Record<string, unknown> | undefined
): Record<string, unknown> {
  return ((site?.themeConfig as Record<string, unknown> | undefined) ?? {})
}

function resolveInitialUiLocaleKey(
  localeIndex: string,
  uiLocales: Record<string, UiLocaleDefinition> = {},
  defaultLocale?: string
): string {
  if (uiLocales[localeIndex]) return localeIndex

  const baseLocale = localeIndex.split('-')[0]
  if (baseLocale && uiLocales[baseLocale]) return baseLocale

  if (defaultLocale && uiLocales[defaultLocale]) return defaultLocale

  return resolveBaseLocaleKey(
    localeIndex,
    blogBaseLocales as Record<string, unknown>
  )
}

function resolveUiLocaleDefinition(
  localeKey: string,
  builtIns: Record<string, LocaleDefinition>,
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
      ? { label: builtIn.label, themeConfig: builtIn.themeConfig, t: builtIn.t }
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

export async function loadBlogLocale(
  localeIndex: string,
  config: BlogUserConfig
): Promise<LocaleDefinition & { label?: string }> {
  const localeMap = blogBaseLocales as unknown as Record<
    string,
    LocaleDefinition
  >
  const baseLocaleKey = resolveBaseLocaleKey(localeIndex, localeMap)
  const baseLocale = localeMap[baseLocaleKey]
  const uiLocaleKey = resolveInitialUiLocaleKey(
    localeIndex,
    config.themeConfig?.uiLocales || {},
    config.themeConfig?.uiLocale?.default
  )
  const uiLocale = resolveUiLocaleDefinition(
    uiLocaleKey,
    localeMap,
    config.themeConfig?.uiLocales || {}
  )

  // ------------------------------------------------------------------
  // Shared <srcDir>/site.yaml — admin-editable layer applied to every
  // locale. Sits between config.ts and per-locale YAML in priority.
  // Template substitution context uses common+config defaults so that
  // ${theme.*} can reference values declared in config.ts.
  // ------------------------------------------------------------------
  const sharedThemeBaseForTemplate = {
    ...(blogCommon.themeConfig || {}),
    ...(config.themeConfig || {}),
  } as Record<string, unknown>
  const sharedSite = parseSharedSite(config.srcDir || '', {
    localeIndex,
    config,
    theme: sharedThemeBaseForTemplate,
    t: (sharedThemeBaseForTemplate.t as Record<string, unknown> | undefined) ?? {},
  }) as Record<string, unknown>
  const sharedThemeConfig = extractThemeConfig(sharedSite)

  const resolvedTheme = deepMerge(
    deepMerge(sharedThemeBaseForTemplate, sharedThemeConfig),
    {
      ...(baseLocale.themeConfig || {}),
      ...(uiLocale.themeConfig || {}),
      t: { ...baseLocale.t, ...(uiLocale.t || {}) },
    }
  )
  const params = {
    localeIndex,
    config,
    theme: resolvedTheme,
    t: (resolvedTheme as Record<string, unknown>).t as Record<string, unknown>,
  }
  const site = parseLocaleSite(config.srcDir || '', params) as Record<
    string,
    unknown
  >
  const {
    lang,
    title: rawTitle,
    titleTemplate,
    description,
  } = site
  const localeThemeConfig = extractThemeConfig(site)
  const title =
    rawTitle ??
    (localeThemeConfig.blogTitle as string | undefined) ??
    (sharedThemeConfig.blogTitle as string | undefined)

  const mergedAuthors =
    (localeThemeConfig.authors as Author[] | undefined) ??
    (sharedThemeConfig.authors as Author[] | undefined)
  const authors = mergedAuthors?.map((item) => {
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
    lang: typeof lang === 'string' ? lang : undefined,
    label: baseLocale.label,
    title: typeof title === 'string' ? title : undefined,
    titleTemplate: typeof titleTemplate === 'string' ? titleTemplate : undefined,
    description: typeof description === 'string' ? description : undefined,
    themeConfig: {
      ...baseLocale.themeConfig,
      ...(uiLocale.themeConfig || {}),
      ...sharedThemeConfig,
      ...localeThemeConfig,
      editLink: {
        ...(config.themeConfig?.repo
          ? { pattern: resolveEditLinkPattern(config.themeConfig.repo) }
          : {}),
        ...baseLocale.themeConfig?.editLink,
        ...(((uiLocale.themeConfig || {}) as Record<string, unknown>)
          .editLink as Record<string, unknown> | undefined),
        ...(sharedThemeConfig.editLink as Record<string, unknown> | undefined),
        ...(localeThemeConfig.editLink as Record<string, unknown> | undefined),
      } as EditLinkConfig,
      t: {
        ...baseLocale.t,
        ...(uiLocale.t || {}),
        ...((sharedThemeConfig.t || {}) as Record<string, unknown>),
        ...((localeThemeConfig.t || {}) as Record<string, unknown>),
      } as I18n,
      authors,
    },
  }
}
