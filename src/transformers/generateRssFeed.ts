import { Feed } from 'feed'
import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'

import { DEFAULT_ENCODE, POSTS_DIR } from '../constants.ts'
import { extractDescriptionFromMd } from '../utils/node/index.ts'
import {
  createPostGuid,
  formatTagsForRss,
  getFeedPath,
  getFeedUrl,
  getFormatInfo,
  getRssFormats,
  makeAbsoluteUrl,
  makeAuthorForRss,
  normalizePathSegment,
  normalizeSiteUrl,
  validatePostForRss,
  validateRssConfig,
} from '../utils/node/index.ts'
import type { ExtendedSiteConfig, PostFrontmatter } from '../types.d.ts'

/**
 * Generates RSS and Atom feeds for all locales.
 * pageData.description must be resolved before this transformer runs.
 */
export async function generateRssFeed(config: ExtendedSiteConfig): Promise<void> {
  try {
    if (!validateRssConfig(config)) {
      throw new Error('Invalid RSS configuration')
    }

    const feeds: Record<string, Feed> = {}
    const siteUrl = normalizeSiteUrl(config.userConfig.siteUrl!)
    const rssFormats = getRssFormats(config)
    const generationErrors: Error[] = []

    for (const localeIndex of Object.keys(config.site.locales)) {
      const locale = config.site.locales[localeIndex]!
      const localeSiteUrl = `${siteUrl}/${localeIndex}`
      const tagsBaseUrl =
        normalizePathSegment(locale.themeConfig?.tagsBaseUrl) ||
        normalizePathSegment(config.userConfig.themeConfig?.tagsBaseUrl) ||
        'tags'
      const feedLinks = Object.fromEntries(
        rssFormats
          .filter((format) => format === 'rss' || format === 'atom')
          .map((format) => [format, getFeedUrl(siteUrl, localeIndex, format)])
      )

      feeds[localeIndex] = new Feed({
        language: localeIndex,
        title: locale.title || '',
        description: locale.description || '',
        copyright: locale.themeConfig?.footer?.copyright || '',
        id: localeSiteUrl,
        link: localeSiteUrl,
        favicon: `${siteUrl}/img/favicon-32x32.png`,
        image:
          makeAbsoluteUrl(
            siteUrl,
            locale.themeConfig?.sidebarLogoSrc ||
              config.userConfig.themeConfig?.sidebarLogoSrc ||
              locale.themeConfig?.mainHeroImg ||
              config.userConfig.themeConfig?.mainHeroImg
          ) || `${siteUrl}/img/favicon-32x32.png`,
        generator: 'VitePress Neptu Blog Theme',
        updated: new Date(),
        feedLinks,
      })

      try {
        const posts = await createContentLoader(
          `${localeIndex}/${POSTS_DIR}/*.md`,
          { includeSrc: true }
        ).load()

        const sortedPosts = posts.sort(
          (a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
        )
        const configuredMaxPosts = Number((config.userConfig as any).maxPostsInRssFeed)
        const maxPosts =
          Number.isFinite(configuredMaxPosts) && configuredMaxPosts >= 0
            ? configuredMaxPosts
            : 50
        let addedPostsCount = 0

        for (const { url, frontmatter, src } of sortedPosts) {
          if (addedPostsCount >= maxPosts) break

          const fm = frontmatter as PostFrontmatter
          try {
            if (!validatePostForRss(fm, url)) {
              console.warn(`Skipping post ${url} - validation failed`)
              continue
            }

            const description = fm.description
              ? fm.description
              : extractDescriptionFromMd(
                  src!,
                  (config.userConfig as any).maxDescriptionLength
                )
            const guid = createPostGuid(siteUrl, url, fm.date)
            const categories = formatTagsForRss(fm.tags, siteUrl, localeIndex, tagsBaseUrl)

            feeds[localeIndex]!.addItem({
              title: fm.title || '',
              description,
              id: guid,
              link: `${siteUrl}${url}`,
              date: fm.date ? new Date(fm.date) : new Date(),
              image: makeAbsoluteUrl(siteUrl, fm.cover),
              author: makeAuthorForRss(
                config,
                fm,
                localeSiteUrl,
                localeIndex
              ) as any,
              category: categories.length > 0 ? categories : undefined,
              published: fm.date ? new Date(fm.date) : new Date(),
            })
            addedPostsCount += 1
          } catch (postError) {
            console.error(`Error processing post ${url}:`, postError)
            continue
          }
        }
      } catch (loaderError) {
        delete feeds[localeIndex]
        const error = new Error(
          `Error loading posts for locale ${localeIndex}: ${(loaderError as Error).message}`,
          { cause: loaderError as Error }
        )
        generationErrors.push(error)
        console.error(error.message, loaderError)
        continue
      }
    }

    for (const localeIndex of Object.keys(feeds)) {
      try {
        const feedDir = path.join(config.outDir, localeIndex)
        fs.mkdirSync(feedDir, { recursive: true })

        for (const format of rssFormats) {
          try {
            const formatInfo = getFormatInfo(format)
            const feedPath = path.join(feedDir, path.basename(getFeedPath(localeIndex, format)))

            const feedContent = formatInfo.generator(feeds[localeIndex]!)

            fs.writeFileSync(feedPath, feedContent, DEFAULT_ENCODE)
          } catch (formatError) {
            const error = new Error(
              `Error generating ${format} feed for locale ${localeIndex}: ${(formatError as Error).message}`,
              { cause: formatError as Error }
            )
            generationErrors.push(error)
            console.error(error.message, formatError)
          }
        }
      } catch (writeError) {
        const error = new Error(
          `Error writing feeds for locale ${localeIndex}: ${(writeError as Error).message}`,
          { cause: writeError as Error }
        )
        generationErrors.push(error)
        console.error(error.message, writeError)
      }
    }

    if (generationErrors.length > 0) {
      throw new AggregateError(generationErrors, 'RSS feed generation completed with errors')
    }
  } catch (error) {
    console.error('Error generating RSS feeds:', error)
    throw error
  }
}
