import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d831-n86-fig200-first-author')
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const source = path.join(D, 'frozen/fig-200.spec.json')
const to = path.join(D, 'attempts/revision-0/fig-200.spec.json')
fs.mkdirSync(path.dirname(to), { recursive: true })
fs.copyFileSync(source, to, fs.constants.COPYFILE_EXCL)
assert.equal(hash(source), hash(to))
fs.chmodSync(to, 0o444)
fs.writeFileSync(path.join(D, 'revision-1-repair.json'), `${JSON.stringify({
  schema: 'd831/spec-repair@1',
  revision: 1,
  originalSpec: { path: to, sha256: hash(to) },
  firstNativeFailure: { path: path.join(D, 'FIRST-native-failure.json'), sha256: hash(path.join(D, 'FIRST-native-failure.json')) },
  diagnosis: 'Native validator requires a 331px width in addition to requested 342/640 for inline instructional maxWidthPx=640.',
  changedPointers: ['/display/widths'],
  before: [342, 640], after: [331, 342, 640],
  geometryChanges: 0, sourceOrTextChanges: 0, numericAnnotationsAdded: 0,
  specRevisionCount: 1, renderRepairCount: 0,
  independentApprovalGranted: false,
}, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
console.log('FIRST failed FigureSpec retained; only /display/widths repair authorized by the native contract.')
