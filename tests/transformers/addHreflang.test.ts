import fs from 'node:fs'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { addHreflang, type AddHreflangContext } from '../../src/transformers/addHreflang.ts'

vi.mock('../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    generatePageUrlPath: vi.fn((path: string) => path.replace(/\.md$/, '').replace(/\/index$/, '')),
  }
})

describe('addHreflang', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  function createContext(overrides: Partial<AddHreflangContext> = {}): AddHreflangContext {
    return {
      head: [],
      pageData: {
        relativePath: 'en/post/hello.md',
      } as any,
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        site: {
          locales: {
            en: { lang: 'en' },
            ru: { lang: 'ru' },
          },
        },
      } as any,
      ...overrides,
    }
  }

  it('does nothing without siteUrl', () => {
    const ctx = createContext({ siteConfig: { userConfig: {}, site: { locales: { en: {} } } } as any })
    addHreflang(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing without pageData', () => {
    const ctx = createContext({ pageData: undefined })
    addHreflang(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing with single locale', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        site: { locales: { en: {} } },
      } as any,
    })
    addHreflang(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds hreflang links for all locales', () => {
    const ctx = createContext()
    addHreflang(ctx)
    expect(ctx.head).toHaveLength(3) // 2 locales + x-default
  })

  it('constructs correct locale paths', () => {
    const ctx = createContext({ pageData: { relativePath: 'en/post/hello.md' } as any })
    addHreflang(ctx)
    const enLink = ctx.head.find((h) => h[1]?.hreflang === 'en')
    const ruLink = ctx.head.find((h) => h[1]?.hreflang === 'ru')
    const defaultLink = ctx.head.find((h) => h[1]?.hreflang === 'x-default')
    expect(enLink?.[1]?.href).toBe('https://example.com/en/post/hello')
    expect(ruLink?.[1]?.href).toBe('https://example.com/ru/post/hello')
    expect(defaultLink?.[1]?.href).toBe('https://example.com/en/post/hello')
  })

  it('uses locale code when lang is missing', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        site: {
          locales: {
            en: {},
            de: {},
          },
        },
      } as any,
      pageData: { relativePath: 'en/post/hello.md' } as any,
    })
    addHreflang(ctx)
    const deLink = ctx.head.find((h) => h[1]?.hreflang === 'de')
    expect(deLink).toBeDefined()
  })

  it('normalizes siteUrl with trailing slash', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com/' },
        site: {
          locales: {
            en: { lang: 'en' },
            ru: { lang: 'ru' },
          },
        },
      } as any,
    })
    addHreflang(ctx)
    expect(ctx.head).toContainEqual([
      'link',
      { rel: 'alternate', hreflang: 'en', href: 'https://example.com/en/post/hello' },
    ])
  })

  it('skips locales without a matching source file when srcDir is available', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) =>
      String(filePath).endsWith('/en/post/hello.md')
    )

    const ctx = createContext({
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        srcDir: '/src',
        site: {
          locales: {
            en: { lang: 'en' },
            ru: { lang: 'ru' },
          },
        },
      } as any,
    })

    addHreflang(ctx)

    expect(ctx.head).toEqual([])
  })
})
