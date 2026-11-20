import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s1-n46'
const output = path.join(tmp, 'n46-symbol-affected-review-inputs-01')
const repair = path.join(tmp, 'n46-answer-symbol-repair-01')
const old = path.join(tmp, 'n46-answer-choice-display-source-review-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const digest = value => createHash('sha256').update(JSON.stringify(canonical(value))
  .replace(/[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')))
  .digest('hex')
const beforeSeed = json(path.join(tmp, 'n46-choice-author/seed.json'))
const seed = json(path.join(repair, 'seed.json'))
const draft = json(path.join(tmp, 'n46-choice-author/draft.json'))
assert.equal(draft.seed_sha256, digest(beforeSeed))
const normalizedSeed = structuredClone(seed)
normalizedSeed.exercises = beforeSeed.exercises
normalizedSeed.trace = beforeSeed.trace
assert.deepEqual(normalizedSeed, beforeSeed)
const changedNumbers = seed.exercises.filter((item, index) =>
  item.text !== beforeSeed.exercises[index].text).map(item => item.number)
assert.deepEqual(changedNumbers, ['36'])
const exercise36 = seed.exercises.find(item => item.number === '36')
const before36 = beforeSeed.exercises.find(item => item.number === '36')
assert.equal(exercise36.text, before36.text.replace('36*. ', '36* '))
const transition = json(path.join(repair, 'modern-transition.json'))
assert.equal(transition.status, 'pass-for-exercise36-presentation-only')
const normalizedTrace = structuredClone(seed.trace)
const changedTrace = normalizedTrace.find(item => path.resolve(repo, item.path) === transition.after.path)
assert.equal(changedTrace.sha256, transition.after.sha256)
changedTrace.sha256 = transition.before.sha256
assert.deepEqual(normalizedTrace, beforeSeed.trace)
const beforeDraft = structuredClone(draft)
draft.seed_sha256 = digest(seed)
const normalizedDraft = structuredClone(draft)
normalizedDraft.seed_sha256 = beforeDraft.seed_sha256
assert.deepEqual(normalizedDraft, beforeDraft)
const resolvedBindings = json(path.join(old, 'bindings-before.json')).files.map(item => {
  let resolvedPath = item.path
  let resolution = 'unchanged'
  if (item.path === transition.after.path) {
    resolvedPath = transition.before.path
    resolution = 'preserved-before-exercises'
  } else if (item.path === path.join(path.dirname(transition.after.path), 'adaptation.audit.json')) {
    resolvedPath = path.join(repair, 'before/modern/adaptation.audit.json')
    resolution = 'preserved-before-adaptation-audit'
  }
  assert.equal(hash(resolvedPath), item.expected_sha256, resolvedPath)
  return { path: resolvedPath, sha256: item.expected_sha256, originalPath: item.path, resolution }
})
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const save = (name, value) => fs.writeFileSync(path.join(output, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
save('seed.json', seed)
save('draft.json', draft)
save('inherited-binding-resolution.json', {
  status: 'exact-historical-resolution-not-a-new-review', bindings: resolvedBindings,
  originalReview: bind(path.join(old, 'output-index.json')),
  originalWholePageSourceApproved: false, allExactGlyphHoldsPreserved: true,
})
const display = path.join(tmp, 'n46-exercise-display-repair-01')
const screenshots = json(path.join(display, 'result.json')).results.map(item => item.screenshot)
assert.equal(screenshots.length, 2)
const sourceManifestPath = path.join(tmp, 'source173174-review-inputs-01/manifest.json')
const sourceManifest = json(sourceManifestPath)
const files = [
  ...['seed.json', 'draft.json', 'inherited-binding-resolution.json'].map(name => path.join(output, name)),
  ...['repair.json', 'modern-transition.json', 'answer-keys.json', 'before/answer-keys.json',
    'exercises.template.json', 'before/exercises.template.json',
    'before/modern/exercises.json', 'adapt-finalize-01/command.json', 'render-01/command.json',
    'choice-seed-refresh-01/command.json'].map(name => path.join(repair, name)),
  ...['answer-review.json', 'visual-review.json', 'review.json', 'convention-review.json', 'output-index.json']
    .map(name => path.join(old, name)),
  path.join(display, 'result.json'), sourceManifestPath,
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => path.join(core, 'editions/modern-us-neutral/lessons', lesson, name)),
]
save('manifest.json', {
  status: 'pending-single-affected-review', lesson,
  answerCandidate: bind(path.join(repair, 'answer-keys.json')),
  answerReviewScope: 'Only36(1) conditional/HOLD wording removal and notes; all formulas, other5answers and36(2)(3) independentlyPASS and unchanged',
  choice: {
    seed: bind(path.join(output, 'seed.json')), draft: bind(path.join(output, 'draft.json')),
    seedSha256: digest(seed), draftSha256: digest(draft),
    inheritedReview: bind(path.join(old, 'review.json')), changedSourceNumbers: changedNumbers,
    changes: 'Only36 printed separator in seed and exercise trace; draftseedhash only; all11views/44options/keys/coverage/definitions/figures unchanged',
  },
  visual: {
    screenshots, inheritedReview: bind(path.join(old, 'visual-review.json')),
    affectedScope: 'Only36 duplicate separator, two new exercise fullframes; unchanged text/figure displayPASS reused',
    oldVisualRevisePreserved: true, textSourceUnchanged: true,
  },
  sourceFirstReview: bind(sourceManifestPath),
  imageOpensPlanned: 8, hardImageLimit: 8,
  bindings: [...new Map([...resolvedBindings, ...files.map(bind), ...screenshots, ...sourceManifest.bindings]
    .map(item => [item.path, item])).values()],
  originalFailuresAndHoldsPreserved: true, historyReset: false, published: false,
})
console.log(JSON.stringify({ output, changedNumbers, imageOpensPlanned: 8 }))
