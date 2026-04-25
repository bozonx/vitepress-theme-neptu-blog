<script setup lang="ts">
import { inject } from 'vue'
import { useData } from 'vitepress'
import PostSimilarList from './PostSimilarList.vue'
import PostAuthor from './PostAuthor.vue'
import PostComments from './PostComments.vue'
import PostDonateLink from './PostDonateLink.vue'
import PostSocialShare from './PostSocialShare.vue'
import PostTags from './PostTags.vue'
import EditLink from '../EditLink.vue'
import BtnLink from '../BtnLink.vue'

const props = defineProps(['localePosts'])
const { localeIndex, theme } = useData()
const allPosts = inject<Record<string, any[]>>('posts', {})
const localePosts = props.localePosts || allPosts[localeIndex.value] || []
</script>

<template>
  <PostAuthor class="mt-10" />

  <PostDonateLink class="mt-10" />
  <PostComments class="mt-10" />
  <PostSocialShare class="mt-10" />

  <div class="flex mt-10">
    <EditLink />
  </div>

  <PostTags class="mt-10" />
  <PostSimilarList class="mt-14" :locale-posts="localePosts" />

  <div class="mt-10">
    <BtnLink
      v-if="theme.popularPosts?.enabled"
      :href="`${theme.popularBaseUrl}/1`"
      :text="theme.t.popularPostsCall"
      :icon="theme.popularIcon"
    />
  </div>
</template>
