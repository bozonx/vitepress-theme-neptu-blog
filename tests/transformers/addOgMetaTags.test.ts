import { describe, it, expect, vi } from 'vitest'
import { addOgMetaTags, type AddOgMetaTagsContext } from '../../src/transformers/addOgMetaTags.ts'

vi.mock('../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    generatePageUrlPath: vi.fn((path: string) => path.replace(/\.md$/, '').replace(/\/index$/, '')),
  }
})

describe('addOgMetaTags', () => {
  function createContext(overrides: Partial<AddOgMetaTagsContext> = {}): AddOgMetaTagsContext {
    return {
      head: [],
      pageData: {
        filePath: 'en/post/hello.md',
        relativePath: 'en/post/hello.md',
        frontmatter: {
          title: 'Hello',
          description: 'World',
          cover: '/img/cover.png',
          date: '2023-01-01',
          tags: ['foo', 'bar'],
          authorId: 'alice',
          layout: 'post',
        },
      } as any,
      siteConfig: {
        userConfig: {
          siteUrl: 'https://example.com',
          themeConfig: {
            mainHeroImg: '/img/hero.png',
            authors: [{ id: 'alice', name: 'Alice Author' }],
          },
        },
        site: {
          locales: {
            en: {
              title: 'My Blog',
              description: 'Blog description',
              lang: 'en-US',
              themeConfig: {
                mainHeroImg: '/img/hero.png',
                authors: [{ id: 'alice', name: 'Alice Author' }],
              },
            },
          },
        },
      } as any,
      ...overrides,
    }
  }

  it('does nothing without siteUrl', () => {
    const ctx = createContext({ siteConfig: { userConfig: {}, site: { locales: {} } } as any })
    addOgMetaTags(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing without matching locale config', () => {
    const ctx = createContext({ pageData: { filePath: 'de/post/hello.md', relativePath: 'de/post/hello.md', frontmatter: {} } as any })
    addOgMetaTags(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds basic Open Graph tags', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:site_name', content: 'My Blog' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'og:type', content: 'article' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'og:title', content: 'Hello' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'og:description', content: 'World' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'og:url', content: 'https://example.com/en/post/hello' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'og:locale', content: 'en-US' }])
  })

  it('adds Twitter card tags', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    expect(ctx.head).toContainEqual(['meta', { name: 'twitter:title', content: 'Hello' }])
    expect(ctx.head).toContainEqual(['meta', { name: 'twitter:description', content: 'World' }])
  })

  it('uses cover image when available', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:image', content: 'https://example.com/img/cover.png' }])
    expect(ctx.head).toContainEqual(['meta', { name: 'twitter:image', content: 'https://example.com/img/cover.png' }])
  })

  it('uses absolute cover URL as-is', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = 'https://cdn.example.com/cover.png'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:image', content: 'https://cdn.example.com/cover.png' }])
  })

  it('falls back to mainHeroImg when cover is absent', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = undefined
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:image', content: 'https://example.com/img/hero.png' }])
  })

  it('skips image tags when no image is available', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.cover = undefined
    ctx.siteConfig.userConfig.themeConfig.mainHeroImg = undefined
    ;(ctx.siteConfig.site.locales.en.themeConfig as any).mainHeroImg = undefined
    addOgMetaTags(ctx)
    const imageTags = ctx.head.filter((h) => h[1]?.property === 'og:image' || h[1]?.name === 'twitter:image')
    expect(imageTags).toHaveLength(0)
  })

  it('uses frontmatter title over locale title', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = 'Custom Title'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:title', content: 'Custom Title' }])
  })

  it('falls back to locale title when frontmatter title is absent', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = undefined
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:title', content: 'My Blog' }])
  })

  it('uses website type for non-post pages', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.layout = 'page'
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'og:type', content: 'website' }])
  })

  it('adds article published time for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'article:published_time', content: new Date('2023-01-01').toISOString() }])
  })

  it('adds article tags for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'article:tag', content: 'foo' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'article:tag', content: 'bar' }])
  })

  it('adds article author for posts', () => {
    const ctx = createContext()
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'article:author', content: 'Alice Author' }])
  })

  it('skips article-specific tags for non-posts', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.layout = 'page'
    addOgMetaTags(ctx)
    const articleTags = ctx.head.filter((h) => h[1]?.property?.startsWith('article:'))
    expect(articleTags).toHaveLength(0)
  })

  it('handles tag objects with name property', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.tags = [{ name: 'Tagged' }, 'plain']
    addOgMetaTags(ctx)
    expect(ctx.head).toContainEqual(['meta', { property: 'article:tag', content: 'Tagged' }])
    expect(ctx.head).toContainEqual(['meta', { property: 'article:tag', content: 'plain' }])
  })

  it('skips meta tags with falsy content', () => {
    const ctx = createContext()
    ctx.pageData.frontmatter.title = ''
    ctx.pageData.frontmatter.description = ''
    ctx.siteConfig.site.locales.en.title = ''
    addOgMetaTags(ctx)
    const titleTag = ctx.head.find((h) => h[1]?.property === 'og:title')
    expect(titleTag).toBeUndefined()
  })
})
