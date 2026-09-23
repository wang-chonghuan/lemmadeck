import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contentSql, contentUrl } from './content-db.mjs'

test('content scripts use only the canonical database variable', () => {
  assert.equal(contentUrl({
    LEMMADECK_DATABASE_URL: 'canonical-content-database',
    EASYAPP_DATABASE_URL: 'retired-database',
    DATABASE_URL: 'unrelated-database',
  }), 'canonical-content-database')
})

for (const legacy of ['EASYAPP_DATABASE_URL', 'DATABASE_URL']) {
  test(`content scripts reject ${legacy} without opening a connection`, () => {
    const env = { [legacy]: 'retired-database' }
    assert.throws(() => contentUrl(env), /no LEMMADECK_DATABASE_URL in the repo-root \.env/)
    assert.throws(() => contentSql({ env }), /no LEMMADECK_DATABASE_URL in the repo-root \.env/)
  })
}

test('content scripts reject missing or empty canonical configuration', () => {
  for (const env of [{}, { LEMMADECK_DATABASE_URL: '' }]) {
    assert.throws(() => contentUrl(env), /no LEMMADECK_DATABASE_URL in the repo-root \.env/)
  }
})
