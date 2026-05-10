import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  parseLocaleSite,
  parseSharedSite,
  LOCALE_SITE_FILE,
  SHARED_SITE_FILE,
} from '../../../src/utils/node/i18n.ts'

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

import fs from 'node:fs'

describe('parseLocaleSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns empty object when file does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    expect(parseLocaleSite('/src', { localeIndex: 'en' })).toEqual({})
  })

  it('returns empty object on parse error', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('bad: [')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(parseLocaleSite('/src', { localeIndex: 'en' })).toEqual({})
    warnSpy.mockRestore()
  })

  it('returns empty object when yaml is empty', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('')
    expect(parseLocaleSite('/src', { localeIndex: 'en' })).toEqual({})
  })

  it('applies template substitution to string values', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('greeting: Hello ${name}!\n')

    const result = parseLocaleSite('/src', { localeIndex: 'en', name: 'World' }) as any
    expect(result.greeting).toBe('Hello World!')
  })

  it('recursively processes nested objects', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('nested:\n  title: ${title}\n')

    const result = parseLocaleSite('/src', { localeIndex: 'en', title: 'Post' }) as any
    expect(result.nested.title).toBe('Post')
  })

  it('recursively processes arrays', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('items:\n  - ${first}\n  - ${second}\n')

    const result = parseLocaleSite('/src', { localeIndex: 'en', first: 'A', second: 'B' }) as any
    expect(result.items).toEqual(['A', 'B'])
  })

  it('passes through non-string values', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('count: 42\n')

    const result = parseLocaleSite('/src', { localeIndex: 'en' }) as any
    expect(result.count).toBe(42)
  })

  it('reads <srcDir>/<localeIndex>/_site.yaml', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    parseLocaleSite('/my-src', { localeIndex: 'ru' })
    expect(fs.existsSync).toHaveBeenCalledWith(
      expect.stringContaining(`/my-src/ru/${LOCALE_SITE_FILE}`)
    )
  })
})

describe('parseSharedSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns empty object when file does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    expect(parseSharedSite('/src', {})).toEqual({})
  })

  it('parses yaml with template substitution', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      'themeConfig:\n  publisher:\n    name: ${name}\n'
    )

    const result = parseSharedSite('/src', { name: 'Acme' }) as any
    expect(result.themeConfig.publisher.name).toBe('Acme')
  })

  it('reads <srcDir>/site.yaml', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    parseSharedSite('/my-src', {})
    expect(fs.existsSync).toHaveBeenCalledWith(
      expect.stringContaining(`/my-src/${SHARED_SITE_FILE}`)
    )
  })
})
