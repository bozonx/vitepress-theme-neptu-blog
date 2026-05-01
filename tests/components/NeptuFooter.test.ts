import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuFooter from '../../src/components/layout-parts/NeptuFooter.vue'
import { mockTheme } from '../mocks/vitepress'

describe('NeptuFooter', () => {
  beforeEach(() => {
    mockTheme.value = {}
  })

  it('renders nothing when theme.footer is absent', () => {
    const wrapper = mount(NeptuFooter)
    expect(wrapper.find('footer').exists()).toBe(false)
  })

  it('renders footer with message and copyright', () => {
    mockTheme.value = {
      footer: {
        message: 'Released under MIT.',
        copyright: 'Copyright 2024',
      },
    }
    const wrapper = mount(NeptuFooter)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Released under MIT.')
    expect(wrapper.text()).toContain('Copyright 2024')
  })

  it('renders footer links', () => {
    mockTheme.value = {
      footer: {
        message: '',
        links: [
          { text: 'Home', href: '/' },
          { text: 'About', href: '/about' },
        ],
      },
    }
    const wrapper = mount(NeptuFooter)
    const links = wrapper.findAll('li')
    expect(links.length).toBe(2)
    expect(links[0].text()).toContain('Home')
    expect(links[1].text()).toContain('About')
  })
})
