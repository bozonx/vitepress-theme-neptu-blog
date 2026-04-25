import fs from 'fs/promises'
import path from 'path'

import { POSTS_DIR } from '../constants.js'
import { mergeWithAnalytics } from './loadPostsStats.js'
import { makePreviewItem } from './makePreviewItem.js'

if (!global.neptuBlogCache) {
  global.neptuBlogCache = {}
}

/**
 * Загружает все посты из директории `<localeDir>/post`.
 *
 * @param {string} localeDir Абсолютный путь к директории локали (например,
 *   `/path/to/src/en`).
 * @param {object} [options]
 * @param {boolean} [options.popularPostsEnabled] Если true и переданы
 *   `googleAnalytics`, посты будут обогащены статистикой и отсортированы.
 * @param {object} [options.googleAnalytics] Слайс themeConfig.googleAnalytics.
 * @param {boolean} [options.ignoreCache] Если true, перечитывает посты с диска.
 * @returns {Promise<Array>} Массив обработанных постов.
 */
export async function loadPostsData(localeDir, options = {}) {
  const {
    popularPostsEnabled = false,
    googleAnalytics = null,
    ignoreCache = false,
  } = options
  const localeIndex = path.basename(localeDir)

  if (!localeIndex) return []

  const postsDir = path.join(localeDir, POSTS_DIR)
  const cacheKey = path.resolve(postsDir)

  if (global.neptuBlogCache[cacheKey]?.length > 0 && !ignoreCache) {
    return global.neptuBlogCache[cacheKey]
  }

  try {
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter((file) => file.endsWith('.md'))
    const fullPaths = mdFiles.map((file) => path.join(postsDir, file))
    const posts = fullPaths.map((filePath) => makePreviewItem(filePath))

    global.neptuBlogCache[cacheKey] = posts

    console.log(`\n...Loaded ${posts.length} posts from ${postsDir}`)

    if (popularPostsEnabled && googleAnalytics) {
      global.neptuBlogCache[cacheKey] = await mergeWithAnalytics(
        posts,
        googleAnalytics,
      )
    }

    return global.neptuBlogCache[cacheKey]
  } catch (error) {
    const errorMsg = `Error loading posts for locale ${localeIndex}: ${error.message}`
    console.error(errorMsg, error)
    throw new Error(errorMsg, { cause: error })
  }
}

export async function loadPostsDataFromFiles(files, options = {}) {
  const {
    popularPostsEnabled = false,
    googleAnalytics = null,
    ignoreCache = false,
  } = options
  const fullPaths = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.resolve(file))
    .sort()
  const cacheKey = fullPaths.join('|')

  if (!fullPaths.length) return []

  if (global.neptuBlogCache[cacheKey]?.length > 0 && !ignoreCache) {
    return global.neptuBlogCache[cacheKey]
  }

  try {
    const posts = fullPaths.map((filePath) => makePreviewItem(filePath))

    global.neptuBlogCache[cacheKey] = posts

    console.log(`\n...Loaded ${posts.length} posts from watched files`)

    if (popularPostsEnabled && googleAnalytics) {
      global.neptuBlogCache[cacheKey] = await mergeWithAnalytics(
        posts,
        googleAnalytics,
      )
    }

    return global.neptuBlogCache[cacheKey]
  } catch (error) {
    const errorMsg = `Error loading posts from watched files: ${error.message}`
    console.error(errorMsg, error)
    throw new Error(errorMsg, { cause: error })
  }
}
