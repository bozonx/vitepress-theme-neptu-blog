---
title: Cross-Posted Content — External Canonical
description: >
  When you republish an article that was originally published elsewhere, set
  canonical to the original URL so search engines attribute the content
  correctly.
date: 2025-01-20T08:00:00Z
authorId: ivan-k

# Point canonical at the original source to avoid duplicate-content penalties.
canonical: "https://example.com/en/articles/original-post"

tags:
  - seo
  - canonical
descrAsPreview: true
---

## When to use an external canonical

Use `canonical: "<url>"` when:

- You republish an article from another site with permission.
- You syndicate your own content (e.g. your newsletter → your blog).
- You import an article from a legacy domain.

Setting a canonical tells Google and other search engines: *"The authoritative
version of this content lives at that URL."* Your copy is treated as a
secondary reference, not a duplicate.

```yaml
canonical: "https://original-blog.com/en/post/title"
```

## Self-referencing canonical

When you want to force a canonical pointing to the current page itself — useful
if the global `themeConfig.seo.autoCanonical` option is disabled — use:

```yaml
canonical: "self"
# or shorthand:
canonical: "s"
```

## Disabling canonical entirely for one page

Override the global `seo.canonical` setting per page:

```yaml
seo:
  canonical: false
```
