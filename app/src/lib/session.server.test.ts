import { describe, expect, it } from 'vitest'

import { requireSessionSecret } from './session.server'

describe('requireSessionSecret', () => {
  it('uses an explicitly configured secret', () => {
    expect(
      requireSessionSecret({
        NODE_ENV: 'production',
        SESSION_SECRET: 'configured-secret',
      }),
    ).toBe('configured-secret')
  })

  it('keeps the development fallback outside production', () => {
    expect(requireSessionSecret({ NODE_ENV: 'development' })).toBe(
      'stemrobin-dev-session-secret',
    )
  })

  it('rejects a missing production secret', () => {
    expect(() => requireSessionSecret({ NODE_ENV: 'production' })).toThrow(
      'SESSION_SECRET is required in production',
    )
  })
})
