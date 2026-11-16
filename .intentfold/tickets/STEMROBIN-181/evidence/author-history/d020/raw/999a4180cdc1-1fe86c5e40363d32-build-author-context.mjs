import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const input = {
  lesson: ['.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n81/lesson.template.json', 'df1c56c96ab6a6c023aec7e8083831a8e95778946dece66de5268cd71ccbda4b'],
  proseFreeze: ['.intentfold/tickets/STEMROBIN-181/tmp/9p-n81-prose-freeze.json', 'f26a5028cf8d01b313bd6f19b98573e6de86b1882cf88cc900e2cccfe09b95b2'],
  science: ['.intentfold/tickets/STEMROBIN-181/tmp/9p-n81-science-review.json', '30d6939957c5cc0e1e65b76f6a94221cf69aa43481872e1b03c50b6fcc153461'],
  source: ['ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-152.png', '546f0d2a23aa9cdfdef9e3d9a78fceba84e224ffcb078c2cf917e8a9e9157b8d'],
  inventory: [path.relative(repo, path.join(own, 'source-inventory.json')), '091fa758a0f65385a181f83c7373ce270811151a908c182aeba89559b4416368'],
}
const bindings = {}
for (const [key, [relative, expected]] of Object.entries(input)) {
  const file = path.join(repo, relative)
  assert.equal(hash(file), expected, `${key} frozen bytes changed`)
  bindings[key] = bind(file)
}
const lesson = JSON.parse(fs.readFileSync(path.join(repo, input.lesson[0]), 'utf8'))
const proseFreeze = JSON.parse(fs.readFileSync(path.join(repo, input.proseFreeze[0]), 'utf8'))
const science = JSON.parse(fs.readFileSync(path.join(repo, input.science[0]), 'utf8'))
assert.equal(science.status, 'pass')
assert.equal(science.bindings.lessonTemplate.sha256, bindings.lesson.sha256)
assert.equal(science.bindings.authorFreeze.sha256, bindings.proseFreeze.sha256)
assert.equal(lesson.id, 'phy9-c2-s2-n81')
const exercises = path.join(repo, proseFreeze.bindings.exercisesTemplate.path)
assert.equal(hash(exercises), proseFreeze.bindings.exercisesTemplate.sha256)
assert.deepEqual(JSON.parse(fs.readFileSync(exercises, 'utf8')).exercises, [])
bindings.exercises = bind(exercises)

const projectionRoot = path.join(own, 'native-input')
const book = path.join(projectionRoot, '9p')
const projectedLesson = path.join(book, 'editions/modern-us-neutral/lessons/phy9-c2-s2-n81')
fs.mkdirSync(projectedLesson, { recursive: true })
fs.mkdirSync(path.join(book, 'figures'), { recursive: true })
const links = [
  [path.join(repo, input.lesson[0]), path.join(projectedLesson, 'lesson.json')],
  [exercises, path.join(projectedLesson, 'exercises.json')],
  [path.join(repo, input.source[0]), path.join(book, 'figures/fig-152.png')],
]
for (const [target, destination] of links) fs.symlinkSync(target, destination)
const script = path.join(repo, '.agents/skills/ld-s10y-image/scripts/build_context.py')
const nativePath = path.join(own, 'context.native.json')
const argv = [script, '--book', '9p', '--edition', 'modern-us-neutral', '--figure', 'fig-152', '--root', projectionRoot, '--output', nativePath]
write(path.join(own, 'native-context-call-start.json'), {
  schema: 'ld-s10y-image/author-native-call@1',
  command: 'python3', argv, cwd: repo, script: bind(script), bindings,
  invocationOrdinal: 1,
  sourceAccess: 'PNG header and byte hashing only; no image loaded or reopened.',
  projection: links.map(([target, destination]) => ({ path: path.relative(repo, destination), target: path.relative(repo, target) })),
})
const result = spawnSync('python3', argv, { cwd: repo, encoding: 'utf8' })
write(path.join(own, 'native-context-call.json'), {
  schema: 'ld-s10y-image/author-native-call@1', command: 'python3', argv, cwd: repo,
  script: bind(script), exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  invocationOrdinal: 1, status: result.status === 0 ? 'pass' : 'fail',
})
assert.equal(result.status, 0, result.stderr)
const native = JSON.parse(fs.readFileSync(nativePath, 'utf8'))
assert.equal(native.sourceImage.sha256, bindings.source.sha256)
assert.equal(native.lessons.length, 1)
assert.equal(native.lessons[0].lesson, lesson.id)
const context = {
  ...native,
  sourceImage: { ...native.sourceImage, path: bindings.source.path },
  nativeContext: bind(nativePath),
  frozenBindings: bindings,
  contextMethod: 'One native builder call over symlinked frozen inputs; augmented with the full current frozen lesson text, not merely its nearby excerpt.',
  lessons: [{
    ...native.lessons[0],
    fullProse: lesson.prose,
    authoritativeText: lesson.prose.filter(block => block.kind === 'p' && block.text.trim()).map(block => ({ lesson: lesson.id, text: block.text })),
  }],
}
write(path.join(own, 'context.json'), context)
write(path.join(own, 'authority-bindings.json'), {
  schema: 'ld-s10y-image/author-authority-bindings@1',
  status: 'pass', bindings, native: bind(nativePath), currentFullTextContext: bind(path.join(own, 'context.json')),
  fullParagraphBlocks: context.lessons[0].authoritativeText.length,
  nativeBuilderInvocations: 1, originalImageReopens: 0,
})
console.log(JSON.stringify({ status: 'pass', nativeBuilderInvocations: 1, context: bind(path.join(own, 'context.json')), fullParagraphBlocks: context.lessons[0].authoritativeText.length }, null, 2))
