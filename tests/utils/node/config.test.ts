import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../src/utils/node/i18n.ts', () => ({
  parseLocaleSite: vi.fn(() => ({
    lang: 'en-US',
    title: 'Example',
    description: 'Example description',
    t: { customKey: 'Custom value' },
  })),
}))

vi.mock('../../../src/utils/node/image.ts', () => ({
  getImageDimensions: vi.fn(() => null),
}))

vi.mock('../../../src/utils/node/markdown.ts', () => ({
  mdToHtml: vi.fn((value: string) => value),
}))

import { loadBlogLocale } from '../../../src/utils/node/config.ts'

describe('loadBlogLocale', () => {
  it('falls back from locale variant to base built-in interface locale', async () => {
    const result = await loadBlogLocale('en-US', {
      srcDir: '/src',
      repo: 'https://github.com/example/repo',
      themeConfig: {},
    })

    expect(result.lang).toBe('en-US')
    expect(result.label).toBe('English')
    expect(result.themeConfig.t.customKey).toBe('Custom value')
    expect(result.themeConfig.t.toBlog).toBeDefined()
  })
})
