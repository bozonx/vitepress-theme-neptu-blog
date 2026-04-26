import fs from 'node:fs/promises'
import { google } from 'googleapis'
import { POSTS_DIR } from '../constants.ts'

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
  credentialsPath?: string | null
  credentialsJson?: string | null
  dataPeriodDays?: number
  dataLimit?: number
}

export interface AnalyticsStats {
  pageviews: number
  uniquePageviews: number
  avgTimeOnPage: number
}

export async function mergeWithAnalytics(
  posts: Record<string, unknown>[],
  gaCfg: GoogleAnalyticsConfig | null | undefined
): Promise<Record<string, unknown>[]> {
  // Configuration validation
  if (!gaCfg?.propertyId) {
    console.warn('⚠️ Google Analytics is not configured: propertyId is missing')
    return posts
  }

  // Check for credentials (ADC is supported)
  if (!gaCfg?.credentialsJson && !gaCfg?.credentialsPath) {
    console.log(
      'ℹ️ No credentials specified, using Application Default Credentials'
    )
    console.log(
      '   Make sure the GOOGLE_APPLICATION_CREDENTIALS environment variable is set'
    )
    console.log('   or run gcloud auth application-default login')
  }

  try {
    let stats: Record<string, AnalyticsStats> | null = null

    if (globalThis.loadingGaStatsPromise) {
      console.log('📦 Using cached Google Analytics data')
    } else {
      console.log('🔍 Loading statistics from Google Analytics...')
      globalThis.loadingGaStatsPromise = loadGoogleAnalytics(gaCfg)
    }

    stats = await globalThis.loadingGaStatsPromise!

    if (!stats || Object.keys(stats).length === 0) {
      console.warn('⚠️ No data from Google Analytics')

      return posts
    }

    let postsWithStatsCount = 0

    const postsWithStats = posts.map((post) => {
      const analyticsData = stats![post.url]

      if (analyticsData) postsWithStatsCount++

      return { ...post, analyticsStats: analyticsData || {} }
    })

    console.log(
      `✅ Processed ${postsWithStatsCount} posts with analytics out of ${posts.length} posts`
    )

    return postsWithStats
  } catch (error) {
    console.error(
      '❌ Error loading data from Google Analytics:',
      (error as Error).message
    )

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
      console.log('🔑 Using credentialsJson')
    } else if (gaCfg.credentialsPath) {
      credentials = JSON.parse(
        await fs.readFile(gaCfg.credentialsPath, 'utf-8')
      )
      console.log(`🔑 Using file: ${gaCfg.credentialsPath}`)
    } else {
      console.log('🔑 Using Application Default Credentials')
    }

    const authClient: unknown = credentials
      ? new google.auth.JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes,
        })
      : await new google.auth.GoogleAuth({ scopes }).getClient()

    console.log('✅ Authentication completed')

    const analyticsdata = google.analyticsdata({
      version: GA_VERSION,
      auth: authClient,
    })
    const endDate = new Date()
    const startDate = new Date()

    startDate.setDate(startDate.getDate() - (gaCfg.dataPeriodDays || 30))

    console.log('🔍 Requesting data from Google Analytics...')
    console.log(
      `📅 Period: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`
    )
    console.log(`🏷️ Property ID: ${gaCfg.propertyId}`)

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

    console.log('📊 Sending request to Google Analytics Data API...')

    const response = await analyticsdata.properties.runReport(requestParams as unknown)

    const stats: Record<string, AnalyticsStats> = {}

    if (!response.data.rows || response.data.rows.length === 0) {
      console.warn('⚠️ No data in response from Google Analytics 4')
      console.warn('   Possible reasons:')
      console.warn('   - Not enough data for the specified period')
      console.warn('   - Incorrect filter by pagePath')
      console.warn('   - Property ID contains no data')
      return {}
    }

    console.log(
      `📊 Response from Google Analytics: Found ${response.data.rows?.length || 0} records`
    )
    console.log('🔗 First 5 URLs:')
    response.data.rows.slice(0, 5).forEach((row: unknown, index: number) => {
      console.log(`  ${index + 1}. ${row.dimensionValues[0].value}`)
    })

    response.data.rows.forEach((row: unknown) => {
      const pagePath = row.dimensionValues[0].value
      const metrics = row.metricValues

      stats[pagePath] = {
        pageviews: parseInt(metrics[0].value) || 0,
        uniquePageviews: parseInt(metrics[1].value) || 0,
        avgTimeOnPage: parseFloat(metrics[2].value) || 0,
      }
    })

    return stats
  } catch (error: unknown) {
    console.error(
      '❌ Error requesting Google Analytics API:',
      (error as Error)?.message
    )

    if (error?.code === 'ENOENT') {
      const credentialsSource = gaCfg.credentialsJson
        ? 'credentialsJson'
        : 'credentialsPath'
      console.error(
        '❌ Credentials file not found:',
        credentialsSource === 'credentialsPath'
          ? gaCfg.credentialsPath
          : 'credentialsJson'
      )
    } else if (error?.code === 403) {
      console.error('❌ No access to Google Analytics. Check:')
      console.error('   - Correctness of propertyId')
      console.error('   - Service Account access rights to Google Analytics')
      console.error('   - Whether Google Analytics Data API is enabled in the project')
    } else if (error?.code === 400) {
      console.error('❌ Invalid request to Google Analytics API')
      if (error?.details) {
        console.error('   Error details:', (error as Record<string, unknown>).details)
      }
    } else if (error?.code === 401) {
      console.error(
        '❌ Authentication error. Check Service Account credentials'
      )
    } else if (error?.code === 429) {
      console.error('❌ Google Analytics API rate limit exceeded')
    } else {
      console.error('❌ Unknown error:', (error as Record<string, unknown>)?.code || 'N/A')
      if (error?.response?.data) {
        console.error(
          '   API response:',
          JSON.stringify(error.response.data, null, 2)
        )
      }
    }

    return {}
  }
}
