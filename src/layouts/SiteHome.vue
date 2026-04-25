<script setup>
import { computed } from 'vue'
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue'
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import VPHomeContent from 'vitepress/dist/client/theme-default/components/VPHomeContent.vue'
import { useData } from 'vitepress'

const props = defineProps(['hero', 'features'])
const { theme } = useData()

const hero = computed(() => ({
  ...props.hero,
  // image: {
  //   ...props.hero.image,
  //   src: props.hero.image?.src || theme.value.mainHeroImg,
  // },
}))
</script>

<template>
  <div>
    <template v-if="props.hero">
      <VPHero v-bind="hero" />
    </template>
    <template v-if="props.features">
      <VPFeatures :features="props.features" />
    </template>
    <VPHomeContent style="margin-top: 2.5rem; margin-bottom: 4rem">
      <slot />
    </VPHomeContent>
  </div>
</template>

<style>
.VPHero a,
.VPFeatures a {
  text-decoration: none;
  color: inherit;
}

.VPFeatures h2 {
  margin: 0;
  border: 0 none;
  padding: 0;
  letter-spacing: normal;
}

.VPFeatures p {
  margin: 0;
}
</style>
