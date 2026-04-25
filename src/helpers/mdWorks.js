import grayMatter from 'gray-matter'
import rehypeExternalLinks from 'rehype-external-links'
import html from 'rehype-stringify'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import strip from 'strip-markdown'
import { smartTruncate, removeTitleFromMd } from './squidlet.js'

export function stripMd(mdContent) {
  if (!mdContent) return mdContent

  return remark().use(strip).processSync(mdContent).toString()
}

export function mdToHtml(mdContent) {
  if (!mdContent) return mdContent

  // Проверяем, содержит ли markdown только один абзац
  const paragraphs = mdContent
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim())

  // Обрабатываем markdown в HTML
  const processed = remark()
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: [] })
    .use(html)
    .processSync(mdContent)
    .toString()

  // Если только один абзац, убираем теги <p> и </p>
  if (paragraphs.length === 1) {
    return processed.replace(/^<p>|<\/p>$/g, '')
  }

  // Возвращаем стандартную обработку для нескольких абзацев
  return processed
}

export function parseMdFile(rawContent) {
  const { data, content } = grayMatter(rawContent)

  return { frontmatter: data, content }
}

export function extractDescriptionFromMd(rawContent, maxLength, markAtTheEnd) {
  const { content } = parseMdFile(rawContent)
  const mdContentNoHeader = removeTitleFromMd(content)
  const striped = stripMd(mdContentNoHeader)

  return smartTruncate(striped, maxLength, { respectWords: true, markAtTheEnd })
}
