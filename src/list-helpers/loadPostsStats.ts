import { google } from 'googleapis'
import type { Auth, analyticsdata_v1beta } from 'googleapis'
import { POSTS_DIR } from '../constants.ts'
import type { Post } from '../types.d.ts'

declare global {
  var loadingGaStatsPromise:
    | Promise<Record<string, AnalyticsStats>>
    | null
    | undefined
}

if (!globalThis.loadingGaStatsPromise) {
  globalThis.loadingGaStatsPromise = null
}

// GA4 Data API v1beta
const GA_VERSION = 'v1beta'

export interface AnalyticsDataSource {
  provider: 'ga4'
  propertyId?: string | null
  credentialsJson?: string | null
  dataPeriodDays?: number
  dataLimit?: number
}

/** @deprecated Use `AnalyticsDataSource` instead. */
export type GoogleAnalyticsConfig = AnalyticsDataSource

export interface AnalyticsStats extends Record<string, number> {
  pageviews: number
  uniquePageviews: number
  avgTimeOnPage: number
}

// Helper to normalize paths so GA paths match VitePress output URLs
function normalizePath(p: string): string {
  return p
    .split('?')[0] // remove query string
    .split('#')[0] // remove hash
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') // remove trailing slash
}

export async function mergeWithAnalytics(
  posts: Post[],
  dataSource: AnalyticsDataSource | null | undefined
): Promise<Post[]> {
  if (dataSource?.provider !== 'ga4' || !dataSource?.propertyId) {
    return posts
  }

  try {
    let stats: Record<string, AnalyticsStats> | null = null

    if (!globalThis.loadingGaStatsPromise) {
      globalThis.loadingGaStatsPromise = loadGoogleAnalytics(dataSource)
    }

    stats = await globalThis.loadingGaStatsPromise!

    if (!stats || Object.keys(stats).length === 0) {
      return posts
    }

    let postsWithStatsCount = 0

    const postsWithStats = posts.map((post) => {
      const normalizedPostUrl = normalizePath(post.url)
      const analyticsData = stats![normalizedPostUrl]

      if (analyticsData) postsWithStatsCount++

      return { ...post, analyticsStats: analyticsData || {} } as Post
    })

    if (postsWithStatsCount > 0) {
      console.info(
        `\x1b[32m📈 Merged GA stats for ${postsWithStatsCount} posts.\x1b[0m`
      )
    }

    return postsWithStats
  } catch (err) {
    console.error('\x1b[31m❌ Error merging GA stats with posts:\x1b[0m', err)
    return posts
  }
}

export async function loadGoogleAnalytics(
  dataSource: AnalyticsDataSource
): Promise<Record<string, AnalyticsStats>> {
  try {
    const scopes = ['https://www.googleapis.com/auth/analytics.readonly']
    let credentials: { client_email: string; private_key: string } | null = null

    if (dataSource.credentialsJson) {
      credentials = JSON.parse(dataSource.credentialsJson)
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

    startDate.setDate(startDate.getDate() - (dataSource.dataPeriodDays || 30))

    const requestParams: analyticsdata_v1beta.Params$Resource$Properties$Runreport =
      {
        property: `properties/${dataSource.propertyId}`,
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
          limit: (dataSource.dataLimit || 1000).toString(),
        },
      }

    console.info(
      `\x1b[36m🔍 Fetching GA stats for property ${dataSource.propertyId}...\x1b[0m`
    )

    const response = await analyticsdata.properties.runReport(requestParams)

    const stats: Record<string, AnalyticsStats> = {}

    const rows = response.data.rows

    if (!rows || rows.length === 0) {
      console.warn('\x1b[33m⚠️ GA returned no data for this period.\x1b[0m')
      return {}
    }

    rows.forEach((row) => {
      if (!row.dimensionValues?.[0]?.value || !row.metricValues) return

      const pagePath = normalizePath(row.dimensionValues[0].value)

      stats[pagePath] = {
        pageviews: parseInt(row.metricValues[0].value || '0', 10),
        uniquePageviews: parseInt(row.metricValues[1].value || '0', 10),
        avgTimeOnPage: parseFloat(row.metricValues[2].value || '0'),
      }
    })

    console.info(
      `\x1b[32m✅ Loaded GA stats for ${Object.keys(stats).length} paths.\x1b[0m`
    )

    return stats
  } catch (err: unknown) {
    console.error(
      '\x1b[31m❌ Critical error fetching Google Analytics data:\x1b[0m'
    )
    if (err instanceof Error) {
      console.error(err.message)
    } else {
      console.error(err)
    }
    return {}
  }
}
