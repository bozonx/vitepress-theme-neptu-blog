---
title: Test JSON-LD Page
description: This page demonstrates JSON-LD generation from YAML
jsonLd: |
  "@type": WebPage
  name: Test JSON-LD Page
  url: https://example.com/test-json-ld
  description: This page demonstrates JSON-LD generation from YAML data
  isPartOf:
    "@type": WebSite
    name: My Blog
    url: https://example.com
---

# Test JSON-LD Page

This page demonstrates how to use the `jsonLd` frontmatter parameter to generate structured data.

## How it works

1. Add `jsonLd` to your frontmatter with YAML content
2. The transformer will parse the YAML and merge it into the generated page schema
3. The result will be emitted into the page `<head>` as `application/ld+json`

## Example YAML

```yaml
jsonLd: |
  "@type": WebPage
  name: Page Title
  url: https://example.com/page
  description: Page description
  isPartOf:
    "@type": WebSite
    name: Site Name
    url: https://example.com
```

## Supported fields

- `"@type"` - The type of the page/content (use quotes for @ fields)
- `name` - The name/title of the page
- `url` - The URL of the page
- `description` - Description of the page
- `isPartOf` - Information about the parent website (can be object or array)

## Important Note

When using fields that start with `@` (like `@type`), you must wrap them in quotes in YAML:

```yaml
"@type": WebPage  # Correct
@type: WebPage    # Incorrect - will cause parsing error
```

## Verification

Inspect the generated page HTML and check the `application/ld+json` script in the `<head>`.
