# Social Sharing

The theme renders a block of share buttons below every post. You control which networks appear and in what order via `themeConfig.socialMediaShares`.

## Basic usage

`socialMediaShares` is an array of `SocialMediaShare` objects:

```ts
interface SocialMediaShare {
  name: string
  icon: string
  title: string
  urlTemplate: string
  class?: string
}
```

| Field | Description |
|-------|-------------|
| `name` | Machine identifier (used only for your reference) |
| `icon` | Iconify icon name (e.g. `'logos:telegram'`) |
| `title` | Accessible label / tooltip |
| `urlTemplate` | Share URL with `{url}` and `{title}` placeholders |
| `class` | Optional CSS classes for the button |

## Default networks

The built-in locale configs already include six networks:

```ts
themeConfig: {
  socialMediaShares: [
    { name: 'telegram',  icon: 'logos:telegram',      title: 'Telegram',  urlTemplate: 'https://t.me/share/url?url={url}&text={title}' },
    { name: 'whatsapp',  icon: 'logos:whatsapp-icon', title: 'WhatsApp',  urlTemplate: 'https://api.whatsapp.com/send?text={title}%20{url}' },
    { name: 'vk',        icon: 'cib:vk',              title: 'VK',        urlTemplate: 'https://vk.com/share.php?url={url}&title={title}', class: 'text-[#0077ff] hover:text-[#0077ff]' },
    { name: 'x',         icon: 'ri:twitter-x-fill',   title: 'X (Twitter)', urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}' },
    { name: 'facebook',  icon: 'logos:facebook',      title: 'Facebook',  urlTemplate: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
    { name: 'linkedin',  icon: 'logos:linkedin-icon', title: 'LinkedIn',  urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
  ]
}
```

You can override the entire array per locale or globally.

## Adding custom networks

Any service that provides a share URL works. Replace `{url}` and `{title}` in the template:

```ts
themeConfig: {
  socialMediaShares: [
    { name: 'threads', icon: 'simple-icons:threads', title: 'Threads', urlTemplate: 'https://threads.net/intent/post?text={title}%20{url}' },
    { name: 'reddit',  icon: 'logos:reddit-icon',    title: 'Reddit',  urlTemplate: 'https://www.reddit.com/submit?url={url}&title={title}' },
    { name: 'bluesky', icon: 'simple-icons:bluesky', title: 'Bluesky', urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}' },
    { name: 'mastodon', icon: 'logos:mastodon-icon', title: 'Mastodon', urlTemplate: 'https://share.plasmatrap.com/share?text={title}%20{url}' },
  ]
}
```

> **Tip:** You can add UTM tags directly in `urlTemplate`:
> ```ts
> urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}%3Futm_source%3Dshare'
> ```

## Hiding the block

Omit `socialMediaShares` entirely or set it to an empty array:

```ts
themeConfig: {
  socialMediaShares: []
}
```

In both cases the share block is not rendered.

## Per-locale overrides

Use `uiLocales` to provide different sets of networks (or different labels) per language:

```ts
themeConfig: {
  uiLocales: {
    ru: {
      extends: 'ru',
      themeConfig: {
        socialMediaShares: [
          { name: 'vk', icon: 'cib:vk', title: 'ВКонтакте', urlTemplate: 'https://vk.com/share.php?url={url}&title={title}', class: 'text-[#0077ff] hover:text-[#0077ff]' },
          { name: 'telegram', icon: 'logos:telegram', title: 'Телеграм', urlTemplate: 'https://t.me/share/url?url={url}&text={title}' },
          { name: 'odnoklassniki', icon: 'simple-icons:odnoklassniki', title: 'Одноклассники', urlTemplate: 'https://connect.ok.ru/offer?url={url}&title={title}' },
        ]
      }
    }
  }
}
```
