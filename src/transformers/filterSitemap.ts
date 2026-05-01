import { POSTS_DIR } from '../constants.ts'

const POSTS_DIR_REGEXP = new RegExp(`^[^/]+/(${POSTS_DIR}|page)`)

export interface SitemapItem {
  url: string
  links: Array<{ url?: string; [key: string]: any }>
  [key: string]: any
}

/** Filter sitemap items only for blog config */
export function filterSitemap(items: SitemapItem[]): SitemapItem[] {
  return items
    .filter((item) => {
      if (!item.url || !item.links) return false
      else if (item.url.startsWith('/')) return false
      else if (item.url.match(/^[^/]+\/$/)) return true
      else if (POSTS_DIR_REGEXP.test(item.url)) return true
      else return false
    })
    .map((item) => {
      if (item.url.indexOf('/') === item.url.length - 1) {
        return {
          ...item,
          links: item.links.filter((link) => link.url),
        }
      } else return item
    })
}
