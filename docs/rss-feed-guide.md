# RSS Feed Guide

## Overview

RSS, Atom, and JSON feeds are generated automatically per locale during the build.

## Supported formats

| Format | File name | MIME type |
|--------|-----------|-----------|
| RSS 2.0 | `feed-{locale}.rss` | `application/rss+xml` |
| Atom 1.0 | `feed-{locale}.atom` | `application/atom+xml` |
| JSON Feed 1.1 | `feed-{locale}.json` | `application/feed+json` |

## Configuration

Control output with root-level config (inside `defineBlogConfig`):

```ts
export default defineConfig(
  defineBlogConfig({
    maxPostsInRssFeed: 50,
    rssFormats: ['rss', 'atom', 'json'],
  })
)
```

## Frontmatter

Required fields:

```yaml
---
title: 'Post title'
date: '2024-01-15'
---
```

Optional fields used by feeds:

```yaml
---
title: 'Post title'
date: '2024-01-15'
authorId: 'john-smith'
tags: ['tag1', 'tag2']
cover: '/img/post-cover.jpg'
previewText: 'Short preview text'
# Not built-in; feed generation strips HTML from descriptions automatically
---
```

## Output file structure

```
dist/
├── feed-en.rss
├── feed-en.atom
├── feed-en.json
├── feed-ru.rss
├── feed-ru.atom
└── feed-ru.json
```

## Validation

- **RSS/Atom**: https://validator.w3.org/feed/
- **JSON Feed**: https://jsonfeed.org/validator/

Local validation:

```bash
xmllint --noout feed-en.rss
xmllint --noout feed-en.atom
jq . feed-en.json
```

## Error handling

- Invalid posts are skipped with a warning instead of crashing the build.
- Missing titles or malformed dates are caught during generation.
- HTML is stripped from descriptions automatically.

## Compatibility

Tested with Feedly, Inoreader, NewsBlur, NetNewsWire, and major platforms such as WordPress, Medium, Substack, and Ghost.
