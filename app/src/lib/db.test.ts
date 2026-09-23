import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { postgres, client } = vi.hoisted(() => ({
  postgres: vi.fn(),
  client: vi.fn(),
}))

vi.mock('postgres', () => ({ default: postgres }))

beforeEach(() => {
  vi.resetModules()
  postgres.mockReset().mockReturnValue(client)
  vi.stubEnv('LEMMADECK_DATABASE_URL', '')
  vi.stubEnv('EASYAPP_DATABASE_URL', '')
  vi.stubEnv('DATABASE_URL', '')
})

afterEach(() => vi.unstubAllEnvs())

describe('content database authority', () => {
  it('uses and caches only the canonical client with the existing pool settings', async () => {
    vi.stubEnv('LEMMADECK_DATABASE_URL', 'canonical-content-database')
    vi.stubEnv('EASYAPP_DATABASE_URL', 'retired-database')
    vi.stubEnv('DATABASE_URL', 'unrelated-database')
    const { sql } = await import('./db')

    expect(sql()).toBe(client)
    expect(sql()).toBe(client)
    expect(postgres).toHaveBeenCalledTimes(1)
    expect(postgres).toHaveBeenCalledWith('canonical-content-database', {
      ssl: 'require',
      max: 5,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
      connect_timeout: 15,
      connection: { search_path: '"lemmadeck-schema"' },
    })
  })

  it.each(['EASYAPP_DATABASE_URL', 'DATABASE_URL'])(
    'refuses %s when the canonical variable is absent',
    async (legacy) => {
      vi.stubEnv(legacy, 'retired-database')
      const { sql } = await import('./db')

      expect(() => sql()).toThrow('Missing LEMMADECK_DATABASE_URL')
      expect(postgres).not.toHaveBeenCalled()
    },
  )

  it('fails without any database configuration', async () => {
    const { sql } = await import('./db')
    expect(() => sql()).toThrow('Missing LEMMADECK_DATABASE_URL')
    expect(postgres).not.toHaveBeenCalled()
  })
})
