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
} from './blogConfigBase.js'
export {
  common as siteCommonConfig,
  mergeSiteConfig,
} from './siteConfigBase.js'
export { loadBlogLocale } from '../helpers/blogConfigHelper.js'
export { loadSiteLocale } from '../helpers/siteConfigHelper.js'
export { resolveTranslationsByFilePath } from '../helpers/resolveTranslations.js'
export { getImageDimensions } from '../helpers/imageHelpers.js'
