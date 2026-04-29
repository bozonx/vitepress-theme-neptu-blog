import tailwindcss from '@tailwindcss/vite'
import { omitUndefined } from '../utils/shared/index.ts'
import { addJsonLd } from '../transformers/addJsonLd.ts'
import { addHreflang } from '../transformers/addHreflang.ts'
import { addOgMetaTags } from '../transformers/addOgMetaTags.ts'
import { addRssLinks } from '../transformers/addRssLinks.ts'
import { filterSitemap } from '../transformers/filterSitemap.ts'
import { generateRssFeed } from '../transformers/generateRssFeed.ts'
import { transformPageMeta } from '../transformers/transformPageMeta.ts'
import { transformTitle } from '../transformers/transformTitle.ts'
import { resolveDescription } from '../transformers/resolveDescription.ts'
import { addCanonicalLink } from '../transformers/addCanonicalLink.ts'
import { collectImageDimensions } from '../transformers/collectImageDimensions.ts'
import { mdImage } from '../transformers/mdImage.ts'

export const common: Record<string, any> = {
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
  locales: { root: { lang: 'en-US' } },

  maxPostsInRssFeed: 50,
  rssFormats: ['rss', 'atom', 'json'],
  maxDescriptionLength: 300,

  themeConfig: {
    i18nRouting: true,
    externalLinkIcon: true,
    mainHeroImg: '/img/home-logo.webp',

    perPage: 10,
    sidebarTagsCount: 15,
    similarPostsCount: 5,
    homeBgParalaxOffset: 300,
    paginationMaxItems: 5,
    showAuthorInPostList: true,

    googleAnalytics: {
      propertyId: null,
      credentialsJson: null,
      dataPeriodDays: 30,
      dataLimit: 1000,
    },
    popularPosts: {
      enabled: false,
      sortBy: 'pageviews',
    },

    tagsBaseUrl: 'tags',
    archiveBaseUrl: 'archive',
    popularBaseUrl: 'popular',
    recentBaseUrl: 'recent',
    authorsBaseUrl: 'authors',

    donateIcon: 'fa6-solid:heart',
    recentIcon: 'fa6-solid:bolt',
    popularIcon: 'fa6-solid:star',
    byDateIcon: 'fa6-solid:calendar-days',
    authorsIcon: 'mdi:users',
    socialLinksIcon: 'heroicons:megaphone-16-solid',
    rssIcon: 'bi:rss-fill',
    atomIcon: 'vscode-icons:file-type-atom',
    youtubeIcon: 'fa6-brands:youtube',
    telegramIcon: 'fa6-brands:telegram',
    chatIcon: 'fa6-solid:message',
    tagsIcon: 'fa6-solid:tag',
  },
}

export function mergeBlogConfig(config: any): any {
  const externalLinkIcon =
    typeof config.themeConfig?.externalLinkIcon === 'boolean'
      ? config.themeConfig.externalLinkIcon
      : common.themeConfig.externalLinkIcon

  return {
    ...common,
    ...config,
    title: config.title || config.en?.title,
    description: config.description || config.en?.description,
    head: [...common.head, ...(config.head || [])],
    locales: { ...common.locales, ...config.locales },
    vite: {
      ...config.vite,
      plugins: [
        ...(config.vite?.plugins?.some((p: any) => p?.name === 'tailwindcss')
          ? []
          : [tailwindcss()]),
        ...(config.vite?.plugins || []),
      ],
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      transformItems: (items: any[]) => {
        return filterSitemap(items as any)
      },
      ...config.sitemap,
    },
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
        rel: [],
      }),
      config: (md: any) => {
        md.use(mdImage, { srcDir: config.srcDir })

        if (config.markdown?.config) {
          config.markdown.config(md)
        }
      },
    },

    themeConfig: {
      ...common.themeConfig,
      ...config.themeConfig,

      googleAnalytics: {
        ...common.themeConfig.googleAnalytics,
        ...config.themeConfig?.googleAnalytics,
      },
      popularPosts: {
        ...common.themeConfig.popularPosts,
        ...config.themeConfig?.popularPosts,
      },
    },

    async transformPageData(pageData: any, ctx: any) {
      collectImageDimensions(pageData, ctx)
      transformTitle(pageData, ctx)
      transformPageMeta(pageData, ctx)
      resolveDescription(pageData, ctx)

      if (config.transformPageData) {
        await config.transformPageData(pageData, ctx)
      }
    },

    async transformHead(ctx: any) {
      addOgMetaTags(ctx)
      addJsonLd(ctx)
      addHreflang(ctx)
      addCanonicalLink(ctx)
      addRssLinks(ctx)

      if (config.transformHead) {
        await config.transformHead(ctx)
      }
    },

    buildEnd: async (cfg: any) => {
      await generateRssFeed(cfg)

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }
    },
  }
}

export const defineBlogConfig = mergeBlogConfig
