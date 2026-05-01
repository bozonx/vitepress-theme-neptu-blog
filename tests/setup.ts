import { vi } from 'vitest'
import { mockTheme, mockLocaleIndex, mockRoute, mockPage, mockFrontmatter } from './mocks/vitepress'

vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: mockTheme,
    localeIndex: mockLocaleIndex,
    page: mockPage,
    frontmatter: mockFrontmatter,
    lang: 'en',
  }),
  useRoute: () => mockRoute.value,
}))
