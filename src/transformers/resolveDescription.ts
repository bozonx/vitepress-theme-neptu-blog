import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE } from '../constants.ts'
import { isPost, isPage } from '../utils/shared/index.ts'
import { extractDescriptionFromMd } from '../utils/node/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * If description = "" in frontmatter, set description from content for posts
 * and pages.
 */
export function resolveDescription(
  pageData: ExtendedPageData,
  { siteConfig }: { siteConfig: ExtendedSiteConfig }
): void {
  if (!isPost(pageData.frontmatter) && !isPage(pageData.frontmatter)) return

  const description = (pageData.frontmatter.description as string)?.trim() || ''
  if (description) return

  try {
    const rawContent = fs.readFileSync(
      path.join(siteConfig.srcDir, pageData.filePath),
      DEFAULT_ENCODE
    )

    pageData.description = extractDescriptionFromMd(
      rawContent,
      (siteConfig.userConfig as any).maxDescriptionLength
    )
  } catch (error) {
    console.warn(
      `Failed to read file for description: ${pageData.filePath}`,
      (error as Error).message
    )
  }
}
