import { mustacheTemplate } from '../helpers/squidlet.ts'

/**
 * If page.frontmatter.title is a template string, then replace it with the
 * template string.
 */
export function transformTitle(pageData: any, { siteConfig }: { siteConfig: any }): void {
  if (pageData.filePath.indexOf('/') < 0) return

  if (!pageData.frontmatter.title) return

  const localeIndex = pageData.filePath.split('/')[0]

  const options = {
    theme: siteConfig.site.locales[localeIndex].themeConfig,
    params: pageData.params || {},
  }

  pageData.frontmatter.title = mustacheTemplate(
    pageData.frontmatter.title,
    options,
    { eval: true }
  )
  pageData.title = pageData.frontmatter.title
}
