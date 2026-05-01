import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuItem from '../../src/components/MenuItem.vue'

describe('MenuItem', () => {
  it('passes attributes and slots to Btn', () => {
    const wrapper = mount(MenuItem, {
      attrs: { href: '/test' },
      slots: { default: 'Item text' },
    })
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('href')).toBe('/test')
    expect(btn.text()).toBe('Item text')
  })

  it('applies menu-item classes to Btn', () => {
    const wrapper = mount(MenuItem)
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    const classes = btn.props('customClass')
    expect(classes).toEqual(
      expect.arrayContaining([expect.stringContaining('menu-item')])
    )
  })

  it('sets noBg and iconClass on Btn', () => {
    const wrapper = mount(MenuItem)
    const btn = wrapper.findComponent({ name: 'NeptuBtn' })
    expect(btn.props('noBg')).toBe(true)
    expect(btn.props('iconClass')).toBe('muted')
  })
})
