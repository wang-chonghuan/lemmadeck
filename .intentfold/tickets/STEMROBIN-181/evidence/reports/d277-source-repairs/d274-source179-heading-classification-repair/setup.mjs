import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const original = path.join(tmp, 'd260-source178179-first-author')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const freezePath = path.join(original, 'author-freeze.json')
assert.equal(hash(freezePath), 'dcf230fad0f066dd28f065766cf3614c36bc060505fc78dea7e940b4e8d53a85')
const freeze = read(freezePath)
for (const artifact of freeze.artifacts) assert.equal(hash(artifact.path), artifact.sha256)
const pagePath = path.join(original, 'source/10p/pages/0179/page.json')
const page = read(pagePath)
assert.equal(page.meta.printed_page, 169)
assert.equal(page.blocks.length, 14)
assert.equal(page.blocks[9].kind, 'exhead')
assert.deepEqual(page.blocks[9].lines, ['练 习 6'])
const tocPath = path.join(root, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json')
const toc = read(tocPath)
const tocPointer = '/contents/1/lessons/1/topics/4'
const tocItem = toc.contents[1].lessons[1].topics[4]
assert.equal(tocItem.id, 'phy10-c2-s2-t5')
assert.equal(tocItem.page, 169)
assert.equal(tocItem.title.replace(/\s/g, ''), page.blocks[9].lines[0].replace(/\s/g, ''))
const reviewPath = path.join(tmp, 'd267-source178179-raw136-first-review/report.json')
assert.equal(hash(reviewPath), '7efccf933a94992d9dbfd615e6ca926822995d57cb341f67a8cb924b7bff4bcd')
assert.equal(read(reviewPath).judgments.SOURCE179, 'PASS')
const failedAssemble = path.join(tmp, 'd273-n68-source-preparation/assemble.json')
const failed = read(failedAssemble)
assert.equal(failed.exitCode, 1)
assert(failed.stdout.includes("内部题目标识重复: ['1', '2', '3']"))
assert(failed.stdout.includes('练习 6（印刷页 169）'))
const d271FreezePath = path.join(tmp, 'd271-source180-punctuation-repair/author-freeze.json')
assert.equal(hash(d271FreezePath), '0bc98ecc19b09bfa1770e60aec0ac801ac5176f96deca0e546f608b6aeaf38ad')
const inherited = bound(path.join(tmp, 'd271-source180-punctuation-repair/actual-opens.json'))
assert.equal(hash(inherited.path), '6cd56499d2145c77daba2be774a769bc5a63546c9291919410b927e839177227')
assert.equal(read(inherited.path).budget.cumulativeContextImages, 24)
const copies = [
  'source/10p/pages/0179/page.md',
  'source/10p/pages/0179/page.json',
  'source/10p/pages/0179/audit.json',
  'work/10p/pages/0179/page.png',
  'work/10p/pages/0179/page.grid.png',
  'work/10p/pages/0179/layout.json',
  'work/10p/pages/0179/page.template.md',
].map(relative => {
  const input = path.join(original, relative)
  const destination = path.join(out, relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(input, destination, fs.constants.COPYFILE_EXCL)
  if (relative.startsWith('source/')) fs.chmodSync(destination, 0o644)
  assert.equal(hash(input), hash(destination))
  return { input: bound(input), candidateInitialCopy: bound(destination) }
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
const preservedInputs = [
  bound(freezePath), ...freeze.artifacts,
  ...snapshot(path.join(tmp, 'd267-source178179-raw136-first-review')),
  bound(failedAssemble), bound(path.join(tmp, 'd273-prepare-n68.mjs')),
  bound(d271FreezePath), ...read(d271FreezePath).artifacts,
]
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
  schema: 'bounded-source179-heading-classification-repair-inputs@1',
  ticket: 'STEMROBIN-181', role: 'Original d260 author; first classification repair, not SCI or independent source review',
  originalFreeze: bound(freezePath), originalPage: bound(pagePath),
  existingIndependentTextReview: bound(reviewPath),
  failedAssemble: bound(failedAssemble), originalAssembleExitCode: 1,
  toc: bound(tocPath), tocPointer, tocItem, inherited, completedD271Freeze: bound(d271FreezePath),
  copies, contractFiles, preservedInputs, uniqueWriteDomain: out,
  soleChange: { ref: 'p0179#10', pointer: '/blocks/9/kind', before: 'exhead', after: 'h3', text: '练 习 6' },
  prepareCalls: 0, vectorizeCalls: 0, assembleCalls: 0, newImages: 0,
})
save('actual-opens.json', {
  schema: 'bounded-source179-classification-zero-image-opens@1',
  ticket: 'STEMROBIN-181', inherited, status: 'COMPLETE-ZERO-IMAGE-CLASSIFICATION-REPAIR',
  budget: {
    inheritedImages: 24, newImages: 0, cumulativeContextImages: 24,
    contextMaximum: 24, batchMaximum: 0, reset: false, remainingImages: 0,
    reopens: 0, cropsOpened: 0, previewsOpened: 0, screenshotsOpened: 0, parentImagesOpened: 0,
  },
  opens: [], binaryHashAndCopyDoNotClaimImageObservation: true,
  observationBasis: 'Previously confirmed printed heading and d267 text/typography review, exact TOC identity and d273 actual failure; no new images or SCI review.',
})
console.log(JSON.stringify({ inputs: bound(path.join(out, 'input-bindings.json')), copies: copies.length, originalKind: page.blocks[9].kind, title: page.blocks[9].lines[0], tocItem, newImages: 0, cumulativeImages: 24 }, null, 2))
