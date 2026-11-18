import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.dirname(out)
const original = path.join(tmp, 'd283-n68-t5-text-author')
const reviewPath = path.join(tmp, 'd284-n68-t5-first-text-review/report.json')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size, mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0') })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
assert.equal(hash(reviewPath), '157c8bf65332b698e5bdf3577f56185b6a31f2636722fe54a01b042e05f37588')
const review = read(reviewPath)
const freezePath = path.join(original, 'author-freeze.json')
assert.equal(hash(freezePath), '96002fefdde2e2c2d6735cbb28487a4a8755b8274da4e3a5b52d8665e45ac458')
const freeze = read(freezePath)
assert.equal(review.authorFreeze.sha256, hash(freezePath))
const inheritedPath = path.join(original, 'actual-opens.json')
assert.equal(read(inheritedPath).budget.cumulativeContextImages, 24)
const targets = [
  { id: 'N68-TEXT-F01', index: 5, pointer: '/prose/5/text' },
  { id: 'N68-TEXT-F02', index: 1, pointer: '/prose/1/text' },
]
const findings = targets.map(target => {
  const finding = review.findings.find(item => item.id === target.id)
  assert(finding)
  assert.deepEqual(finding.candidatePointers, [target.pointer])
  assert.equal(finding.status, 'HOLD')
  return finding
})
const templates = []
for (const language of ['zh', 'en']) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const source = path.join(original, 'frozen/n68', language, `${name}.template.json`)
    const expected = freeze.candidates.find(item => item.alias === 'n68' && item.language === language)
      .templates.find(item => item.name === name)
    assert.equal(hash(source), expected.sha256)
    assert.equal(bound(source).mode, '0444')
    const destination = path.join(out, 'frozen/n68', language, `${name}.template.json`)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o644)
    templates.push({ language, name, original: bound(source), initialCandidateCopy: bound(destination) })
  }
}
const contracts = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
].map(p => bound(path.join(root, p)))
save('source-binding.json', {
  schema: 'bounded-n68-two-prose-scope-repair-input-binding@1',
  ticket: 'STEMROBIN-181', batch: 'D033', role: 'Original author, local repair only',
  authorFreeze: bound(freezePath), authorSourceBinding: bound(path.join(original, 'source-binding.json')),
  authorSCIPending: bound(path.join(original, 'sci-pending.json')),
  review: bound(reviewPath), targets, findings, templates, contracts,
  inheritedOpens: bound(inheritedPath),
  unrepairedReviewHolds: review.findings.filter(item => !targets.some(target => target.id === item.id))
    .map(({ id, status, candidatePointers, authorPendingId }) => ({ id, status, candidatePointers, authorPendingId })),
  authorization: 'Two modern prose condition clarifications only. No formula, numeric, source, errata, unit or other content change.',
  expectedSubstantiveLanguageUnits: 4, originalFrozenByteChanges: 0,
  newImages: 0, cumulativeImages: 24, reset: false,
})
save('actual-opens.json', {
  schema: 'bounded-n68-two-prose-scope-repair-zero-image-opens@1',
  ticket: 'STEMROBIN-181', inherited: bound(inheritedPath),
  opens: [], status: 'ZERO-IMAGE-LOCAL-TEXT-REPAIR',
  budget: { inheritedImages: 24, newImages: 0, cumulativeContextImages: 24, maximum: 24, reset: false, remaining: 0 },
})
console.log(JSON.stringify({ copiedTemplates: 6, findings: targets.map(item => item.id), newImages: 0, cumulativeImages: 24 }, null, 2))
