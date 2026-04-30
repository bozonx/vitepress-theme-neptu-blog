import { useData, type SiteData } from 'vitepress'
import { computed } from 'vue'
import type { NeptuBlogTheme } from '../types.d.ts'

interface LocaleLink {
  text: string
  link: string
  lang?: string
  dir?: string
}

interface CurrentLang {
  label?: string
  link: string
}

interface LocaleSpecificConfig {
  label: string
  lang?: string
  dir?: string
}

function ensureStartingSlash(path: string): string {
  return /^\.\//.test(path) || /^\w+:/.test(path) || path.startsWith('/') ? path : `/${path}`
}

function normalizeLink(
  link: string,
  addPath: boolean,
  path: string,
  addHtmlExtension: boolean
): string {
  if (!addPath) return link

  const normalizedPath = path
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, addHtmlExtension ? '.html' : '')

  return link.replace(/\/$/, '') + ensureStartingSlash(normalizedPath)
}

export function useContentLangs(options: { correspondingLink?: boolean } = {}) {
  const { correspondingLink = false } = options
  const { site, localeIndex, page, theme, hash } = useData<NeptuBlogTheme.Config>()

  const currentLang = computed<CurrentLang>(() => {
    const currentLocale = site.value.locales[localeIndex.value] as LocaleSpecificConfig | undefined

    return {
      label: currentLocale?.label,
      link: `/${localeIndex.value}/`,
    }
  })

  const localeLinks = computed<LocaleLink[]>(() => {
    return Object.entries(
      site.value.locales as SiteData<NeptuBlogTheme.Config>['locales']
    ).flatMap(
      ([key, value]) => {
        if (currentLang.value.label === value.label) {
          return []
        }

        const localeBaseLink = `/${key}/`
        const relativePath = page.value.relativePath.slice(currentLang.value.link.length - 1)

        return {
          text: value.label,
          link:
            normalizeLink(
              localeBaseLink,
              theme.value.i18nRouting !== false && correspondingLink,
              relativePath,
              !site.value.cleanUrls
            ) + hash.value,
          lang: value.lang,
          dir: value.dir,
        }
      }
    )
  })

  return {
    currentLang,
    localeLinks,
  }
}
