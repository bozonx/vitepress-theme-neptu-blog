import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NeptuPagination from './src/components/NeptuPagination.vue'
import { mockTheme, mockRoute } from './tests/mocks/vitepress'

describe('Debug', () => {
  it('debug theme', () => {
    mockTheme.value = {
      paginationMaxItems: 5,
      t: { paginationToStart: 'To start', paginationToEnd: 'To end' },
    }
    mockRoute.value = { path: '/en/blog/1' }
    const wrapper = mount(NeptuPagination, {
      props: { curPage: 5, totalPages: 10, paginationMaxItems: 5 },
    })
    console.log('theme', JSON.stringify(mockTheme.value))
    const btns = wrapper.findAllComponents({ name: 'NeptuBtn' })
    console.log('btns length', btns.length)
    btns.forEach((b, i) => console.log(i, b.props()))
  })
})
