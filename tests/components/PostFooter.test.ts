import { afterEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostFooter from '../../src/components/post/PostFooter.vue'
import { mockLocaleIndex, mockTheme } from '../mocks/vitepress'

const PostAuthorStub = { name: 'PostAuthor', template: '<div class="post-author-stub" />' }
const PostDonateLinkStub = { name: 'PostDonateLink', template: '<div class="post-donate-stub" />' }
const PostCommentsStub = { name: 'PostComments', template: '<div class="post-comments-stub" />' }
const PostSocialShareStub = { name: 'PostSocialShare', template: '<div class="post-share-stub" />' }
const PostTagsStub = { name: 'PostTags', template: '<div class="post-tags-stub" />' }
const EditLinkStub = { name: 'EditLink', template: '<div class="edit-link-stub" />' }
const PostSimilarListStub = { name: 'PostSimilarList', template: '<div class="post-similar-stub" />', props: ['localePosts'] }
const NeptuBtnLinkStub = { name: 'NeptuBtnLink', template: '<a class="btn-link-stub"><slot /></a>', props: ['href', 'text', 'icon'] }

describe('PostFooter', () => {
  afterEach(() => {
    mockLocaleIndex.value = 'en'
    mockTheme.value = { popularPosts: { enabled: false } }
  })

  it('renders child components', () => {
    const wrapper = mount(PostFooter, {
      global: {
        stubs: {
          PostAuthor: PostAuthorStub,
          PostDonateLink: PostDonateLinkStub,
          PostComments: PostCommentsStub,
          PostSocialShare: PostSocialShareStub,
          PostTags: PostTagsStub,
          EditLink: EditLinkStub,
          PostSimilarList: PostSimilarListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })
    expect(wrapper.find('.post-author-stub').exists()).toBe(true)
    expect(wrapper.find('.post-donate-stub').exists()).toBe(true)
    expect(wrapper.find('.post-comments-stub').exists()).toBe(true)
    expect(wrapper.find('.post-share-stub').exists()).toBe(true)
    expect(wrapper.find('.edit-link-stub').exists()).toBe(true)
    expect(wrapper.find('.post-tags-stub').exists()).toBe(true)
    expect(wrapper.find('.post-similar-stub').exists()).toBe(true)
  })

  it('does not render popular posts link when disabled', () => {
    mockTheme.value = { popularPosts: { enabled: false } }
    const wrapper = mount(PostFooter, {
      global: {
        stubs: {
          PostAuthor: PostAuthorStub,
          PostDonateLink: PostDonateLinkStub,
          PostComments: PostCommentsStub,
          PostSocialShare: PostSocialShareStub,
          PostTags: PostTagsStub,
          EditLink: EditLinkStub,
          PostSimilarList: PostSimilarListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })
    expect(wrapper.find('.btn-link-stub').exists()).toBe(false)
  })

  it('renders popular posts link when enabled', () => {
    mockTheme.value = { popularPosts: { enabled: true }, popularBaseUrl: '/popular', popularIcon: 'mdi:fire', t: { popularPostsCall: 'Popular posts' } }
    const wrapper = mount(PostFooter, {
      global: {
        stubs: {
          PostAuthor: PostAuthorStub,
          PostDonateLink: PostDonateLinkStub,
          PostComments: PostCommentsStub,
          PostSocialShare: PostSocialShareStub,
          PostTags: PostTagsStub,
          EditLink: EditLinkStub,
          PostSimilarList: PostSimilarListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })
    const link = wrapper.findComponent({ name: 'NeptuBtnLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('href')).toBe('/popular/1')
    expect(link.props('text')).toBe('Popular posts')
  })

  it('updates similar posts source when locale changes', async () => {
    mockLocaleIndex.value = 'en'
    const wrapper = mount(PostFooter, {
      global: {
        provide: {
          posts: {
            en: [{ url: '/en/post/a' }],
            ru: [{ url: '/ru/post/a' }],
          },
        },
        stubs: {
          PostAuthor: PostAuthorStub,
          PostDonateLink: PostDonateLinkStub,
          PostComments: PostCommentsStub,
          PostSocialShare: PostSocialShareStub,
          PostTags: PostTagsStub,
          EditLink: EditLinkStub,
          PostSimilarList: PostSimilarListStub,
          NeptuBtnLink: NeptuBtnLinkStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'PostSimilarList' }).props('localePosts')).toEqual([
      { url: '/en/post/a' },
    ])

    mockLocaleIndex.value = 'ru'
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'PostSimilarList' }).props('localePosts')).toEqual([
      { url: '/ru/post/a' },
    ])
  })
})
