import path from 'node:path'
import { defineConfig } from 'vitepress'
import { mergeBlogConfig } from 'vitepress-theme-neptu-blog/blogConfigBase.js'
import { loadBlogLocale } from 'vitepress-theme-neptu-blog/blogConfigHelper.js'

export const PER_PAGE = 20

export default async () => {
  const config = defineConfig({
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org',
    repo: 'https://github.com/...',
    themeConfig: {
      perPage: PER_PAGE,
      sidebarLogoSrc: '/img/sidebar-logo.webp',

      search: { bodyMarker: 'data-pagefind-body' },

      googleAnalytics: {
        propertyId: '123456789',
        credentialsJson: process.env.GA_CREDENTIALS_JSON,
        credentialsPath: '.../credentials.json',
      },

      popularPosts: {
        enabled: true,
        sortBy: 'pageviews', // 'pageviews', 'uniquePageviews'
      },
    },
    head: [
      // do not recognize telephone numbers on the page
      ['meta', { name: 'format-detection', content: 'telephone=no' }],

      // google analytics
      [
        'script',
        { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-...' },
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
       gtag('config', 'G-...');`,
      ],

      // pagefind
      ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
      ['script', { src: '/pagefind/pagefind-ui.js' }],
    ],
  })

  return mergeBlogConfig({
    ...config,
    locales: { en: await loadBlogLocale('en', config) },
  })
}
