---
title: Уровни конфигурации
description: Тема объединяет настройки из четырех уровней. На этой странице объясняется назначение каждого уровня и то, какой из них следует редактировать.
layout: page
translations:
  en: /en/page/config-layers
---

# Уровни конфигурации

Настройки темы формируются путём объединения **четырёх уровней** в порядке приоритета. Более поздние
уровни переопределяют значения предыдущих:

```
встроенные значение по умолчанию
  → .vitepress/config.ts        (для разработчиков, требует кода)
    → src/site.yaml             (для редакторов, общие для всех локалей)
      → src/<locale>/_site.yaml (для редакторов, отдельно для каждой локали)
```

## Какой файл редактировать?

| Я хочу изменить… | Файл для редактирования |
| --- | --- |
| `siteUrl`, значения из переменных окружения, Vite-плагины, поиск, популярные посты (GA4) | `.vitepress/config.ts` |
| Оформление, общее для всех локалей (футер, издатель, иконки, переключатели SEO) | `src/site.yaml` |
| Локализованную идентичность и переопределения (`lang`, `blogTitle`, подписи навигации, переводы) | `src/<locale>/_site.yaml` |

**Правило:** если настройка требует JavaScript или секретов, она помещается в `config.ts`.
Если её может захотеть изменить редактор контента, используйте YAML.

## Уровень 1 — `.vitepress/config.ts`

Подключение на уровне кода. Здесь вызывается `defineBlogConfig` и автоматически обнаруживаются
папки локалей (любая папка `src/<locale>/`, содержащая `_site.yaml`).

```ts
// .vitepress/config.ts (выдержка)
export default async () => {
  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org', // абсолютный URL без завершающего слэша —
                                   // используется для canonical, sitemap, RSS, OG, hreflang
    themeConfig: {
      repo: 'https://github.com/your-org/your-blog',
      perPage: 10,
      search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
      popularPosts, // зависит от env (GA4), остаётся в коде
    },
  }
  return defineBlogConfig(config)
}
```

## Уровень 2 — `src/site.yaml` (межлокальный)

Всё в разделе `themeConfig:`, что **одинаково для всех локалей**, но редактор контента
может захотеть изменить без правки кода:

```yaml
themeConfig:
  publisher:
    logo: 'https://myblog.org/logo.png'
  editLink:
    pattern: 'https://github.com/your-org/your-blog/edit/main/src/:path'
  sidebar:
    popular: true
    recent: true
    archive: true
    authors: true
    tags: true
```

## Уровень 3 — `src/<locale>/_site.yaml` (для конкретной локали)

Локализованная идентичность и переопределения для данного языка. Ключи верхнего уровня:
`lang`, `title`, `titleTemplate`, `description`; всё остальное вложено в `themeConfig:`.

```yaml
lang: 'ru-RU'
description: 'Демонстрационный блог'
themeConfig:
  blogTitle: 'Тема Neptu для блога'
  footer:
    copyright: 'Copyright © 2026 Your Name.'
```

## Шаблонизация строк в YAML

Внутри любого `_site.yaml` можно подставлять динамические значения (подставляются перед
парсингом YAML):

| Шаблон | Во что разворачивается |
| --- | --- |
| `${theme.<key>}` | любое объединённое значение `themeConfig`, например `${theme.repo}` |
| `${t.<key>}` | строка перевода, например `${t.links.donate}` |
| `${config.siteUrl}` | URL сайта из `config.ts` |
| `${localeIndex}` | имя папки текущей локали, например `ru` |

```yaml
publisher:
  name: '${theme.blogTitle}'
  url: '${config.siteUrl}'
nav:
  socialLinks:
    - icon: 'fa6-brands:github'
      link: '${theme.repo}'
```

Подробное справочное руководство см. в `docs/CONFIG_LAYERS.md` репозитория.
