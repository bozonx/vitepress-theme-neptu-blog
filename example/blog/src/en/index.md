---
layout: home
---
<script setup>
import {
  HomeHero,
  HomeTags,
  HomePopularPosts,
  UtilPageContent,
} from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { theme, localeIndex } = useData()

const hero = {
  firstLine: "Example blog",
  secondLine: "Articles, new&nbsp;of&nbsp;the&nbsp;movement",
  img: {
    src: theme.value.mainHeroImg,
    alt: "Example blog logo",
  },
  buttons: [
    {
      text: theme.value.t.toBlog,
      href: `${theme.value.recentBaseUrl}/1`,
      primary: true,
    },
    {
      text: `Our Telegram channel`,
      href: "https://t.me/...",
      icon: theme.value.telegramIcon,
    },
    {
      text: theme.value.t.links.donate,
      href: `${theme.value.donate.url}`,
      icon: theme.value.donateIcon,
    },
  ],
}
</script>

<HomeHero v-bind="hero" />
<HomeTags :header="theme.t.tags" />
<HomePopularPosts />

<!-- <UtilPageContent> -->
<!---->
<!-- ## header -->
<!---->
<!-- other text -->
<!---->
<!-- </UtilPageContent> -->
