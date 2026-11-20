import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c1-s3-n41'
const output = path.join(tmp, 'n41-affected-review-inputs-01')
const repair = path.join(tmp, 'n41-answer-display-repair-01')
const old = path.join(tmp, 'n41-answer-choice-review-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const digest = value => createHash('sha256').update(JSON.stringify(canonical(value))
  .replace(/[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')))
  .digest('hex')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const save = (name, value) => fs.writeFileSync(path.join(output, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const args = ['.agents/skills/ld-s10y-choice/scripts/prepare.py', 'inspect',
  '--repo', repo, '--book', '9-10g', '--lesson', lesson]
const inspect = spawnSync('python3', args, { cwd: repo, encoding: 'utf8' })
save('inspect-current-source.command.json', { cwd: repo, command: 'python3', args, exitCode: inspect.status })
for (const [name, text] of [['stdout.txt', inspect.stdout || ''], ['stderr.txt', inspect.stderr || '']])
  fs.writeFileSync(path.join(output, `inspect-current-source.${name}`), text, { flag: 'wx' })
assert.equal(inspect.status, 0)
const projection = JSON.parse(inspect.stdout)
const seedPath = path.join(tmp, 'n41-choice-author/seed.json')
const draftPath = path.join(tmp, 'n41-choice-author/draft.json')
const seed = json(seedPath)
const draft = json(draftPath)
assert.equal(draft.seed_sha256, digest(seed))
const beforeSeed = structuredClone(seed)
const beforeDraft = structuredClone(draft)
const changedNumbers = []
seed.exercises = seed.exercises.map(item => {
  const current = projection.exercises.find(candidate => candidate.number === item.number)
  assert.ok(current)
  assert.deepEqual(item.figure_ids, current.figure_ids)
  if (item.text !== current.text) changedNumbers.push(item.number)
  return current
})
assert.deepEqual(changedNumbers, ['391', '392', '393', '394', '395', '396', '397'])
const transition = json(path.join(repair, 'modern-transition.json'))
assert.equal(transition.status, 'pass-for-exercise-presentation-only')
const trace = seed.trace.find(item => path.resolve(repo, item.path) === transition.after.path)
assert.equal(trace.sha256, transition.before.sha256)
trace.sha256 = transition.after.sha256
const compareSeed = structuredClone(seed)
compareSeed.exercises = beforeSeed.exercises
compareSeed.trace = beforeSeed.trace
assert.deepEqual(compareSeed, beforeSeed)
draft.seed_sha256 = digest(seed)
const compareDraft = structuredClone(draft)
compareDraft.seed_sha256 = beforeDraft.seed_sha256
assert.deepEqual(compareDraft, beforeDraft)
save('seed.json', seed)
save('draft.json', draft)
const prerequisitePath = path.join(core, 'evidence/stemrobin188-g10-n41/prerequisites/bindings.json')
const prerequisites = json(prerequisitePath)
const originalBindings = json(path.join(old, 'report.json')).bindings
const resolvedBindings = originalBindings.map(item => {
  let resolvedPath = item.path
  let resolution = 'unchanged'
  const prior = prerequisites.originalPathsResolvedBy.find(candidate => candidate.originalPath === item.path)
  if (prior) {
    assert.equal(prior.sha256, item.sha256)
    resolvedPath = path.join(core, prior.retained)
    resolution = 'retained-exact-prerequisite'
  } else if (item.path === transition.after.path) {
    resolvedPath = transition.before.path
    resolution = 'preserved-before-exercises'
  } else if (item.path === path.join(path.dirname(transition.after.path), 'adaptation.audit.json')) {
    resolvedPath = path.join(repair, 'before/modern/adaptation.audit.json')
    resolution = 'preserved-before-adaptation-audit'
  }
  assert.equal(hash(resolvedPath), item.sha256, resolvedPath)
  return { path: resolvedPath, sha256: item.sha256, originalPath: item.path, resolution }
})
save('inherited-binding-resolution.json', {
  status: 'exact-historical-resolution-not-a-new-review', bindings: resolvedBindings,
  originalReview: bind(path.join(old, 'report.json')), prerequisiteResolution: bind(prerequisitePath),
  originalWholePageSourceApproved: false, allLocalHoldsPreserved: true,
})
const display = path.join(tmp, 'n41-exercise-display-repair-01')
const screenshots = json(path.join(display, 'result.json')).results.map(item => item.screenshot)
assert.equal(screenshots.length, 3)
const files = [
  ...['seed.json', 'draft.json', 'inherited-binding-resolution.json'].map(name => path.join(output, name)),
  ...['repair.json', 'modern-transition.json', 'answer-keys.candidate.json',
    'before/answer-keys.candidate.json', 'exercises.template.candidate.json',
    'before/exercises.template.json', 'before/modern/exercises.json',
    'adapt-finalize-01/command.json', 'render-01/command.json'].map(name => path.join(repair, name)),
  ...['answer-review.json', 'visual-observation.json', 'review.json', 'report.json', 'report.md']
    .map(name => path.join(old, name)),
  path.join(display, 'result.json'), prerequisitePath,
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => path.join(core, 'editions/modern-us-neutral/lessons', lesson, name)),
]
save('manifest.json', {
  status: 'pending-single-affected-review', lesson,
  answerCandidate: bind(path.join(repair, 'answer-keys.candidate.json')),
  answerReviewScope: 'Only392/397 grading auto→ungraded, parts removal, notes; all14 mathematical derivations/display answers unchanged and their independent PASS reused',
  choice: { seed: bind(path.join(output, 'seed.json')), draft: bind(path.join(output, 'draft.json')),
    seedSha256: digest(seed), draftSha256: digest(draft),
    inheritedReview: bind(path.join(old, 'review.json')), changedSourceNumbers: changedNumbers,
    changes: 'Only seed exercise presentation text and exercise trace; draft seed hash only; all question views, options, keys, coverage, definitions, figures byte-identical' },
  visual: { screenshots, imageOpensPlanned: 3,
    inheritedText: bind(path.join(old, 'visual-observation.json')),
    scopes: ['Two new exercise fullframes', 'Mobile395 formula actual scroll right endpoint'],
    oldVisualRevisePreserved: true, textSourceUnchanged: true },
  bindings: [...new Map([...resolvedBindings, ...files.map(bind), ...screenshots]
    .map(item => [item.path, item])).values()],
  originalFailuresAndHoldsPreserved: true, historyReset: false, published: false,
})
console.log(JSON.stringify({ output, changedNumbers, imageOpensPlanned: 3 }))
