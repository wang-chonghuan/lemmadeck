import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root), 'Preserve earlier rejection evidence')
const seed = `${ticket}/geo910-n12-choice-seed.json`
const draft = `${ticket}/geo910-n12-choice-draft.json`
const review = `${ticket}/geo910-n12-choice-independent-review-rejected.json`
assert.equal(hash(seed), 'b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17')
assert.equal(hash(draft), 'aa2aa67d4e467cc5749683d8d52ad3bbe1d1038a1c4c9279f3314a65302f1397')
assert.equal(hash(review), '3f3266bb933c54b257f4af3a6576c67016001dc31289e8a854a2ff2d73adf5d5')
assert.equal(JSON.parse(fs.readFileSync(review, 'utf8')).outcome, 'blocked')
const args = [
  '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', seed, '--draft', draft, '--review', review,
]
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' })
fs.mkdirSync(root, { recursive: true })
fs.writeFileSync(`${root}/validation.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/validation.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/validation-command.json`, JSON.stringify({
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
  defects: ['99 half-plane/angle definitions unresolved and all three task units omitted', '104(2) conditional construction/no-solution investigation omitted', '101 internal broad-parallel/coincident-image distinction and coverage revise'],
  basis: 'All existing author drafts and sole independent Stage1/2/3 evidence copied byte-identically. No repair, browser or second semantic review. Historical scratch paths describe evidence, not runtime dependencies.',
  copied,
}, null, 2) + '\n')
console.log((result.stdout || '') + (result.stderr || ''))
console.log(`n12 rejected: actual review validator exit${result.status}; ${copied.length} immutable files retained, no approved choice-set`)
