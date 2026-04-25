import fs from 'fs/promises'
import path from 'path'
import { makePreviewItem } from './makePreviewItem.js'
import { mergeWithAnalytics } from './loadPostsStats.js'
import { POSTS_DIR } from '../constants.js'

if (!global.blogCache) {
  global.blogCache = {}
}

/**
 * Загружает все посты из директории postsDir
 *
 * @param {string} localeDir - Путь к директории локали
 * @param {Object} config - Конфигурация блога нужна для popularPosts
 * @param {Array} watchedFiles - Список путей всех файлов постов локали, вида
 *   'src/ru/post/....md'
 * @param {boolean} ignoreCache - Если true, игнорирует кэш и перечитывает посты
 * @returns {Promise<Array>} Массив обработанных постов
 */
export async function loadPostsData(localeDir, config, ignoreCache = false) {
  const localeIndex = path.basename(localeDir)

  if (!localeIndex) return []

  // Проверяем глобальный кэш для текущей локали
  if (global.blogCache[localeIndex]?.length > 0 && !ignoreCache) {
    return global.blogCache[localeIndex]
  }

  try {
    const postsDir = path.join(localeDir, POSTS_DIR)
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter((file) => file.endsWith('.md'))
    const fullPaths = mdFiles.map((file) => path.join(postsDir, file))
    const posts = fullPaths.map((filePath) => makePreviewItem(filePath))
    // Сохраняем в глобальный кэш для текущей локали
    global.blogCache[localeIndex] = posts

    console.log(`\n...Loaded ${posts.length} posts from ${postsDir}`)

    if (config?.site?.themeConfig?.popularPosts?.enabled) {
      global.blogCache[localeIndex] = await mergeWithAnalytics(posts, config)
    }

    return global.blogCache[localeIndex]
  } catch (error) {
    const errorMsg = `Error loading posts for locale ${localeIndex}: ${error.message}`
    console.error(errorMsg, error)
    throw new Error(errorMsg, { cause: error })
  }
}
