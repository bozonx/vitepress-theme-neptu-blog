import { describe, expect, it, vi } from 'vitest'
import {
  buildUiLocaleOptions,
  readStoredUiLocale,
  resolveUiLocaleKey,
  writeStoredUiLocale,
} from '../../../src/utils/client/uiLocale.ts'

describe('resolveUiLocaleKey', () => {
  it('prefers stored user locale when available', () => {
    expect(
      resolveUiLocaleKey({
        availableLocales: ['en', 'ru'],
        contentLocale: 'ru',
        preferredLocale: 'en',
        defaultLocale: 'ru',
      })
    ).toBe('en')
  })

  it('prefers exact content locale match', () => {
    expect(
      resolveUiLocaleKey({
        availableLocales: ['en', 'en-GB', 'ru'],
        contentLocale: 'en-GB',
      })
    ).toBe('en-GB')
  })

  it('falls back to base content locale', () => {
    expect(
      resolveUiLocaleKey({
        availableLocales: ['en', 'ru'],
        contentLocale: 'en-US',
        defaultLocale: 'ru',
      })
    ).toBe('en')
  })

  it('uses configured default when no content match exists', () => {
    expect(
      resolveUiLocaleKey({
        availableLocales: ['en', 'ru'],
        contentLocale: 'fr-FR',
        defaultLocale: 'ru',
      })
    ).toBe('ru')
  })
})

describe('ui locale storage', () => {
  it('reads stored locale', () => {
    const storage = { getItem: vi.fn(() => 'en-GB') }
    expect(readStoredUiLocale(storage, 'ui')).toBe('en-GB')
  })

  it('writes stored locale', () => {
    const storage = { setItem: vi.fn() }
    writeStoredUiLocale(storage, 'ru', 'ui')
    expect(storage.setItem).toHaveBeenCalledWith('ui', 'ru')
  })
})

describe('buildUiLocaleOptions', () => {
  it('uses custom labels first', () => {
    expect(buildUiLocaleOptions(['en-GB'], { 'en-GB': 'English (UK)' })).toEqual([
      { key: 'en-GB', label: 'English (UK)' },
    ])
  })

  it('reads labels from admin locale definitions', () => {
    expect(
      buildUiLocaleOptions(['pt-BR'], {
        'pt-BR': { label: 'Português (Brasil)' },
      })
    ).toEqual([{ key: 'pt-BR', label: 'Português (Brasil)' }])
  })
})
