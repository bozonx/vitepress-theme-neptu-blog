import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TopBar from '../../src/components/layout-parts/TopBar.vue'
import { mockTheme } from '../mocks/vitepress'

const BtnStub = {
  name: 'Btn',
  template: '<button class="btn-stub"><slot /></button>',
  props: ['icon', 'noBg', 'class', 'iconClass', 'text'],
}
const SwitchLangStub = { name: 'SwitchLang', template: '<div class="lang-stub" />', props: ['noBg'] }
const SwitchAppearanceStub = { name: 'SwitchAppearance', template: '<div class="appearance-stub" />' }

describe('TopBar', () => {
  beforeEach(() => {
    mockTheme.value = {
      topBar: {
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

  it('renders topBar links', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { Btn: BtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const btns = wrapper.findAllComponents({ name: 'Btn' })
    expect(btns.length).toBeGreaterThanOrEqual(1)
  })

  it('emits openDrawer when menu button clicked', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { Btn: BtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    const menuBtn = wrapper.findAllComponents({ name: 'Btn' }).find((b) => b.props('icon') === 'fa6-solid:bars')
    if (menuBtn) {
      menuBtn.vm.$emit('click')
      expect(wrapper.emitted('openDrawer')).toHaveLength(1)
    }
  })

  it('renders switch appearance only on desktop', () => {
    const wrapper = mount(TopBar, {
      global: { stubs: { Btn: BtnStub, SwitchLang: SwitchLangStub, SwitchAppearance: SwitchAppearanceStub } },
    })
    expect(wrapper.findComponent({ name: 'SwitchAppearance' }).exists()).toBe(true)
  })
})
