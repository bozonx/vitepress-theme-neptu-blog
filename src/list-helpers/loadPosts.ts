import fs from 'node:fs/promises'
import path from 'node:path'

import { POSTS_DIR } from '../constants.ts'
import {
  mergeWithAnalytics,
  type AnalyticsDataSource,
} from './loadPostsStats.ts'
import { makePreviewItem } from './makePreviewItem.ts'
import type { Post } from '../types.d.ts'

declare global {
  var neptuBlogCache: Record<string, Post[]> | undefined
}

function getDefaultCache(): Record<string, Post[]> {
  if (!globalThis.neptuBlogCache) {
    globalThis.neptuBlogCache = {}
  }
  return globalThis.neptuBlogCache
}

export interface LoadPostsOptions {
  popularPostsEnabled?: boolean
  dataSource?: AnalyticsDataSource | null
  /** @deprecated Use `dataSource` instead. */
  googleAnalytics?: AnalyticsDataSource | null
  ignoreCache?: boolean
  /** Cache store for dependency injection. Falls back to the global singleton. */
  cache?: Record<string, Post[]>
}

/** Loads all posts from the `<localeDir>/post` directory. */
export async function loadPostsData(
  localeDir: string,
  options: LoadPostsOptions = {}
): Promise<Post[]> {
  const {
    popularPostsEnabled = false,
    dataSource: dataSourceOpt = null,
    googleAnalytics = null,
    ignoreCache = false,
    cache: cacheOpt,
  } = options

  const dataSource = dataSourceOpt ?? googleAnalytics
  const localeIndex = path.basename(localeDir)

  if (!localeIndex) return []

  const postsDir = path.join(localeDir, POSTS_DIR)
  const cacheKey = path.resolve(postsDir)
  const cache = cacheOpt ?? getDefaultCache()

  if (cache[cacheKey] && cache[cacheKey].length > 0 && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter((file) => file.endsWith('.md'))
    const fullPaths = mdFiles.map((file) => path.join(postsDir, file))
    const posts = fullPaths.map((filePath) =>
      makePreviewItem(filePath)
    ) as Post[]

    cache[cacheKey] = posts

    if (popularPostsEnabled && dataSource) {
      cache[cacheKey] = await mergeWithAnalytics(posts, dataSource)
    }

    return cache[cacheKey]!
  } catch (error) {
    throw new Error(
      `Error loading posts for locale ${localeIndex}: ${(error as Error).message}`,
      { cause: error }
    )
  }
}

export async function loadPostsDataFromFiles(
  files: string[],
  options: LoadPostsOptions = {}
): Promise<Post[]> {
  const {
    popularPostsEnabled = false,
    dataSource: dataSourceOpt = null,
    googleAnalytics = null,
    ignoreCache = false,
    cache: cacheOpt,
  } = options
  const dataSource = dataSourceOpt ?? googleAnalytics
  const fullPaths = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.resolve(file))
    .sort()
  const cacheKey = fullPaths.join('|')
  const cache = cacheOpt ?? getDefaultCache()

  if (!fullPaths.length) return []

  if (cache[cacheKey] && cache[cacheKey].length > 0 && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    const posts = fullPaths.map((filePath) =>
      makePreviewItem(filePath)
    ) as Post[]

    cache[cacheKey] = posts

    if (popularPostsEnabled && dataSource) {
      cache[cacheKey] = await mergeWithAnalytics(posts, dataSource)
    }

    return cache[cacheKey]!
  } catch (error) {
    throw new Error(
      `Error loading posts from watched files: ${(error as Error).message}`,
      { cause: error }
    )
  }
}
