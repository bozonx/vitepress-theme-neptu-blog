import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { ref } from 'vue'
import {
  mockTheme,
  mockLocaleIndex,
  mockRoute,
  mockPage,
  mockFrontmatter,
  mockIsDark,
} from './mocks/vitepress'

vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: mockTheme,
    localeIndex: mockLocaleIndex,
    page: mockPage,
    frontmatter: mockFrontmatter,
    isDark: mockIsDark,
    lang: 'en',
    title: ref('Test Post'),
  }),
  useRoute: () => mockRoute.value,
}))

afterEach(() => {
  cleanup()
})
