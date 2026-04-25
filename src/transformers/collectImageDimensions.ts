import { getImageDimensions } from '../helpers/imageHelpers.js'

export function collectImageDimensions(
  pageData: any,
  { siteConfig }: { siteConfig: any }
): void {
  if (!pageData.frontmatter.cover) return

  const imageDimensions = getImageDimensions(
    pageData.frontmatter.cover,
    siteConfig.srcDir
  )

  pageData.frontmatter.coverHeight = imageDimensions?.height
  pageData.frontmatter.coverWidth = imageDimensions?.width
}
