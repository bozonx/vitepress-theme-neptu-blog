---
title: Навигация, сайдбар и футер
description: Как формируются верхняя панель, секции сайдбара и футер из конфигурации YAML.
layout: page
translations:
  en: /en/page/nav-sidebar-footer
---

# Навигация, сайдбар и футер

Интерфейс вокруг вашего контента — верхняя панель, сайдбар и футер — полностью
формируется из YAML. Посмотрите на элементы этого демо: всё, что описано ниже, работает вживую.

## Верхняя панель (`nav`)

Панель в самом верху. Содержит произвольные ссылки, иконки соцсетей, опциональную кнопку
пожертвования, кнопку поиска, переключатель языка и переключатель темы оформления.

```yaml
# src/<locale>/_site.yaml
themeConfig:
  nav:
    donate: true            # показывать кнопку пожертвования в панели
    links:
      - text: 'Внешняя ссылка'
        href: 'https://example.org/'
        icon: 'solar:document-linear'
        desktopOnly: true   # скрывать на мобильных (где работает сайдбар)
    socialLinks:
      - icon: 'fa6-brands:github'
        link: '${theme.repo}'
```

Каждая ссылка поддерживает параметры `icon`, `iconClass`, `class`, а также флаги видимости
`desktopOnly` / `mobileOnly`.

## Сайдбар

Включайте или отключайте встроенные секции и добавляйте свои группы ссылок:

```yaml
themeConfig:
  sidebar:
    popular: true   # требуется popularPosts.enabled
    recent: true
    archive: true   # по годам → месяцам
    authors: true
    tags: true      # облако тегов
    donate: true
    rssFeed: true
    atomFeed: true
    bottomLinks:
      - { header: '${t.links.links}' }        # заголовок секции
      - text: 'Наш YouTube-канал'
        href: 'https://www.youtube.com/'
        icon: '${theme.youtubeIcon}'
      - text: 'Мы в соцсетях'
        href: 'page/links'
        icon: 'fa6-solid:share-nodes'
```

Каждая встроенная секция соответствует сгенерированному макету — их можно посмотреть в сайдбаре:
**Свежие посты**, **Популярное**, **Архив**, **Авторы**, **Теги**.

## Футер

```yaml
themeConfig:
  footer:
    message: 'Копирование разрешено только со ссылкой на источник.'
    copyright: 'Copyright © 2026 Your Name.'
    links:
      - text: '${t.links.aboutBlog}'
        href: 'page/about'
```

## Иконки

Каждое поле `icon:` принимает строку [Iconify](https://icones.es) вида `prefix:name`,
например `fa6-solid:hand-holding-heart`. Иконки по умолчанию (пожертвование, свежие,
популярное, RSS и т.д.) можно переопределить глобально в `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  popularIcon: 'fa6-solid:star'
  rssIcon: 'bi:rss-fill'
```

## Внешние ссылки в контенте постов

К внешним ссылкам внутри вашей markdown-разметки (не в навигации) по умолчанию
добавляется иконка перехода, чтобы читатели видели уход с сайта. Эту иконку можно отключить глобально:

```yaml
# src/site.yaml
themeConfig:
  externalLinkIcon: true   # установите false, чтобы убрать иконку ↗ на внешних ссылках
```

Под капотом тема открывает внешние ссылки в новой вкладке (`target="_blank"`).
Если вам нужно изменить атрибут `rel` (VitePress добавляет `rel="noreferrer"` по умолчанию),
переопределите `markdown.externalLinks` в `.vitepress/config.ts`:

```ts
markdown: {
  externalLinks: { target: '_blank', rel: [] }, // например, убрать rel="noreferrer"
}
```

## Относительные URL подстраиваются под локаль

Относительный `href`, такой как `page/about`, автоматически дополняется префиксом текущей
локали (`/en/page/about`, `/ru/page/about`). Для внешних ссылок используйте абсолютные URL (`https://…`).
