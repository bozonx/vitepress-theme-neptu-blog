---
title: Cover Image Options
description: >
  How to set a post cover image: local files, external URLs, and how
  coverDescr, coverAlt, coverWidth and coverHeight work.
date: 2025-03-05T09:00:00Z
authorId: ivan-k

# External cover image. The theme cannot auto-detect dimensions for external
# URLs, so supply coverWidth / coverHeight manually to avoid layout shift.
cover: https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Mountain landscape at sunset

# Markdown is supported — links, bold, etc.
coverDescr: "A sunset over mountain peaks. Photo by [Jeremy Bishop](https://unsplash.com/@jeremybishop) on Unsplash."

tags:
  - images
  - guide
descrAsPreview: true
---

## External images

Set `cover` to any absolute URL. Because the theme cannot inspect remote files,
provide `coverWidth` and `coverHeight` (pixels) so the browser can reserve the
correct space before the image loads, avoiding cumulative layout shift.

```yaml
cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: Descriptive alt text for accessibility
coverDescr: "Caption with **markdown** and [links](https://example.com)."
```

## Local images

Place the file in `src/public/img/` and use the path starting with `/img/`:

```yaml
cover: /img/my-post-cover.jpg
```

The theme reads local files at build time and sets `coverWidth` / `coverHeight`
automatically — you do not need to supply them.

## Images inside the post body

Standard markdown image syntax works anywhere in the body:

![A cozy cabin in the woods](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop)

External images in the body are passed through as-is. Local images in the body
are also handled by the theme — `lazyLoading` is enabled by default.
