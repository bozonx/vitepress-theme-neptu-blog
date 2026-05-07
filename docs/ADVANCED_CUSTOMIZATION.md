# Advanced Customization

This guide covers extending the theme without forking it.

## Hooks

The theme exposes a small hook system inside `defineBlogConfig`. You can run custom code **before** or **after** the built-in `transformPageData` pipeline.

```ts
// .vitepress/config.ts
import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'

export default defineBlogConfig({
  siteUrl: 'https://example.com',
  locales: { en: { lang: 'en-US' } },
  hooks: {
    transformPageData: {
      before: [
        (pageData, ctx) => {
          // Runs before collectImageDimensions, transformTitle, etc.
          console.log('Processing:', pageData.filePath)
        },
      ],
      after: [
        async (pageData, ctx) => {
          // Runs after all built-in transformers
          pageData.frontmatter.customField = 'value'
        },
      ],
    },
  },
})
```

Hook order:

1. `hooks.transformPageData.before[]`
2. Built-in: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
3. `hooks.transformPageData.after[]`

## Post Components

All post building blocks are exported from `vitepress-theme-neptu-blog/components`. Use them to build a fully custom post layout while keeping the theme chrome.

```vue
<!-- .vitepress/theme/CustomPost.vue -->
<script setup lang="ts">
import {
  PostDate,
  PostAuthor,
  PostImage,
  PostTags,
  PostSocialShare,
  PostSimilarList,
  PostFooter,
} from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <article class="my-custom-post">
    <PostDate />
    <PostAuthor />
    <h1>{{ page.title }}</h1>
    <PostImage />

    <div class="vp-doc">
      <Content />
    </div>

    <PostTags />
    <PostSocialShare />
    <PostSimilarList />
    <PostFooter />
  </article>
</template>
```

Then reference it in frontmatter:

```yaml
---
layout: post
contentLayout: CustomPost
---
```

> Register `CustomPost` as a global component in `.vitepress/theme/index.ts` (see README "Custom layouts").
> Use `layout: CustomPost` only when the component should replace the whole page chrome.

### Available post components

| Component | Purpose |
|-----------|---------|
| `PostDate` | Publication date |
| `PostAuthor` | Author name + link |
| `PostImage` | Cover image with dimensions |
| `PostTags` | Tag list + "All tags" link |
| `PostSocialShare` | Social share buttons |
| `PostSimilarList` | Similar posts by tag |
| `PostFooter` | Donate link, comments, podcast |
| `PostTopBar` | Video/podcast top actions |
| `PostVideoLink` | External video button |
| `PostDonateLink` | Donation call-to-action |
| `PostComments` | Comments link |
| `PodcastDropdown` | Podcast platform selector |
| `PodcastIcon` | Individual podcast platform icon |

## Post Layout Slots

If you only need to inject small pieces of UI into the built-in post layout, use slots instead of replacing the whole component.

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu-blog'
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #post-header-before>
      <BreadcrumbNav />
    </template>

    <template #post-content-after>
      <NewsletterSignup />
    </template>
  </Layout>
</template>
```

Available slots inside the default post layout (`PageContent.vue`):

| Slot | Location |
|------|----------|
| `post-header-before` | Before `<header>` (title, date, topbar) |
| `post-header-after` | After `<header>` |
| `post-content-before` | Before the markdown `<Content />` |
| `post-content-after` | After the markdown `<Content />` |

## Composables

Reuse theme logic in your own Vue components by importing from `vitepress-theme-neptu-blog/composables`.

```vue
<script setup lang="ts">
import { useLightbox, useBreakpoint } from 'vitepress-theme-neptu-blog/composables'

const { isOpen, open, close } = useLightbox()
const { isMobile } = useBreakpoint()
</script>
```

### Available composables

| Composable | Description |
|------------|-------------|
| `useUiTheme()` | Typed `themeConfig` access |
| `useLightbox()` | Control the image lightbox |
| `useBreakpoint()` | Reactive mobile/tablet/desktop checks |
| `useScrollY()` | Reactive `window.scrollY` |
| `useContentLangs()` | Content/UI locale resolution |
| `useToTheTop()` | Scroll-to-top visibility logic |
| `useSwipeDrawer()` | Mobile sidebar swipe gestures |

## Layout Helpers

Import utilities from `vitepress-theme-neptu-blog/utils` to build custom layout logic:

```ts
import {
  isPage,
  isUtilPage,
  isPost,
  resolveArticlePreview,
} from 'vitepress-theme-neptu-blog/utils'

function myHelper(frontmatter) {
  if (isPage(frontmatter)) {
    return 'page'
  }
  if (isPost(frontmatter)) {
    return resolveArticlePreview(frontmatter)
  }
}
```

### Available helpers

| Helper | Description |
|--------|-------------|
| `isPost(frontmatter)` | True for posts (explicit `layout: post` or no layout) |
| `isPage(frontmatter)` | True for `layout: page` |
| `isUtilPage(frontmatter)` | True for `util`, `tag`, `archive`, `author` |
| `isHomePage(frontmatter)` | True for `layout: home` |
| `resolveArticlePreview(frontmatter)` | Resolve preview text from frontmatter |
| `resolveBodyMarker(theme, frontmatter)` | Resolve Pagefind body marker |
| `isPopularRoute(path, theme)` | Check if route is a "popular" listing |
| `isAuthorPage(filePath, siteConfig)` | Check if file path is an author page |

## Runtime Warnings

`defineBlogConfig` prints console warnings for common misconfigurations:

- Missing `siteUrl` — SEO features may produce broken URLs.
- Empty `locales` — the theme requires at least one locale.


These warnings appear only during the build / dev server startup.
