import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useBreakpoint } from '../../src/composables/useBreakpoint.ts'

vi.mock('vitepress', () => ({ inBrowser: true }))

describe('useBreakpoint', () => {
  const originalInnerWidth = window.innerWidth

  beforeEach(() => {
    window.innerWidth = 1024
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    vi.restoreAllMocks()
  })

  function mountComposable(breakpoint?: number) {
    const result = { windowWidth: ref(0), isMobile: ref(true) }
    const TestComp = defineComponent({
      setup() {
        const composable = breakpoint !== undefined ? useBreakpoint(breakpoint) : useBreakpoint()
        result.windowWidth = composable.windowWidth
        result.isMobile = composable.isMobile
        return () => h('div')
      },
    })
    mount(TestComp)
    return result
  }

  it('defaults to MOBILE_BREAKPOINT (1024)', () => {
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('is mobile when width < breakpoint', () => {
    window.innerWidth = 500
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(true)
  })

  it('is not mobile when width === breakpoint', () => {
    window.innerWidth = 1024
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('is not mobile when width > breakpoint', () => {
    window.innerWidth = 1200
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)
  })

  it('accepts custom breakpoint', () => {
    window.innerWidth = 800
    const { isMobile } = mountComposable(900)
    expect(isMobile.value).toBe(true)

    window.innerWidth = 1000
    window.dispatchEvent(new Event('resize'))
    expect(isMobile.value).toBe(false)
  })

  it('updates on window resize', async () => {
    const { isMobile } = mountComposable()
    expect(isMobile.value).toBe(false)

    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))

    expect(isMobile.value).toBe(true)
  })

  it('removes listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const TestComp = defineComponent({
      setup() {
        useBreakpoint()
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
