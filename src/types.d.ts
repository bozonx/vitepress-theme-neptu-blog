/// <reference types="vite/client" />
import { DefaultTheme } from 'vitepress'

export namespace NeptuBlogTheme {
  export interface Config extends DefaultTheme.Config {
    i18nRouting?: boolean
    externalLinkIcon?: boolean
    mainHeroImg?: string
    perPage?: number
    sidebarTagsCount?: number
    similarPostsCount?: number
    homeBgParalaxOffset?: number
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
    socialLinksIcon?: string
    rssIcon?: string
    atomIcon?: string
    youtubeIcon?: string
    telegramIcon?: string
    chatIcon?: string
    tagsIcon?: string

    authors?: Author[]
    topBar?: TopBarConfig
    sideBar?: SideBarConfig
    donate?: DonateConfig

    sidebarLogoSrc?: string
    siteTitle?: string
    sidebarMenuLabel?: string
  }

  export interface GoogleAnalyticsConfig {
    propertyId?: string | null
    credentialsPath?: string | null
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
    class?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface DonateConfig {
    url: string
    icon?: string
  }
}

export type ThemeConfig = NeptuBlogTheme.Config
