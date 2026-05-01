import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToTheTop from '../../src/components/layout-parts/ToTheTop.vue'

const ToTheTopMobileStub = { name: 'ToTheTopMobile', template: '<div class="to-top-mobile" />', props: ['scrollY'] }
const ToTheTopDesktopStub = { name: 'ToTheTopDesktop', template: '<div class="to-top-desktop" />', props: ['scrollY'] }

describe('ToTheTop', () => {
  it('renders mobile variant when isMobile is true', () => {
    const wrapper = mount(ToTheTop, {
      props: { scrollY: 2000, isMobile: true },
      global: { stubs: { ToTheTopMobile: ToTheTopMobileStub, ToTheTopDesktop: ToTheTopDesktopStub } },
    })
    expect(wrapper.find('.to-top-mobile').exists()).toBe(true)
    expect(wrapper.find('.to-top-desktop').exists()).toBe(false)
  })

  it('renders desktop variant when isMobile is false', () => {
    const wrapper = mount(ToTheTop, {
      props: { scrollY: 2000, isMobile: false },
      global: { stubs: { ToTheTopMobile: ToTheTopMobileStub, ToTheTopDesktop: ToTheTopDesktopStub } },
    })
    expect(wrapper.find('.to-top-desktop').exists()).toBe(true)
    expect(wrapper.find('.to-top-mobile').exists()).toBe(false)
  })
})
