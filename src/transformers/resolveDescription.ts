import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE } from '../constants.js'
import { isPost, isPage } from '../helpers/helpers.js'
import { extractDescriptionFromMd } from '../helpers/mdWorks.js'

/**
 * If description = "" in frontmatter, set description from content for posts
 * and pages.
 */
export function resolveDescription(
  pageData: any,
  { siteConfig }: { siteConfig: any }
): void {
  if (!isPost(pageData.frontmatter) && !isPage(pageData.frontmatter)) return

  const description = pageData.frontmatter.description?.trim() || ''
  if (description) return

  try {
    const rawContent = fs.readFileSync(
      path.join(siteConfig.srcDir, pageData.filePath),
      DEFAULT_ENCODE
    )

    pageData.description = extractDescriptionFromMd(
      rawContent,
      siteConfig.userConfig.maxDescriptionLength
    )
  } catch (error) {
    console.warn(
      `Failed to read file for description: ${pageData.filePath}`,
      (error as Error).message
    )
  }
}
