import tailwindcss from '@tailwindcss/vite'
import type {
  UserConfig,
  HeadConfig,
  TransformContext,
  SiteConfig,
} from 'vitepress'
import { omitUndefined, hasNoIndex } from '../utils/shared/index.ts'
import { deepMerge } from '../utils/shared/merge.ts'
import blogBaseLocales from './blogLocalesBase/index.ts'
import { addJsonLd } from '../transformers/addJsonLd.ts'
import { addHreflang } from '../transformers/addHreflang.ts'
import { addOgMetaTags } from '../transformers/addOgMetaTags.ts'
import { addRssLinks } from '../transformers/addRssLinks.ts'
import { filterSitemap } from '../transformers/filterSitemap.ts'
import type { SitemapItem } from '../transformers/filterSitemap.ts'
import { generateRssFeed } from '../transformers/generateRssFeed.ts'
import { generateRobotsTxt } from '../transformers/generateRobotsTxt.ts'
import { transformPageMeta } from '../transformers/transformPageMeta.ts'
import { transformTitle } from '../transformers/transformTitle.ts'
import { resolveDescription } from '../transformers/resolveDescription.ts'
import { addCanonicalLink } from '../transformers/addCanonicalLink.ts'
import { collectImageDimensions } from '../transformers/collectImageDimensions.ts'
import { mdImage } from '../transformers/mdImage.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  BlogUserConfig,
  ThemeConfig,
  SeoConfig,
  BlogHooks,
  I18n,
} from '../types.d.ts'

// ---------------------------------------------------------------------------
// Type adapters — isolate all `as unknown as` casts in one place so the
// rest of the file can use named, readable casts instead of inline ones.
// ---------------------------------------------------------------------------

type TransformHeadContext = {
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
  page: string
}

function asExtendedPageData(pageData: unknown): ExtendedPageData {
  return pageData as ExtendedPageData
}

function asTransformContext(ctx: unknown): TransformContext {
  return ctx as unknown as TransformContext
}

function asExtendedSiteConfig(siteConfig: unknown): ExtendedSiteConfig {
  return siteConfig as unknown as ExtendedSiteConfig
}

function asTransformHeadContext(ctx: unknown): TransformHeadContext {
  return ctx as unknown as TransformHeadContext
}

// ---------------------------------------------------------------------------
// Generic hook runner for single-argument hooks.
// ---------------------------------------------------------------------------

function runHooks<T>(
  hooks: Array<(arg: T) => void | Promise<void>> | undefined,
  arg: T
): Promise<void> {
  if (!hooks?.length) return Promise.resolve()
  return hooks.reduce<Promise<void>>(
    (promise, fn) => promise.then(() => fn(arg)),
    Promise.resolve()
  )
}

// ---------------------------------------------------------------------------
// Tailwind plugin guard — type-safe name check that handles nested arrays.
// ---------------------------------------------------------------------------

function hasTailwindPlugin(plugins: unknown): boolean {
  const flat = Array.isArray(plugins) ? (plugins as unknown[]).flat(10) : []
  return flat.some(
    (p) =>
      p != null &&
      typeof p === 'object' &&
      'name' in p &&
      (p as Record<string, unknown>).name === 'tailwindcss'
  )
}

type ResolvedBlogConfig = BlogUserConfig & {
  head: NonNullable<UserConfig['head']>
  locales: NonNullable<BlogUserConfig['locales']>
  markdown: NonNullable<UserConfig['markdown']> & {
    image: NonNullable<NonNullable<UserConfig['markdown']>['image']>
  }
  sitemap: NonNullable<UserConfig['sitemap']> & {
    transformItems: NonNullable<
      NonNullable<UserConfig['sitemap']>['transformItems']
    >
  }
  themeConfig: Partial<ThemeConfig> & {
    popularPosts: NonNullable<ThemeConfig['popularPosts']>
    t: I18n
  }
  vite: NonNullable<UserConfig['vite']> & {
    ssr: NonNullable<NonNullable<UserConfig['vite']>['ssr']>
    build: NonNullable<NonNullable<UserConfig['vite']>['build']>
  }
}

const commonThemeConfig = {
  externalLinkIcon: true,
  autoCanonical: true,
  mainHeroImg: '/img/home-logo.webp',

  perPage: 10,
  sidebarTagsCount: 15,
  similarPostsCount: 5,
  homeBgParallaxOffset: 300,
  paginationMaxItems: 5,
  postList: {
    showDate: true,
    showTags: true,
    showThumbnail: true,
    showPreview: true,
    showAuthor: true,
    maxPreviewLength: 300,
  },

  popularPosts: {
    enabled: false,
    sortBy: 'pageviews',
    dataSource: {
      provider: 'ga4' as const,
      propertyId: null,
      credentialsJson: null,
      dataPeriodDays: 30,
      dataLimit: 1000,
    },
  },

  tagsBaseUrl: 'tags',
  archiveBaseUrl: 'archive',
  popularBaseUrl: 'popular',
  recentBaseUrl: 'recent',
  authorsBaseUrl: 'authors',

  donateIcon: 'fa6-solid:hand-holding-heart',
  recentIcon: 'fa6-solid:bolt',
  popularIcon: 'fa6-solid:star',
  byDateIcon: 'fa6-solid:calendar-days',
  authorsIcon: 'mdi:users',
  rssIcon: 'bi:rss-fill',
  atomIcon: 'vscode-icons:file-type-atom',
  youtubeIcon: 'fa6-brands:youtube',
  tagsIcon: 'fa6-solid:tag',
} satisfies Partial<ThemeConfig>

export const common: BlogUserConfig = {
  head: [
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],

    ['link', { rel: 'icon', sizes: '16x16', href: '/img/favicon-16x16.png' }],
    ['link', { rel: 'icon', sizes: '32x32', href: '/img/favicon-32x32.png' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    ],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],
  srcExclude: ['site/**', '**/site/**'],
  lastUpdated: true,
  cleanUrls: true,
  lang: 'en-US',

  maxPostsInRssFeed: 50,
  rssFormats: ['rss', 'atom', 'json'],
  maxDescriptionLength: 300,

  themeConfig: commonThemeConfig,
}

function runTransformPageDataHooks(
  hooks: BlogHooks['transformPageData'] | undefined,
  phase: 'before' | 'after',
  pageData: ExtendedPageData,
  ctx: TransformContext
): Promise<void> {
  const fns = hooks?.[phase]
  if (!fns) return Promise.resolve()

  return fns.reduce<Promise<void>>(
    (promise, fn) => promise.then(() => fn(pageData, ctx)),
    Promise.resolve()
  )
}

function warnMissingRequired(config: BlogUserConfig): void {
  if (!config.siteUrl) {
    console.warn(
      '[vitepress-theme-neptu-blog] `siteUrl` is not set. ' +
        'SEO features (sitemap, RSS, canonical links) may produce broken URLs.'
    )
  }

  if (!config.locales || Object.keys(config.locales).length === 0) {
    console.warn(
      '[vitepress-theme-neptu-blog] `locales` is empty. ' +
        'The theme requires at least one locale (e.g. `{ en: { lang: "en-US" } }`).'
    )
  }
}

/**
 * Low-level config merge without validation warnings.
 *
 * Applies all built-in defaults (head, vite, markdown, sitemap, transformers,
 * deep-merges postList / popularPosts / t) on top of the provided config. Does
 * NOT emit warnings for missing required fields.
 *
 * Prefer {@link defineBlogConfig} as the standard entry point — it wraps this
 * function and also calls `warnMissingRequired`. Use `mergeBlogConfig` directly
 * only when composing configs programmatically and you want to suppress
 * warnings (e.g. in tests or multi-step merge pipelines).
 */
export function mergeBlogConfig(config: BlogUserConfig): ResolvedBlogConfig {
  const externalLinkIcon =
    typeof config.themeConfig?.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : commonThemeConfig.externalLinkIcon

  const noIndexUrls = new Set<string>()

  function normalizeSitemapUrl(relativePath: string): string {
    return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  }

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title,
    description: config.description || config.en?.description,
    head: [...(common.head || []), ...(config.head || [])],
    locales: { ...(common.locales || {}), ...(config.locales || {}) },
    vite: {
      ...config.vite,
      plugins: [
        ...(hasTailwindPlugin(config.vite?.plugins) ? [] : [tailwindcss()]),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items) => {
        return filterSitemap(items as unknown as SitemapItem[], noIndexUrls)
      },
      ...config.sitemap,
    } as UserConfig['sitemap'],
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
      }),
      config: (md) => {
        md.use(mdImage, { srcDir: config.srcDir })

        if (config.markdown?.config) {
          config.markdown.config(md)
        }
      },
    },

    themeConfig: {
      ...common.themeConfig,
      ...config.themeConfig,

      popularPosts: {
        ...commonThemeConfig.popularPosts,
        ...config.themeConfig?.popularPosts,
        dataSource: {
          ...commonThemeConfig.popularPosts.dataSource,
          ...config.themeConfig?.popularPosts?.dataSource,
        },
      },

      postList: {
        ...commonThemeConfig.postList,
        ...config.themeConfig?.postList,
      },

      t: deepMerge(
        (blogBaseLocales.en as { t: I18n }).t,
        (config.themeConfig?.t ?? {}) as Record<string, unknown>
      ) as I18n,
    },

    async transformPageData(pageData, ctx) {
      const extendedPageData = asExtendedPageData(pageData)
      const extendedSiteConfig = asExtendedSiteConfig(ctx.siteConfig)
      const typedCtx = asTransformContext(ctx)

      await runTransformPageDataHooks(
        config.hooks?.transformPageData,
        'before',
        extendedPageData,
        typedCtx
      )

      collectImageDimensions(extendedPageData, extendedSiteConfig)
      transformTitle(extendedPageData, { siteConfig: extendedSiteConfig })
      transformPageMeta(extendedPageData)
      resolveDescription(extendedPageData, { siteConfig: extendedSiteConfig })

      if (hasNoIndex(extendedPageData.frontmatter.head)) {
        noIndexUrls.add(normalizeSitemapUrl(extendedPageData.relativePath))
      }

      await runTransformPageDataHooks(
        config.hooks?.transformPageData,
        'after',
        extendedPageData,
        typedCtx
      )
    },

    async transformHead(ctx) {
      const extendedCtx = asTransformHeadContext(ctx)
      const typedCtx = asTransformContext(ctx)

      await runHooks(config.hooks?.transformHead?.before, typedCtx)

      const pageSeo = extendedCtx.pageData.frontmatter?.seo
      const globalSeo = extendedCtx.siteConfig.userConfig?.themeConfig?.seo
      const isSeoEnabled = (key: keyof SeoConfig): boolean => {
        if (pageSeo?.[key] !== undefined) return pageSeo[key] !== false
        if (globalSeo?.[key] !== undefined) return globalSeo[key] !== false
        return true
      }

      const isNoIndex = hasNoIndex(extendedCtx.pageData.frontmatter?.head)

      if (isSeoEnabled('og')) addOgMetaTags(extendedCtx)
      if (!isNoIndex && isSeoEnabled('jsonLd')) addJsonLd(extendedCtx)
      if (!isNoIndex && isSeoEnabled('hreflang')) addHreflang(extendedCtx)
      if (isSeoEnabled('canonical')) addCanonicalLink(extendedCtx)
      if (isSeoEnabled('rss')) addRssLinks(extendedCtx)

      if (config.transformHead) {
        await config.transformHead(typedCtx)
      }

      await runHooks(config.hooks?.transformHead?.after, typedCtx)
    },

    buildEnd: async (cfg: SiteConfig) => {
      await generateRssFeed(asExtendedSiteConfig(cfg))
      generateRobotsTxt(asExtendedSiteConfig(cfg))

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }

      await runHooks(config.hooks?.buildEnd, cfg)
    },
  } as ResolvedBlogConfig
}

/**
 * Standard entry point for blog configuration.
 *
 * Calls {@link mergeBlogConfig} to apply all built-in defaults, and additionally
 * emits `console.warn` for commonly missed required fields (`siteUrl`,
 * `locales`).
 *
 * Use this function in your `.vitepress/config.ts`. Use {@link mergeBlogConfig}
 * only when you need a silent merge (tests, multi-step composition).
 */
export function defineBlogConfig(config: BlogUserConfig): ResolvedBlogConfig {
  warnMissingRequired(config)

  return mergeBlogConfig(config)
}
