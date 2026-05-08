---
title: Full-Featured Post — All Frontmatter Options
description: >
  This post demonstrates every frontmatter option the theme supports: cover
  image, author, tags, preview, media links, and podcasts.
date: 2025-01-15T12:00:00Z
authorId: ivan-k

# Cover image. Use an absolute URL for external images or a path relative to
# the public/ directory for local ones.
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: A laptop on a desk with a cup of coffee
# coverDescr supports markdown — it is converted to HTML before rendering.
coverDescr: "Photo by [Alejandro Escamilla](https://unsplash.com/@alejandroescamilla) on Unsplash."

tags:
  - guide
  - frontmatter
  - features

# Override the auto-generated preview that appears in post lists.
# Use either previewText OR descrAsPreview — not both.
descrAsPreview: true
# previewText: "Custom text shown in post list instead of the generated excerpt."

# Link to an external discussion thread (Telegram, GitHub Discussions, etc.).
commentLink: https://github.com/

# Optional video link shown as a button at the top of the post.
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: EN

# Podcast episodes on different platforms.
podcastLang: EN
podcasts:
  spotify: https://open.spotify.com/
  apple: https://podcasts.apple.com/
  # youtube: https://www.youtube.com/

# searchIncluded: false   # Exclude this post from search index.

# Per-page SEO overrides (each defaults to true).
# seo:
#   og: false       # Disable Open Graph tags for this page.
#   jsonLd: false   # Disable JSON-LD structured data.

# Canonical link. Omit this field to use the value of autoCanonical from the
# global config (which defaults to true — pointing to the page's own URL).
# Use "self" / "s" to force a self-referencing canonical even when autoCanonical
# is disabled globally.
# Use a full URL to point at the original source when cross-posting.
# canonical: "self"
# canonical: "https://original-blog.com/en/post/this-post"

# translations:
#   ru: "/ru/post/full-featured-ru"
---

This is the "kitchen sink" post — it has every frontmatter option turned on so
you can see how the theme renders each feature.

## What's shown here

- **Cover image** — set via `cover`, with explicit `coverWidth` / `coverHeight`
  so the browser can reserve layout space before the image loads.
- **Cover description** — `coverDescr` appears as a caption below the cover.
- **Author block** — `authorId` links to the author's page and shows their
  avatar and bio in the post footer.
- **Tags** — displayed both in the post header and footer.
- **Preview override** — `descrAsPreview: true` reuses the frontmatter
  `description` in post-list cards instead of generating a text excerpt.
- **Comment link** — `commentLink` adds a "Discussion" button in the post footer.
- **Video button** — `videoLink` adds a prominent button at the top of the post.
- **Podcast dropdown** — `podcasts` adds platform links rendered as a dropdown.

## Post body

The rest of the post is normal markdown content. Everything below is just
placeholder text to give the post realistic length in the post list.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula
metus vitae mi feugiat, sed convallis diam feugiat. Suspendisse potenti.

```ts
// Code blocks work too.
const greeting = (name: string) => `Hello, ${name}!`
console.log(greeting('world'))
```

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.
