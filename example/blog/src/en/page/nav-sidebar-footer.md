---
title: Nav, Sidebar & Footer
description: How the top bar, sidebar sections, and footer are assembled from YAML config.
layout: page
---

# Nav, Sidebar & Footer

The chrome around your content — top bar, sidebar, and footer — is assembled
entirely from YAML. Look around this demo as you read: everything below is live.

## Top bar (`nav`)

The bar at the very top. Holds custom links, social icons, an optional donate
button, the search button, language switcher, and appearance toggle.

```yaml
# src/<locale>/_site.yaml
themeConfig:
  nav:
    donate: true            # show donate button in the bar
    links:
      - text: 'Some link'
        href: 'https://example.org/'
        icon: 'solar:document-linear'
        desktopOnly: true   # hide on mobile (where the sidebar takes over)
    socialLinks:
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
```

Every link supports `icon`, `iconClass`, `class`, and `desktopOnly` /
`mobileOnly` visibility flags.

## Sidebar

Toggle the built-in sections on or off, then add your own link groups:

```yaml
themeConfig:
  sidebar:
    popular: true   # requires popularPosts.enabled
    recent: true
    archive: true   # by year → month
    authors: true
    tags: true      # tags cloud
    donate: true
    rssFeed: true
    atomFeed: true
    bottomLinks:
      - { header: '${t.links.links}' }        # section header
      - text: 'Our YouTube channel'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
      - text: 'We in social media'
        href: 'page/links'
        icon: 'fa6-solid:share-nodes'
```

Each built-in section maps to a generated layout — see them live via the
sidebar: **Recent**, **Popular**, **Archive**, **Authors**, **Tags**.

## Footer

```yaml
themeConfig:
  footer:
    message: 'Copying allowed only with a link to the source.'
    copyright: 'Copyright © 2026 Your Name.'
    links:
      - text: '${t.links.aboutBlog}'
        href: 'page/about'
```

## Icons

Every `icon:` field takes an [Iconify](https://icones.es) string in the form
`prefix:name`, e.g. `fa6-solid:hand-holding-heart`. The theme's default icons
(donate, recent, popular, RSS, …) can be overridden globally in `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  popularIcon: 'fa6-solid:star'
  rssIcon: 'bi:rss-fill'
```

## Relative URLs are locale-aware

A relative `href` like `page/about` is automatically prefixed with the current
locale (`/en/page/about`, `/ru/page/about`). Use absolute URLs (`https://…`) for
external links.
