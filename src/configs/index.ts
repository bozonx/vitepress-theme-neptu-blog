// Public **server-only** configs barrel.
// Import from `vitepress-theme-neptu-blog/configs` only in your
// `.vitepress/config.js` and data loaders (Node side).
//
// Pulls server-only deps (gray-matter, image-size, remark, googleapis,
// feed, ...). Do not import from .vue / markdown files.

export {
  common as blogCommonConfig,
  defineBlogConfig,
  mergeBlogConfig,
} from './blogConfigBase.ts'
export {
  common as siteCommonConfig,
  mergeSiteConfig,
} from './siteConfigBase.ts'
export { loadBlogLocale } from '../helpers/blogConfigHelper.ts'
export { loadSiteLocale } from '../helpers/siteConfigHelper.ts'
export { resolveTranslationsByFilePath } from '../helpers/resolveTranslations.ts'
export { getImageDimensions } from '../helpers/imageHelpers.ts'
