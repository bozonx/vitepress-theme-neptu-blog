import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE, PREVIEW_LENGTH } from '../constants.ts'
import { parseMdFile, extractDescriptionFromMd } from '../utils/node/markdown.ts'
import { transliterate } from '../utils/shared/index.ts'
import { getImageDimensions } from '../utils/node/image.ts'
import type { PostFrontmatter, Tag } from '../types.d.ts'

export interface PreviewItem {
  url: string
  date: string | Date | undefined
  authorId: string | undefined
  title: string | undefined
  tags: Tag[]
  preview: string | undefined
  thumbnail: string | undefined
  cover: string | undefined
  coverHeight: number | undefined
  coverWidth: number | undefined
  frontmatter: PostFrontmatter
  [key: string]: unknown
}

export function makePreviewItem(filePath: string): PreviewItem {
  const baseDir = path.resolve(filePath, '../../../')
  const relativePath = path.relative(baseDir, filePath)
  const lang = relativePath.split('/')[0]!

  const url = '/' + relativePath.replace(/\.md$/, '')
  const rawContent = fs.readFileSync(filePath, DEFAULT_ENCODE)
  const { frontmatter, content } = parseMdFile(rawContent)
  const fm = frontmatter as PostFrontmatter
  
  let preview = resolvePreview(fm)
  // make preview from content as description
  if (!preview)
    preview = extractDescriptionFromMd(content, PREVIEW_LENGTH, false)

  // Get image dimensions if cover is provided
  let coverDimensions = null
  if (fm.cover) {
    coverDimensions = getImageDimensions(fm.cover, baseDir)
  }

  return {
    url,
    date: fm.date,
    authorId: fm.authorId,
    title: fm.title,
    tags: [...(fm.tags || [])].map((item: string) => ({
      name: item,
      slug: transliterate(item, lang),
    })),
    preview,
    thumbnail: fm.cover,
    cover: fm.cover,
    coverHeight: coverDimensions?.height,
    coverWidth: coverDimensions?.width,
    frontmatter: fm,
  }
}

export function resolvePreview({
  previewText,
  descrAsPreview,
  description,
}: PostFrontmatter): string | undefined {
  const normalizedPreviewText =
    typeof previewText === 'string' ? previewText.trim() : undefined
  const normalizedDescription =
    typeof description === 'string' ? description.trim() : undefined

  if (normalizedPreviewText !== undefined) {
    return normalizedPreviewText || undefined
  } else if (descrAsPreview && normalizedDescription) {
    return normalizedDescription
  }
  return undefined
}
