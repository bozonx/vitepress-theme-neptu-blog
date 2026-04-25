import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { POSTS_DIR } from 'vitepress-theme-neptu-blog/constants'
import { loadPostsData } from 'vitepress-theme-neptu-blog/list-helpers'

import { popularPosts, googleAnalytics } from '../.vitepress/config.js'

const localeDir = path.dirname(fileURLToPath(import.meta.url))

export default {
  watch: [`./${POSTS_DIR}/*.md`],
  async load() {
    return {
      posts: await loadPostsData(localeDir, {
        popularPostsEnabled: popularPosts.enabled,
        googleAnalytics,
        ignoreCache: process.env.NODE_ENV !== 'production',
      }),
    }
  },
}
