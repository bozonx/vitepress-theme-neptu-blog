---
layout: home
heroImg: /img/home-logo.webp
---
<script setup>
import {
  HomeHero,
  HomeTags,
  HomePopularPosts,
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

Каждый пост и страница здесь — это **живая демонстрация** одной возможности
темы, а рядом показан тот frontmatter или конфиг, который дал этот результат.
Начните с [вводного гайда](post/welcome), а затем изучайте по темам: frontmatter,
медиа-компоненты, SEO и настройка.

Полная версия документации доступна в английской локали — переключите язык в
верхней панели.

</UtilPageContent>

<HomeTags :header="theme.t.tags" />
<HomePopularPosts />
