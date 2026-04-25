<script setup lang="ts">
import ToTheTopDesktop from "./ToTheTopDesktop.vue";
import ToTheTopMobile from "./ToTheTopMobile.vue";

const props = defineProps(["scrollY", "isMobile"]);
</script>

<template>
  <ToTheTopMobile v-if="props.isMobile" :scroll-y="scrollY" />
  <ToTheTopDesktop v-else :scroll-y="scrollY" />
</template>
