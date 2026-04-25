import { arraysIntersection } from './array.ts'
import type { Post } from '../../types.d.ts'

/** Sorts posts by popularity or by date. */
export function sortPosts(
  posts: Post[] | null | undefined,
  sortBy?: string,
  sortByPopularity: boolean = false
): Post[] {
  if (!posts || !Array.isArray(posts)) return []

  if (sortByPopularity && !sortBy) {
    console.warn('⚠️ Warning: function sortPosts: sortBy is not defined')
    return posts
  }

  return [...posts].sort((a, b) => {
    if (sortByPopularity && sortBy) {
      // Sort by popularity
      const aHasStats = Number.isFinite(a.analyticsStats?.[sortBy])
      const bHasStats = Number.isFinite(b.analyticsStats?.[sortBy])

      if (aHasStats && bHasStats && a.analyticsStats && b.analyticsStats) {
        const aValue = a.analyticsStats[sortBy] as number
        const bValue = b.analyticsStats[sortBy] as number
        return bValue - aValue
      }

      if (aHasStats && !bHasStats) return -1
      if (!aHasStats && bHasStats) return 1

      return +new Date(b.date || 0) - +new Date(a.date || 0)
    } else {
      return +new Date(b.date || 0) - +new Date(a.date || 0)
    }
  })
}

/**
 * Sorts posts to display similar ones. Priority: number of matching
 * tags > popularity > date
 */
export function sortSimilarPosts(
  posts: Post[] | null | undefined,
  currentPostTags: Array<{ slug?: string }> | null | undefined,
  currentPostUrl: string,
  sortBy?: string,
  limit: number = 5
): Post[] {
  if (!posts || !Array.isArray(posts)) return []
  if (!currentPostTags || !Array.isArray(currentPostTags)) return []

  const getTagsIntersection = (
    tags1: Array<{ slug?: string }> | undefined,
    tags2: Array<{ slug?: string }> | undefined
  ): string[] => {
    if (!Array.isArray(tags1) || !Array.isArray(tags2)) {
      return []
    }

    const slugs1 = tags1.map((tag) => tag?.slug).filter(Boolean) as string[]
    const slugs2 = tags2.map((tag) => tag?.slug).filter(Boolean) as string[]

    return arraysIntersection(slugs1, slugs2)
  }

  const getPopularityValue = (post: Post): number => {
    if (!sortBy) return 0

    const stats = post.analyticsStats?.[sortBy]
    return stats !== undefined && stats !== null ? stats : 0
  }

  return [...posts]
    .filter((item) => {
      const isCurrentPost = item.url === currentPostUrl
      if (isCurrentPost) return false

      if (!item.tags || !Array.isArray(item.tags)) return false

      const intersection = getTagsIntersection(item.tags, currentPostTags)
      return intersection.length > 0
    })
    .sort((a, b) => {
      const aIntersection = getTagsIntersection(a.tags, currentPostTags).length
      const bIntersection = getTagsIntersection(b.tags, currentPostTags).length

      if (aIntersection !== bIntersection) {
        return bIntersection - aIntersection
      }

      const aPopularity = getPopularityValue(a)
      const bPopularity = getPopularityValue(b)

      if (aPopularity !== bPopularity) {
        return bPopularity - aPopularity
      }

      return +new Date(b.date || 0) - +new Date(a.date || 0)
    })
    .slice(0, limit)
}
