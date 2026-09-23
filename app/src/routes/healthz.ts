import { createFileRoute } from '@tanstack/react-router'

import { sql } from '~/lib/db'
import { requireSessionSecret } from '~/lib/session.server'

export async function healthResponse(): Promise<Response> {
  const headers = {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  }

  try {
    requireSessionSecret()
    await sql()`select 1`
    return Response.json(
      {
        status: 'ok',
        database: 'reachable',
        commit: process.env.RENDER_GIT_COMMIT ?? 'local',
      },
      { headers },
    )
  } catch {
    return Response.json({ status: 'error' }, { status: 503, headers })
  }
}

export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: healthResponse,
    },
  },
})
