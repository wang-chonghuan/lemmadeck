import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const O = path.join(T, 'tmp/d858-n87-text-first-repair')
const A = path.join(T, 'tmp/d837-n87-first-bilingual-text-author')
const P = path.join(T, 'tmp/d836-source233-consume-n87-prepare')
const V = path.join(T, 'tmp/d847-n87-first-independent-text-review')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const ledger = []
function bind(source, snapshot, expected) {
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  if (snapshot) {
    const target = path.join(O, 'inputs', snapshot)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(target), sha256)
  }
  ledger.push({ path: source, sha256, snapshot: snapshot ? path.join(O, 'inputs', snapshot) : null })
}
const freeze = JSON.parse(fs.readFileSync(path.join(A, 'author-freeze.json')))
for (const input of freeze.candidates) {
  bind(input.path, null, input.sha256)
  const relative = path.relative(path.join(A, 'candidate'), input.path)
  assert.equal(hash(path.join(O, 'before', relative)), input.sha256)
  assert.equal(hash(path.join(O, 'candidate', relative)), input.sha256)
}
bind(path.join(A, 'author-freeze.json'), 'author-freeze.json')
bind(path.join(V, 'findings.md'), 'FIRST-review/findings.md')
bind(path.join(V, 'report.json'), 'FIRST-review/report.json')
bind(path.join(V, 'input-bindings.json'), 'FIRST-review/input-bindings.json')
bind(path.join(P, 'n87-preauthor-source-requirements.json'), 'n87-preauthor-source-requirements.v1.json',
  'e2035f5a3e0a9608d90ef5275d9056dd59da9c221d3b3c9f596a46b09059d071')
bind(path.join(P, 'root/10p/lessons/phy10-c2-s3-n87/lesson.json'), 'raw-lesson.json',
  '6fe57df85e6b9986854b00c662cb9249ac71a32e1417a6fbad0bf6a4dd32a83c')
bind(path.join(P, 'root/10p/lessons/phy10-c2-s3-n87/exercises.json'), 'raw-exercises.json',
  '9299fe2333c9d0bb5157ad0a9deeb4d0d456972596c5d9178dea6ee042fbb43a')
for (const relative of [
  'native/zh.json', 'native/en.json', 'native/en-numeric-technical-recovery.json',
  'flow/zh-resolved.json', 'flow/en-resolved.json', 'native-text-once.py',
  'calls/run-author-FIRST-failure.json',
]) bind(path.join(A, relative), 'reused/' + relative)
for (const relative of [
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
]) bind(path.join(R, relative), null)
fs.writeFileSync(path.join(O, 'input-bindings.json'), JSON.stringify({
  schema: 'STEMROBIN-181/d858-input-bindings@1', R, T, O,
  verifiedAt: new Date().toISOString(), status: 'PASS-EXACT-INPUT-BYTES',
  soleCandidateBase: path.join(A, 'candidate'), ledger,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: 'PASS-EXACT-INPUT-BYTES', boundInputs: ledger.length, O }))
