import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadPostsData } from 'vitepress-theme-neptu-blog/loadPosts.js'

import { popularPosts, googleAnalytics } from '../.vitepress/config.js'

const localeDir = path.dirname(fileURLToPath(import.meta.url))

export default function () {
  return loadPostsData(localeDir, {
    popularPostsEnabled: popularPosts.enabled,
    googleAnalytics,
  })
}
