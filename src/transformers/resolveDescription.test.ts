import { describe, it, expect, vi } from 'vitest'
import * as fs from 'node:fs'
import { resolveDescription } from './resolveDescription.ts'

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  const readFileSyncMock = vi.fn()
  return {
    ...actual,
    default: { ...actual, readFileSync: readFileSyncMock },
    readFileSync: readFileSyncMock,
  }
})

vi.mock('../utils/node/index.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/node/index.ts')>()
  return {
    ...actual,
    extractDescriptionFromMd: vi.fn((content: string, _maxLen: number) => content.trim()),
  }
})

describe('resolveDescription', () => {
  it('does nothing for non-post non-page frontmatter', () => {
    const pageData: Record<string, any> = {
      frontmatter: { layout: 'home' },
      description: undefined,
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any })
    expect(pageData.description).toBeUndefined()
  })

  it('skips when description is already set and non-empty', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('raw content' as any)

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: 'Existing desc' },
      description: undefined,
      filePath: 'en/post/hello.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any })
    expect(fs.readFileSync).not.toHaveBeenCalled()
    expect(pageData.description).toBeUndefined()
  })

  it('reads file and extracts description for post', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('# Title\n\nSome content here.' as any)

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/post/hello.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: { maxDescriptionLength: 200 } } as any })
    expect(fs.readFileSync).toHaveBeenCalledWith('/src/en/post/hello.md', 'utf-8')
    expect(pageData.description).toBe('# Title\n\nSome content here.')
  })

  it('handles missing description field', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('content' as any)

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'page' },
      description: undefined,
      filePath: 'en/about.md',
    }
    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: { maxDescriptionLength: 50 } } as any })
    expect(pageData.description).toBe('content')
  })

  it('catches file read errors gracefully', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('ENOENT')
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const pageData: Record<string, any> = {
      frontmatter: { layout: 'post', description: '' },
      description: undefined,
      filePath: 'en/post/missing.md',
    }

    resolveDescription(pageData as any, { siteConfig: { srcDir: '/src', userConfig: {} } as any })
    expect(pageData.description).toBeUndefined()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to read file'), 'ENOENT')
    warnSpy.mockRestore()
  })
})
