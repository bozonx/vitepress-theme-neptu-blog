# External Links Configuration

## Problem

By default VitePress adds `rel="noreferrer"` to all external links in posts. This is a security feature, but may be undesirable in some cases.

## Solution

The theme configures `externalLinks` in the `markdown` section of `blogConfigBase`:

```javascript
markdown: {
  ...config.markdown,
  image: { lazyLoading: true, ...config.markdown?.image },
  // Disable rel="noreferrer" for external links
  externalLinks: { target: '_blank', rel: [] },
  config: (md) => {
    md.use(mdImage, { srcDir: config.srcDir })

    if (config.markdown?.config) {
      config.markdown.config(md)
    }
  },
},
```

## Behavior

- `target: '_blank'` — links still open in a new tab
- `rel: []` — an empty array disables all `rel` attributes, including `noreferrer`

## Customizing rel attributes

You can use different `rel` values in your own config:

```javascript
// Keep only noopener (recommended for security)
externalLinks: { target: '_blank', rel: ['noopener'] },

// Add noopener and nofollow
externalLinks: { target: '_blank', rel: ['noopener', 'nofollow'] },

// Disable all rel attributes
externalLinks: { target: '_blank', rel: [] },
```

## Security note

`noreferrer` prevents:

- Referrer information leakage
- `window.opener` attacks

If you disable `noreferrer`, keep `noopener` for basic protection:

```javascript
externalLinks: { target: '_blank', rel: ['noopener'] },
```

Changes take effect after restarting the dev server or rebuilding.
