// Vendored from vitepress/dist/client/theme-default/styles/components — keeps
// the theme insulated from VitePress internals (dist/ paths are not public API).
// Update on VitePress version bump if needed.
import './styles/vendor/custom-block.css'
import './styles/vendor/vp-code-group.css'
import './styles/vendor/vp-code.css'
import './styles/vendor/vp-doc.css'
import FileDownload from './components/docComponents/FileDownload.vue'
import AudioFile from './components/docComponents/AudioFile.vue'
import VideoYoutube from './components/docComponents/VideoYoutube.vue'
import { resolveTranslationsByFilePath } from './helpers/resolveTranslations.ts'
import './styles/vp-common.css'
import './styles/vp-icons.css'
import './styles/search-modal.css'
import './styles/blog-vars.css'
import './styles/blog-styles.css'

import type { EnhanceAppContext } from 'vitepress'
import Layout from './layouts/Layout.vue'

export default {
  Layout,
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.config.globalProperties.getLocales = () =>
      resolveTranslationsByFilePath(ctx.router.route.path)

    ctx.app.component('FileDownload', FileDownload)
    ctx.app.component('AudioFile', AudioFile)
    ctx.app.component('VideoYoutube', VideoYoutube)
  },
}
