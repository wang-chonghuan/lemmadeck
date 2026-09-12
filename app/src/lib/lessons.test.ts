import { describe, expect, it } from 'vitest'

import { partInputKind } from './lessons'

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
