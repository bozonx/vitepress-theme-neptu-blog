import fs from 'fs'
import path from 'path'

import { DEFAULT_ENCODE } from '../constants.js'
import { parseMdFile } from '../helpers/mdWorks.js'
import { transliterate } from '../helpers/transliterate.js'
import { getImageDimensions } from '../helpers/imageHelpers.js'
import { extractDescriptionFromMd } from '../helpers/mdWorks.js'
import { PREVIEW_LENGTH } from '../constants.js'

export function makePreviewItem(filePath) {
  const baseDir = path.resolve(filePath, '../../../')
  const relativePath = path.relative(baseDir, filePath)
  const lang = relativePath.split('/')[0]

  const url = '/' + relativePath.replace(/\.md$/, '')
  const rawContent = fs.readFileSync(filePath, DEFAULT_ENCODE)
  const { frontmatter, content } = parseMdFile(rawContent)
  let preview = resolvePreview(frontmatter, content)
  // make preview from content as description
  if (!preview)
    preview = extractDescriptionFromMd(content, PREVIEW_LENGTH, false)

  // Получаем размеры изображения если оно есть
  let coverDimensions = null
  if (frontmatter.cover) {
    coverDimensions = getImageDimensions(frontmatter.cover, baseDir)
  }

  return {
    url,
    date: frontmatter.date,
    authorId: frontmatter.authorId,
    title: frontmatter.title,
    tags: [...(frontmatter.tags || [])].map((item) => ({
      name: item,
      slug: transliterate(item, lang),
    })),
    preview,
    thumbnail: frontmatter.cover,
    cover: frontmatter.cover,
    coverHeight: coverDimensions?.height,
    coverWidth: coverDimensions?.width,
  }
}

export function resolvePreview({ previewText, descrAsPreview, description }) {
  if (previewText) {
    return previewText
  } else if (descrAsPreview && description) {
    return description
  }
}
