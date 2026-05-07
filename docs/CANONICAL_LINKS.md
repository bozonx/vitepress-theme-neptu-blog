# Canonical Links

## Overview

Canonical links help search engines understand which version of a page is the primary one, preventing duplicate content issues.

By default, every page automatically gets a self-referencing canonical link (via `themeConfig.autoCanonical: true`). You can override this on a per-page basis using the `canonical` field in frontmatter:

- `canonical: "https://example.com/en/post/post-slug"` — absolute URL
- `canonical: "self"` — auto-generate a link to the current page
- `canonical: "s"` — short alias for `"self"`

```yaml
---
title: My Post Title
description: Post description
date: 2024-01-15
canonical: "https://example.com/en/post/post-slug"
# or
canonical: "self"
# or short alias
canonical: "s"
tags:
  - tag1
  - tag2
---
```

### Disabling auto-canonical

To disable automatic canonical links and require explicit frontmatter, set `themeConfig.autoCanonical: false`:

```ts
// .vitepress/config.ts
export default defineBlogConfig({
  themeConfig: {
    autoCanonical: false,
  },
})
```

## Behavior

### With an explicit URL

The `addCanonicalLink` transformer inserts a `<link rel="canonical">` tag into the page `<head>` using the provided absolute URL.

```html
<link rel="canonical" href="https://example.com/en/post/post-slug" />
```

### With `"self"` or `"s"`

The transformer builds the current page URL from `siteUrl` and the page path.

```html
<link rel="canonical" href="https://example.com/en/post/current-page" />
```

## Examples

### Link to another page

```yaml
---
title: 'How to set up VitePress'
description: 'Step-by-step VitePress setup guide'
date: 2024-01-15
canonical: 'https://example.com/en/post/how-to-setup-vitepress'
---
```

### Link to the current page

```yaml
---
title: 'Page with self canonical'
description: 'Self-referencing canonical link'
date: 2024-01-15
canonical: 'self'
---
```

### Without a canonical link (when autoCanonical is disabled)

If `themeConfig.autoCanonical` is set to `false`, pages without an explicit `canonical` field will not emit a `<link rel="canonical">` tag.

```yaml
---
title: 'Regular page'
description: 'No canonical link added'
date: 2024-01-15
---
```

No `<link rel="canonical">` tag is emitted.

## Disabling canonical links

You can disable the canonical link transformer on specific pages or globally.

### Per-page

```yaml
---
title: Draft Post
description: Work in progress
seo:
  canonical: false
---
```

### Globally

```ts
export default defineBlogConfig({
  themeConfig: {
    seo: {
      canonical: false,
    },
  },
})
```

Frontmatter `seo` always overrides the global setting.

## Technical details

- `themeConfig.autoCanonical` defaults to `true`; every page gets a self-referencing canonical link automatically.
- The transformer only runs on locale-prefixed paths (e.g. `/en/`, `/ru/`).
- Explicit URLs are validated.
- `"self"` and `"s"` require `siteUrl` to be configured.
- When an explicit canonical URL is used, `og:url` meta tag is synchronized to match it.
- Errors are handled safely with build-time warnings.
