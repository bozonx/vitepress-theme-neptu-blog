<script setup lang="ts">
import { useData } from 'vitepress'
import BtnLink from '../BtnLink.vue'

const { theme } = useData()
</script>

<template>
  <div v-if="theme.donate?.postDonateCall" class="vp-doc">
    <span>{{ theme.donate.postDonateCall }}</span>
    <BtnLink
      :href="theme.donate.url"
      :text="theme.t.links.donate"
      target="_blank"
      :icon="theme.donate.icon || theme.donateIcon"
      class="ml-2 inline-flex"
    />
  </div>
</template>
