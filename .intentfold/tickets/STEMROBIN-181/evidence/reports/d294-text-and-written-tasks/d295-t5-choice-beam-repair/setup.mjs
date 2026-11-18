import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.dirname(out)
const original = path.join(tmp, 'd291-t5-choice-author')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const phase1Path = path.join(tmp, 'd293-t5-choice-review/phase1-visible-review.json')
assert.equal(hash(phase1Path), '7c1a68513436820a129a290319cbee0462c171fe03fd648ba825b89cd3fbce01')
const phase1 = read(phase1Path)
const finding = phase1.findings.find(item => item.id === 'D293-F001')
assert(finding)
assert.equal(finding.sourceNumber, '1')
assert.equal(finding.status, 'FAIL')
const freezePath = path.join(original, 'author-freeze.json')
assert.equal(hash(freezePath), 'cb31333b33c746d8223f14e70b2a947d35593b7b5791383324718c73662f28cd')
const freeze = read(freezePath)
const bindingPath = path.join(original, 'source-binding.json')
const previous = read(bindingPath)
assert.equal(hash(bindingPath), freeze.artifacts.find(item => item.path === bindingPath).sha256)
const inheritedPath = path.join(original, 'actual-opens.json')
assert.equal(read(inheritedPath).budget.cumulativeContextImages, 24)
const languages = []
for (const item of previous.seeds) {
  const oldOutput = freeze.outputs.find(output => output.language === item.language)
  const source = oldOutput.draft.path
  assert.equal(hash(source), oldOutput.draft.sha256)
  assert.equal(fs.statSync(source).mode & 0o777, 0o444)
  const destination = path.join(out, item.language, 'draft.json')
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(destination, 0o644)
  const oldDraft = read(source)
  assert.equal(oldDraft.questions[0].id, 'beam-observation')
  assert.deepEqual(oldDraft.questions[0].source_numbers, ['1'])
  assert.deepEqual(oldDraft.questions[0].key.correct, ['A', 'D'])
  assert.equal(oldDraft.coverage[0].source_number, '1')
  for (const input of [item.seed, ...item.authority]) assert.equal(hash(input.path), input.sha256)
  const phaseVisible = phase1.snapshotBindings.languages.find(output => output.language === item.language).visible
  assert.equal(hash(phaseVisible.path), phaseVisible.sha256)
  languages.push({
    language: item.language, repository: item.repository,
    seed: item.seed, canonicalSeedDigest: item.canonicalSeedDigest, authority: item.authority,
    originalDraft: bound(source), originalVisible: phaseVisible,
    initialCandidateCopy: bound(destination),
  })
}
const contracts = [
  '.agents/skills/ld-s10y-choice/SKILL.md',
  '.agents/skills/ld-s10y-choice/references/authoring.md',
  '.agents/skills/ld-s10y-choice/references/contract.md',
  '.agents/skills/ld-s10y-choice/scripts/prepare.py',
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
].map(p => bound(path.join(root, p)))
save('source-binding.json', {
  schema: 'bounded-t5-beam-only-choice-repair-binding@1',
  ticket: 'STEMROBIN-181', batch: 'D033', role: 'Original d291 author; unique local source1 repair',
  originalFreeze: bound(freezePath), previousSourceBinding: bound(bindingPath),
  originalReport: bound(path.join(original, 'report.json')),
  originalScopeAndHolds: bound(path.join(original, 'scope-and-pending.json')),
  phase1: bound(phase1Path), finding, languages, contracts,
  inheritedOpens: bound(inheritedPath),
  allowedQuestion: 'beam-observation', allowedSourceNumber: '1',
  originalFullSourcePresolveReplayed: false, otherQuestionSemanticReviewReplayed: false,
  source2Source3AndExcluded5HoldsPreserved: true,
  newImages: 0, cumulativeImages: 24, reset: false,
})
save('actual-opens.json', {
  schema: 'bounded-t5-beam-only-choice-repair-zero-image-opens@1',
  inherited: bound(inheritedPath), opens: [],
  budget: { inheritedImages: 24, newImages: 0, cumulativeContextImages: 24, maximum: 24, reset: false, remaining: 0 },
  new_figures: [],
})
console.log(JSON.stringify({ candidatesCopied: 2, finding: finding.id, originalTrueSet: ['A', 'D'], newImages: 0, cumulativeImages: 24 }, null, 2))
