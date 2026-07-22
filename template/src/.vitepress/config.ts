import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'
import type { BlogUserConfig } from 'vitepress-theme-neptu-blog'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PER_PAGE = 10

export const postList = {
  maxPreviewLength: 300,
}

export default async () => {
  const base = process.env.VITEPRESS_BASE || '/'
  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    base,

    // Replace with your production blog URL (no trailing slash)
    siteUrl: process.env.SITE_URL || 'https://example.com',

    head: [
      ['meta', { name: 'format-detection', content: 'telephone=no' }],
      ['link', { rel: 'stylesheet', href: `${base}/pagefind/pagefind-ui.css`.replace(/\/+/g, '/') }],
      ['script', { src: `${base}/pagefind/pagefind-ui.js`.replace(/\/+/g, '/') }],
    ],

    themeConfig: {
      repo: 'https://github.com/your-username/my-blog',
      perPage: PER_PAGE,

      search: {
        provider: 'pagefind',
        options: { bodyMarker: 'data-pagefind-body' },
      },
    },
  }

  return defineBlogConfig(config)
}
