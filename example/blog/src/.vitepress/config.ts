import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  defineBlogConfig,
  loadBlogLocale,
} from 'vitepress-theme-neptu-blog/configs'
import type { BlogUserConfig, ThemeConfig } from 'vitepress-theme-neptu-blog'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 10

// Popular posts via Google Analytics 4. Requires GA_PROPERTY_ID and
// GA_CREDENTIALS_JSON environment variables. Set enabled: true only when
// both variables are present.
export const popularPosts = {
  enabled: Boolean(
    process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON
  ),
  // enabled: true, // use this to force-enable for demo without GA env vars
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  dataSource: {
    provider: 'ga4' as const,
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
    // dataPeriodDays: 30,   // how many days of data to fetch (default: 30)
    // dataLimit: 1000,      // max posts to fetch from GA4 (default: 1000)
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export const postList = {
  showDate: true,
  showTags: true,
  showThumbnail: true,
  showPreview: true,
  showAuthor: true,
  maxPreviewLength: 300,
}

export default async () => {
  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),

    // Required for SEO: canonical links, sitemap, RSS feeds.
    siteUrl: 'https://myblog.org',

    // Used in sidebar social links and footer.
    repo: 'https://github.com/your-org/your-blog',

    // Maximum number of posts included in the RSS/Atom/JSON feeds.
    // maxPostsInRssFeed: 50,

    // Which feed formats to generate ('rss', 'atom', 'json').
    // rssFormats: ['rss', 'atom', 'json'],

    // Maximum length of auto-generated post descriptions (chars).
    // maxDescriptionLength: 300,

    // Custom hooks — run your own code before/after built-in transformers.
    // hooks: {
    //   transformPageData: {
    //     before: [(pageData, ctx) => { /* ... */ }],
    //     after:  [(pageData, ctx) => { /* ... */ }],
    //   },
    //   transformHead: {
    //     before: [(ctx) => { /* ... */ }],
    //     after:  [(ctx) => { /* ... */ }],
    //   },
    //   buildEnd: [(cfg) => { /* ... */ }],
    // },

    themeConfig: {
      // -----------------------------------------------------------------------
      // UI locale selector — lets the reader switch the interface language
      // independently of the content language.
      // -----------------------------------------------------------------------
      uiLocale: { default: 'en', storageKey: 'example-blog-ui-locale' },
      uiLocales: {
        en: { themeConfig: { langMenuLabel: 'Interface language' } },
        'en-GB': {
          extends: 'en',
          label: 'English (UK)',
          themeConfig: { langMenuLabel: 'Interface language' },
          t: { viewInAnotherLanguage: 'Read this page in another language' },
        },
        ru: { themeConfig: { langMenuLabel: 'Язык интерфейса' } },
      },

      // -----------------------------------------------------------------------
      // Layout
      // -----------------------------------------------------------------------
      perPage: PER_PAGE,

      // Number of tags shown in the sidebar.
      // sidebarTagsCount: 15,

      // Number of "similar posts" shown at the bottom of each post.
      // similarPostsCount: 5,

      // Parallax scroll distance on the home page (px).
      // homeBgParallaxOffset: 300,

      // Maximum page buttons shown in the pagination bar.
      // paginationMaxItems: 5,

      // -----------------------------------------------------------------------
      // Images
      // -----------------------------------------------------------------------
      sidebarLogoSrc:
        'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=100&auto=format&fit=crop',

      // -----------------------------------------------------------------------
      // Search (Pagefind)
      // -----------------------------------------------------------------------
      search: { bodyMarker: 'data-pagefind-body' },

      // -----------------------------------------------------------------------
      // Popular posts
      // -----------------------------------------------------------------------
      popularPosts,

      // -----------------------------------------------------------------------
      // Post list display
      // -----------------------------------------------------------------------
      postList,

      // -----------------------------------------------------------------------
      // Post footer blocks — reorder or omit entries to customize the layout.
      // Default order: author, donate, comments, social-share, edit-link,
      //                tags, similar, popular-link.
      // -----------------------------------------------------------------------
      // postFooter: ['author', 'donate', 'comments', 'social-share', 'edit-link', 'tags', 'similar', 'popular-link'],

      // -----------------------------------------------------------------------
      // SEO — disable individual features globally (all default to true).
      // Per-page overrides are available via the `seo` frontmatter field.
      // -----------------------------------------------------------------------
      // seo: {
      //   og: true,
      //   jsonLd: true,
      //   hreflang: true,
      //   canonical: true,
      //   rss: true,
      // },

      // When true, every post gets a <link rel="canonical"> pointing to itself.
      // autoCanonical: true,

      // -----------------------------------------------------------------------
      // Twitter / X card
      // -----------------------------------------------------------------------
      // twitterSite: '@your_handle',

      // -----------------------------------------------------------------------
      // Social sharing buttons shown in the post footer.
      // Each entry needs: name, icon (Iconify), title, urlTemplate ({url}
      // and {title} are replaced at render time).
      // -----------------------------------------------------------------------
      // socialMediaShares: [
      //   {
      //     name: 'twitter',
      //     icon: 'fa6-brands:x-twitter',
      //     title: 'Share on X',
      //     urlTemplate: 'https://twitter.com/intent/tweet?url={url}&text={title}',
      //   },
      //   {
      //     name: 'telegram',
      //     icon: 'fa6-brands:telegram',
      //     title: 'Share on Telegram',
      //     urlTemplate: 'https://t.me/share/url?url={url}&text={title}',
      //   },
      // ],

      // -----------------------------------------------------------------------
      // Base URL segments — change if you rename the generated route folders.
      // -----------------------------------------------------------------------
      // tagsBaseUrl:    'tags',
      // archiveBaseUrl: 'archive',
      // popularBaseUrl: 'popular',
      // recentBaseUrl:  'recent',
      // authorsBaseUrl: 'authors',

      // -----------------------------------------------------------------------
      // Icon overrides (Iconify icon strings).
      // -----------------------------------------------------------------------
      // donateIcon:  'fa6-solid:hand-holding-heart',
      // recentIcon:  'fa6-solid:bolt',
      // popularIcon: 'fa6-solid:star',
      // byDateIcon:  'fa6-solid:calendar-days',
      // authorsIcon: 'mdi:users',
      // rssIcon:     'bi:rss-fill',
      // atomIcon:    'vscode-icons:file-type-atom',
      // youtubeIcon: 'fa6-brands:youtube',
      // tagsIcon:    'fa6-solid:tag',

      // -----------------------------------------------------------------------
      // Sidebar branding
      // -----------------------------------------------------------------------
      // sidebarLogoHeight: 40,  // px
      // sidebarMenuLabel: 'Menu',

      // -----------------------------------------------------------------------
      // Edit link (shown in post footer when repo is set).
      // -----------------------------------------------------------------------
      // editLink: {
      //   pattern: 'https://github.com/your-org/your-blog/edit/main/src/:path',
      //   text: 'Edit this page on GitHub',
      // },
    },

    vite: {
      // tailwindcss() is injected automatically — add other plugins here.
    },

    head: [
      // Prevent auto-detection of phone numbers as links on iOS.
      ['meta', { name: 'format-detection', content: 'telephone=no' }],

      // Google Analytics 4 — replace G-XXXXXXXXXX with your Measurement ID.
      // ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
      // ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`],

      // Pagefind search UI assets (generated by the `pagefind` build step).
      ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
      ['script', { src: '/pagefind/pagefind-ui.js' }],
    ],
  }

  return defineBlogConfig({
    ...config,
    locales: { en: await loadBlogLocale('en', config) },
  })
}
