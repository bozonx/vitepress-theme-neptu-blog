/// <reference types="vite/client" />
import { DefaultTheme, PageData, SiteConfig } from 'vitepress'

export namespace NeptuBlogTheme {
  export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[K] extends Record<string, unknown>
      ? DeepPartial<T[K]>
      : T[K]
  }

  export interface UiLocaleConfig {
    default?: string
    storageKey?: string
  }

  export interface UiLocaleDefinition {
    extends?: string
    label?: string
    themeConfig?: DeepPartial<Config>
    t?: DeepPartial<I18n>
  }

  export interface Config extends DefaultTheme.Config {
    externalLinkIcon?: boolean
    mainHeroImg?: string
    perPage?: number
    sidebarTagsCount?: number
    similarPostsCount?: number
    homeBgParallaxOffset?: number
    paginationMaxItems?: number
    showAuthorInPostList?: boolean

    googleAnalytics?: GoogleAnalyticsConfig
    popularPosts?: PopularPostsConfig

    tagsBaseUrl?: string
    archiveBaseUrl?: string
    popularBaseUrl?: string
    recentBaseUrl?: string
    authorsBaseUrl?: string

    donateIcon?: string
    recentIcon?: string
    popularIcon?: string
    byDateIcon?: string
    authorsIcon?: string
    rssIcon?: string
    atomIcon?: string
    youtubeIcon?: string
    tagsIcon?: string

    authors?: Author[]
    topBar?: TopBarConfig
    sideBar?: SideBarConfig
    donate?: DonateConfig

    sidebarLogoSrc?: string
    siteTitle?: string
    sidebarMenuLabel?: string

    socialMediaShares?: string
    uiLocale?: UiLocaleConfig
    uiLocales?: Record<string, UiLocaleDefinition>

    t: I18n

    search?: (DefaultTheme.Config['search'] & { bodyMarker?: string }) | { provider: string; options?: unknown; bodyMarker?: string }

    publisher?: {
      name?: string
      url?: string
      logo?: string
    }

    footer?: {
      message?: string
      copyright?: string
      links?: NavLink[]
    }

    [key: string]: unknown
  }


  export interface I18n {
    popularPosts: string
    similarPosts: string
    shareSocialMedia: string
    currentLang: string
    tagBadgeCount: string
    tagPageHeader: string
    tags: string
    allTags: string
    paginationToStart: string
    paginationToEnd: string
    toHome: string
    toBlog: string
    author: string
    year: string
    showMorePosts: string
    listenPodcast: string
    commentCall: string
    allTagsCall: string
    popularPostsCall: string
    viewInAnotherLanguage: string
    postVideoButton: string
    allPostsOfAuthor: string
    closeMenu: string
    allPostsOfYear: string
    postsCount: string
    postsCountForms: string[]
    search: string
    searchInBlog: string

    links: {
      aboutBlog: string
      donate: string
      recent: string
      popular: string
      byDate: string
      links: string
      authors: string
      aboutUs: string
      rssFeed: string
      atomFeed: string
    }
    months: string[]
    podcasts: Record<string, string>
    audioFile: Record<string, string>
    fileDownload: Record<string, string>
    lightbox: Record<string, string>

    [key: string]: unknown
  }


  export interface GoogleAnalyticsConfig {
    propertyId?: string | null
    credentialsJson?: string | null
    dataPeriodDays?: number
    dataLimit?: number
  }

  export interface PopularPostsConfig {
    enabled?: boolean
    sortBy?: 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  }

  export interface Author {
    id: string
    name: string
    avatar?: string
    image?: string
    description?: string
    links?: SocialLink[]
    aboutUrl?: string
    imageHeight?: number
    imageWidth?: number
  }

  export interface TopBarConfig {
    links?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
  }

  export interface SideBarConfig {
    links?: NavLink[]
    recent?: boolean
    popular?: boolean
    archive?: boolean
    authors?: boolean
    tags?: boolean
    bottomLinks?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
    rssFeed?: boolean
    atomFeed?: boolean
  }

  export interface NavLink {
    text: string
    href: string
    icon?: string
    iconClass?: string
    class?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface SocialLink {
    icon: string
    link: string
    url?: string
    class?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface DonateConfig {
    url: string
    icon?: string
    postDonateCall?: string
  }

  export interface Tag {
    name: string
    slug: string
    count?: number
  }

  export interface PostFrontmatter extends Record<string, unknown> {
    layout?: 'post' | 'home' | 'page' | 'util' | 'tag' | 'archive' | 'author' | string
    title?: string
    description?: string
    date?: string | Date
    authorId?: string
    cover?: string
    coverHeight?: number
    coverWidth?: number
    coverDescr?: string
    coverAlt?: string
    tags?: Array<string | Tag>
    previewText?: string
    descrAsPreview?: boolean
    jsonLd?: string
    searchIncluded?: boolean
    podcasts?: Record<string, string>
    canonical?: string
  }


  export interface Post {
    url: string
    title?: string
    date?: string | Date
    excerpt?: string
    preview?: string
    frontmatter: PostFrontmatter
    tags?: Tag[]
    analyticsStats?: Record<string, number>
    authorId?: string
    thumbnail?: string
    cover?: string
    [key: string]: unknown
  }

  export interface LocaleDefinition {
    lang?: string
    title?: string
    description?: string
    head?: DefaultTheme.Config['head']
    themeConfig?: DeepPartial<Config>
    t?: DeepPartial<I18n>
    label?: string
    link?: string
  }

  export interface ExtendedPageData extends PageData {
    frontmatter: PostFrontmatter
    filePath: string
  }

  export interface ExtendedSiteConfig extends SiteConfig<Config> {
    userConfig: {
      themeConfig: Config
      siteUrl?: string
      maxPostsInRssFeed?: number
      rssFormats?: string[]
      maxDescriptionLength?: number
      [key: string]: unknown
    }
  }
}

export type ThemeConfig = NeptuBlogTheme.Config
export type DeepPartial<T> = NeptuBlogTheme.DeepPartial<T>
export type Post = NeptuBlogTheme.Post
export type PostFrontmatter = NeptuBlogTheme.PostFrontmatter
export type Tag = NeptuBlogTheme.Tag
export type Author = NeptuBlogTheme.Author
export type I18n = NeptuBlogTheme.I18n
export type UiLocaleConfig = NeptuBlogTheme.UiLocaleConfig
export type UiLocaleDefinition = NeptuBlogTheme.UiLocaleDefinition
export type LocaleDefinition = NeptuBlogTheme.LocaleDefinition
export type ExtendedPageData = NeptuBlogTheme.ExtendedPageData
export type ExtendedSiteConfig = NeptuBlogTheme.ExtendedSiteConfig

