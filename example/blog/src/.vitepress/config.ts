import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'
import { defineBlogConfig, loadBlogLocale } from 'vitepress-theme-neptu-blog/configs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 20

export const popularPosts = {
  enabled: Boolean(process.env.GA_PROPERTY_ID),
  sortBy: 'pageviews', // 'pageviews', 'uniquePageviews'
}

export const googleAnalytics = {
  propertyId: process.env.GA_PROPERTY_ID,
  credentialsJson: process.env.GA_CREDENTIALS_JSON,
}

export default async () => {
  const config = defineConfig({
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org',
    repo: 'https://github.com/...',
    themeConfig: {
      uiLocale: {
        default: 'en',
        storageKey: 'example-blog-ui-locale',
      },
      uiLocales: {
        en: {
          themeConfig: {
            langMenuLabel: 'Interface language',
          },
        },
        'en-GB': {
          extends: 'en',
          label: 'English (UK)',
          themeConfig: {
            langMenuLabel: 'Interface language',
          },
          t: {
            viewInAnotherLanguage: 'Read this page in another language',
          },
        },
        ru: {
          themeConfig: {
            langMenuLabel: 'Язык интерфейса',
          },
        },
      },
      perPage: PER_PAGE,
      sidebarLogoSrc: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=100&auto=format&fit=crop',
      mainHeroImg: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',

      search: { bodyMarker: 'data-pagefind-body' } as Record<string, unknown>,

      googleAnalytics,
      popularPosts,

      // Add there some variables specified for your blog
    } as Record<string, unknown>,
    vite: {
      // tailwindcss() is auto-injected by vitepress-theme-neptu-blog
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
  } as Record<string, unknown>)

  return defineBlogConfig({
    ...config,
    locales: { en: await loadBlogLocale('en', config) },
  })
}
