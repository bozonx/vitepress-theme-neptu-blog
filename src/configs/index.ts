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
export { loadBlogLocale } from '../utils/node/index.ts'
export { loadSiteLocale } from '../utils/node/index.ts'
export { resolveTranslationsByFilePath } from '../utils/shared/index.ts'
export { getImageDimensions } from '../utils/node/index.ts'
