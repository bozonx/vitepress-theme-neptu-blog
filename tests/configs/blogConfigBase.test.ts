import { describe, it, expect, vi } from 'vitest'
import {
  mergeBlogConfig,
  defineBlogConfig,
} from '../../src/configs/blogConfigBase.ts'

vi.mock('../../src/transformers/filterSitemap.ts', () => ({
  filterSitemap: vi.fn((items: any[]) => items),
}))

vi.mock('../../src/transformers/collectImageDimensions.ts', () => ({
  collectImageDimensions: vi.fn(),
}))

vi.mock('../../src/transformers/transformTitle.ts', () => ({
  transformTitle: vi.fn(),
}))

vi.mock('../../src/transformers/transformPageMeta.ts', () => ({
  transformPageMeta: vi.fn(),
}))

vi.mock('../../src/transformers/resolveDescription.ts', () => ({
  resolveDescription: vi.fn(),
}))

vi.mock('../../src/transformers/addOgMetaTags.ts', () => ({
  addOgMetaTags: vi.fn(),
}))

vi.mock('../../src/transformers/addJsonLd.ts', () => ({ addJsonLd: vi.fn() }))

vi.mock('../../src/transformers/addHreflang.ts', () => ({
  addHreflang: vi.fn(),
}))

vi.mock('../../src/transformers/addCanonicalLink.ts', () => ({
  addCanonicalLink: vi.fn(),
}))

vi.mock('../../src/transformers/addRssLinks.ts', () => ({
  addRssLinks: vi.fn(),
}))

vi.mock('../../src/transformers/generateRssFeed.ts', () => ({
  generateRssFeed: vi.fn(),
}))

describe('mergeBlogConfig', () => {
  it('returns merged config with defaults', () => {
    const result = mergeBlogConfig({})
    expect(result.themeConfig).toBeDefined()
    expect(result.themeConfig.perPage).toBe(10)
    expect(result.maxPostsInRssFeed).toBe(50)
  })

  it('does not throw when themeConfig is missing', () => {
    expect(() => mergeBlogConfig({})).not.toThrow()
  })

  it('overrides defaults with provided values', () => {
    const result = mergeBlogConfig({
      themeConfig: { perPage: 20 },
      maxPostsInRssFeed: 100,
    })
    expect(result.themeConfig.perPage).toBe(20)
    expect(result.maxPostsInRssFeed).toBe(100)
  })

  it('merges head arrays', () => {
    const result = mergeBlogConfig({
      head: [['meta', { name: 'custom', content: 'value' }]],
    })
    expect(result.head).toEqual(
      expect.arrayContaining([
        expect.arrayContaining(['meta', expect.any(Object)]),
      ])
    )
    const customMeta = result.head.find((h: any[]) => h[1]?.name === 'custom')
    expect(customMeta).toEqual(['meta', { name: 'custom', content: 'value' }])
  })

  it('merges locales', () => {
    const result = mergeBlogConfig({ locales: { de: { label: 'Deutsch' } } })
    expect(result.locales.de).toEqual({ label: 'Deutsch' })
  })

  it('preserves rssFormats array', () => {
    const result = mergeBlogConfig({ rssFormats: ['rss', 'atom'] })
    expect(result.rssFormats).toEqual(['rss', 'atom'])
  })

  it('wraps transformPageData to call internal transformers', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.transformPageData).toBe('function')
  })

  it('wraps transformHead to call meta transformers', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.transformHead).toBe('function')
  })

  it('wraps buildEnd to call generateRssFeed', () => {
    const result = mergeBlogConfig({})
    expect(typeof result.buildEnd).toBe('function')
  })

  it('includes sitemap configuration with filterSitemap', () => {
    const result = mergeBlogConfig({})
    expect(result.sitemap).toBeDefined()
    expect(typeof result.sitemap.transformItems).toBe('function')
    const items = [{ url: 'en/post/test', links: [] }]
    expect(result.sitemap.transformItems(items)).toEqual(items)
  })

  it('sitemap hostname comes from siteUrl', () => {
    const result = mergeBlogConfig({ siteUrl: 'https://blog.example.com' })
    expect(result.sitemap.hostname).toBe('https://blog.example.com')
  })

  it('deep merges themeConfig.popularPosts.dataSource', () => {
    const result = mergeBlogConfig({
      themeConfig: {
        popularPosts: { dataSource: { provider: 'ga4', propertyId: '123' } },
      },
    })
    expect(result.themeConfig.popularPosts.dataSource?.propertyId).toBe('123')
    expect(result.themeConfig.popularPosts.dataSource?.dataPeriodDays).toBe(30)
  })

  it('falls back deprecated themeConfig.googleAnalytics into popularPosts.dataSource', () => {
    const result = mergeBlogConfig({
      themeConfig: { googleAnalytics: { propertyId: '456', dataLimit: 500 } },
    })
    expect(result.themeConfig.popularPosts.dataSource?.propertyId).toBe('456')
    expect(result.themeConfig.popularPosts.dataSource?.dataLimit).toBe(500)
    expect(result.themeConfig.popularPosts.dataSource?.provider).toBe('ga4')
  })

  it('deep merges themeConfig.popularPosts', () => {
    const result = mergeBlogConfig({
      themeConfig: { popularPosts: { enabled: true } },
    })
    expect(result.themeConfig.popularPosts.enabled).toBe(true)
    expect(result.themeConfig.popularPosts.sortBy).toBe('pageviews')
  })

  it('deep merges themeConfig.postList', () => {
    const result = mergeBlogConfig({
      themeConfig: { postList: { showTags: false, maxPreviewLength: 120 } },
    })
    expect(result.themeConfig.postList?.showTags).toBe(false)
    expect(result.themeConfig.postList?.showDate).toBe(true)
    expect(result.themeConfig.postList?.showAuthor).toBe(true)
    expect(result.themeConfig.postList?.maxPreviewLength).toBe(120)
  })

  it('markdown config includes lazyLoading image', () => {
    const result = mergeBlogConfig({})
    expect(result.markdown.image.lazyLoading).toBe(true)
  })

  it('vite ssr config marks theme as noExternal', () => {
    const result = mergeBlogConfig({})
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu-blog')
  })

  it('vite merges with provided config', () => {
    const result = mergeBlogConfig({ vite: { build: { target: 'esnext' } } })
    expect(result.vite.build.target).toBe('esnext')
    expect(result.vite.ssr.noExternal).toContain('vitepress-theme-neptu-blog')
  })

  it('resolves title from config', () => {
    const result = mergeBlogConfig({ title: 'Custom Title' })
    expect(result.title).toBe('Custom Title')
  })

  it('resolves title from en locale fallback', () => {
    const result = mergeBlogConfig({ en: { title: 'EN Title' } })
    expect(result.title).toBe('EN Title')
  })

  it('calls custom transformPageData if provided', async () => {
    const customFn = vi.fn()
    const result = mergeBlogConfig({ transformPageData: customFn })
    const pageData = { frontmatter: {} }
    const ctx = { siteConfig: {} }
    await (result.transformPageData as any)(pageData, ctx)
    expect(customFn).toHaveBeenCalledWith(pageData, ctx)
  })

  it('calls custom transformHead if provided', async () => {
    const customFn = vi.fn()
    const result = mergeBlogConfig({ transformHead: customFn })
    const ctx = { head: [], pageData: {}, siteConfig: {} }
    await (result.transformHead as any)(ctx)
    expect(customFn).toHaveBeenCalledWith(ctx)
  })

  it('calls custom buildEnd if provided', async () => {
    const customFn = vi.fn()
    const result = mergeBlogConfig({ buildEnd: customFn })
    const cfg = {}
    await (result.buildEnd as any)(cfg)
    expect(customFn).toHaveBeenCalledWith(cfg)
  })
})

describe('defineBlogConfig', () => {
  it('is an alias for mergeBlogConfig', () => {
    expect(defineBlogConfig).toBe(mergeBlogConfig)
  })
})
