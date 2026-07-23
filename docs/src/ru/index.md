---
layout: home
heroImg: /img/home-logo.webp
---
<script setup>
import {
  HomeHero,
  HomeTags,
  HomePopularPosts,
  UtilPageContent,
} from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { theme, frontmatter } = useData()

const hero = {
  firstLine: "Тема Neptu для блога",
  secondLine: "Живое демо &mdash; каждая страница документирует возможность темы",
  img: {
    src: frontmatter.value.heroImg,
    alt: "Логотип демо-блога",
  },
  buttons: [
    {
      text: theme.value.t.toBlog,
      href: 'recent/1',
      primary: true,
    },
    {
      text: 'Открыть гайд',
      href: 'post/welcome',
    },
  ],
}
</script>

<HomeHero v-bind="hero" />

<UtilPageContent>

## Блог документирует сам себя

Каждый пост и страница здесь — это **живая демонстрация** одной возможности темы,
с точным фронтматером или конфигурацией, создавшими её, показанными прямо под результатом.
Начните с [вводного гайда](post/welcome), а затем изучайте по разделам:

- **Frontmatter** — [пост со всеми полями](post/full-featured) · [обложки и лайтбокс](post/cover-and-images) · [автор, видео и подкасты](post/author-video-podcast) · [превью и поиск](post/preview-and-search) · [футер, шеринг и похожие](post/post-footer-and-sharing)
- **Медиа-компоненты** — [YouTube, видео, аудио, скачивание](post/media-components)
- **SEO** — [JSON-LD](post/json-ld) · [canonical и кросспостинг](post/canonical-crosspost) · [i18n и hreflang](post/i18n-hreflang)
- **Конфигурация** — [уровни конфигурации](page/config-layers) · [цветовые темы и шрифты](page/color-themes) · [навигация, сайдбар и футер](page/nav-sidebar-footer) · [ленты, поиск и SEO-переключатели](page/seo-feeds-search) · [расширенные возможности: хуки и внешний контент](page/advanced)

### Все типы макетов доступны для просмотра

Сайдбар ссылается на каждый сгенерированный макет списка: **Свежие посты**, **Популярное**,
**Архив** (по годам → месяцам), **Авторы** и облако **Теги**. Используйте переключатель
языка в верхней панели для перехода между английской и русской версиями.

</UtilPageContent>

<HomeTags :header="theme.t.tags" />
<HomePopularPosts />
