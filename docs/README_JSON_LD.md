# JSON-LD in Neptu Blog Theme

`addJsonLd` adds structured data to the page `<head>` during `transformHead`.

## What is generated automatically

- Post pages: `BlogPosting`
- Plain pages with `layout: page`: `WebPage`
- Author pages: `Person`

The transformer always writes a single `<script type="application/ld+json">` tag.

## Built-in post fields

For posts the theme generates:

- `@context`
- `@type: BlogPosting`
- `headline`
- `description`
- `url`
- `datePublished`
- `dateModified` when `lastUpdated` is available
- `author` when the configured author exists
- `image` when `cover` is provided
- `keywords` from tags
- `publisher` when configured in the locale theme config
- `inLanguage`
- `mainEntityOfPage`
- `isPartOf`

## Custom JSON-LD via frontmatter

You can extend generated JSON-LD or provide custom JSON-LD for non-post pages using `frontmatter.jsonLd`.

Example:

```yaml
---
title: About
layout: page
jsonLd: |
  "@type": AboutPage
  about:
    "@type": Organization
    name: Example Inc.
---
```

Behavior:

- For posts and `layout: page`, object-shaped `jsonLd` is merged into the generated schema
- For other pages, object-shaped `jsonLd` becomes the whole payload
- Top-level arrays are supported only for custom-only pages and are emitted as `@graph`
- If `jsonLd` cannot be parsed, the transformer logs a warning and continues

## Error handling

- Invalid `frontmatter.jsonLd` does not crash the transformer
- For generated post/page schemas, invalid custom YAML is ignored and the base schema is still emitted
- For custom-only pages, invalid YAML is skipped after a warning

## Publisher configuration

`publisher` is read from locale `themeConfig.publisher`:

```ts
export default {
  themeConfig: {
    publisher: {
      name: 'Example',
      url: 'https://example.com',
      logo: '/logo.png',
    },
  },
}
```

Relative logo URLs are converted to absolute URLs using `siteUrl`.

## Notes

- All content pages are expected to have a locale prefix in the path
- The transformer does not generate alternate-language JSON-LD links
- Validate the result with Google Rich Results Test when you add custom schema fields
