import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const [admissionPath, name] = process.argv.slice(2)
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const inside = (file, root) => file.startsWith(root + path.sep)
const safe = file => {
  assert.ok(path.isAbsolute(file), 'Evidence paths must be explicit')
  assert.ok(inside(file, tmp) || inside(file, core), file)
  assert.equal(fs.realpathSync(file), file, 'Do not follow symlink evidence')
  assert.ok(!file.split(path.sep).some(part =>
    ['.env', '.git', 'node_modules', '.venv', '__pycache__'].includes(part)), file)
  assert.ok(!/\.(pdf|pyc|pem|key)$/i.test(file), file)
  assert.ok(fs.statSync(file).isFile(), file)
  return file
}
const inventory = (directory, reuseOnly = false) => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (reuseOnly && (entry.isSymbolicLink() || /\.(pdf|pyc|pem|key)$/i.test(file)
      || ['.env', '.git', 'node_modules', '.venv', '__pycache__'].includes(entry.name))) return []
  assert.ok(!entry.isSymbolicLink(), file)
  return entry.isDirectory() ? inventory(file, reuseOnly) : [safe(file)]
})
const check = binding => {
  assert.equal(hash(safe(binding.path)), binding.sha256, binding.path)
  return binding.path
}
const at = (value, fields) => fields.reduce((item, field) => item[field], value)
safe(admissionPath)
assert.ok(inside(admissionPath, tmp))
const admission = json(admissionPath)
assert.equal(admission.status, 'pass-for-offline-completion')
assert.ok(['geo910-c1-s3-n41', 'geo910-c2-s1-n42', 'geo910-c2-s1-n45'].includes(admission.lesson))
assert.equal(admission.book, '9-10g')
assert.equal(admission.published, false)
assert.match(name, /^stemrobin188-g10-n(41|42|45)$/)
assert.ok(admission.lesson.endsWith(name.split('-').at(-1)))
const output = path.join(core, 'evidence', name, 'completion')
assert.ok(!fs.existsSync(output), 'Do not repeat successful or replace partial retention')
const bindingsByPath = new Map(admission.bindings.map(binding => [check(binding), binding.sha256]))
assert.equal(bindingsByPath.size, admission.bindings.length)
const lessonPath = path.join(core, 'editions/modern-us-neutral/lessons', admission.lesson)
const rawPath = path.join(core, 'lessons', admission.lesson)
const lesson = json(path.join(lessonPath, 'lesson.json'))
const exercises = json(path.join(lessonPath, 'exercises.json'))
const keys = json(path.join(lessonPath, 'answer-keys.json'))
const choices = json(path.join(lessonPath, 'choice-set/draft.json'))
assert.equal(lesson.id, admission.lesson)
assert.equal(lesson.status, 'ready')
assert.equal(keys.status, 'ready')
assert.equal(keys.answers.length, exercises.exercises.length)
assert.equal(json(path.join(lessonPath, 'adaptation.audit.json')).status, 'pass')
assert.equal(json(path.join(lessonPath, 'answer-keys.audit.json')).status, 'pass')
assert.equal(json(path.join(lessonPath, 'choice-set/review.json')).outcome, 'pass')
for (const stage of ['adapt-finalize', 'render', 'answer-finalize', 'choice-check', 'choice-retain']) {
  const receipt = admission.receipts.find(item => item.stage === stage)
  assert.ok(receipt, stage)
  check(receipt)
  assert.equal(json(receipt.path).exitCode, 0, stage)
}
for (const kind of ['modern', 'answer', 'choice']) {
  const report = admission.reviews.find(item => item.kind === kind)
  assert.ok(report, kind)
  check(report)
  assert.equal(at(json(report.path), report.passFields), 'pass', kind)
}
for (const kind of ['text', 'exercises', 'choices']) {
  const visual = admission.visuals.find(item => item.kind === kind)
  assert.ok(visual, kind)
  check(visual)
  assert.equal(at(json(visual.path), visual.passFields), 'pass')
  assert.equal(visual.observedSourceUnchanged, true)
  assert.ok(visual.screenshots.length > 0)
  for (const binding of [...visual.sources, ...visual.screenshots]) {
    check(binding)
    assert.equal(bindingsByPath.get(binding.path), binding.sha256)
  }
}
assert.equal(admission.history.reset, false)
const inherited = admission.inheritedPackages.map(binding => {
  check(binding)
  assert.ok(inside(binding.path, path.join(core, 'evidence')))
  return { path: path.relative(core, binding.path), sha256: binding.sha256, reused: true }
})
const files = [...new Set([admissionPath, ...admission.retainFiles])]
for (const file of files) {
  safe(file)
  if (file !== admissionPath) assert.equal(bindingsByPath.get(file), hash(file), `Unbound evidence: ${file}`)
}
const artifacts = [...inventory(rawPath), ...inventory(lessonPath)]
const manifest = json(path.join(lessonPath, 'figures.json'))
for (const figure of manifest.figures) {
  for (const field of ['svg', 'png', 'artwork', 'spec', 'render', 'review']) {
    if (!figure[field]) continue
    const file = path.resolve(core, 'editions/modern-us-neutral', figure[field])
    safe(file)
    assert.equal(bindingsByPath.get(file), hash(file), `Unbound figure: ${file}`)
    artifacts.push(file)
  }
}
for (const file of artifacts)
  assert.equal(bindingsByPath.get(file), hash(file), `Unbound current artifact: ${file}`)
const existing = new Map(inventory(core, true).map(file => [hash(file), file]))
// The admission and artifact checks finish before creating any new durable path.
for (const binding of admission.bindings) check(binding)
fs.mkdirSync(output, { recursive: true })
const retained = files.map(from => {
  const sha256 = hash(from)
  const reused = existing.has(sha256)
  const to = reused ? existing.get(sha256) : path.join(output, 'files', path.relative(tmp, from))
  if (!reused) {
    assert.ok(inside(from, tmp), 'New bytes must be ticket evidence, not another resource package')
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    existing.set(sha256, to)
  }
  assert.equal(hash(to), sha256)
  return { from, retained: path.relative(core, to), sha256, reused }
})
for (const binding of admission.bindings) check(binding)
fs.writeFileSync(path.join(output, 'bindings.json'), JSON.stringify({
  schema: 'stemrobin188-offline-completion@1',
  book: '9-10g', lesson: admission.lesson, status: 'complete-offline',
  published: false, fullMechanicalDefence: false,
  exercises: exercises.exercises.length, figures: manifest.figures.length,
  answers: keys.answers.length, choices: choices.questions.length,
  lessonArtifacts: [...new Set(artifacts)].map(file => ({
    path: path.relative(core, file), sha256: hash(file),
  })),
  inheritedPackages: inherited, history: admission.history,
  sourceTransitions: admission.sourceTransitions || [],
  bindings: retained,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  output, status: 'complete-offline', bindings: retained.length,
  copied: retained.filter(item => !item.reused).length, reused: retained.filter(item => item.reused).length,
}))
