import { isPost } from '../helpers/helpers.ts'
import { mdToHtml } from '../helpers/mdWorks.ts'
import { transliterate } from '../helpers/transliterate.ts'
import type { ExtendedPageData } from '../types.d.ts'

/** Transform md in frontmatter params of post to html. And resolve preview */
export function transformPageMeta(pageData: ExtendedPageData, _ctx: any): void {
  if (!isPost(pageData.frontmatter)) return

  if (pageData.frontmatter.coverDescr) {
    pageData.frontmatter.coverDescr = mdToHtml(pageData.frontmatter.coverDescr)
  }

  pageData.frontmatter.tags = (pageData.frontmatter.tags as any)?.map((item: string | any) => {
    if (typeof item === 'string') {
      return {
        name: item,
        slug: transliterate(item),
      }
    }
    return item
  })
}
