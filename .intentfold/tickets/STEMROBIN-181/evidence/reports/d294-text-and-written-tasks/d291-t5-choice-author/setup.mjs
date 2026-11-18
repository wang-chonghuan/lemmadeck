import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.dirname(out)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const manifestPath = path.join(tmp, 'd290-t5-scoped-choice-seeds/manifest.json')
assert.equal(hash(manifestPath), '6707b4228111b0f005b1a9de0a7f56dc53b0309a739adec750a02ee16400b551')
const manifest = read(manifestPath)
assert.equal(manifest.sourceCardTasks, 7)
assert.equal(manifest.selectedSourceTasks, 6)
const inheritedPath = path.join(tmp, 'd286-n68-scope-text-repair/actual-opens.json')
assert.equal(read(inheritedPath).budget.cumulativeContextImages, 24)
const seeds = []
for (const item of manifest.results) {
  const seedPath = path.resolve(root, item.seed.path)
  assert.equal(hash(seedPath), item.seed.sha256)
  const seed = read(seedPath)
  assert.deepEqual(seed.exercises.map(exercise => exercise.number), ['1', '2', '3', '4', '6', '7'])
  assert.deepEqual(seed.concepts, [])
  assert.deepEqual(seed.figures, [])
  assert(seed.exercises.every(exercise => exercise.figure_ids.length === 0))
  const repository = path.resolve(root, item.repository)
  const authority = seed.trace.map(entry => {
    const p = path.resolve(repository, entry.path)
    assert.equal(hash(p), entry.sha256)
    return bound(p)
  })
  const command = ['python3', '-B', path.join(root, '.agents/skills/ld-s10y-choice/scripts/prepare.py'), 'digest', seedPath]
  const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' })
  const folder = path.join(out, 'seed-digest', item.language)
  fs.mkdirSync(folder, { recursive: true })
  const stdout = path.join(folder, 'stdout.txt')
  const stderr = path.join(folder, 'stderr.txt')
  fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
  const receiptPath = path.join(folder, 'receipt.json')
  fs.writeFileSync(receiptPath, `${JSON.stringify({
    command, exitCode: proc.status, stdout: bound(stdout), stderr: bound(stderr),
    scope: 'Canonical seed digest only; not inspect/prepare, no seed/source write.',
  }, null, 2)}\n`, { flag: 'wx' })
  assert.equal(proc.status, 0)
  const digest = proc.stdout.trim()
  assert(/^[a-f0-9]{64}$/.test(digest))
  seeds.push({
    language: item.language, repository, seed: bound(seedPath), canonicalSeedDigest: digest,
    authority, digestReceipt: bound(receiptPath),
    selectedSourceNumbers: seed.exercises.map(exercise => exercise.number),
    sourceFigures: [], sourceConcepts: [],
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
  schema: 'bounded-t5-six-source-choice-first-author-binding@1',
  ticket: 'STEMROBIN-181', batch: 'D033', role: 'First choice author only',
  manifest: bound(manifestPath), seeds, contracts,
  inheritedOpens: bound(inheritedPath), sourceCardTasks: 7, selectedTasks: 6,
  unselectedTask5: manifest.unselectedTask5, definitionParagraphs: [], figures: [],
  preparedSeedsOrFourAuthorityJSONChanged: false,
  d280D288HistoricalChoiceInputOrAnswerKeyRead: false,
  newImages: 0, cumulativeImages: 24, reset: false,
})
save('actual-opens.json', {
  schema: 'bounded-t5-six-source-choice-author-zero-image-opens@1',
  inherited: bound(inheritedPath), opens: [],
  budget: { inheritedImages: 24, newImages: 0, cumulativeContextImages: 24, maximum: 24, reset: false, remaining: 0 },
  allSeedsTextOnly: true, new_figures: [],
})
save('independent-solution-checkpoint.json', {
  role: 'Author independently solved selected raw tasks before creating any options; not independent reviewer approval.',
  solutions: bound(path.join(out, 'independent-source-solutions.json')),
  sourceBinding: bound(path.join(out, 'source-binding.json')),
  savedBeforeAnyDraft: !fs.existsSync(path.join(out, 'zh/draft.json')) && !fs.existsSync(path.join(out, 'en/draft.json')),
  timestamp: new Date().toISOString(),
  prohibitedAnswerOrChoiceInputsRead: false,
})
console.log(JSON.stringify({ seeds, independentSolutions: bound(path.join(out, 'independent-source-solutions.json')), newImages: 0, cumulativeImages: 24 }, null, 2))
