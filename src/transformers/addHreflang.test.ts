import { describe, it, expect, vi } from 'vitest'
import { addHreflang, type AddHreflangContext } from './addHreflang.ts'

vi.mock('../utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/shared/index.ts')>()
  return {
    ...actual,
    generatePageUrlPath: vi.fn((path: string) => path.replace(/\.md$/, '').replace(/\/index$/, '')),
  }
})

describe('addHreflang', () => {
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
            root: { lang: 'en' },
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
    expect(ctx.head).toHaveLength(4) // 2 locales * 1 link + root x-default
    // Should include x-default for root
    const xDefault = ctx.head.find((h) => h[1]?.hreflang === 'x-default')
    expect(xDefault).toBeDefined()
  })

  it('constructs correct locale paths', () => {
    const ctx = createContext({ pageData: { relativePath: 'en/post/hello.md' } as any })
    addHreflang(ctx)
    const enLink = ctx.head.find((h) => h[1]?.hreflang === 'en')
    const ruLink = ctx.head.find((h) => h[1]?.hreflang === 'ru')
    expect(enLink?.[1]?.href).toBe('https://example.com/post/hello')
    expect(ruLink?.[1]?.href).toBe('https://example.com/ru/post/hello')
  })

  it('uses locale code when lang is missing', () => {
    const ctx = createContext({
      siteConfig: {
        userConfig: { siteUrl: 'https://example.com' },
        site: {
          locales: {
            root: {},
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
})
