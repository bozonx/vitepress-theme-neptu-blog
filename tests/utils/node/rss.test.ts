import { describe, it, expect, vi } from 'vitest'
import {
  validatePostForRss,
  createPostGuid,
  formatTagsForRss,
  validateRssConfig,
  getFormatInfo,
  getRssFormats,
  makeAuthorForRss,
} from '../../../src/utils/node/rss.ts'

describe('validatePostForRss', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  afterEach(() => warnSpy.mockClear())
  afterAll(() => warnSpy.mockRestore())

  it('returns true for valid post', () => {
    expect(validatePostForRss({ title: 'Hello', date: '2024-01-01' }, '/hello')).toBe(true)
  })

  it('fails when title is missing', () => {
    expect(validatePostForRss({ date: '2024-01-01' }, '/hello')).toBe(false)
  })

  it('fails when date is missing', () => {
    expect(validatePostForRss({ title: 'Hello' }, '/hello')).toBe(false)
  })

  it('fails for invalid date format', () => {
    expect(validatePostForRss({ title: 'Hello', date: 'not-a-date' }, '/hello')).toBe(false)
  })

  it('fails for date too far in the future', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    expect(validatePostForRss({ title: 'Hello', date: future.toISOString() }, '/hello')).toBe(false)
  })

  it('passes for date within 1 day tolerance', () => {
    const nearFuture = new Date(Date.now() + 12 * 60 * 60 * 1000)
    expect(validatePostForRss({ title: 'Hello', date: nearFuture.toISOString() }, '/hello')).toBe(
      true
    )
  })

  it('passes for past date', () => {
    expect(validatePostForRss({ title: 'Hello', date: '2020-01-01' }, '/hello')).toBe(true)
  })

  it('handles Date object', () => {
    expect(validatePostForRss({ title: 'Hello', date: new Date('2024-06-01') }, '/hello')).toBe(true)
  })
})

describe('createPostGuid', () => {
  it('includes date when provided', () => {
    expect(createPostGuid('https://site.com', '/path', '2024-03-15')).toBe(
      'https://site.com/path#2024-03-15'
    )
  })

  it('omits date when not provided', () => {
    expect(createPostGuid('https://site.com', '/path')).toBe('https://site.com/path')
  })

  it('handles Date object input', () => {
    expect(createPostGuid('https://site.com', '/path', new Date('2024-03-15'))).toBe(
      'https://site.com/path#2024-03-15'
    )
  })

  it('ignores invalid date string', () => {
    expect(createPostGuid('https://site.com', '/path', 'invalid-date')).toBe('https://site.com/path')
  })
})

describe('formatTagsForRss', () => {
  it('formats tags into categories', () => {
    expect(formatTagsForRss(['JavaScript', 'Vue'], 'https://site.com')).toEqual([
      { name: 'JavaScript', domain: 'https://site.com/tag/javascript' },
      { name: 'Vue', domain: 'https://site.com/tag/vue' },
    ])
  })

  it('trims whitespace and replaces spaces with hyphens', () => {
    expect(formatTagsForRss(['  web dev  '], 'https://site.com')).toEqual([
      { name: 'web dev', domain: 'https://site.com/tag/web-dev' },
    ])
  })

  it('filters non-string and empty entries', () => {
    expect(formatTagsForRss(['ok', '', 123, null, '   '], 'https://site.com')).toEqual([
      { name: 'ok', domain: 'https://site.com/tag/ok' },
    ])
  })

  it('returns empty array for null', () => {
    expect(formatTagsForRss(null, 'https://site.com')).toEqual([])
  })

  it('returns empty array for non-array', () => {
    expect(formatTagsForRss('tag', 'https://site.com')).toEqual([])
  })
})

describe('validateRssConfig', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  afterEach(() => errorSpy.mockClear())
  afterAll(() => errorSpy.mockRestore())

  it('returns true for valid config', () => {
    expect(
      validateRssConfig({
        site: { locales: { en: {} } },
        userConfig: { siteUrl: 'https://site.com' },
        outDir: 'dist',
      })
    ).toBe(true)
  })

  it('fails when site.locales is missing', () => {
    expect(validateRssConfig({ userConfig: { siteUrl: 'https://site.com' }, outDir: 'dist' })).toBe(
      false
    )
  })

  it('fails when siteUrl is missing', () => {
    expect(validateRssConfig({ site: { locales: {} }, outDir: 'dist' })).toBe(false)
  })

  it('fails when outDir is missing', () => {
    expect(
      validateRssConfig({ site: { locales: {} }, userConfig: { siteUrl: 'https://site.com' } })
    ).toBe(false)
  })
})

describe('getFormatInfo', () => {
  it('returns RSS info for rss', () => {
    const info = getFormatInfo('rss')
    expect(info.mimeType).toBe('application/rss+xml')
    expect(info.extension).toBe('rss')
  })

  it('returns Atom info for atom', () => {
    const info = getFormatInfo('atom')
    expect(info.mimeType).toBe('application/atom+xml')
  })

  it('returns JSON info for json', () => {
    const info = getFormatInfo('json')
    expect(info.mimeType).toBe('application/feed+json')
  })

  it('defaults to rss for unknown format', () => {
    const info = getFormatInfo('unknown')
    expect(info.mimeType).toBe('application/rss+xml')
  })
})

describe('getRssFormats', () => {
  it('returns defaults when no config', () => {
    expect(getRssFormats({})).toEqual(['rss', 'atom', 'json'])
  })

  it('returns configured formats', () => {
    expect(getRssFormats({ userConfig: { rssFormats: ['rss', 'json'] } })).toEqual(['rss', 'json'])
  })
})

describe('makeAuthorForRss', () => {
  it('returns author info when found', () => {
    const config = {
      userConfig: {
        locales: {
          en: {
            themeConfig: {
              authors: [{ id: 'john', name: 'John' }],
            },
          },
        },
        themeConfig: { authorsBaseUrl: 'authors' },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toEqual({
      name: 'John',
      link: 'https://site.com/authors/john/1',
    })
  })

  it('returns undefined when authorId is missing', () => {
    expect(makeAuthorForRss({}, {}, 'https://site.com', 'en')).toBeUndefined()
  })

  it('returns undefined when authors array is missing', () => {
    const config = {
      userConfig: {
        locales: { en: { themeConfig: {} } },
        themeConfig: { authorsBaseUrl: 'authors' },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toBeUndefined()
  })

  it('returns undefined when author is not found', () => {
    const config = {
      userConfig: {
        locales: {
          en: {
            themeConfig: {
              authors: [{ id: 'jane', name: 'Jane' }],
            },
          },
        },
        themeConfig: { authorsBaseUrl: 'authors' },
      },
    }
    expect(makeAuthorForRss(config, { authorId: 'john' }, 'https://site.com', 'en')).toBeUndefined()
  })
})
