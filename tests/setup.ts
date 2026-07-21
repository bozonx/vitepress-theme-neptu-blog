import { vi, afterEach } from 'vitest'
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

vi.mock('@iconify/vue', () => ({
  Icon: {
    name: 'Icon',
    props: ['icon'],
    template: '<i class="iconify-stub" :data-icon="icon" />',
  },
  addCollection: () => true,
}))

afterEach(() => {
  document.body.innerHTML = ''
})
