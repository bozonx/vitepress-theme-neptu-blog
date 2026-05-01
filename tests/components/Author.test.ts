import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Author from '../../src/components/NeptuAuthor.vue'

describe('Author', () => {
  it('renders author image with correct attributes', () => {
    const wrapper = mount(Author, {
      props: {
        author: {
          name: 'John Doe',
          image: '/img/john.jpg',
          imageHeight: 200,
          imageWidth: 300,
          description: '<p>Writer</p>',
          links: [],
        },
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img/john.jpg')
    expect(img.attributes('alt')).toBe('John Doe')
    expect(img.attributes('height')).toBe('200')
    expect(img.attributes('width')).toBe('300')
  })

  it('does not render image when absent', () => {
    const wrapper = mount(Author, {
      props: {
        author: {
          name: 'Jane',
          description: 'Bio text',
          links: [],
        },
      },
    })
    expect(wrapper.find('figure').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders description html', () => {
    const wrapper = mount(Author, {
      props: {
        author: {
          name: 'John',
          description: '<p>Hello world</p>',
          links: [],
        },
      },
    })
    expect(wrapper.html()).toContain('Hello world')
  })

  it('passes filtered social links to SocialMediaLinks', () => {
    const wrapper = mount(Author, {
      props: {
        author: {
          name: 'John',
          links: [
            { url: 'https://x.com/john', type: 'x', title: 'X' },
            { url: '', type: 'facebook' },
            { type: 'youtube', url: 'https://youtube.com' },
          ],
        },
      },
    })
    const social = wrapper.findComponent({ name: 'SocialMediaLinks' })
    expect(social.exists()).toBe(true)
    expect(social.props('links')).toHaveLength(2)
    expect(social.props('links')).toEqual([
      { url: 'https://x.com/john', title: 'X', type: 'x' },
      { url: 'https://youtube.com', title: undefined, type: 'youtube' },
    ])
  })

  it('does not render SocialMediaLinks when no valid links', () => {
    const wrapper = mount(Author, {
      props: {
        author: {
          links: [
            { url: '', type: 'x' },
            { type: 'facebook' },
          ],
        },
      },
    })
    expect(wrapper.findComponent({ name: 'SocialMediaLinks' }).exists()).toBe(false)
  })
})
