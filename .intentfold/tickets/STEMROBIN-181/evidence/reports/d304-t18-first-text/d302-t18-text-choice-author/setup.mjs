import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.dirname(out)
const source = path.join(tmp, 'd032-t18-text-repair/frozen')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, value) => {
  const p = path.join(out, name)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bound(p)
}
const expected = {
  'lesson.template.json': '5ec317b53627f947129d0f56d9cd46ee4089df5ec139e263e2b377c6dcf2b6fd',
  'exercises.template.json': 'fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0',
  'english.lesson.template.json': 'd1b3cf80796c12c94915d59a5da01c09661cfc4379aa209dda41168450f29f86',
  'english.exercises.template.json': 'fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02',
  'figures.template.json': '254a760157bfec9af60f556759ec37a9bb79de2cd4694a53c62abe6f7587ff8d',
}
const templates = Object.entries(expected).map(([name, sha256]) => {
  const p = path.join(source, name)
  assert.equal(hash(p), sha256)
  return { name, ...bound(p), originalMode: (fs.statSync(p).mode & 0o777).toString(8) }
})
const summaryPath = path.join(tmp, 'd032-t18-science-effective-review.json')
assert.equal(hash(summaryPath), '20a9faf60ed130ff34d1d0c10b32dab5f981f8ade18c062193df030c0d48f6b9')
const contracts = [
  '.agents/skills/ld-s10y-choice/SKILL.md',
  '.agents/skills/ld-s10y-choice/references/authoring.md',
  '.agents/skills/ld-s10y-choice/references/contract.md',
  '.agents/skills/ld-s10y-choice/scripts/prepare.py',
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
].map(p => bound(path.join(root, p)))
save('input-hashes.json', {
  schema: 'bounded-t18-four-text-choice-author-input-hashes@1',
  checkedAtUtc: new Date().toISOString(), templates,
  effectiveReview: bound(summaryPath), effectiveReviewConsumption: 'Status/scope summary only, never findings or independent solutions.',
  contracts, newImages: 0, cumulativeImages: 24, budgetReset: false,
})
const selected = ['2', '3', '11', '12']
const review = read(summaryPath)
const summary = save('approval-summary-consumption.json', {
  schema: 'bounded-t18-text-approval-status-only-consumption@1',
  input: bound(summaryPath),
  schemaRead: review.schema, book: review.book, card: review.card,
  status: review.status, approval: review.approval,
  completeCardClaim: review.completeCardClaim,
  editorialCorrectionStatus: review.editorialCorrectionStatus,
  selectedTaskStatuses: review.exercises.filter(item => selected.includes(String(item.number)))
    .map(item => ({ number: item.number, status: item.status })),
  retainedHoldSummary: review.retainedHolds.map(item => Object.fromEntries(
    ['id', 'status', 'approval', 'exercise', 'number', 'repairBudgetExhausted',
      'regenerationAuthorized', 'fallbackAuthorized', 'dropExerciseAuthorized',
      'adaptFinalizeAuthorized', 'sourceTextUnchanged', 'noErratumRegistered',
      'noCoronaSubstitutionAuthorized'].filter(key => Object.hasOwn(item, key))
      .map(key => [key, item[key]]))),
  exerciseFindingsOrObservationsOrIndependentAnswersConsumed: false,
  sourceSCIReviewRepeated: false,
  scope: 'Consume already-retained text approval scope, not the content of its scientific solution checks.',
})
const repositories = []
for (const language of ['zh', 'en']) {
  const prefix = language === 'en' ? 'english.' : ''
  const lessonName = `${prefix}lesson.template.json`
  const lesson = read(path.join(source, lessonName))
  assert.equal(lesson.id, 'phy9-c2-s4-t18')
  assert.equal(lesson.status, 'draft')
  assert.deepEqual(lesson.prose, [])
  const repo = path.join(out, language, 'repo')
  const base = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p')
  const directory = path.join(base, 'editions/modern-us-neutral/lessons', lesson.id)
  fs.mkdirSync(directory, { recursive: true })
  const copies = []
  for (const name of ['lesson', 'exercises', 'figures']) {
    const inputName = name === 'figures' ? 'figures.template.json' : `${prefix}${name}.template.json`
    const input = templates.find(item => item.name === inputName)
    const destination = path.join(directory, `${name}.json`)
    fs.copyFileSync(input.path, destination, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(destination), input.sha256)
    fs.chmodSync(destination, 0o444)
    copies.push({ name, original: input, staged: bound(destination), byteEqual: true })
  }
  const exercises = read(path.join(directory, 'exercises.json'))
  assert.equal(exercises.exercises.length, 16)
  assert.equal(exercises.status, 'draft')
  for (const number of selected) {
    const item = exercises.exercises.find(item => String(item.number) === number)
    assert(item)
    assert.deepEqual(item.figure_refs || [], [])
    assert.deepEqual(item.figures || [], [])
  }
  const bookPath = path.join(base, 'book.json')
  fs.writeFileSync(bookPath, `${JSON.stringify({ lessons: [{ id: lesson.id }] }, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(bookPath, 0o444)
  repositories.push({
    language, repo, book: '9p', lesson: lesson.id, templates: copies,
    temporaryBookIndex: bound(bookPath),
    temporaryBookIndexBasis: 'Minimal selector derived from the authorized lesson.id; no original/canonical book provenance or whole-adapt-finalize claim.',
    fullOriginalTaskCount: 16, stagedTaskCount: 16, status: 'draft',
    selectedSourceNumbers: selected, conceptIndices: [], noConcepts: true,
    seedPath: path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d302/seed.json'),
  })
}
save('source-binding.json', {
  schema: 'bounded-t18-four-text-choice-author-source-binding@1',
  ticket: 'STEMROBIN-181', batch: 'D033', author: 'Existing Galileo',
  inputHashes: bound(path.join(out, 'input-hashes.json')), templates,
  effectiveReview: bound(summaryPath), approvalSummary: summary,
  repositories, contracts, authority: 'Original embedded written tasks and retained modern wording in the five bound templates only.',
  fullSixteenTaskCopiesByteEqual: true, statusChangedToReady: false,
  conceptsImportedFromOtherCards: false,
  answersOldChoicesInteractionsInitialScientificSolutionsConsumed: false,
  figureAssetsCopiedOrOpened: false,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
})
save('actual-opens.json', {
  schema: 'bounded-t18-four-text-choice-author-zero-image-opens@1',
  inheritedAuthority: 'Current human direction and same-agent history: 24/24; no reset.',
  opens: [],
  budget: { inheritedImages: 24, newImages: 0, cumulativeImages: 24, maximum: 24, remaining: 0, reset: false },
  imageAssetsCopied: 0, new_figures: [],
})
console.log(JSON.stringify({ inputHashes: bound(path.join(out, 'input-hashes.json')), summary, repositories }, null, 2))
