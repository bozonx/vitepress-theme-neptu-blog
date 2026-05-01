# Hreflang Meta Tags for VitePress Neptu Blog Theme

## Summary

`addHreflang` adds alternate locale links for multilingual pages.

The theme assumes locale-prefixed routing only:

- `en/index.md` -> `/en/`
- `ru/post/hello.md` -> `/ru/post/hello`
- `en-GB/page/about.md` -> `/en-GB/page/about`

There is no special `root` locale in the theme model.

## Current behavior

The transformer:

1. Reads the current page locale from `pageData.relativePath`.
2. Removes that locale segment from the relative path.
3. Rebuilds the same page path for every configured locale.
4. When `srcDir` is available, skips locales whose source file does not exist.
5. Adds one `<link rel="alternate">` tag per existing locale page.
6. Adds one `x-default` alternate link that points to the first configured locale version of the page.

Locale-matching behavior in the theme is:

1. If `frontmatter.translations` exists, use it as the source of truth for alternate locale pages.
2. Otherwise, fall back to the same relative path in another locale.

Example:

```yaml
---
title: Hello world
translations:
  ru: /ru/post/privet-mir
  'en-US': /en-US/post/hello-world
  'pt-BR': /pt-BR/artigos/ola-mundo
---
```

When `translations` is omitted, hreflang generation still works automatically for pages that keep the same relative path across locale folders.

For `en/post/hello.md` with locales `en` and `ru`, it generates:

```html
<link rel="alternate" hreflang="en-US" href="https://example.com/en/post/hello" />
<link rel="alternate" hreflang="ru-RU" href="https://example.com/ru/post/hello" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/post/hello" />
```

## Requirements

- `siteUrl` must be configured.
- At least two locales must exist in `locales`.
- Content files must live under locale folders.

Example:

```ts
export default defineConfig({
  locales: {
    en: { lang: 'en-US' },
    ru: { lang: 'ru-RU' },
  },
})
```

## File structure

```text
src/
  en/
    index.md
    post/
      article.md
  ru/
    index.md
    post/
      article.md
```

Even a single-language site should still use a locale folder such as `src/en/`.

## Notes

- The current locale is included in the generated hreflang set.
- If only one locale version of a page exists, hreflang tags are omitted for that page.
- `x-default` points to the first configured locale version that exists for the current page.
- Links without a locale prefix are outside the supported routing model.
- Different localized slugs are supported through `frontmatter.translations`.
