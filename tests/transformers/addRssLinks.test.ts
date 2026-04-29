import { describe, it, expect, vi } from 'vitest'
import { addRssLinks, type AddRssLinksContext } from '../../src/transformers/addRssLinks.ts'

vi.mock('../../src/utils/node/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/node/index.ts')>()
  return {
    ...actual,
    getRssFormats: vi.fn((_config: any) => ['rss', 'atom']),
    getFormatInfo: vi.fn((format: string) => {
      const map: Record<string, { mimeType: string; title: string }> = {
        rss: { mimeType: 'application/rss+xml', title: 'RSS Feed' },
        atom: { mimeType: 'application/atom+xml', title: 'Atom Feed' },
      }
      return map[format] || map.rss
    }),
  }
})

describe('addRssLinks', () => {
  function createContext(overrides: Partial<AddRssLinksContext> = {}): AddRssLinksContext {
    return {
      page: 'en/index.md',
      head: [],
      pageData: {
        frontmatter: { layout: 'home' },
      },
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
        },
        site: {
          locales: {
            root: { title: 'Root Blog' },
            en: { title: 'English Blog' },
            ru: { title: 'Russian Blog' },
          },
        },
      },
      ...overrides,
    } as AddRssLinksContext
  }

  it('does nothing for non-home pages', () => {
    const ctx = createContext({
      pageData: { frontmatter: { layout: 'post' } },
    })
    addRssLinks(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds RSS links for current locale formats', () => {
    const ctx = createContext()
    addRssLinks(ctx)
    expect(ctx.head).toHaveLength(3) // rss + atom for current locale + 1 alternate locale
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'English Blog - RSS Feed',
        href: 'https://example.com/feed-en.rss',
        hreflang: 'en',
      },
    ])
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'English Blog - Atom Feed',
        href: 'https://example.com/feed-en.atom',
        hreflang: 'en',
      },
    ])
  })

  it('adds alternate locale RSS links', () => {
    const ctx = createContext()
    addRssLinks(ctx)
    expect(ctx.head).toContainEqual([
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Russian Blog - RSS Feed',
        href: 'https://example.com/feed-ru.rss',
        hreflang: 'ru',
      },
    ])
  })

  it('does not add self-locale as alternate', () => {
    const ctx = createContext({ page: 'ru/index.md' })
    addRssLinks(ctx)
    const ruAlts = ctx.head.filter(
      (h) => h[1]?.hreflang === 'ru' && h[1]?.type === 'application/rss+xml'
    )
    expect(ruAlts).toHaveLength(1) // Only the main feed, not alternate
  })

  it('skips root locale in alternate feeds', () => {
    const ctx = createContext()
    addRssLinks(ctx)
    const rootAlt = ctx.head.find((h) => h[1]?.hreflang === 'root')
    expect(rootAlt).toBeUndefined()
  })
})
