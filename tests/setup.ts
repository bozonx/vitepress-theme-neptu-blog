import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { mockTheme, mockLocaleIndex, mockRoute, mockPage, mockFrontmatter, mockIsDark } from './mocks/vitepress'

vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: mockTheme,
    localeIndex: mockLocaleIndex,
    page: mockPage,
    frontmatter: mockFrontmatter,
    isDark: mockIsDark,
    lang: 'en',
  }),
  useRoute: () => mockRoute.value,
}))

afterEach(() => {
  cleanup()
})
