import { google } from 'googleapis'
import type { Auth } from 'googleapis'
import { POSTS_DIR } from '../constants.ts'
import type { Post } from '../types.d.ts'

declare global {
   
  var loadingGaStatsPromise: Promise<Record<string, AnalyticsStats>> | null | undefined
}

if (!globalThis.loadingGaStatsPromise) {
  globalThis.loadingGaStatsPromise = null
}

// GA4 Data API v1beta
const GA_VERSION = 'v1beta'

export interface GoogleAnalyticsConfig {
  propertyId?: string | null
  credentialsJson?: string | null
  dataPeriodDays?: number
  dataLimit?: number
}

export interface AnalyticsStats extends Record<string, number> {
  pageviews: number
  uniquePageviews: number
  avgTimeOnPage: number
}

export async function mergeWithAnalytics(
  posts: Post[],
  gaCfg: GoogleAnalyticsConfig | null | undefined
): Promise<Post[]> {
  if (!gaCfg?.propertyId) {
    return posts
  }

  try {
    let stats: Record<string, AnalyticsStats> | null = null

    if (!globalThis.loadingGaStatsPromise) {
      globalThis.loadingGaStatsPromise = loadGoogleAnalytics(gaCfg)
    }

    stats = await globalThis.loadingGaStatsPromise!

    if (!stats || Object.keys(stats).length === 0) {
      return posts
    }

    let postsWithStatsCount = 0

    const postsWithStats = posts.map((post) => {
      const analyticsData = stats![post.url]

      if (analyticsData) postsWithStatsCount++

      return { ...post, analyticsStats: analyticsData || {} } as Post
    })

    return postsWithStats
  } catch {
    return posts
  }
}

export async function loadGoogleAnalytics(
  gaCfg: GoogleAnalyticsConfig
): Promise<Record<string, AnalyticsStats>> {
  try {
    const scopes = ['https://www.googleapis.com/auth/analytics.readonly']
    let credentials: { client_email: string; private_key: string } | null = null

    if (gaCfg.credentialsJson) {
      credentials = JSON.parse(gaCfg.credentialsJson)
    }

    const authClient: Auth.JWT | Auth.AuthClient = credentials
      ? new google.auth.JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes,
        })
      : await new google.auth.GoogleAuth({ scopes }).getClient()

    const analyticsdata = google.analyticsdata({
      version: GA_VERSION,
      auth: authClient as Auth.JWT,
    })
    const endDate = new Date()
    const startDate = new Date()

    startDate.setDate(startDate.getDate() - (gaCfg.dataPeriodDays || 30))

    const requestParams = {
      property: `properties/${gaCfg.propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
        ],
        dimensions: [{ name: 'pagePath' }],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'CONTAINS',
              value: `/${POSTS_DIR}/`,
              caseSensitive: false,
            },
          },
        },
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: gaCfg.dataLimit || 1000,
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await analyticsdata.properties.runReport(requestParams as any)

    const stats: Record<string, AnalyticsStats> = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (response as any).data

    if (!responseData.rows || responseData.rows.length === 0) {
      return {}
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseData.rows.forEach((row: any) => {
      const pagePath = row.dimensionValues[0].value
      const metrics = row.metricValues

      stats[pagePath] = {
        pageviews: parseInt(metrics[0].value) || 0,
        uniquePageviews: parseInt(metrics[1].value) || 0,
        avgTimeOnPage: parseFloat(metrics[2].value) || 0,
      }
    })

    return stats
  } catch {
    return {}
  }
}
