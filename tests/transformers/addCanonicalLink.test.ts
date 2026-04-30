import { describe, it, expect, vi } from 'vitest'
import { addCanonicalLink, type AddCanonicalLinkContext } from '../../src/transformers/addCanonicalLink.ts'

vi.mock('../../src/utils/shared/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/shared/index.ts')>()
  return {
    ...actual,
    generatePageUrlPath: vi.fn((path: string) => path.replace(/\.md$/, '').replace(/\/index$/, '')),
  }
})

describe('addCanonicalLink', () => {
  function createContext(overrides: Partial<AddCanonicalLinkContext> = {}): AddCanonicalLinkContext {
    return {
      page: overrides.page ?? 'en/post/hello.md',
      head: [],
      pageData: overrides.pageData ?? { frontmatter: {} },
      siteConfig: overrides.siteConfig ?? { userConfig: { siteUrl: 'https://example.com' } },
      ...overrides,
    } as AddCanonicalLinkContext
  }

  it('does nothing if page has no slash', () => {
    const ctx = createContext({ page: 'hello' })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing if page is empty', () => {
    const ctx = createContext({ page: '' })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('does nothing without canonical frontmatter', () => {
    const ctx = createContext()
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('adds self-canonical link', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'self' } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }]])
  })

  it('supports the short self alias', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 's' } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }]])
  })

  it('warns and skips if siteUrl is missing for self-canonical', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'self' } },
      siteConfig: { userConfig: {} },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('siteUrl not configured'))
    warnSpy.mockRestore()
  })

  it('adds explicit canonical URL', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'https://other.com/page' } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([['link', { rel: 'canonical', href: 'https://other.com/page' }]])
  })

  it('normalizes self-canonical when siteUrl has a trailing slash', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: 'self' } },
      siteConfig: { userConfig: { siteUrl: 'https://example.com/' } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([['link', { rel: 'canonical', href: 'https://example.com/en/post/hello' }]])
  })

  it('warns and skips invalid explicit URL', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'not-a-url' } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid canonical URL'))
    warnSpy.mockRestore()
  })

  it('skips non-string canonical values', () => {
    const ctx = createContext({
      pageData: { frontmatter: { canonical: true } },
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('handles null pageData gracefully', () => {
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: null as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
  })

  it('catches errors inside try block gracefully', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ctx = createContext({
      page: 'en/post/hello.md',
      pageData: { frontmatter: { canonical: 'self' } },
      siteConfig: null as any,
    })
    addCanonicalLink(ctx)
    expect(ctx.head).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
