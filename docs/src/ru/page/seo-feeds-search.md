---
title: Ленты, поиск и SEO-переключатели
description: Механизмы сайта — ленты RSS/Atom/JSON, поиск Pagefind, популярные посты через GA4, robots.txt, sitemap и глобальные переключатели SEO.
layout: page
translations:
  en: /en/page/seo-feeds-search
---

# Ленты, поиск и SEO-переключатели

Помимо отдельных постов, тема автоматически настраивает множество механизмов для всего сайта.
На этой странице показано, как они работают и где конфигурируются. Настройки SEO для конкретных постов
(JSON-LD, canonical, OG) описаны в постах с тегом [`seo`](../tags/seo/1).

## Что генерируется автоматически

При сборке тема формирует для всего сайта:

- **`sitemap.xml`** — на основе `siteUrl`, за исключением страниц с `noindex`.
- **`robots.txt`** — со ссылкой на sitemap.
- **Ленты RSS / Atom / JSON** — по одному комплекту для каждой локали.
- **Мета-теги Open Graph + Twitter card** — для каждой страницы.
- **Структурированные данные JSON-LD** — для каждого поста.
- **Ссылки `hreflang`** — между переведенными страницами.
- **Канонические ссылки (canonical)**.

> **Любую из этих функций можно отключить** — глобально в `src/site.yaml` или
> индивидуально в фронтматере поста. См. раздел [SEO-переключатели](#seo-переключатели) ниже.

## Ленты (RSS / Atom / JSON)

Включены по умолчанию. Ссылки отображаются в сайдбаре (RSS + Atom) и в `<head>` каждой
страницы. Настраиваются в `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
```

Пути к файлам для каждой локали: `/ru/feed.rss`, `/ru/feed.atom`, `/ru/feed.json`.

## Поиск (Pagefind)

Поиск работает на базе [Pagefind](https://pagefind.app), который индексирует собранный
сайт. За функционирование отвечают два элемента:

```ts
// .vitepress/config.ts — ресурсы и провайдер
head: [
  ['link', { rel: 'stylesheet', href: '/pagefind/pagefind-ui.css' }],
  ['script', { src: '/pagefind/pagefind-ui.js' }],
],
themeConfig: {
  search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
},
```

Индекс создаётся из собранных файлов production, поэтому поиск доступен после полной
сборки (`pnpm build && pnpm pagefind`), а не в режиме dev. Исключить отдельный пост из
индекса можно с помощью `searchIncluded: false` в его фронтматере — см.
[Превью и поиск](../post/preview-and-search).

## Популярные посты (Google Analytics 4)

Секция сайдбара «Популярные посты» и список `/ru/popular/1` заполняются на основе реальных
просмотров из GA4 во время сборки. Секция отключена, пока вы не укажете
учетные данные через переменные окружения:

```ts
// .vitepress/config.ts
export const popularPosts = {
  enabled: Boolean(process.env.GA_PROPERTY_ID && process.env.GA_CREDENTIALS_JSON),
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  dataSource: {
    provider: 'ga4',
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
  },
}
```

Для локального предпросмотра без GA установите `enabled: true` — тема покажет
свежие посты как запасной вариант.

## SEO-переключатели

Все SEO-функции **включены по умолчанию**. Отключить их можно глобально в
`src/site.yaml` или для отдельной страницы в фронтматере через ключ `seo`:

```yaml
# Глобально — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true
    autoCanonical: true      # авто-каноническая ссылка по умолчанию
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle'  # twitter:site на каждой странице
```

```yaml
# Для отдельной страницы — в фронтматере поста
seo:
  jsonLd: false   # отключить структурированные данные только для этой страницы
  og: false
```

Установка `robots: noindex` (через `head`) также автоматически исключает страницу из sitemap.
