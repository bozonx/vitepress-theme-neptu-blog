import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EditLink from '../../src/components/EditLink.vue'
import { mockTheme, mockPage, mockFrontmatter } from '../mocks/vitepress'

describe('EditLink', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    mockTheme.value = { editLink: { text: 'Edit', pattern: 'https://example.com/edit/:path' } }
    mockPage.value = { relativePath: 'posts/hello.md' }
    mockFrontmatter.value = {}
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders when editLink is configured and frontmatter allows it', () => {
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
  })

  it('hides when frontmatter.editLink is false', () => {
    mockFrontmatter.value = { layout: 'page', editLink: false }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('hides when page is not a post or page', () => {
    mockFrontmatter.value = { layout: 'home' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('uses string pattern for href', () => {
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com/edit/posts/hello.md')
  })

  it('uses function pattern for href', () => {
    mockTheme.value.editLink = {
      text: 'Edit',
      pattern: (page: any) => `https://git.example.com/${page.relativePath}`,
    }
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').attributes('href')).toBe('https://git.example.com/posts/hello.md')
  })

  it('hides when editLink config is missing', () => {
    mockTheme.value = {}
    mockFrontmatter.value = { layout: 'page' }
    wrapper = mount(EditLink, { attachTo: document.body })
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
