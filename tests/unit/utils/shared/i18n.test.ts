import { describe, it, expect } from 'vitest'
import { resolveTranslationsByFilePath } from '../../../../src/utils/shared/i18n.ts'

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

  it('falls back from locale variant to base interface locale', () => {
    const result = resolveTranslationsByFilePath('en-US/post/hello.md')
    expect(result).toBeDefined()
    expect(result.label).toBe('English')
  })

  it('resolves Spanish locales (es, es-419, es-MX, es-ES) to Spanish base locale', () => {
    const es = resolveTranslationsByFilePath('es/page.md')
    expect(es).toBeDefined()
    expect(es.label).toBe('Español')
    expect(es.t.search).toBe('Buscar')

    const es419 = resolveTranslationsByFilePath('es-419/page.md')
    expect(es419).toBeDefined()
    expect(es419.label).toBe('Español')

    const esMX = resolveTranslationsByFilePath('es-MX/page.md')
    expect(esMX).toBeDefined()
    expect(esMX.label).toBe('Español')

    const esES = resolveTranslationsByFilePath('es-ES/page.md')
    expect(esES).toBeDefined()
    expect(esES.label).toBe('Español')
  })
})

