import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import { defineBlogConfig, loadBlogLocale } from 'vitepress-theme-neptu-blog/configs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 20

export const popularPosts = {
  enabled: true,
  sortBy: 'pageviews', // 'pageviews', 'uniquePageviews'
}

export const googleAnalytics = {
  propertyId: '123456789',
  credentialsJson: process.env.GA_CREDENTIALS_JSON,
  credentialsPath: '.../credentials.json',
}

export default async () => {
  const config = defineConfig({
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org',
    repo: 'https://github.com/...',
    themeConfig: {
      perPage: PER_PAGE,
      sidebarLogoSrc: '/img/sidebar-logo.webp',

      search: { bodyMarker: 'data-pagefind-body' },

      googleAnalytics,
      popularPosts,

      // Add there some variables specified for your blog
    },
    vite: {
      plugins: [tailwindcss()],
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

  return defineBlogConfig({
    ...config,
    locales: { en: await loadBlogLocale('en', config) },
  })
}
