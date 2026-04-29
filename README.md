# vitepress-theme-neptu-blog

Vitepress blog template for freedom sites by Ivan K.

## Use in your project

See `example` dir

## Multilingual model

This theme is multilingual by design.

- Content always lives inside a locale directory, even if your site has only one language.
- Locale indexes are user-defined route segments such as `en`, `ru`, `en-US`, `pt-BR`, `zh-CN`.
- The theme does not restrict content locales to two-letter codes.
- A single-language blog should still keep its content under a locale folder such as `src/en/`.

Example content layout:

```text
src/
  index.md
  en/
    index.md
    post/
    page/
  en-US/
    index.md
    post/
    page/
  site/
    site.en.yaml
    site.en-US.yaml
```

Notes:

- `localeIndex` is the route segment and content bucket.
- `lang` in locale config is the language tag used for SEO and browser formatting, for example `en-US` or `en-GB`.
- If you only need one English UI but different content trees, you can still choose separate content locales such as `en-US` and `en-GB`.

See [docs/LOCALES.md](docs/LOCALES.md) for the planned locale model, UI locale resolution, switcher behavior, and admin overrides.

## Use in dev mode

This repo is a pnpm workspace. Clone and run:

```sh
pnpm install
pnpm --filter vitepress-theme-neptu-blog-example-blog dev
```

The example site under `example/blog` is linked to the local theme via
`workspace:*`, so any change in `src/` is reflected immediately.

## Styling: Tailwind v4 source-mode

The theme is built with Tailwind v4 and ships its sources, not prebuilt
CSS. Your VitePress site must compile Tailwind itself; the theme exposes
a single `@source` re-export that tells your Tailwind compiler to scan
the theme's `.vue` / `.js` files.

### 1. Install the Vite plugin

```sh
pnpm add -D @tailwindcss/vite tailwindcss
```

### 2. Wire it into VitePress

```js
// .vitepress/config.js
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
})
```

### 3. Author your CSS

```css
/* .vitepress/theme/styles.css */
@import "tailwindcss";
@import "vitepress-theme-neptu-blog/tailwind-source.css";

/* Optional: customise tokens that the theme reads */
@theme {
  --color-brand-1: oklch(0.55 0.2 240);
  --font-sans: "Inter Variable", sans-serif;
}
```

```js
// .vitepress/theme/index.js
import './styles.css'
```

You get a single deduplicated stylesheet, customisable design tokens via
`@theme {}`, and your own utilities can extend the same Tailwind cascade
the theme uses. See `example/blog` for a complete reference.

## Config

```
export default {
  themeConfig: {
    // show author name on the posts list items
    showAuthorInPostList: true
    authors:
      - id: john-smith
        name: John Smith
        descr: Some MD descr
        link?: If defined then this link will be used. If not then will be use link to author page
    homeBgParallaxOffset: 150
    sidebarLogoSrc: "/img/sidebar-logo.webp",
  },
};
```

### Optional VitePress build options

The theme does not enable experimental VitePress options by default. If your
blog has many pages and you want smaller initial HTML payloads, you can enable
VitePress metadata chunk extraction in your own `.vitepress/config.js`:

```js
export default {
  metaChunk: true,
}
```

## Site config

```
  topBar:
    links:
      - text: "${PROPS.t.links.donate}"
        href: "${PROPS.siteUrl}/${PROPS.localeIndex}/page/donate"
        icon: "${PROPS.donateIcon}"
        # show on desktop and on mobile
        mobileToo: true
        # show only on mobile and don't show on desktop
        mobileOnly: true

```

## Post meta data

You can publish all types of posts - article, post, video and audio. They are the same.

### All the posts have common parameters

```
---
title?: Use it only if you want to replace title which is got from H1 tag
description: content of meta descr and preview text if it allowed
# If true - then use description or first part of the post in a list and article
# If false | undefined - then use first part of the post in a list and don't use in article
descrAsPreview: true | false
# If has text - then use this text in a list and in an article
# If not set - then depend of descrAsPreview
# It won't shown in a post if media, or cover is set
previewText: text for list item and article preview
pubDate: Publication date in iso format. Better to use time to order posts which are published at the same day
# The main image of article. Optional
cover: /media/img.jpg
coverDescr: description of cover image in MD format
# ID of author of site team. It it some other author just put his name into the text
authorId: john-smith
# Url where you can find comments of it post in social media
commentUrl: https://...
# List of tags. Tags can include spaces
tags:
  - some
# Add canonical link to page head for SEO (prevents duplicate content issues)
canonical: "https://example.com/en/post/post-slug"  # URL канонической страницы
# или
canonical: "self"  # Ссылка на саму страницу
# или
canonical: "s"     # Сокращенная версия

...special params
---
```

### Special parameters of posts

```
---
...common params

# Link to a video on youtube or another platform. It is used in a watch video button
videoLink: htts://...
# Language of video link if it doesn't equal the language of the page
videoLinkLang: en | ru | ...
# Links to poscast of this post
podcasts:
  # means special page of this podcast e.g on https://mave.digital
  site: "https://..",
  castbox: "https://..",
  soundstream: "https://..",
  spotify: "https://..",
  vk: "https://..",
  yandexmusic: "https://..",
  deezer: "https://..",
  pocketcasts: "https://..",
  applepodcasts: "https://..",
  overcast: "https://..",
  zvuk: "https://..",
  podcastaddiction: "https://..",
# Language of podcast if it doesn't equal the language of the page
podcastLang: en | ru | ...
---

If the post doesn't have any media then the first image will be used as main image to show in lists.

## SEO Features

### Canonical Links
Add `canonical` parameter to your post frontmatter to automatically include a canonical link in the page head. This helps search engines understand which version of a page is the primary one, preventing duplicate content issues.

**Options:**
- `canonical: "https://example.com/en/post/post-slug"` - Link to another page
- `canonical: "self"` - Link to the current page itself
- `canonical: "s"` - Short version of "self"

See [CANONICAL_README.md](CANONICAL_README.md) for detailed documentation.
```

## Publish

```
pnpm publish
```

## Youtube

see https://github.com/miletorix/vitepress-youtube-embed

```
<YouTubeEmbed video-id="vidid" />
```
