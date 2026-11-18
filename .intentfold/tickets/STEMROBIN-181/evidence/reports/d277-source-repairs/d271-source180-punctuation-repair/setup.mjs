import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const previous = path.join(tmp, 'd268-source180-first-author')
const review = path.join(tmp, 'd270-source180-first-review')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const freezePath = path.join(previous, 'author-freeze.json')
const reviewPath = path.join(review, 'report.json')
assert.equal(hash(freezePath), 'b0ade04e1f7953e6f1f7d5397df9ede4ba87a891b7ce2f7055ba5764f3a31b8a')
assert.equal(hash(reviewPath), '88327d18a6479e27a3cdc02c85f7c9adb2fba42b23b265eceb0b94c319ef458e')
const freeze = read(freezePath)
for (const artifact of freeze.artifacts) assert.equal(hash(artifact.path), artifact.sha256)
const report = read(reviewPath)
assert.equal(report.judgments.SOURCE180, 'FAIL')
assert.equal(report.sourceFailureCount, 1)
assert.equal(report.sourceFindings.length, 1)
const finding = report.sourceFindings[0]
assert.equal(finding.id, 'S180-F001')
assert.equal(finding.pointer, '/blocks/0/lines/2')
assert.equal(finding.actual, '组成的彩色风景画，不过全部是倒影.')
assert.equal(finding.profileExpected, '组成的彩色风景画. 不过全部是倒影.')
const originalPage = read(path.join(previous, 'source/10p/pages/0180/page.json'))
assert(originalPage.blocks[0].lines[2].startsWith(finding.actual))
const inherited = bound(path.join(previous, 'actual-opens.json'))
assert.equal(inherited.sha256, '0add4e68552855fa1049120a47e2fd2a0cfea833bcc0851f9c59beca1c997c6d')
assert.equal(read(inherited.path).budget.cumulativeContextImages, 24)
const copies = [
  'source/10p/pages/0180/page.md',
  'source/10p/pages/0180/page.json',
  'source/10p/pages/0180/audit.json',
  'work/10p/pages/0180/page.png',
  'work/10p/pages/0180/page.grid.png',
  'work/10p/pages/0180/layout.json',
  'work/10p/pages/0180/page.template.md',
  'boundaries.json',
].map(relative => {
  const source = path.join(previous, relative)
  const destination = path.join(out, relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  if (relative.startsWith('source/')) fs.chmodSync(destination, 0o644)
  assert.equal(hash(source), hash(destination))
  return { input: bound(source), candidateInitialCopy: bound(destination) }
})
function snapshot(folder) {
  const files = []
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const p = path.join(folder, entry.name)
    assert(!entry.isSymbolicLink())
    if (entry.isDirectory()) files.push(...snapshot(p))
    else files.push(bound(p))
  }
  return files.sort((a, b) => a.path.localeCompare(b.path))
}
const contractFiles = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
  '.claude/skills/ld-s10y-lesson/tools/normalize.py',
].map(p => bound(path.join(root, p)))
save('input-bindings.json', {
  schema: 'bounded-source180-punctuation-repair-inputs@1', ticket: 'STEMROBIN-181',
  role: 'Original d268 author; one finding repair, not independent reviewer',
  originalFreeze: bound(freezePath), originalReport: bound(path.join(previous, 'report.json')),
  independentReview: bound(reviewPath), originalFinding: finding,
  originalPage: bound(path.join(previous, 'source/10p/pages/0180/page.json')),
  inherited, copies, contractFiles,
  preservedOriginalFiles: [...snapshot(previous), ...snapshot(review)],
  uniqueWriteDomain: out, prepareCalls: 0, vectorizeCalls: 0,
  binaryImageInputsCopiedOnlyNoVisualConsumption: true,
})
save('actual-opens.json', {
  schema: 'bounded-source180-punctuation-repair-zero-image-opens@1',
  ticket: 'STEMROBIN-181', role: 'Original d268 author, not independent reviewer',
  inherited, status: 'COMPLETE-ZERO-IMAGE-REPAIR',
  budget: {
    inheritedImages: 24, newImages: 0, cumulativeContextImages: 24,
    contextMaximum: 24, batchMaximum: 0, reset: false, remainingImages: 0,
    reopens: 0, cropsOpened: 0, previewsOpened: 0, screenshotsOpened: 0,
    parentImagesOpened: 0,
  },
  opens: [], binaryHashAndCopyDoNotClaimImageObservation: true,
  observationBasis: 'Only the existing d270 text finding, prior d268 observations and mechanical text integrity checks; no new pixel observation.',
})
console.log(JSON.stringify({
  inputs: bound(path.join(out, 'input-bindings.json')), copies: copies.length,
  finding: finding.id, inheritedImages: 24, newImages: 0,
}, null, 2))
