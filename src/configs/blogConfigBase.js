import { omitUndefined } from '../helpers/squidlet.js'
import { addJsonLd } from '../transformers/addJsonLd.js'
import { addHreflang } from '../transformers/addHreflang.js'
import { addOgMetaTags } from '../transformers/addOgMetaTags.js'
import { addRssLinks } from '../transformers/addRssLinks.js'
import { filterSitemap } from '../transformers/filterSitemap.js'
import { generateRssFeed } from '../transformers/generateRssFeed.js'
import { transformPageMeta } from '../transformers/transformPageMeta.js'
import { transformTitle } from '../transformers/transformTitle.js'
import { resolveDescription } from '../transformers/resolveDescription.js'
import { addCanonicalLink } from '../transformers/addCanonicalLink.js'
import { collectImageDimensions } from '../transformers/collectImageDimensions.js'
import { mdImage } from '../transformers/mdImage.js'

export const common = {
  //// You have to set an absolute path to the "src" directory of your blog
  // srcDir: path.resolve(__dirname, '../'),
  //// You have to set the url with protocol, hostname and port of
  //// your site
  // siteUrl: 'https://example.com',

  head: [
    // tell IE to use the most modern engine
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
  outDir: '../dist',
  cacheDir: '../.cache',
  srcExclude: ['site/**', '**/site/**'],
  metaChunk: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: true,
  lang: 'en-US',
  locales: { root: { lang: 'en-US' } },

  // Build params
  maxPostsInRssFeed: 50,
  rssFormats: ['rss', 'atom', 'json'],
  // max description length for description meta tag,
  //  open graph, json-ld and for rss feed
  // for RSS max is 500 characters
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
    // show author in post list
    showAuthorInPostList: true,

    // bodyMarker is set on the element that contains the content of the page.
    // For Pagefind use 'data-pagefind-body'
    // Then all the pages excluding util pages will have this marker.
    // To change this behavior, set in the frontmatter or the page
    //   searchIncluded: false or true
    // search: { bodyMarker: 'data-pagefind-body' },

    // use for popular posts
    googleAnalytics: {
      propertyId: null, // GA4 Property ID (например: "123456789")
      // You can use env variable GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
      credentialsPath: null, // Путь к JSON файлу Service Account
      // JSON string Service Account. eg process.env.GA_CREDENTIALS_JSON
      credentialsJson: null,
      // period for getting analytics data
      dataPeriodDays: 30,
      // limit for getting analytics data.
      // This data will be fetched once for all the languages.
      dataLimit: 1000,
    },
    popularPosts: {
      // Включить генерацию популярных постов во время сборки
      enabled: false,
      sortBy: 'pageviews', // 'pageviews', 'uniquePageviews', 'avgTimeOnPage'
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
    // social icons
    socialLinksIcon: 'heroicons:megaphone-16-solid',
    rssIcon: 'bi:rss-fill',
    atomIcon: 'vscode-icons:file-type-atom',
    youtubeIcon: 'fa6-brands:youtube',
    telegramIcon: 'fa6-brands:telegram',
    chatIcon: 'fa6-solid:message',
    tagsIcon: 'fa6-solid:tag',
    ///// not used
    // docIcon: 'iconoir:book-solid',
  },
}

/**
 * @param {import('vitepress').UserConfig<import('../types').ThemeConfig>} config
 * @returns {import('vitepress').UserConfig<import('../types').ThemeConfig>}
 */
export function mergeBlogConfig(config) {
  const externalLinkIcon =
    typeof config.themeConfig.externalLinkIcon === 'boolean'
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
      ssr: { noExternal: ['vitepress-theme-neptu-blog'], ...config.vite?.ssr },
    },
    sitemap: {
      hostname: config.siteUrl,
      // fix sitemap - remove root from it
      transformItems: (items) => {
        return filterSitemap(items)
      },

      ...config.sitemap,
    },
    markdown: {
      ...config.markdown,
      image: { lazyLoading: true, ...config.markdown?.image },
      // Отключаем rel="noreferrer" для внешних ссылок
      externalLinks: omitUndefined({
        target: '_blank',
        class: externalLinkIcon ? 'vp-external-link-icon' : undefined,
        rel: [],
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

      googleAnalytics: {
        ...common.themeConfig.googleAnalytics,
        ...config.themeConfig.googleAnalytics,
      },
      popularPosts: {
        ...common.themeConfig.popularPosts,
        ...config.themeConfig.popularPosts,
      },
    },

    async transformPageData(pageData, ctx) {
      collectImageDimensions(pageData, ctx)
      transformTitle(pageData, ctx)
      transformPageMeta(pageData, ctx)
      resolveDescription(pageData, ctx)

      if (config.transformPageData) {
        await config.transformPageData(pageData, ctx)
      }
    },

    async transformHead(ctx) {
      addOgMetaTags(ctx)
      addJsonLd(ctx)
      addHreflang(ctx)
      addCanonicalLink(ctx)
      addRssLinks(ctx)

      if (config.transformHead) {
        await config.transformHead(ctx)
      }
    },

    buildEnd: async (cfg) => {
      await generateRssFeed(cfg)

      if (config.buildEnd) {
        await config.buildEnd(cfg)
      }
    },
  }
}
