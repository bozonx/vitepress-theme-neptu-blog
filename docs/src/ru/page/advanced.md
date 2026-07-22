---
title: Расширенные возможности — хуки и внешний контент
description: >
  Расширение темы без форка — пользовательские трансформ-хуки, полностью
  своя разметка поста и синхронизация контента из CMS или API перед сборкой.
layout: page
translations:
  en: /en/page/advanced
---

# Расширенные возможности — хуки и внешний контент

Всё, что описано выше, касается встроенного поведения. На этой странице рассмотрены два
механизма на случай, если нужно большее: **хуки жизненного цикла** и **внешний
контент**.

## Пользовательские трансформ-хуки

Тема предоставляет стандартные хуки VitePress в конфигурации, которую вы передаёте в
`defineBlogConfig`. Ваши хуки выполняются **после** встроенных трансформеров, поэтому вы расширяете,
а не заменяете их:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',

  async transformPageData(pageData, ctx) {
    // Встроенные трансформеры уже выполнились (размеры изображений, заголовок,
    // мета-теги, описание). Добавьте или измените поля здесь.
    pageData.frontmatter.customField = 'value'
  },

  async transformHead(ctx) {
    return [['meta', { name: 'custom', content: 'value' }]]
  },

  async buildEnd(siteConfig) {
    // Выполняется после генерации RSS / robots.txt темой.
  },
})
```

Порядок выполнения для `transformPageData`:

1. Встроенные: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
2. Ваш хук

Нужно запуститься **до** встроенных трансформеров? Используйте [`extends`](https://vitepress.dev/reference/site-config#extends)
в VitePress — хуки из этой конфигурации срабатывают первыми.

## Пользовательский макет поста

Каждый строительный блок поста экспортируется из
`vitepress-theme-neptu-blog/components`, поэтому вы можете собрать собственный макет поста,
сохранив общий интерфейс темы:

```vue
<script setup lang="ts">
import {
  PostDate, PostAuthor, PostImage, PostTags,
  PostSocialShare, PostSimilarList, PostFooter,
} from 'vitepress-theme-neptu-blog/components'
</script>

<template>
  <article>
    <PostDate />
    <PostAuthor />
    <PostImage />
    <div class="vp-doc"><Content /></div>
    <PostTags />
    <PostSocialShare />
    <PostSimilarList />
    <PostFooter />
  </article>
</template>
```

Полный список экспортируемых компонентов см. в `docs/ADVANCED_CUSTOMIZATION.md`.

## Внешний контент (CMS / API)

Вспомогательные функции постов в теме читают **локальные `.md` файлы**. Если ваш контент хранятся в
CMS, API или на другом сайте, синхронизируйте его в локальный markdown *перед* сборкой VitePress
— после этого сгенерированные файлы ведут себя точно так же, как написанные вручную посты (превью,
ленты, архив, похожие посты).

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-remote-posts.mjs",
    "build": "vitepress build src && pnpm pagefind"
  }
}
```

Ваш `sync-remote-posts.mjs` получает внешний контент и записывает файлы вида
`src/ru/post/<slug>.md` с фронтматером, который ожидает тема (`title`,
`date`, `authorId`, `tags`, …). Поскольку `prebuild` выполняется первым, только что
записанные посты индексируются при каждой сборке. См. `docs/EXTERNAL_CONTENT.md`.
