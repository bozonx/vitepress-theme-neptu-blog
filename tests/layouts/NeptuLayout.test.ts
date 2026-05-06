import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuLayout from '../../src/layouts/NeptuLayout.vue'
import { mockFrontmatter, mockPage } from '../mocks/vitepress'

const CustomLayoutStub = {
  name: 'CustomLayout',
  template: '<div class="custom-layout-stub">Custom Layout</div>',
}

describe('NeptuLayout', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockPage.value = { isNotFound: false, title: 'Hello' }
  })

  it('renders custom layout when frontmatter.layout matches a globally registered component', () => {
    mockFrontmatter.value = { layout: 'CustomLayout' }
    const wrapper = mount(NeptuLayout, {
      global: {
        components: { CustomLayout: CustomLayoutStub },
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.find('.custom-layout-stub').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DefaultLayout' }).exists()).toBe(false)
  })

  it('falls back to DefaultLayout for builtin layouts like post', () => {
    mockFrontmatter.value = { layout: 'post' }
    const wrapper = mount(NeptuLayout, {
      global: {
        components: { CustomLayout: CustomLayoutStub },
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'DefaultLayout' }).exists()).toBe(true)
    expect(wrapper.find('.custom-layout-stub').exists()).toBe(false)
  })

  it('renders BlogHome for layout: home', () => {
    mockFrontmatter.value = { layout: 'home' }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'BlogHome' }).exists()).toBe(true)
  })

  it('renders raw Content for layout: false', () => {
    mockFrontmatter.value = { layout: false }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'Content' }).exists()).toBe(true)
  })

  it('renders NotFound for 404 pages', () => {
    mockPage.value = { isNotFound: true, title: 'Not Found' }
    const wrapper = mount(NeptuLayout, {
      global: {
        stubs: {
          DefaultLayout: true,
          BlogHome: true,
          NotFound: true,
          Content: true,
          ImageLightbox: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'NotFound' }).exists()).toBe(true)
  })
})
