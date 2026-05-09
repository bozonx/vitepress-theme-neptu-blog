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

  it('uses up to two even navigation columns for many links', () => {
    mockTheme.value = {
      footer: {
        copyright: 'Copyright 2024',
        links: [
          { text: 'Home', href: '/' },
          { text: 'About', href: '/about' },
          { text: 'Advanced JSON-LD', href: '/advanced-json-ld' },
          { text: 'RSS', href: '/rss' },
        ],
      },
    }
    const wrapper = mount(NeptuFooter)

    expect(wrapper.find('footer').classes()).toContain('flex-wrap')
    expect(wrapper.find('nav[aria-label="Footer navigation"]').exists()).toBe(true)
    expect(wrapper.find('ul').classes()).toEqual(
      expect.arrayContaining(['grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-y-3'])
    )
  })

  it('uses a single navigation column for one link', () => {
    mockTheme.value = {
      footer: {
        links: [{ text: 'Home', href: '/' }],
      },
    }
    const wrapper = mount(NeptuFooter)

    expect(wrapper.find('nav').classes()).toEqual(
      expect.arrayContaining(['min-w-0', 'ml-auto'])
    )
    expect(wrapper.find('ul').classes()).toEqual(
      expect.arrayContaining(['grid', 'grid-cols-1', 'justify-end'])
    )
  })
})
