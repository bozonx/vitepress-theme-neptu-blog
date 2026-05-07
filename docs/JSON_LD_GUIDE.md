# JSON-LD Guide

## Overview

The theme generates JSON-LD automatically for posts, author pages, and plain content pages.

The implementation lives in `src/transformers/addJsonLd.ts` and is executed from `transformHead`.

## Automatic output for posts

Post pages generate a `BlogPosting` schema with these core fields:

- `headline`
- `description`
- `url`
- `datePublished`
- `dateModified` when available
- `author` when the author exists in locale config
- `image` from `cover`
- `keywords` from tags
- `publisher` from locale config
- `inLanguage`
- `mainEntityOfPage`
- `isPartOf`

## Custom schema in frontmatter

Use `jsonLd` in frontmatter when you need extra fields.

```yaml
---
title: Test JSON-LD Page
description: Demonstrates custom JSON-LD
layout: page
jsonLd: |
  "@type": AboutPage
  speakable:
    "@type": SpeakableSpecification
    cssSelector:
      - h1
      - p.lead
---
```

### Merge rules

- Generated post/page schemas: custom object fields are merged into the generated schema
- Custom-only pages: the parsed object becomes the full JSON-LD payload
- Custom-only pages may also use a top-level array; it will be emitted as `@graph`

## Publisher

Add `publisher` to locale `themeConfig`:

```ts
export default {
  themeConfig: {
    publisher: {
      name: 'Your Site Name',
      url: 'https://yoursite.com',
      logo: '/logo.png',
    },
  },
}
```

Output:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name",
    "url": "https://yoursite.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.png"
    }
  }
}
```

## Error handling

- Invalid YAML in `frontmatter.jsonLd` produces a warning in the build log
- Generated post/page schemas still render without custom overrides
- Custom-only invalid JSON-LD is skipped

## Disabling JSON-LD

You can disable automatic JSON-LD on specific pages or globally.

### Per-page

```yaml
---
title: Draft Post
description: Work in progress
seo:
  jsonLd: false
---
```

### Globally

```ts
export default defineBlogConfig({
  themeConfig: {
    seo: {
      jsonLd: false,
    },
  },
})
```

Frontmatter `seo` always overrides the global setting.

## Best practices

- Keep `siteUrl` configured, otherwise generated URLs will be incomplete
- Prefer absolute URLs in custom schema fields
- Use valid schema.org property names such as `dateModified`
- Test custom schema with Google Rich Results Test
