import fs from 'node:fs/promises'
import path from 'node:path'

import { POSTS_DIR } from '../constants.js'
import { mergeWithAnalytics, type GoogleAnalyticsConfig } from './loadPostsStats.js'
import { makePreviewItem } from './makePreviewItem.js'

declare global {
  // eslint-disable-next-line no-var
  var neptuBlogCache: Record<string, any[]> | undefined
}

if (!globalThis.neptuBlogCache) {
  globalThis.neptuBlogCache = {}
}

export interface LoadPostsOptions {
  popularPostsEnabled?: boolean
  googleAnalytics?: GoogleAnalyticsConfig | null
  ignoreCache?: boolean
}

/** Загружает все посты из директории `<localeDir>/post`. */
export async function loadPostsData(
  localeDir: string,
  options: LoadPostsOptions = {}
): Promise<any[]> {
  const {
    popularPostsEnabled = false,
    googleAnalytics = null,
    ignoreCache = false,
  } = options
  const localeIndex = path.basename(localeDir)

  if (!localeIndex) return []

  const postsDir = path.join(localeDir, POSTS_DIR)
  const cacheKey = path.resolve(postsDir)
  const cache = globalThis.neptuBlogCache!

  if (cache[cacheKey]?.length! > 0 && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter((file) => file.endsWith('.md'))
    const fullPaths = mdFiles.map((file) => path.join(postsDir, file))
    const posts = fullPaths.map((filePath) => makePreviewItem(filePath))

    cache[cacheKey] = posts

    console.log(`\n...Loaded ${posts.length} posts from ${postsDir}`)

    if (popularPostsEnabled && googleAnalytics) {
      cache[cacheKey] = await mergeWithAnalytics(posts, googleAnalytics)
    }

    return cache[cacheKey]!
  } catch (error) {
    const errorMsg = `Error loading posts for locale ${localeIndex}: ${(error as Error).message}`
    console.error(errorMsg, error)
    throw new Error(errorMsg, { cause: error as Error })
  }
}

export async function loadPostsDataFromFiles(
  files: string[],
  options: LoadPostsOptions = {}
): Promise<any[]> {
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
  const cache = globalThis.neptuBlogCache!

  if (!fullPaths.length) return []

  if (cache[cacheKey]?.length! > 0 && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    const posts = fullPaths.map((filePath) => makePreviewItem(filePath))

    cache[cacheKey] = posts

    console.log(`\n...Loaded ${posts.length} posts from watched files`)

    if (popularPostsEnabled && googleAnalytics) {
      cache[cacheKey] = await mergeWithAnalytics(posts, googleAnalytics)
    }

    return cache[cacheKey]!
  } catch (error) {
    const errorMsg = `Error loading posts from watched files: ${(error as Error).message}`
    console.error(errorMsg, error)
    throw new Error(errorMsg, { cause: error as Error })
  }
}
