import { describe, it, expect } from 'vitest'
import { arraysIntersection } from './array.ts'

describe('arraysIntersection', () => {
  it('returns common elements', () => {
    expect(arraysIntersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
  })

  it('returns empty array when no intersection', () => {
    expect(arraysIntersection([1, 2], [3, 4])).toEqual([])
  })

  it('returns empty array for empty inputs', () => {
    expect(arraysIntersection([], [])).toEqual([])
  })

  it('uses default empty arrays when no args', () => {
    expect(arraysIntersection()).toEqual([])
  })

  it('works with strings', () => {
    expect(arraysIntersection(['a', 'b'], ['b', 'c'])).toEqual(['b'])
  })
})
