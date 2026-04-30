import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useContentLangs } from '../../src/composables/useContentLangs.ts'

const { mockedUseData } = vi.hoisted(() => ({
  mockedUseData: vi.fn(),
}))

vi.mock('vitepress', () => ({
  useData: mockedUseData,
}))

describe('useContentLangs', () => {
  it('always builds locale-prefixed links even if locale.link is "/"', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English', link: '/' },
          ru: { label: 'Русский', link: '/' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/post/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref(''),
    })

    const { currentLang, localeLinks } = useContentLangs({ correspondingLink: true })

    expect(currentLang.value.link).toBe('/en/')
    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/post/hello',
        lang: undefined,
        dir: undefined,
      },
    ])
  })

  it('keeps locale root links prefixed when correspondingLink is disabled', () => {
    mockedUseData.mockReturnValue({
      site: ref({
        locales: {
          en: { label: 'English' },
          ru: { label: 'Русский' },
        },
        cleanUrls: true,
      }),
      localeIndex: ref('en'),
      page: ref({
        relativePath: 'en/post/hello.md',
      }),
      theme: ref({
        i18nRouting: true,
      }),
      hash: ref('#top'),
    })

    const { localeLinks } = useContentLangs()

    expect(localeLinks.value).toEqual([
      {
        text: 'Русский',
        link: '/ru/#top',
        lang: undefined,
        dir: undefined,
      },
    ])
  })
})
