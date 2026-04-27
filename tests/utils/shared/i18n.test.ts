import { describe, it, expect } from 'vitest'
import { resolveTranslationsByFilePath } from '../../../src/utils/shared/i18n.ts'

describe('resolveTranslationsByFilePath', () => {
  it('returns en for undefined path', () => {
    const result = resolveTranslationsByFilePath(undefined)
    expect(result).toBeDefined()
    expect(result.t).toBeDefined()
  })

  it('returns en for empty string', () => {
    const result = resolveTranslationsByFilePath('')
    expect(result).toBeDefined()
  })

  it('returns en for unknown locale', () => {
    const result = resolveTranslationsByFilePath('unknown/page.md')
    expect(result).toBeDefined()
  })

  it('returns specific locale when first segment matches', () => {
    const ru = resolveTranslationsByFilePath('ru/page.md')
    expect(ru).toBeDefined()
    expect(ru.t).toBeDefined()
  })

  it('handles nested paths', () => {
    const result = resolveTranslationsByFilePath('en/post/hello.md')
    expect(result).toBeDefined()
  })
})
