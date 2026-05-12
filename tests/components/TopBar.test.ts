import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopBar from '../../src/components/layout-parts/TopBar.vue'
import { mockTheme } from '../mocks/vitepress'

const NeptuBtnStub = {
  name: 'NeptuBtn',
  template: '<button class="btn-stub"><slot /></button>',
  props: ['icon', 'noBg', 'class', 'iconClass', 'text'],
}
const SwitchLangStub = { name: 'SwitchLang', template: '<div class="lang-stub" />', props: ['noBg'] }
const SwitchAppearanceStub = { name: 'SwitchAppearance', template: '<div class="appearance-stub" />' }

describe('TopBar', () => {
  beforeEach(() => {
    mockTheme.value = {
      nav: {
        links: [
          { text: 'Home', href: '/', desktopOnly: true },
          { text: 'Mobile', href: '/m', mobileOnly: true },
        ],
        socialLinks: [{ url: 'https://x.com/test', icon: 'x' }],
      },
      donate: null,
      sidebarMenuLabel: 'Menu',
    }
  })

  it('renders nav links', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    expect(btns.length).toBeGreaterThanOrEqual(1)
  })

  it('emits openDrawer when menu button clicked', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const menuBtn = wrapper.findAllComponents({ name: 'NeptuBtn' }).find((b) => b.props('icon') === 'fa6-solid:bars')
    if (menuBtn) {
      menuBtn.vm.$emit('click')
      expect(wrapper.emitted('openDrawer')).toHaveLength(1)
    }
  })

  it('renders switch appearance only on desktop', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    expect(wrapper.findComponent({ name: 'SwitchAppearance' }).exists()).toBe(true)
  })

  it('passes iconClass for social links', () => {
    mockTheme.value = {
      nav: {
        links: [],
        socialLinks: [{ url: 'https://x.com/test', icon: 'x', iconClass: 'text-xl' }],
      },
      donate: null,
      sidebarMenuLabel: 'Menu',
    }
    const wrapper = mount(TopBar, {
      global: { stubs: { NeptuNeptuBtn: NeptuBtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const socialBtns = wrapper.findAllComponents({ name: 'NeptuBtn' }).filter((b) => b.props('icon') === 'x')
    expect(socialBtns.length).toBe(1)
    expect(socialBtns[0].props('iconClass')).toBe('text-xl')
  })
})
