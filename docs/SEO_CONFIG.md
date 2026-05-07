# SEO Configuration

## Overview

The theme automatically injects several SEO-related tags into every page `<head>`:

- **Open Graph / Twitter Cards** (`og:*`, `twitter:*`)
- **JSON-LD** structured data (`BlogPosting`, `WebPage`, `Person`)
- **Hreflang** alternate links for multilingual sites
- **Canonical** links
- **RSS feed** `<link>` tags on home pages

All of these can be controlled globally via `themeConfig.seo` or per-page via frontmatter `seo`.

## Configuration object

```ts
interface SeoConfig {
  og?: boolean      // Open Graph / Twitter meta tags
  jsonLd?: boolean  // JSON-LD structured data
  hreflang?: boolean// Hreflang alternate links
  canonical?: boolean// Canonical link tags
  rss?: boolean     // RSS feed links in <head>
}
```

Everything defaults to `true` (enabled).

## Global control

```ts
export default defineBlogConfig({
  themeConfig: {
    seo: {
      og: false,      // disable Open Graph everywhere
      jsonLd: false,  // disable JSON-LD everywhere
    },
  },
})
```

## Per-page control

Use frontmatter to override the global setting for a specific page:

```yaml
---
title: Draft Post
description: Work in progress
seo:
  og: false
  jsonLd: false
---
```

### Common use cases

**Service / internal pages** (no SEO needed):

```yaml
---
layout: page
title: Admin Dashboard
seo:
  og: false
  jsonLd: false
  hreflang: false
  canonical: false
---
```

**Pages with custom SEO only** (disable auto-generation):

```yaml
---
title: Special Landing Page
seo:
  jsonLd: false
head:
  - - meta
    - property: og:title
      content: My Custom Title
---
```

**Draft posts** (hide from social sharing):

```yaml
---
title: WIP Post
draft: true
seo:
  og: false
---
```

## Override rules

1. **Frontmatter wins** — `page.seo.jsonLd: true` overrides `themeConfig.seo.jsonLd: false`
2. **Global fallback** — when frontmatter has no `seo` key, the global `themeConfig.seo` is used
3. **Default is `true`** — when neither is set, the transformer runs normally

## Related docs

- [JSON-LD Guide](JSON_LD_GUIDE.md)
- [Canonical Links](CANONICAL_LINKS.md)
- [Hreflang](HREFLANG_README.md)
- [RSS Feed Guide](rss-feed-guide.md)
