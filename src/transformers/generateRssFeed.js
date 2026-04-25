import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'
import { createContentLoader } from 'vitepress'

import { DEFAULT_ENCODE, POSTS_DIR, ROOT_LANG } from '../constants.js'
import { extractDescriptionFromMd } from '../helpers/mdWorks.js'
import {
  createPostGuid,
  formatTagsForRss,
  getFormatInfo,
  getRssFormats,
  makeAuthorForRss,
  validatePostForRss,
  validateRssConfig,
} from '../helpers/rssHelpers.js'

/**
 * Генерирует RSS и Atom feeds для всех локалей. pageData.description has to be
 * resolved before start this transformer
 *
 * @param {Object} config - Конфигурация VitePress
 * @returns {Promise<void>}
 */
export async function generateRssFeed(config) {
  try {
    // Валидируем конфигурацию
    if (!validateRssConfig(config)) {
      throw new Error('Invalid RSS configuration')
    }

    const feeds = {}
    const siteUrl = config.userConfig.siteUrl

    for (const localeIndex of Object.keys(config.site.locales)) {
      if (localeIndex === ROOT_LANG) continue

      const locale = config.site.locales[localeIndex]
      const localeSiteUrl = `${siteUrl}/${localeIndex}`

      // Создаем базовый feed
      feeds[localeIndex] = new Feed({
        language: localeIndex,
        title: locale.title,
        description: locale.description,
        copyright: locale.themeConfig.footer.copyright,
        id: localeSiteUrl,
        link: localeSiteUrl,
        favicon: `${siteUrl}/img/favicon-32x32.png`,
        image: `${siteUrl}${config.userConfig.themeConfig.sidebarLogoSrc}`,
        generator: 'VitePress Neptu Blog Theme',
        updated: new Date(),
        feedLinks: {
          rss: `${siteUrl}/feed-${localeIndex}.rss`,
          atom: `${siteUrl}/feed-${localeIndex}.atom`,
        },
      })

      try {
        const posts = await createContentLoader(
          `${localeIndex}/${POSTS_DIR}/*.md`,
          { includeSrc: true }
        ).load()

        // Сортируем посты по дате (новые сначала) и ограничиваем количество
        const sortedPosts = posts
          .sort(
            (a, b) =>
              +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
          )
          .slice(0, config.userConfig.maxPostsInRssFeed)

        for (const { url, frontmatter, src } of sortedPosts) {
          try {
            // Валидируем обязательные поля
            if (!validatePostForRss(frontmatter, url)) {
              console.warn(config, `Skipping post ${url} - validation failed`)

              continue
            }

            const description = frontmatter.description
              ? frontmatter.description
              : extractDescriptionFromMd(
                  src,
                  config.userConfig.maxDescriptionLength
                )
            // Создаем уникальный GUID для поста
            const guid = createPostGuid(siteUrl, url, frontmatter.date)
            // Подготавливаем категории из тегов
            const categories = formatTagsForRss(frontmatter.tags, siteUrl)

            // Добавляем пост в feed
            feeds[localeIndex].addItem({
              title: frontmatter.title,
              description,
              id: guid,
              link: `${siteUrl}${url}`,
              date: frontmatter.date && new Date(frontmatter.date),
              image: frontmatter.cover && `${siteUrl}${frontmatter.cover}`,
              // Добавляем автора если есть
              author: makeAuthorForRss(
                config,
                frontmatter,
                localeSiteUrl,
                localeIndex
              ),
              // Добавляем категории
              category: categories.length > 0 ? categories : undefined,
              // Добавляем дополнительные поля
              published: frontmatter.date && new Date(frontmatter.date),
            })
          } catch (postError) {
            console.error(`Error processing post ${url}:`, postError)
            continue
          }
        }
      } catch (loaderError) {
        console.error(
          `Error loading posts for locale ${localeIndex}:`,
          loaderError
        )
        continue
      }
    }

    // Получаем настройки форматов RSS из конфигурации
    const rssFormats = getRssFormats(config)

    // Генерируем файлы для каждой локали
    for (const localeIndex of Object.keys(feeds)) {
      try {
        const feedDir = path.join(config.outDir)

        // Генерируем файлы для каждого настроенного формата
        for (const format of rssFormats) {
          try {
            const formatInfo = getFormatInfo(format)
            const feedPath = path.join(
              feedDir,
              `feed-${localeIndex}.${formatInfo.extension}`
            )

            // Генерируем контент для выбранного формата
            const feedContent = formatInfo.generator(feeds[localeIndex])

            // Записываем файл
            fs.writeFileSync(feedPath, feedContent, DEFAULT_ENCODE)
            console.log(`Generated ${formatInfo.title}: ${feedPath}`)
          } catch (formatError) {
            console.error(
              `Error generating ${format} feed for locale ${localeIndex}:`,
              formatError
            )
          }
        }
      } catch (writeError) {
        console.error(
          `Error writing feeds for locale ${localeIndex}:`,
          writeError
        )
      }
    }
    // success
  } catch (error) {
    console.error('Error generating RSS feeds:', error)
    throw error
  }
}
