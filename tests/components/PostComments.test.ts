import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostComments from '../../src/components/post/PostComments.vue'
import { mockFrontmatter, mockTheme } from '../mocks/vitepress'

const NeptuBtnLinkStub = {
  name: 'NeptuBtnLink',
  template: '<a class="btn-link-stub"><slot /></a>',
  props: ['href', 'text', 'icon'],
}

describe('PostComments', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockTheme.value = { t: { commentCall: 'Comment' } }
  })

  it('renders nothing when no commentUrl', () => {
    mockFrontmatter.value = {}
    const wrapper = mount(PostComments, {
      global: { stubs: { NeptuBtnLink: NeptuBtnLinkStub } },
    })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('renders comment link when commentUrl is set', () => {
    mockFrontmatter.value = { commentUrl: 'https://reddit.com/r/vue/comments/xyz' }
    const wrapper = mount(PostComments, {
      global: { stubs: { NeptuBtnLink: NeptuBtnLinkStub } },
    })
    const link = wrapper.findComponent({ name: 'NeptuBtnLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('href')).toBe('https://reddit.com/r/vue/comments/xyz')
    expect(link.props('text')).toBe('Comment')
  })
})
