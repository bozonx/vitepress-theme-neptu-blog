# Canonical Links

## Overview

Canonical links help search engines understand which version of a page is the primary one, preventing duplicate content issues.

Add the `canonical` field to any post or page frontmatter:

- `canonical: "https://example.com/en/post/post-slug"` — absolute URL
- `canonical: "self"` — auto-generate a link to the current page
- `canonical: "s"` — short alias for `"self"`

```yaml
---
title: My Post Title
description: Post description
date: 2024-01-15
canonical: "https://example.com/en/post/post-slug"
# or
canonical: "self"
# or short alias
canonical: "s"
tags:
  - tag1
  - tag2
---
```

## Behavior

### With an explicit URL

The `addCanonicalLink` transformer inserts a `<link rel="canonical">` tag into the page `<head>` using the provided absolute URL.

```html
<link rel="canonical" href="https://example.com/en/post/post-slug" />
```

### With `"self"` or `"s"`

The transformer builds the current page URL from `siteUrl` and the page path.

```html
<link rel="canonical" href="https://example.com/en/post/current-page" />
```

## Examples

### Link to another page

```yaml
---
title: 'How to set up VitePress'
description: 'Step-by-step VitePress setup guide'
date: 2024-01-15
canonical: 'https://example.com/en/post/how-to-setup-vitepress'
---
```

### Link to the current page

```yaml
---
title: 'Page with self canonical'
description: 'Self-referencing canonical link'
date: 2024-01-15
canonical: 'self'
---
```

### Without a canonical link

```yaml
---
title: 'Regular page'
description: 'No canonical link added'
date: 2024-01-15
---
```

No `<link rel="canonical">` tag is emitted.

## Technical details

- The transformer only runs on locale-prefixed paths (e.g. `/en/`, `/ru/`).
- Explicit URLs are validated.
- `"self"` and `"s"` require `siteUrl` to be configured.
- Errors are handled safely with build-time warnings.
