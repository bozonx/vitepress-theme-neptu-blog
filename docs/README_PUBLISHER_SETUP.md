# Publisher setup for JSON-LD

## Problem

`publisher` is omitted from generated JSON-LD when it is not configured in the locale theme config.

## Configuration

Add `publisher` to the locale `themeConfig`:

```ts
export default {
  themeConfig: {
    publisher: {
      name: 'Your Site Name',
      url: 'https://yoursite.com',
      logo: '/logo.png',
    },
  },
}
```

You can also override it in the final site config with the same shape.

## How it works

`src/transformers/addJsonLd.ts` builds:

```ts
const publisher = langConfig.themeConfig.publisher && {
  '@type': 'Organization',
  name: langConfig.themeConfig.publisher.name || siteName,
  url: langConfig.themeConfig.publisher.url || siteUrl,
  logo: langConfig.themeConfig.publisher.logo && {
    '@type': 'ImageObject',
    url: absoluteLogoUrl,
  },
}
```

If `publisher` is missing, the field is not added to JSON-LD.

## Result

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name",
    "url": "https://yoursite.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.png"
    }
  }
}
```

## Verification

1. Configure `themeConfig.publisher`
2. Build the site
3. Open a post page
4. Check the generated `application/ld+json` script
