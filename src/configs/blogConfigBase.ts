import tailwindcss from '@tailwindcss/vite'
import type {
  UserConfig,
  HeadConfig,
  TransformContext,
  SiteConfig,
} from 'vitepress'
import { omitUndefined } from '../utils/shared/index.ts'
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
} from '../types.d.ts'

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

function warnDeprecated(config: BlogUserConfig): void {
  if (config.themeConfig?.googleAnalytics) {
    console.warn(
      '[vitepress-theme-neptu-blog] `themeConfig.googleAnalytics` is deprecated. ' +
        'Use `themeConfig.popularPosts.dataSource` instead.'
    )
  }
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

export function mergeBlogConfig(config: BlogUserConfig): ResolvedBlogConfig {
  const externalLinkIcon =
    typeof config.themeConfig?.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : commonThemeConfig.externalLinkIcon

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
        ...(config.vite?.plugins?.some(
          (p: unknown) => (p as { name: string })?.name === 'tailwindcss'
        )
          ? []
          : [tailwindcss()]),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items) => {
        return filterSitemap(items as unknown as SitemapItem[])
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
          // Fallback for deprecated themeConfig.googleAnalytics
          ...(config.themeConfig?.googleAnalytics
            ? {
                provider: 'ga4' as const,
                ...config.themeConfig.googleAnalytics,
              }
            : {}),
        },
      },

      postList: {
        ...commonThemeConfig.postList,
        ...config.themeConfig?.postList,
      },
    },

    async transformPageData(pageData, ctx) {
      const extendedPageData = pageData as ExtendedPageData
      const extendedSiteConfig = ctx.siteConfig as unknown as ExtendedSiteConfig

      await runTransformPageDataHooks(
        config.hooks?.transformPageData,
        'before',
        extendedPageData,
        ctx as unknown as TransformContext
      )

      collectImageDimensions(extendedPageData, extendedSiteConfig)
      transformTitle(extendedPageData, { siteConfig: extendedSiteConfig })
      transformPageMeta(extendedPageData)
      resolveDescription(extendedPageData, { siteConfig: extendedSiteConfig })

      await runTransformPageDataHooks(
        config.hooks?.transformPageData,
        'after',
        extendedPageData,
        ctx as unknown as TransformContext
      )

      if (config.transformPageData) {
        await config.transformPageData(pageData, ctx)
      }
    },

    async transformHead(ctx) {
      const extendedCtx = ctx as unknown as {
        head: HeadConfig[]
        pageData: ExtendedPageData
        siteConfig: ExtendedSiteConfig
        page: string
      }

      const pageSeo = extendedCtx.pageData.frontmatter?.seo
      const globalSeo = extendedCtx.siteConfig.userConfig?.themeConfig?.seo
      const isSeoEnabled = (key: keyof SeoConfig): boolean => {
        if (pageSeo?.[key] !== undefined) return pageSeo[key] !== false
        if (globalSeo?.[key] !== undefined) return globalSeo[key] !== false
        return true
      }

      if (isSeoEnabled('og')) addOgMetaTags(extendedCtx)
      if (isSeoEnabled('jsonLd')) addJsonLd(extendedCtx)
      if (isSeoEnabled('hreflang')) addHreflang(extendedCtx)
      if (isSeoEnabled('canonical')) addCanonicalLink(extendedCtx)
      if (isSeoEnabled('rss')) addRssLinks(extendedCtx)

      if (config.transformHead) {
        await config.transformHead(ctx as unknown as TransformContext)
      }
    },

    buildEnd: async (cfg: SiteConfig) => {
      await generateRssFeed(cfg as unknown as ExtendedSiteConfig)
      generateRobotsTxt(cfg as unknown as ExtendedSiteConfig)

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }
    },
  } as ResolvedBlogConfig
}

export function defineBlogConfig(config: BlogUserConfig): ResolvedBlogConfig {
  warnDeprecated(config)
  warnMissingRequired(config)

  return mergeBlogConfig(config)
}
