import fs from 'node:fs'
import path from 'node:path'

import { DEFAULT_ENCODE, PREVIEW_LENGTH } from '../constants.ts'
import { parseMdFile, extractDescriptionFromMd } from '../helpers/mdWorks.ts'
import { transliterate } from '../helpers/transliterate.ts'
import { getImageDimensions } from '../helpers/imageHelpers.ts'

export interface PreviewItem {
  url: string
  date: any
  authorId: any
  title: any
  tags: Array<{ name: string; slug: string }>
  preview: string | undefined
  thumbnail: any
  cover: any
  coverHeight: number | undefined
  coverWidth: number | undefined
}

export function makePreviewItem(filePath: string): PreviewItem {
  const baseDir = path.resolve(filePath, '../../../')
  const relativePath = path.relative(baseDir, filePath)
  const lang = relativePath.split('/')[0]

  const url = '/' + relativePath.replace(/\.md$/, '')
  const rawContent = fs.readFileSync(filePath, DEFAULT_ENCODE)
  const { frontmatter, content } = parseMdFile(rawContent)
  let preview = resolvePreview(frontmatter as any)
  // make preview from content as description
  if (!preview)
    preview = extractDescriptionFromMd(content, PREVIEW_LENGTH, false)

  const fm = frontmatter as Record<string, any>

  // Получаем размеры изображения если оно есть
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
  }
}

export function resolvePreview({
  previewText,
  descrAsPreview,
  description,
}: {
  previewText?: string
  descrAsPreview?: boolean
  description?: string
}): string | undefined {
  if (previewText) {
    return previewText
  } else if (descrAsPreview && description) {
    return description
  }
  return undefined
}
