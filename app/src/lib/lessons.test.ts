import { describe, expect, it } from 'vitest'

import { partInputKind, projectedSourceNumber } from './lessons'

describe('partInputKind', () => {
  it('lets the interaction spec override a numeric answer judge', () => {
    expect(partInputKind('math', 'numeric')).toBe('math')
    expect(partInputKind('number', 'numeric')).toBe('number')
  })

  it('keeps the legacy judge fallback when no interaction exists', () => {
    expect(partInputKind(undefined, 'numeric')).toBe('number')
    expect(partInputKind(undefined, 'expression')).toBe('math')
  })
})

describe('projectedSourceNumber', () => {
  it('falls back to the stable number only when the stored field is absent', () => {
    expect(projectedSourceNumber({ number: 14 })).toBe('14')
    expect(projectedSourceNumber({ number: 'q1', sourceNumber: null })).toBeNull()
    expect(projectedSourceNumber({ number: 'g2-1', sourceNumber: 1 })).toBe('1')
  })
})
