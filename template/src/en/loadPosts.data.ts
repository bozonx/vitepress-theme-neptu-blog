import { POSTS_DIR } from 'vitepress-theme-neptu-blog/constants'
import { loadPostsDataFromFiles } from 'vitepress-theme-neptu-blog/list-helpers/node'

import { postList } from '../.vitepress/config.js'

export default {
  watch: [`./${POSTS_DIR}/*.md`],
  async load(watchedFiles: string[]) {
    return {
      posts: await loadPostsDataFromFiles(watchedFiles, {
        popularPostsEnabled: false,
        ignoreCache: process.env.NODE_ENV !== 'production',
        maxPreviewLength: postList?.maxPreviewLength,
      }),
    }
  },
}
