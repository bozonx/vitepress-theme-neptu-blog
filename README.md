# vitepress-theme-neptu-blog

VitePress blog theme with i18n, RSS/Atom/JSON feeds, JSON-LD structured data, hreflang tags, canonical links, popular posts via Google Analytics, Pagefind search, tag/archive/author layouts, and Tailwind v4 styling.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Social Sharing](#social-sharing)
- [Post Frontmatter](#post-frontmatter)
- [Layouts & Components](#layouts--components)
- [Styling](#styling)
- [Multilingual Setup](#multilingual-setup)
- [SEO Features](#seo-features)
- [Advanced Customization](#advanced-customization)
- [Development](#development)
- [Publishing](#publishing)

## Features

- **Tailwind v4** source-mode styling
- **Multilingual by design** — locale-prefixed routing, separate UI and content locales
- **SEO ready** — JSON-LD, Open Graph, hreflang, canonical links, sitemap filtering
- **RSS/Atom/JSON feeds** — generated automatically per locale
- **Popular posts** — sort by GA4 pageviews at build time
- **Pagefind** search integration
- **Built-in layouts** — home, post, page, tag, archive, author
- **Utility components** — home hero, tag lists, author cards, pagination
- **Doc components** — audio player, file download, YouTube embed

## Installation

```sh
pnpm add -D vitepress-theme-neptu-blog
```

Peer dependencies (handled automatically with compatible VitePress projects):

- `vitepress`
- `vue`
- `tailwindcss`

## Quick Start

Create `.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress-theme-neptu-blog'
import './styles.css'

export default DefaultTheme
```

Create `.vitepress/theme/styles.css`:

```css
@import "tailwindcss";
@import "vitepress-theme-neptu-blog/tailwind-source.css";
```

Create `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'

export default defineConfig(
  defineBlogConfig({
    siteUrl: 'https://example.com',
    title: 'My Blog',
    description: 'Blog description',
    srcDir: 'src',
    locales: {
      en: { lang: 'en-US', label: 'English' },
    },
    themeConfig: {
      sidebarLogoSrc: '/img/sidebar-logo.webp',
      authors: [
        { id: 'john-smith', name: 'John Smith' },
      ],
    },
  })
)
```

Content lives inside locale folders:

```text
src/
  en/
    index.md          # home page
    post/
      hello.md        # blog post
    page/
      about.md        # static page
```

See the `example/blog` directory in this repo for a complete working project.

## Configuration

`defineBlogConfig` merges your settings with theme defaults. Below are the main `themeConfig` options.

### Core options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `perPage` | `number` | `10` | Posts per page |
| `sidebarTagsCount` | `number` | `15` | Max tags shown in sidebar |
| `similarPostsCount` | `number` | `5` | Similar posts count on post page |
| `homeBgParallaxOffset` | `number` | `300` | Parallax offset for home background |
| `paginationMaxItems` | `number` | `5` | Max pagination links |
| `sidebarLogoSrc` | `string` | - | Logo image in sidebar |
| `siteTitle` | `string` | - | Override site title in sidebar |
| `sidebarMenuLabel` | `string` | - | Custom sidebar menu label |

### Post list preview

Control what is shown in post list items via the `postList` object:

| Option                      | Type      | Default | Description                               |
| --------------------------- | --------- | ------- | ----------------------------------------- |
| `postList.showDate`         | `boolean` | `true`  | Show post date in list items              |
| `postList.showTags`         | `boolean` | `true`  | Show tags in list items                   |
| `postList.showThumbnail`    | `boolean` | `true`  | Show thumbnail/cover image in list items  |
| `postList.showPreview`      | `boolean` | `true`  | Show excerpt/preview text in list items   |
| `postList.showAuthor`       | `boolean` | `true`  | Show author name in list items            |
| `postList.maxPreviewLength` | `number`  | `300`   | Max length of auto-generated preview text |

```ts
export default defineConfig(
  defineBlogConfig({
    themeConfig: {
      postList: {
        showDate: true,
        showTags: false,
        showThumbnail: true,
        showPreview: true,
        showAuthor: false,
        maxPreviewLength: 200,
      },
    },
  })
)
```

`postList.maxPreviewLength` only affects preview text generated from post content. A `preview` value specified in post frontmatter is used as-is.

### Edit link

Set `repo` at the top level of `defineBlogConfig` to enable an "Edit this page" button. The theme auto-detects the hosting platform from the URL and generates the correct edit-link pattern.

```ts
export default defineConfig(
  defineBlogConfig({
    repo: 'https://github.com/username/repo',
  })
)
```

Supported platforms: **GitHub**, **GitLab**, **Bitbucket**, **Gitea / Forgejo / Codeberg**.

If your provider is not auto-detected or you need a custom path, override `editLink.pattern` explicitly via `themeConfig`:

```ts
themeConfig: {
  editLink: {
    pattern: 'https://my-gitea.example.com/user/repo/_edit/main/src/:path',
  },
}
```

To change the button label, override it via `uiLocales`:

```ts
themeConfig: {
  uiLocales: {
    en: {
      extends: 'en',
      t: { editLink: 'Improve this page' },
    },
  },
}
```

Disable per-page via frontmatter:

```yaml
---
editLink: false
---
```

### Similar posts

Post pages render a "similar posts" block when the current post and other posts
share at least one tag. Ranking is based on matching tag count, then GA
popularity when `popularPosts.enabled` is on, then date.

The theme reads post lists from Vue injection, so your wrapper layout must load
posts and provide them by locale:

```vue
<script setup lang="ts">
import Theme from 'vitepress-theme-neptu-blog'
import { provide } from 'vue'
import { data as enData } from '../../en/loadPosts.data'

provide('posts', { en: enData.posts })

const { Layout } = Theme
</script>

<template>
  <Layout />
</template>
```

Use `similarPostsCount` to control the maximum number of rendered items.

### Authors

```ts
themeConfig: {
  authors: [
    {
      id: 'john-smith',
      name: 'John Smith',
      description?: string,
      avatar?: string,
      image?: string,
      imageHeight?: number,
      imageWidth?: number,
      aboutUrl?: string,
      links?: [{ icon: 'mdi:github', link: 'https://github.com/...' }],
    },
  ],
}
```

### Navigation

```ts
themeConfig: {
  topBar: {
    links: [
      { text: '${PROPS.t.links.donate}', href: '${PROPS.siteUrl}/${PROPS.localeIndex}/page/donate', icon: '${PROPS.donateIcon}', mobileOnly?: boolean, desktopOnly?: boolean },
    ],
    donate?: boolean,
    socialLinks?: SocialLink[],
  },
  sideBar: {
    links?: NavLink[],
    recent?: boolean,
    popular?: boolean,
    archive?: boolean,
    authors?: boolean,
    tags?: boolean,
    bottomLinks?: NavLink[],
    donate?: boolean,
    socialLinks?: SocialLink[],
    rssFeed?: boolean,
    atomFeed?: boolean,
  },
}
```

### Google Analytics (build-time popular posts)

```ts
themeConfig: {
  popularPosts: {
    enabled: true,
    sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
    dataSource: {
      provider: 'ga4',
      propertyId: process.env.GA_PROPERTY_ID,
      credentialsJson: process.env.GA_CREDENTIALS_JSON,
      dataPeriodDays: 30,
      dataLimit: 1000,
    },
  },
}
```

See [docs/BUILD_TIME_ANALYTICS.md](docs/BUILD_TIME_ANALYTICS.md) for the full GA4 service-account setup.
For SPA pageview tracking in client-side analytics, see the note in [docs/BUILD_TIME_ANALYTICS.md](docs/BUILD_TIME_ANALYTICS.md#spa-navigation-and-client-side-analytics).

### RSS feed options

```ts
export default defineConfig(
  defineBlogConfig({
    maxPostsInRssFeed: 50,
    rssFormats: ['rss', 'atom', 'json'],
  })
)
```

See [docs/rss-feed-guide.md](docs/rss-feed-guide.md) for details.

### JSON-LD publisher

```ts
themeConfig: {
  publisher: {
    name: 'Your Site Name',
    url: 'https://yoursite.com',
    logo: '/logo.png',
  },
}
```

See [docs/JSON_LD_GUIDE.md](docs/JSON_LD_GUIDE.md) for structured-data documentation.

### Social sharing

Control which networks appear below every post:

```ts
themeConfig: {
  socialMediaShares: [
    { name: 'telegram', icon: 'logos:telegram', title: 'Telegram', urlTemplate: 'https://t.me/share/url?url={url}&text={title}' },
    { name: 'x', icon: 'ri:twitter-x-fill', title: 'X (Twitter)', urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}' },
    { name: 'linkedin', icon: 'logos:linkedin-icon', title: 'LinkedIn', urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
  ]
}
```

- `urlTemplate` accepts `{url}` and `{title}` placeholders.
- You can add any network — Threads, Reddit, Bluesky, Mastodon, etc.
- Set to `[]` or omit to hide the block entirely.
- Use `uiLocales` for per-language overrides.

See [docs/SOCIAL_SHARES.md](docs/SOCIAL_SHARES.md) for the full guide.

### Optional VitePress build options

```ts
export default defineConfig({
  metaChunk: true, // smaller initial HTML payloads for large sites
})
```

## Post Frontmatter

Posts support the following frontmatter fields:

### Common fields

```yaml
---
# Optional: override title extracted from H1
title: 'Post Title'
# Meta description and preview text
description: 'Post description'
# Use description as preview in lists and article
descrAsPreview: true
# Custom preview text (overrides description auto-preview)
previewText: 'Custom preview text'
# ISO publication date (include time for same-day ordering)
date: '2024-01-15T10:00:00Z'
# Author ID from themeConfig.authors
authorId: 'john-smith'
# Main cover image
cover: /media/cover.jpg
coverDescr: 'Cover description'
coverAlt: 'Alt text'
# Social comments URL
commentUrl: 'https://...'
# Tags (spaces allowed)
tags:
  - 'some tag'
# Canonical link
canonical: 'https://example.com/en/post/post-slug'
# or
canonical: 'self'
# or short alias
canonical: 's'
---
```

### Media posts

```yaml
---
# YouTube / external video link
videoLink: 'https://youtube.com/watch?v=...'
videoLinkLang: 'en'

# Podcast links
podcasts:
  site: 'https://...'
  spotify: 'https://...'
  applepodcasts: 'https://...'
podcastLang: 'en'
---
```

If no media or cover is set, the first image found in the post content is used as the list thumbnail.

## Layouts & Components

### Layouts

Import from `vitepress-theme-neptu-blog/layouts`:

- `Layout` — main Neptu layout (default)
- `DefaultLayout` — plain content layout
- `BlogHome` — home page layout

### Custom layouts

The theme supports custom layouts without forking. Register your layout component globally in `.vitepress/theme/index.ts` and reference it by name in frontmatter:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress-theme-neptu-blog'
import PodcastEpisode from './PodcastEpisode.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('PodcastEpisode', PodcastEpisode)
  },
}
```

```yaml
---
layout: PodcastEpisode
---
```

How it resolves:

- If the layout name matches a **built-in** (`home`, `post`, `page`, `util`, `tag`, `archive`, `author`), the theme uses its native logic.
- If `layout` matches a **globally registered Vue component**, that component replaces the entire page chrome (sidebar, topbar, footer).
- If `contentLayout` matches a **globally registered Vue component**, that component replaces only the central content area while keeping the built-in chrome.
- If no component is found for an unknown layout name, the theme falls back to the standard `post` layout.

This also works with kebab-case names (`layout: podcast-episode`) as long as the registered component name matches.

Use `contentLayout` when you want custom article markup but still want the theme sidebar, topbar, footer, lightbox, and scroll controls:

```yaml
---
layout: post
contentLayout: PodcastEpisode
---
```

### Utility components

Import from `vitepress-theme-neptu-blog/components`:

- `HomeHero`, `HomeTags`, `HomePopularPosts`
- `AllTagsList`, `TagPostsList`
- `AuthorDetails`, `NeptuAuthors`
- `MonthPostsList`, `MonthsOfYear`, `NeptuYears`
- `PopularPostsList`, `RecentList`
- `PageFindSearch`, `NavSearchButton`
- `UtilPageContent`, `UtilPageHeader`, `UtilSubPageHeader`

### Post building blocks

Import from `vitepress-theme-neptu-blog/components` to assemble your own post layout:

- `PostAuthor`, `PostDate`, `PostImage`
- `PostTags`, `PostSocialShare`, `PostSimilarList`
- `PostTopBar`, `PostFooter`, `PostComments`
- `PostDonateLink`, `PostVideoLink`
- `PodcastDropdown`, `PodcastIcon`

```vue
<script setup>
import {
  PostAuthor,
  PostDate,
  PostTags,
  PostSocialShare,
  PostFooter,
} from 'vitepress-theme-neptu-blog/components'
</script>

<template>
  <PostDate />
  <PostAuthor />
  <PostTags />
  <slot />
  <PostSocialShare />
  <PostFooter />
</template>
```

### Composables

Import from `vitepress-theme-neptu-blog/composables` in your custom Vue components:

- `useUiTheme()` — typed access to `themeConfig`
- `useLightbox()` — programmatic lightbox control
- `useBreakpoint()` — reactive breakpoint checks
- `useScrollY()` — reactive scroll position
- `useContentLangs()` — content/UI locale resolution
- `useToTheTop()` — scroll-to-top logic
- `useSwipeDrawer()` — mobile drawer swipe gestures

### Post layout slots

When using the built-in `post` layout, you can inject content via named slots without forking the theme:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu-blog'
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #post-header-before>
      <MyBreadcrumb />
    </template>
    <template #post-content-after>
      <MyNewsletterForm />
    </template>
  </Layout>
</template>
```

Available slots inside `PageContent.vue` (post layout):

- `post-header-before` — before the `<header>` element
- `post-header-after` — after the `<header>` element
- `post-content-before` — before the markdown content
- `post-content-after` — after the markdown content

### Home page customization

The `layout: home` frontmatter activates the full-bleed home layout with parallax background. You can customize it via frontmatter options in your `index.md`:

```yaml
---
layout: home
homeTheme: dark          # 'dark' | 'light' (default: 'dark')
homeMaxWidth: 800        # content max-width in px (default: 800)
homeBackground: parallax # 'parallax' | 'none' (default: 'parallax')
homeBackgroundImage: /img/my-bg.jpg  # optional custom background image
homeBgParallaxOffset: 300          # parallax scroll offset (default: from themeConfig)
---
```

When `homeBackground: none`, the parallax effect is disabled and the wrapper renders as a plain flex container, making it easier to apply your own CSS background.

For total control, use `layout: false` and import `BlogHome` (or any other layout/component) directly:

```vue
---
layout: false
---
<script setup>
import { BlogHome } from 'vitepress-theme-neptu-blog/layouts'
import { HomeHero, HomeTags } from 'vitepress-theme-neptu-blog/components'
</script>

<BlogHome>
  <template #home-before>
    <MyCustomBackground />
  </template>
  <HomeHero ... />
  <HomeTags />
</BlogHome>
```

### Doc components (available in markdown)

Registered globally in the theme:

- `<AudioFile url="/audio/file.mp3" />`
- `<FileDownload url="/files/doc.pdf" />`
- `<YoutubeVideo id="dQw4w9WgXcQ" />`

See [docs/README_COMPONENTS.md](docs/README_COMPONENTS.md) for full component documentation.

## Styling

The theme ships Tailwind v4 sources, not prebuilt CSS. Your site must compile Tailwind itself.

### 1. Install the Vite plugin

```sh
pnpm add -D @tailwindcss/vite tailwindcss
```

### 2. Add to VitePress config

```ts
// .vitepress/config.ts
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
})
```

### 3. Import theme source in your CSS

```css
/* .vitepress/theme/styles.css */
@import "tailwindcss";
@import "vitepress-theme-neptu-blog/tailwind-source.css";

/* Optional: custom design tokens */
@theme {
  --color-brand-1: oklch(0.55 0.2 240);
  --font-sans: "Inter Variable", sans-serif;
}
```

You get a single deduplicated stylesheet and customisable tokens via `@theme {}`.

### Customizing fonts

See [docs/FONTS.md](docs/FONTS.md) for a guide on using custom fonts (Google Fonts, etc.).

## Multilingual Setup

The theme is multilingual by design. Key rules:

- Content always lives inside a locale directory, even for single-language sites.
- Locale indexes are user-defined route segments (`en`, `ru`, `en-US`, `pt-BR`, `zh-CN`).
- `lang` in locale config is the language tag used for SEO and browser formatting.
- UI locale and content locale are separate; users can read content in one language with UI in another.

See [docs/LOCALES.md](docs/LOCALES.md) for the full locale model, UI resolution, switcher behavior, and admin overrides.

## SEO Features

| Feature | Description | Docs |
|---------|-------------|------|
| JSON-LD | Automatic `BlogPosting`, `WebPage`, `Person` structured data | [docs/JSON_LD_GUIDE.md](docs/JSON_LD_GUIDE.md) |
| Hreflang | Alternate locale links for multilingual pages | [docs/HREFLANG_README.md](docs/HREFLANG_README.md) |
| Canonical | Configurable canonical links per post | [docs/CANONICAL_LINKS.md](docs/CANONICAL_LINKS.md) |
| Open Graph | Auto-generated OG meta tags | Built-in |
| RSS/Atom/JSON | Per-locale feeds | [docs/rss-feed-guide.md](docs/rss-feed-guide.md) |
| Sitemap | Automatic filtering of non-content pages | Built-in |

## Advanced Customization

See [docs/ADVANCED_CUSTOMIZATION.md](docs/ADVANCED_CUSTOMIZATION.md) for:

- Using `hooks.transformPageData` to inject logic between built-in transformers
- Building custom post layouts from exported post components
- Reusing theme composables (`useLightbox`, `useBreakpoint`, etc.)
- Layout helpers (`isPage`, `isUtilPage`, `resolveArticlePreview`)

## Development

This repo is a pnpm workspace. Clone and run:

```sh
pnpm install
pnpm --filter vitepress-theme-neptu-blog-example-blog dev
```

The example site under `example/blog` is linked via `workspace:*`, so changes in `src/` are reflected immediately.

### Scripts

```sh
pnpm test          # run unit tests
pnpm test:watch    # watch mode
pnpm lint          # eslint check
pnpm typecheck     # typescript check
```

## Publishing

```sh
pnpm publish
```
