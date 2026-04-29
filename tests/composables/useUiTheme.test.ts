import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, ref, computed, nextTick, type Ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useUiTheme, useUiLocaleController } from '../../src/composables/useUiTheme.ts'

const mockTheme: Ref<any> = ref({
  uiLocale: { default: 'en', storageKey: 'test-ui-locale' },
  uiLocales: {
    de: { label: 'Deutsch', t: { search: 'Suche' } },
  },
  langMenuLabel: 'Change language',
  t: {
    search: 'Search',
    popularPosts: 'Popular',
  },
})

const mockLocaleIndex = ref('en')

vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: mockTheme,
    localeIndex: mockLocaleIndex,
  }),
}))

describe('useUiTheme', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    mockTheme.value = {
      uiLocale: { default: 'en', storageKey: 'test-ui-locale' },
      uiLocales: {
        de: { label: 'Deutsch', t: { search: 'Suche' } },
      },
      langMenuLabel: 'Change language',
      t: {
        search: 'Search',
        popularPosts: 'Popular',
      },
    }
    mockLocaleIndex.value = 'en'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mountComposable() {
    const result: Record<string, any> = {}
    const TestComp = defineComponent({
      setup() {
        Object.assign(result, useUiTheme())
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('returns base theme when no active ui locale is loaded', () => {
    const { theme } = mountComposable()
    expect(theme.value.t.search).toBe('Search')
    expect(theme.value.langMenuLabel).toBe('Change language')
  })

  it('lists built-in and custom ui locales', () => {
    const { availableUiLocales } = mountComposable()
    const keys = availableUiLocales.value.map((l: any) => l.key)
    expect(keys).toContain('en')
    expect(keys).toContain('ru')
    expect(keys).toContain('de')
  })

  it('uses custom labels from uiLocales', () => {
    const { availableUiLocales } = mountComposable()
    const de = availableUiLocales.value.find((l: any) => l.key === 'de')
    expect(de?.label).toBe('Deutsch')
  })

  it('sets ui locale and persists to storage', async () => {
    const setItemSpy = vi.fn((key: string, val: string) => {
      storage[key] = val
    })
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: setItemSpy, getItem: vi.fn(() => null) },
      writable: true,
    })

    const { setUiLocale, currentUiLocaleKey } = mountComposable()
    await setUiLocale('de')

    expect(currentUiLocaleKey.value).toBe('de')
    expect(setItemSpy).toHaveBeenCalledWith('test-ui-locale', 'de')
  })

  it('applies custom ui locale translations after load', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: vi.fn(), getItem: vi.fn(() => null) },
      writable: true,
    })

    const { theme, setUiLocale } = mountComposable()
    await setUiLocale('de')
    await flushPromises()

    expect(theme.value.t.search).toBe('Suche')
  })
})

describe('useUiLocaleController', () => {
  beforeEach(() => {
    mockTheme.value = {
      uiLocale: { default: 'en', storageKey: 'test-ui-locale' },
      uiLocales: {} as Record<string, any>,
      langMenuLabel: 'Change language',
      t: { search: 'Search', popularPosts: 'Popular' },
    }
    mockLocaleIndex.value = 'en'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not throw when mounted', () => {
    const TestComp = defineComponent({
      setup() {
        useUiLocaleController()
        return () => h('div')
      },
    })
    expect(() => mount(TestComp)).not.toThrow()
  })
})
