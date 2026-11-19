import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
for (const id of ['fig-196', 'fig-197']) {
  const before = `${O}/${id}/initial/spec.json`
  const after = `${O}/${id}/repair-1/spec.json`
  assert.ok(!fs.existsSync(after), 'Do not replay a completed repair')
  const spec = JSON.parse(fs.readFileSync(before, 'utf8'))
  const failure = `${O}/${id}/FIRST-native-failure.json`
  assert.ok(fs.existsSync(failure))
  const changes = []
  if (id === 'fig-196') {
    for (const object of spec.objects) {
      const match = /^(wall-contact|colour-name)-([1-7])$/.exec(object.id)
      if (match) {
        const index = Number(match[2]) - 1
        object.at[1] = 375 - index * 26
        changes.push({ object: object.id, property: 'at[1]', old: 362 - index * 22, new: object.at[1] })
      }
      if (object.id === 'prism-label') {
        changes.push({ object: object.id, property: 'at', old: object.at, new: [350, 155] })
        object.at = [350, 155]
      }
    }
    for (const assertion of spec.assertions) {
      if (assertion.id.startsWith('ordered-round-images-')) assertion.dy = -26
      if (assertion.id.startsWith('overlapping-round-image-spacing-')) assertion.value = 26
    }
  } else {
    const removed = spec.assertions.filter(a => a.id.endsWith('-exit-inside-prism')).map(a => a.id)
    assert.equal(removed.length, 4)
    spec.assertions = spec.assertions.filter(a => !removed.includes(a.id))
    for (const group of spec.source.inventory) group.assertions = group.assertions.filter(name => !removed.includes(name))
    changes.push({
      removedAssertions: removed,
      reason: 'Exit points are exactly on a prism face, not in its strict interior. The validator rejects boundary membership. Preserve unchanged entry/exit coordinates, exact pointOnLine face incidence, connects and common screen contacts; remove only the four incorrect redundant inside claims.',
    })
  }
  fs.mkdirSync(path.dirname(after), { recursive: true })
  fs.writeFileSync(after, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.writeFileSync(`${O}/${id}/repair-1/repair.json`, `${JSON.stringify({
    ordinal: 1, figure: id,
    before: { path: before, sha256: hash(before) },
    after: { path: after, sha256: hash(after) },
    firstFailure: { path: failure, sha256: hash(failure) },
    changes,
    sourceFactsChanged: false, cumulativeContentRepairs: 1,
    approval: 'none', review: 'not performed',
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${id} repair-1 ${hash(after)}`)
}
