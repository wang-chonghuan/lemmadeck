import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const before = `${own}/fig-198.first.spec.json`
const after = `${own}/fig-198.repair-1.spec.json`
const failure = JSON.parse(fs.readFileSync(`${own}/fig-198.first.render.json`, 'utf8'))
assert.equal(failure.status, 'fail')
assert.deepEqual(failure.collisions.map(c => c.id), ['inner-surface-label-label'])
assert.ok(!fs.existsSync(after))
const spec = JSON.parse(fs.readFileSync(before, 'utf8'))
const label = spec.objects.find(o => o.id === 'water-label')
assert.deepEqual(label.at, [490, 78])
label.at = [490, 62]
fs.writeFileSync(after, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
fs.writeFileSync(`${own}/repair-1.json`, `${JSON.stringify({
  authorRepairsCumulative: 1,
  cause: 'First native render found Inner surface label collision with Water label; 24 px baseline separation did not allow the rendered text boxes plus label gap.',
  change: { object: 'water-label', field: 'at', before: [490, 78], after: [490, 62] },
  retainedFirstSpec: { path: before, sha256: hash(before) },
  retainedFirstRender: { path: `${own}/fig-198.first.render.json`, sha256: hash(`${own}/fig-198.first.render.json`) },
  repairedSpec: { path: after, sha256: hash(after) },
  sourceInventoryChanged: false, geometryChanged: false, authoritativeTextChanged: false,
  independentReview: false, approval: 'none',
}, null, 2)}\n`, { flag: 'wx' })
console.log('Repair 1: Water label moved down 16 layout px; first failure preserved.')
