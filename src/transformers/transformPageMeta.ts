import { isPost } from '../helpers/helpers.ts'
import { mdToHtml } from '../helpers/mdWorks.ts'
import { transliterate } from '../helpers/transliterate.ts'

/** Transform md in frontmatter params of post to html. And resolve preview */
export function transformPageMeta(pageData: any, _ctx: any): void {
  if (!isPost(pageData.frontmatter)) return

  pageData.frontmatter.coverDescr = mdToHtml(pageData.frontmatter.coverDescr)

  pageData.frontmatter.tags = pageData.frontmatter.tags?.map((item: string) => ({
    name: item,
    slug: transliterate(item),
  }))
}
