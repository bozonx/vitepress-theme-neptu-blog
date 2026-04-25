import { Feed } from 'feed'
import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'

import { DEFAULT_ENCODE, POSTS_DIR, ROOT_LANG } from '../constants.ts'
import { extractDescriptionFromMd } from '../helpers/mdWorks.ts'
import {
  createPostGuid,
  formatTagsForRss,
  getFormatInfo,
  getRssFormats,
  makeAuthorForRss,
  validatePostForRss,
  validateRssConfig,
} from '../helpers/rssHelpers.ts'

/**
 * Generates RSS and Atom feeds for all locales.
 * pageData.description must be resolved before this transformer runs.
 */
export async function generateRssFeed(config: any): Promise<void> {
  try {
    if (!validateRssConfig(config)) {
      throw new Error('Invalid RSS configuration')
    }

    const feeds: Record<string, Feed> = {}
    const siteUrl = config.userConfig.siteUrl

    for (const localeIndex of Object.keys(config.site.locales)) {
      if (localeIndex === ROOT_LANG) continue

      const locale = config.site.locales[localeIndex]
      const localeSiteUrl = `${siteUrl}/${localeIndex}`

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

        const sortedPosts = posts
          .sort(
            (a: any, b: any) =>
              +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
          )
          .slice(0, config.userConfig.maxPostsInRssFeed)

        for (const { url, frontmatter, src } of sortedPosts as any[]) {
          try {
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
            const guid = createPostGuid(siteUrl, url, frontmatter.date)
            const categories = formatTagsForRss(frontmatter.tags, siteUrl)

            feeds[localeIndex]!.addItem({
              title: frontmatter.title,
              description,
              id: guid,
              link: `${siteUrl}${url}`,
              date: frontmatter.date && new Date(frontmatter.date),
              image: frontmatter.cover && `${siteUrl}${frontmatter.cover}`,
              author: makeAuthorForRss(
                config,
                frontmatter,
                localeSiteUrl,
                localeIndex
              ) as any,
              category: categories.length > 0 ? categories : undefined,
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

    const rssFormats = getRssFormats(config)

    for (const localeIndex of Object.keys(feeds)) {
      try {
        const feedDir = path.join(config.outDir)

        for (const format of rssFormats) {
          try {
            const formatInfo = getFormatInfo(format)
            const feedPath = path.join(
              feedDir,
              `feed-${localeIndex}.${formatInfo.extension}`
            )

            const feedContent = formatInfo.generator(feeds[localeIndex])

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
  } catch (error) {
    console.error('Error generating RSS feeds:', error)
    throw error
  }
}
