import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import NotFound from '../../src/components/layout-parts/NotFound.vue'
import { mockLocaleIndex, mockTheme } from '../mocks/vitepress'

describe('NotFound', () => {
  beforeEach(() => {
    mockLocaleIndex.value = 'ru'
    mockTheme.value = {
      t: {
        pageNotFound: 'Страница не найдена',
        toHome: 'На главную',
      },
    }
  })

  it('renders localized copy and locale-aware home link', () => {
    const wrapper = mount(NotFound)

    expect(wrapper.text()).toContain('Страница не найдена')
    expect(wrapper.find('a').text()).toBe('На главную')
    expect(wrapper.find('a').attributes('href')).toBe('/ru/')
  })
})
