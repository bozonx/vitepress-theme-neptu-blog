---

title: Custom JSON-LD Structured Data
description: &gt;
  The theme generates JSON-LD automatically for every post. Use the jsonLd
  frontmatter field to extend or override the generated schema.
date: 2025-02-28T14:00:00Z
authorId: ivan-k
tags:

- seo
- json-ld
descrAsPreview: true

# The jsonLd block is YAML that gets merged into the auto-generated schema.

# Use quoted "@type" because @ is not valid bare YAML.

## jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu-blog

## How it works

The theme automatically generates an `Article` schema for every post based on
its frontmatter (`title`, `description`, `date`, `author`, `cover`). The
`jsonLd` frontmatter field lets you merge additional fields into that schema.

## Basic example

```yaml
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
```

Fields you provide are **merged** with the auto-generated schema, so you only
need to specify what differs or what the theme cannot infer automatically.

## Nested objects

```yaml
jsonLd: |
  isPartOf:
    "@type": Blog
    name: My Blog
    url: https://myblog.org
```

## Arrays

```yaml
jsonLd: |
  isPartOf:
    - "@type": WebSite
      name: Main Website
      url: https://myblog.org
    - "@type": Blog
      name: My Blog
      url: https://myblog.org/blog
```

## Disabling JSON-LD for a page

```yaml
seo:
  jsonLd: false
```

## Disabling all SEO head tags globally

In `.vitepress/config.ts`:

```ts
themeConfig: {
  seo: {
    og: false,
    jsonLd: false,
    hreflang: false,
    canonical: false,
    rss: false,
  }
}
```

