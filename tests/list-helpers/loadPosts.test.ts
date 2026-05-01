import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadPostsData, loadPostsDataFromFiles } from '../../src/list-helpers/loadPosts.ts'

const mockReaddir = vi.fn()

vi.mock('node:fs/promises', () => ({
  default: { readdir: (...args: any[]) => mockReaddir(...args) },
  readdir: (...args: any[]) => mockReaddir(...args),
}))

vi.mock('../../src/list-helpers/makePreviewItem.ts', () => ({
  makePreviewItem: (path: string) => ({ url: path.replace(/\\/g, '/').replace('.md', '.html') }),
}))

describe('loadPostsData', () => {
  beforeEach(() => {
    mockReaddir.mockReset()
    if (globalThis.neptuBlogCache) {
      Object.keys(globalThis.neptuBlogCache).forEach((k) => delete (globalThis.neptuBlogCache as any)[k])
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array for empty localeDir', async () => {
    expect(await loadPostsData('')).toEqual([])
  })

  it('reads md files from posts directory', async () => {
    mockReaddir.mockResolvedValue(['post1.md', 'post2.md', 'readme.txt'])
    const posts = await loadPostsData('/content/en')
    expect(posts).toHaveLength(2)
    expect(posts[0].url).toContain('post1')
    expect(posts[1].url).toContain('post2')
  })

  it('returns cached results on second call', async () => {
    mockReaddir.mockResolvedValue(['a.md'])
    const first = await loadPostsData('/content/en')
    const second = await loadPostsData('/content/en')
    expect(mockReaddir).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
  })

  it('ignores cache when ignoreCache is true', async () => {
    mockReaddir.mockResolvedValue(['a.md'])
    await loadPostsData('/content/en')
    await loadPostsData('/content/en', { ignoreCache: true })
    expect(mockReaddir).toHaveBeenCalledTimes(2)
  })

  it('throws on fs error', async () => {
    mockReaddir.mockRejectedValue(new Error('ENOENT'))
    await expect(loadPostsData('/content/en')).rejects.toThrow('Error loading posts')
  })
})

describe('loadPostsDataFromFiles', () => {
  beforeEach(() => {
    if (globalThis.neptuBlogCache) {
      Object.keys(globalThis.neptuBlogCache).forEach((k) => delete (globalThis.neptuBlogCache as any)[k])
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('filters non-md files', async () => {
    const posts = await loadPostsDataFromFiles(['a.md', 'b.txt', 'c.md'])
    expect(posts).toHaveLength(2)
  })

  it('returns empty array for empty input', async () => {
    expect(await loadPostsDataFromFiles([])).toEqual([])
  })

  it('caches by file list', async () => {
    const files = ['/a.md', '/b.md']
    const first = await loadPostsDataFromFiles(files)
    const second = await loadPostsDataFromFiles(files)
    expect(second).toEqual(first)
  })
})
