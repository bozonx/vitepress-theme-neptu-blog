import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PageContent from '../../src/components/PageContent.vue'
import { mockFrontmatter, mockPage } from '../mocks/vitepress'

const PostFooterStub = { name: 'PostFooter', template: '<div class="post-footer-stub" />' }
const PostDateStub = { name: 'PostDate', template: '<div class="post-date-stub" />' }
const PostTopBarStub = { name: 'PostTopBar', template: '<div class="post-topbar-stub" />' }
const PostImageStub = { name: 'PostImage', template: '<div class="post-image-stub" />', props: ['src', 'description', 'alt', 'height', 'width'] }

describe('PageContent', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockPage.value = { title: 'Hello' }
  })

  it('renders util page layout for util frontmatter', () => {
    mockFrontmatter.value = { layout: 'util' }
    const wrapper = mount(PageContent, {
      global: { stubs: { PostFooter: PostFooterStub, PostDate: PostDateStub, PostTopBar: PostTopBarStub, PostImage: PostImageStub, Content: true } },
    })
    expect(wrapper.find('.content-page').exists()).toBe(true)
    expect(wrapper.find('.simple-page').exists()).toBe(true)
    expect(wrapper.find('.post-footer-stub').exists()).toBe(false)
  })

  it('renders simple page layout for page frontmatter', () => {
    mockFrontmatter.value = { layout: 'page' }
    const wrapper = mount(PageContent, {
      global: { stubs: { PostFooter: PostFooterStub, PostDate: PostDateStub, PostTopBar: PostTopBarStub, PostImage: PostImageStub, Content: true } },
    })
    expect(wrapper.find('.content-page').exists()).toBe(true)
    expect(wrapper.find('.simple-page').exists()).toBe(true)
  })

  it('renders article layout for post frontmatter', () => {
    mockFrontmatter.value = { layout: 'post' }
    const wrapper = mount(PageContent, {
      global: { stubs: { PostFooter: PostFooterStub, PostDate: PostDateStub, PostTopBar: PostTopBarStub, PostImage: PostImageStub, Content: true } },
    })
    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Hello')
    expect(wrapper.find('.post-footer-stub').exists()).toBe(true)
    expect(wrapper.find('.post-topbar-stub').exists()).toBe(true)
    expect(wrapper.find('.post-date-stub').exists()).toBe(true)
  })

  it('renders preview text when available and no cover', () => {
    mockFrontmatter.value = { layout: 'post', previewText: 'Some preview text' }
    const wrapper = mount(PageContent, {
      global: { stubs: { PostFooter: PostFooterStub, PostDate: PostDateStub, PostTopBar: PostTopBarStub, PostImage: PostImageStub, Content: true } },
    })
    expect(wrapper.find('.italic').text()).toContain('Some preview text')
  })

  it('hides preview text when cover is present', () => {
    mockFrontmatter.value = { layout: 'post', preview: 'Some preview text', cover: '/img.jpg' }
    const wrapper = mount(PageContent, {
      global: { stubs: { PostFooter: PostFooterStub, PostDate: PostDateStub, PostTopBar: PostTopBarStub, PostImage: PostImageStub, Content: true } },
    })
    expect(wrapper.find('.italic').exists()).toBe(false)
  })
})
