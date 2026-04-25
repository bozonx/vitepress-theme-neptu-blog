<script setup>
  import DefaultTheme from "vitepress/theme";
  import PageFindSearch from "vitepress-theme-neptu-blog/PageFindSearch.vue";
  import NavSearchButton from "vitepress-theme-neptu-blog/NavSearchButton.vue";

  const { Layout: DefaultLayout } = DefaultTheme;
</script>

<template>
  <div id="modals"></div>

  <DefaultLayout>
    <template #nav-bar-content-before>
      <PageFindSearch>
        <NavSearchButton />
      </PageFindSearch>
    </template>
  </DefaultLayout>
</template>
