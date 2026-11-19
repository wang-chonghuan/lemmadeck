import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d831-n86-fig200-first-author')
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const retained = {}
for (const [from, name] of [
  ['frozen/fig-200.spec.json', 'fig-200.spec.json'],
  ['frozen/fig-200.svg', 'fig-200.svg'],
  ['frozen/fig-200.render.json', 'fig-200.render.json'],
  ['previews/fig-200-native-640.png', 'fig-200-native-640.png'],
  ['calls/render-first.json', 'render-first.json'],
]) {
  const p = path.join(D, from)
  const to = path.join(D, 'attempts/revision-1-first-render', name)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(p, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(p), hash(to))
  fs.chmodSync(to, 0o444)
  retained[name] = { path: to, sha256: hash(to) }
}
fs.copyFileSync(path.join(D, 'calls/render-first.json'), path.join(D, 'FIRST-render-failure.json'), fs.constants.COPYFILE_EXCL)
fs.writeFileSync(path.join(D, 'revision-2-repair.json'), `${JSON.stringify({
  schema: 'd831/spec-repair@1', revision: 2, retained,
  diagnosis: 'First native render detected oblique R touching the radius stroke and padded overlap between h and its k subscript.',
  changes: [
    { object: 'raw200-oblique-R', pointer: '/objects/53/at', before: [-2.25, 5.3], after: [-2.6, 5.3] },
    { object: 'raw200-gap-k-subscript', pointer: '/objects/58/at', before: [-6.3, 0.54], after: [-6.14, 0.54] },
  ],
  sourceOrTextChanges: 0, geometricRelationshipChanges: 0, numericAnnotationsAdded: 0,
  specRevisionCount: 2, renderRepairCount: 1,
  firstRenderInspection: 'Author inspected retained native 640px PNG; geometry, true contact and all source label groups are visible. This is not independent review or promotion clearance.',
  imageLoadsThroughThisRepair: 2, paidCalls: 0,
}, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
console.log('FIRST failed render retained; one targeted two-label layout repair, cumulative spec revisions=2.')
