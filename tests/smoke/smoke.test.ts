import { describe, it, expect } from 'vitest'

// Simple inline smoke test — does vitest even run?
describe('smoke test', () => {
  it('vitest should execute assertions', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
  })
})
