import { ref } from 'vue'

export const mockTheme = ref<any>({
  tagsBaseUrl: 'tags',
  authorsBaseUrl: 'authors',
  perPage: 10,
  paginationMaxItems: 7,
  t: {
    paginationToStart: 'To start',
    paginationToEnd: 'To end',
    tagBadgeCount: 'Posts count',
    postsCountForms: ['post', 'posts', 'posts'],
    links: { recent: 'Recent', popular: 'Popular' },
  },
  popularPosts: { enabled: false },
  externalLinkIcon: true,
})

export const mockLocaleIndex = ref<any>('en')
export const mockRoute = ref<any>({ path: '/en/blog/1' })
export const mockPage = ref<any>({ relativePath: 'posts/hello.md', title: 'Hello' })
export const mockFrontmatter = ref<any>({})
export const mockIsDark = ref<any>(false)
