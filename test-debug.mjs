import { addCanonicalLink } from './src/transformers/addCanonicalLink.ts'

const head = []
addCanonicalLink({
  page: 'en/post/hello.md',
  head,
  pageData: {
    filePath: 'en/post/hello.md',
    frontmatter: { canonical: 'self' }
  },
  siteConfig: {
    userConfig: { siteUrl: 'https://example.com', themeConfig: { autoCanonical: true } },
    site: { locales: {} }
  }
})

console.log('HEAD:', JSON.stringify(head, null, 2))
