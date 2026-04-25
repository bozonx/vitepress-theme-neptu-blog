import { omitUndefined } from '../helpers/squidlet.js'
import { addOgMetaTags } from '../transformers/addOgMetaTags.js'
import { resolveDescription } from '../transformers/resolveDescription.js'
import { addJsonLd } from '../transformers/addJsonLd.js'
import { addHreflang } from '../transformers/addHreflang.js'
import { addCanonicalLink } from '../transformers/addCanonicalLink.js'
import { filterSitemap } from '../transformers/filterSitemap.js'
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

  // max description length for description meta tag,
  //  open graph, json-ld and for rss feed
  // for RSS max is 500 characters
  maxDescriptionLength: 300,

  themeConfig: {
    i18nRouting: true,
    externalLinkIcon: true,
    mainHeroImg: '/img/home-logo.webp',
    lastUpdated: { formatOptions: { dateStyle: 'medium', forceLocale: true } },
  },
}

/**
 * @param {import('vitepress').UserConfig<import('../types').ThemeConfig>} config
 * @returns {import('vitepress').UserConfig<import('../types').ThemeConfig>}
 */
export function mergeSiteConfig(config) {
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
      socialLinks: config.repo && [{ icon: 'github', link: config.repo }],
      ...config.themeConfig,
    },

    async transformPageData(pageData, ctx) {
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

      if (config.transformHead) {
        await config.transformHead(ctx)
      }
    },
  }
}
