# vitepress-theme-neptu-blog

Vitepress blog template for freedom sites by Ivan K.

## Use in your project

See `example` dir

## Use in dev mode

Clone repo and run inside it.

```
pnpm link
pnpm build:tw
```

The `build:tw` command only builds tailwind classes that are used in
this blog template. All other styles as included in layout and
are built via vitepress of your project

## Config

```
export default {
  themeConfig: {
    // show author name on the posts list items
    showAuthorInPostList: true
    authors:
      - id: john-smith
        name: John Smith
        descr: Some MD descr
        link?: If defined then this link will be used. If not then will be use link to author page
    homeBgParalaxOffset: 150
    sidebarLogoSrc: "/img/sidebar-logo.webp",
  },
};
```

## Site config

```
  topBar:
    links:
      - text: "${PROPS.t.links.donate}"
        href: "${PROPS.siteUrl}/${PROPS.lang}/page/donate"
        icon: "${PROPS.donateIcon}"
        # show on desktop and on mobile
        mobileToo: true
        # show only on mobile and don't show on desktop
        mobileOnly: true

```

## Post meta data

You can publish all types of posts - article, post, video and audio. They are the same.

### All the posts have common parameters

```
---
title?: Use it only if you want to replace title which is got from H1 tag
description: content of meta descr and preview text if it allowed
# If true - then use description or first part of the post in a list and article
# If false | undefined - then use first part of the post in a list and don't use in article
descrAsPreview: true | false
# If has text - then use this text in a list and in an article
# If not set - then depend of descrAsPreview
# It won't shown in a post if media, or cover is set
previewText: text for list item and article preview
pubDate: Publication date in iso format. Better to use time to order posts which are published at the same day
# The main image of article. Optional
cover: /media/img.jpg
coverDescr: description of cover image in MD format
# ID of author of site team. It it some other author just put his name into the text
authorId: john-smith
# Url where you can find comments of it post in social media
commentUrl: https://...
# List of tags. Tags can include spaces
tags:
  - some
# Add canonical link to page head for SEO (prevents duplicate content issues)
canonical: "https://example.com/en/post/post-slug"  # URL канонической страницы
# или
canonical: "self"  # Ссылка на саму страницу
# или
canonical: "s"     # Сокращенная версия

...special params
---
```

### Special parameters of posts

```
---
...common params

# Link to a video on youtube or another platform. It is used in a watch video button
videoLink: htts://...
# Language of video link if it doesn't equal the language of the page
videoLinkLang: en | ru | ...
# Links to poscast of this post
podcasts:
  # means special page of this podcast e.g on https://mave.digital
  site: "https://..",
  castbox: "https://..",
  soundstream: "https://..",
  spotify: "https://..",
  vk: "https://..",
  yandexmusic: "https://..",
  deezer: "https://..",
  pocketcasts: "https://..",
  applepodcasts: "https://..",
  overcast: "https://..",
  zvuk: "https://..",
  podcastaddiction: "https://..",
# Language of podcast if it doesn't equal the language of the page
podcastLang: en | ru | ...
---

If the post doesn't have any media then the first image will be used as main image to show in lists.

## SEO Features

### Canonical Links
Add `canonical` parameter to your post frontmatter to automatically include a canonical link in the page head. This helps search engines understand which version of a page is the primary one, preventing duplicate content issues.

**Options:**
- `canonical: "https://example.com/en/post/post-slug"` - Link to another page
- `canonical: "self"` - Link to the current page itself
- `canonical: "s"` - Short version of "self"

See [CANONICAL_README.md](CANONICAL_README.md) for detailed documentation.
```

## Publish

```
pnpm publish
```

## Youtube

see https://github.com/miletorix/vitepress-youtube-embed

```
<YouTubeEmbed video-id="vidid" />
```
