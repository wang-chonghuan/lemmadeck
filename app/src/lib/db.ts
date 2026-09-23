import postgres from 'postgres'

// Server-only Postgres client. The connection string is a server secret and must
// never reach the browser bundle — this module is imported only from server
// functions. All tables live in the per-project schema `lemmadeck-schema`.
//
// LEMMADECK_DATABASE_URL is the only authority for the shared Supabase database.
// A missing value must fail instead of silently selecting a different database.
let _sql: ReturnType<typeof postgres> | null = null

export function sql(): ReturnType<typeof postgres> {
  if (_sql) return _sql
  const url = process.env.LEMMADECK_DATABASE_URL
  if (!url) throw new Error('Missing LEMMADECK_DATABASE_URL')
  _sql = postgres(url, {
    ssl: 'require',
    max: 5,
    // Recycle idle/old connections before the remote server closes their sockets.
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connect_timeout: 15,
    // Quoted because the schema name contains a hyphen.
    connection: { search_path: '"lemmadeck-schema"' },
  })
  return _sql
}
