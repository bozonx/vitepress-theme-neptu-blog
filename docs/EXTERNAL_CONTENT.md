# External Content

The theme is optimized for static VitePress sites. Built-in post helpers read
local Markdown files and turn them into post previews, feeds, archive pages, and
similar-post lists.

If your source content lives in a CMS, API, or another website, the recommended
approach is to sync that content into local `.md` files before VitePress builds.
After that, the theme treats generated files exactly like handwritten posts.

## Generate posts before build

Add a prebuild script that downloads or transforms remote content and writes it
to your locale post directory:

```json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src"
  }
}
```

```js
// scripts/sync-remote-posts.mjs
import fs from 'node:fs/promises'

const response = await fetch('https://example.com/post.md')
if (!response.ok) {
  throw new Error(`Failed to fetch remote post: ${response.status}`)
}

const markdown = await response.text()

await fs.mkdir('src/en/post', { recursive: true })
await fs.writeFile(
  'src/en/post/remote-post.md',
  `---
title: Remote post
date: 2026-05-09
tags: [remote]
---

${markdown}
`
)
```

The generated file should include the same frontmatter as any regular post.
Once it exists under `src/<locale>/post/*.md`, it is included by the standard
data loader, RSS generation, sitemap, archive pages, tag pages, and similar-post
logic.

## Convert remote HTML

For remote HTML, convert it to Markdown in the same prebuild step and then write
the generated Markdown file:

```js
// scripts/sync-html-posts.mjs
import fs from 'node:fs/promises'
import TurndownService from 'turndown'

const response = await fetch('https://example.com/article.html')
if (!response.ok) {
  throw new Error(`Failed to fetch remote HTML: ${response.status}`)
}

const html = await response.text()
const markdown = new TurndownService().turndown(html)

await fs.mkdir('src/en/post', { recursive: true })
await fs.writeFile(
  'src/en/post/imported-article.md',
  `---
title: Imported article
date: 2026-05-09
tags: [imported]
---

${markdown}
`
)
```

Install the converter in your site project, not in the theme package:

```sh
pnpm add -D turndown
```

## Custom data loaders

You can also write your own VitePress data loader. The default example watches
`./post/*.md` and passes watched files to `loadPostsDataFromFiles`:

```ts
// src/en/loadPosts.data.ts
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu-blog/list-helpers/node'

export default {
  watch: ['./post/*.md'],
  async load(watchedFiles: string[]) {
    return {
      posts: await loadPostsDataFromFiles(watchedFiles),
    }
  },
}
```

For most external-content workflows, still generate local `.md` files first.
VitePress can only build post pages for files it knows about during the build.
Returning extra items from a data loader can populate lists, but it does not
create the corresponding Markdown pages.

## Embed external content

If you only need to display external content inside an existing post, use an
iframe or a custom Vue component in Markdown:

```md
<iframe
  src="https://example.com/embed"
  width="100%"
  height="420"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

Prefer a wrapper component when the embed is reused:

```vue
<!-- .vitepress/theme/ExternalEmbed.vue -->
<script setup lang="ts">
defineProps<{ src: string; title?: string }>()
</script>

<template>
  <iframe
    :src="src"
    :title="title"
    width="100%"
    height="420"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
  />
</template>
```

Register it in your site theme:

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu-blog'
import ExternalEmbed from './ExternalEmbed.vue'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)
    ctx.app.component('ExternalEmbed', ExternalEmbed)
  },
}
```

Then use it in Markdown:

```md
<ExternalEmbed src="https://example.com/embed" title="External content" />
```

Only embed trusted sources. Configure `sandbox`, allowed domains, and your
site's Content Security Policy according to the content provider's requirements.
