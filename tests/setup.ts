import { vi } from 'vitest'
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
