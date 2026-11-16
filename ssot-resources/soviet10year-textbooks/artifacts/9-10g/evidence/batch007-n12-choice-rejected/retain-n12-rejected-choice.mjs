import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(fs.existsSync(root), 'First actual structural failure must remain')
assert.equal(JSON.parse(fs.readFileSync(`${root}/validation-command.json`, 'utf8')).exit, 2)
assert.equal(hash(`${root}/validation.stderr.txt`), '7c4e60cbdcd6196fb6c295e1e2afb7e5df66aba7e77a5a6b65a6200e9a2ddefb')
assert(!fs.existsSync(`${root}/validation-repaired-command.json`), 'Run repaired binding once')
const seed = `${ticket}/geo910-n12-choice-seed.json`
const draft = `${ticket}/geo910-n12-choice-draft.json`
const review = `${ticket}/geo910-n12-choice-independent-review-rejected.json`
assert.equal(hash(seed), 'b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17')
assert.equal(hash(draft), 'aa2aa67d4e467cc5749683d8d52ad3bbe1d1038a1c4c9279f3314a65302f1397')
assert.equal(hash(review), 'fe11b7ea3e8b6493278f8c0d318ca644c7fa44c3aba1aaf271152578c8dce7a0')
assert.equal(JSON.parse(fs.readFileSync(review, 'utf8')).outcome, 'blocked')
const current = JSON.parse(fs.readFileSync(review, 'utf8'))
const initial = JSON.parse(fs.readFileSync(`${ticket}/geo910-n12-choice-independent-review-rejected.serialization-first.json`, 'utf8'))
assert.deepEqual(current.figure_checks, [])
initial.figure_checks = []
assert.deepEqual(current, initial)
const args = [
  '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', seed, '--draft', draft, '--review', review,
]
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' })
fs.writeFileSync(`${root}/validation-repaired.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/validation-repaired.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/validation-repaired-command.json`, JSON.stringify({
  executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  args, exit: result.status, signal: result.signal, runCount: 1,
  meaning: 'Expected semantic rejection, not approval; only current review binding checked',
}, null, 2) + '\n')
assert.equal(result.status, 3, 'Expected structurally valid non-passing semantic outcome')
const copied = []
for (const name of [
  'geo910-n12-choice-seed.json',
  'geo910-n12-choice-draft.json',
  'geo910-n12-choice-view-only.json',
  'geo910-n12-choice-source-solve.md',
  'geo910-n12-choice-author.md',
  'geo910-n12-choice-independent-source-first.md',
  'geo910-n12-choice-independent-stage2.md',
  'geo910-n12-choice-independent-stage3.md',
  'geo910-n12-choice-independent-review-rejected.json',
  'geo910-n12-choice-independent-review-rejected.serialization-first.json',
  'geo910-n12-choice-independent-stage3.serialization-first.md',
  'geo910-n12-choice-review-serialization-repair.md',
  'retain-n12-rejected-choice.mjs',
]) {
  const from = path.join(ticket, name)
  const to = path.join(root, name)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: name, sha256: hash(to) })
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'blocked partial n12 choice draft; not approved, not promoted to choice-set',
  counts: { questions: 9, options: 42, selectedSources: 10 },
  independentOutcome: 'blocked',
  currentValidatorExit: result.status,
  initialValidatorExit: 2,
  serializationRepair: 'Only figure_checks membership changed to the exact empty question-used set. Original concept-figure observations retained, all mathematical and coverage records unchanged.',
  defects: ['99 half-plane/angle definitions unresolved and all three task units omitted', '104(2) conditional construction/no-solution investigation omitted', '101 internal broad-parallel/coincident-image distinction and coverage revise'],
  basis: 'All existing author drafts and sole independent Stage1/2/3 evidence copied byte-identically. No repair, browser or second semantic review. Historical scratch paths describe evidence, not runtime dependencies.',
  copied,
}, null, 2) + '\n')
console.log((result.stdout || '') + (result.stderr || ''))
console.log(`n12 rejected: actual review validator exit${result.status}; ${copied.length} immutable files retained, no approved choice-set`)
