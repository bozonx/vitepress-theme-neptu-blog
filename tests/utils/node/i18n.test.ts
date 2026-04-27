import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseLocaleSite, loadConfigYamlFile, SITE_DIR_REL_PATH } from '../../../src/utils/node/i18n.ts'

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

import fs from 'node:fs'

describe('loadConfigYamlFile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns empty object when file does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    expect(loadConfigYamlFile('/src', 'site.en.yaml')).toEqual({})
  })

  it('parses simple yaml', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('title: Hello\n')
    const result = loadConfigYamlFile('/src', 'site.en.yaml')
    expect(result).toEqual({ title: 'Hello' })
  })

  it('unwraps body wrapper', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('body: |\n  title: Wrapped\n')
    const result = loadConfigYamlFile('/src', 'site.en.yaml')
    expect(result).toEqual({ title: 'Wrapped' })
  })

  it('returns empty object on parse error', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('bad: [')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(loadConfigYamlFile('/src', 'site.en.yaml')).toEqual({})
    warnSpy.mockRestore()
  })

  it('returns empty object when yaml returns null', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue('')
    expect(loadConfigYamlFile('/src', 'site.en.yaml')).toEqual({})
  })
})

describe('parseLocaleSite', () => {
  beforeEach(() => {
    vi.resetAllMocks()
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

  it('uses correct file path with locale index', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    parseLocaleSite('/my-src', { localeIndex: 'ru' })
    expect(fs.existsSync).toHaveBeenCalledWith(
      expect.stringContaining(`${SITE_DIR_REL_PATH}/site.ru.yaml`)
    )
  })
})
