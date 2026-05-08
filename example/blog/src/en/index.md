---
layout: home
---
<script setup>
import {
  HomeHero,
  HomeTags,
  HomePopularPosts,
} from 'vitepress-theme-neptu-blog/components'
import { useData } from 'vitepress'

const { theme, localeIndex } = useData()

const hero = {
  firstLine: "Example Blog",
  secondLine: "A demo of the&nbsp;vitepress&#8209;theme&#8209;neptu&#8209;blog",
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
      text: theme.value.t.links.donate,
      href: theme.value.donate?.url,
      icon: theme.value.donateIcon,
    },
  ],
}
</script>

<HomeHero v-bind="hero" />
<HomeTags :header="theme.t.tags" />
<HomePopularPosts />

<!-- Optional: add a static text block below the hero. -->
<!-- <UtilPageContent>                                  -->
<!--                                                    -->
<!-- ## Welcome                                         -->
<!--                                                    -->
<!-- Some introductory text here.                       -->
<!--                                                    -->
<!-- </UtilPageContent>                                 -->
