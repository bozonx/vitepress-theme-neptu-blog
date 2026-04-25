import { isPost } from '../utils/shared/index.ts'
import { mdToHtml } from '../utils/node/index.ts'
import { transliterate } from '../utils/shared/index.ts'
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
