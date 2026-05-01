import { describe, expect, it, vi } from 'vitest'

const { readFileSyncMock, existsSyncMock } = vi.hoisted(() => ({
  readFileSyncMock: vi.fn(),
  existsSyncMock: vi.fn(() => false),
}))

vi.mock('node:fs', () => ({
  default: {
    readFileSync: readFileSyncMock,
    existsSync: existsSyncMock,
  },
  readFileSync: readFileSyncMock,
  existsSync: existsSyncMock,
}))

vi.mock('../../src/utils/node/image.ts', () => ({
  getImageDimensions: vi.fn(() => null),
}))

import { makePreviewItem } from '../../src/list-helpers/makePreviewItem.ts'

describe('makePreviewItem', () => {
  it('normalizes string and object tags from frontmatter', () => {
    readFileSyncMock.mockReturnValue(`---
title: Hello
tags:
  - Vue
  - name: Web Dev
    slug: web-dev-custom
---

Body content`)

    const item = makePreviewItem('/tmp/site/src/en/post/hello.md')

    expect(item.tags).toEqual([
      { name: 'Vue', slug: 'vue' },
      { name: 'Web Dev', slug: 'web-dev-custom' },
    ])
  })

  it('includes file path in frontmatter parsing errors', () => {
    readFileSyncMock.mockReturnValue(`---
title: [
---

Body content`)

    expect(() => makePreviewItem('/tmp/site/src/en/post/broken.md')).toThrow(
      'Failed to parse frontmatter in /tmp/site/src/en/post/broken.md'
    )
  })
})
