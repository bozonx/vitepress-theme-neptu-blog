---
title: Advanced JSON-LD Test
description: Testing advanced JSON-LD features with arrays
jsonLd: |
  "@type": Article
  name: Advanced JSON-LD Test Article
  url: https://example.com/advanced-json-ld
  description: This article tests advanced JSON-LD features including arrays
  isPartOf:
    - "@type": WebSite
      name: Main Website
      url: https://example.com
    - "@type": Blog
      name: My Blog
      url: https://example.com/blog
---

# Advanced JSON-LD Test

This page demonstrates advanced JSON-LD features including array support for `isPartOf`.

## Array Support

The `isPartOf` field in custom JSON-LD can be an array of objects, which is useful when content belongs to multiple parent entities.

## Generated JSON-LD

The transformer will generate structured data like this:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "name": "Advanced JSON-LD Test Article",
  "url": "https://example.com/advanced-json-ld",
  "description": "This article tests advanced JSON-LD features including arrays",
  "isPartOf": [
    {
      "@type": "WebSite",
      "name": "Main Website",
      "url": "https://example.com"
    },
    { "@type": "Blog", "name": "My Blog", "url": "https://example.com/blog" }
  ]
}
```

## Use Cases

- Content that belongs to multiple sections
- Articles published in multiple blogs
- Pages that are part of different site sections

## YAML Syntax Note

Remember to use quotes for fields starting with `@`:

```yaml
"@type": Article  # Correct
@type: Article    # Incorrect
```

## Verification

Inspect the generated HTML and confirm the `application/ld+json` script contains the expected `isPartOf` array.
