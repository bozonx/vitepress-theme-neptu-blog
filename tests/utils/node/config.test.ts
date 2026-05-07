import { describe, it, expect, vi } from 'vitest'
import { parseLocaleSite } from '../../../src/utils/node/i18n.ts'

vi.mock('../../../src/utils/node/i18n.ts', () => ({
  parseLocaleSite: vi.fn((_srcDir: string, props: any) => ({
    lang: 'en-US',
    title: 'Example',
    description: 'Example description',
    resolvedUiLabel: props.theme?.langMenuLabel,
    resolvedViewInAnotherLanguage: props.theme?.t?.viewInAnotherLanguage,
    t: { customKey: 'Custom value' },
  })),
}))

vi.mock('../../../src/utils/node/image.ts', () => ({
  getImageDimensions: vi.fn(() => null),
}))

vi.mock('../../../src/utils/node/markdown.ts', () => ({
  mdToHtml: vi.fn((value: string) => value),
}))

import { loadBlogLocale } from '../../../src/utils/node/config.ts'

describe('loadBlogLocale', () => {
  it('falls back from locale variant to base built-in interface locale', async () => {
    const result = await loadBlogLocale('en-US', {
      srcDir: '/src',
      repo: 'https://github.com/example/repo',
      themeConfig: {},
    })

    expect(result.lang).toBe('en-US')
    expect(result.label).toBe('English')
    expect((result.themeConfig!.t as any).customKey).toBe('Custom value')
    expect(result.themeConfig!.t!.toBlog).toBeDefined()
  })

  it('applies exact ui locale override for matching content locale on first render', async () => {
    const result = await loadBlogLocale('en-GB', {
      srcDir: '/src',
      repo: 'https://github.com/example/repo',
      themeConfig: {
        uiLocales: {
          'en-GB': {
            extends: 'en',
            t: { viewInAnotherLanguage: 'Read in another language' },
            themeConfig: { langMenuLabel: 'UI language' },
          },
        },
      },
    } as any)

    expect(result.themeConfig!.langMenuLabel).toBe('UI language')
    expect(result.themeConfig!.t!.viewInAnotherLanguage).toBe(
      'Read in another language'
    )
    expect((result.themeConfig as any).resolvedUiLabel).toBe('UI language')
    expect((result.themeConfig as any).resolvedViewInAnotherLanguage).toBe(
      'Read in another language'
    )
  })

  it('passes build-resolved interface translations into site parsing', async () => {
    await loadBlogLocale('en-GB', {
      srcDir: '/src',
      repo: 'https://github.com/example/repo',
      themeConfig: {
        uiLocales: {
          'en-GB': {
            extends: 'en',
            t: { viewInAnotherLanguage: 'Read in another language' },
            themeConfig: { langMenuLabel: 'UI language' },
          },
        },
      },
    } as any)

    expect(parseLocaleSite).toHaveBeenCalledWith(
      '/src',
      expect.objectContaining({
        localeIndex: 'en-GB',
        t: expect.objectContaining({
          viewInAnotherLanguage: 'Read in another language',
        }),
        theme: expect.objectContaining({
          langMenuLabel: 'UI language',
          t: expect.objectContaining({
            viewInAnotherLanguage: 'Read in another language',
          }),
        }),
      })
    )
  })
})
