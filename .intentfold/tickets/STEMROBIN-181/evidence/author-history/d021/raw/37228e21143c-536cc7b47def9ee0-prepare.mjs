import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const snapshot = (file, relative) => {
  const output = path.join(own, 'inputs', relative)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(file, output, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(output), hash(file))
  return { original: bind(file), snapshot: bind(output) }
}
const freezePaths = {
  n80: ['.intentfold/tickets/STEMROBIN-181/tmp/9p-n80-prose-correction-freeze.json', 'edbeccb09dac97d5fc0199d7e849d67198918a436c953f3cfb4854aee65cc0d2'],
  n83: ['.intentfold/tickets/STEMROBIN-181/tmp/9p-n83-prose-freeze.json', '1ccf532e129309a778267470bbbab5132a737bd8d8357f2d9c2fa2ffbd4840b0'],
}
const authority = {}
for (const [key, [relative, expected]] of Object.entries(freezePaths)) {
  const freezeFile = path.join(repo, relative)
  assert.equal(hash(freezeFile), expected, `${key} author freeze changed`)
  const freeze = read(freezeFile)
  const entry = key === 'n80'
    ? freeze.bindings.lessonTemplate
    : freeze.templates.find(item => item.active.path.endsWith('/lesson.template.json')).snapshot
  const template = key === 'n80'
    ? path.join(repo, entry.path)
    : path.join(repo, `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-${key}/lesson.template.json`)
  const authorBound = path.isAbsolute(entry.path) ? entry.path : path.join(repo, entry.path)
  assert.equal(hash(authorBound), entry.sha256, `${key} bound lesson bytes changed`)
  const active = read(template)
  const bound = read(authorBound)
  assert.deepEqual(active.prose, bound.prose, `${key} active prose differs from required author freeze`)
  const lesson = snapshot(authorBound, `${key}/lesson.template.json`)
  const exercisesFile = path.join(path.dirname(template), 'exercises.template.json')
  const exercises = snapshot(exercisesFile, `${key}/exercises.template.json`)
  assert.deepEqual(read(exercisesFile).exercises, [])
  authority[key] = {
    lesson: bound.id,
    activeAtAuthorStart: bind(template),
    proseFreeze: snapshot(freezeFile, `${key}/prose-freeze.json`),
    authorBoundTemplate: lesson,
    exercises,
    fullProse: bound.prose,
    authoritativeText: bound.prose.filter(block => block.kind === 'p' && block.text.trim()).map(block => ({ lesson: bound.id, text: block.text })),
    metadataCanChangeWithoutChangingProse: key === 'n80',
  }
}
const sources = {}
for (const id of ['fig-158', 'fig-159']) {
  sources[id] = snapshot(path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`), `sources/${id}.png`)
}
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.tmp/STEMROBIN-181/9p-d020-n81-fig152/native-author-run.mjs',
  '.tmp/STEMROBIN-181/9p-d020-n81-fig152/width-previews.mjs',
  '.tmp/STEMROBIN-181/9p-d020-n81-fig152/freeze-author.mjs',
]
const tools = contracts.map(relative => snapshot(path.join(repo, relative), `tools/${relative}`))
const projection = path.join(own, 'native-input')
const book = path.join(projection, '9p')
fs.mkdirSync(path.join(book, 'figures'), { recursive: true })
for (const [id, source] of Object.entries(sources)) {
  fs.symlinkSync(path.join(repo, source.snapshot.path), path.join(book, `figures/${id}.png`))
}
for (const context of Object.values(authority)) {
  const directory = path.join(book, `editions/modern-us-neutral/lessons/${context.lesson}`)
  fs.mkdirSync(directory, { recursive: true })
  fs.symlinkSync(path.join(repo, context.authorBoundTemplate.snapshot.path), path.join(directory, 'lesson.json'))
  fs.symlinkSync(path.join(repo, context.exercises.snapshot.path), path.join(directory, 'exercises.json'))
}
const builder = path.join(repo, '.agents/skills/ld-s10y-image/scripts/build_context.py')
for (const id of ['fig-158', 'fig-159']) {
  const output = path.join(own, id, 'context.native.json')
  fs.mkdirSync(path.dirname(output), { recursive: true })
  const argv = [builder, '--book', '9p', '--edition', 'modern-us-neutral', '--figure', id, '--root', projection, '--output', output]
  const result = spawnSync('python3', argv, { cwd: repo, encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' } })
  write(path.join(own, id, 'context-call.json'), { command: 'python3', argv, script: bind(builder), exitCode: result.status, stdout: result.stdout, stderr: result.stderr, status: result.status === 0 ? 'pass' : 'fail', invocations: 1 })
  assert.equal(result.status, 0, result.stderr)
  const native = read(output)
  assert.equal(native.sourceImage.sha256, sources[id].snapshot.sha256)
  const contexts = id === 'fig-158' ? [authority.n80, authority.n83] : [authority.n83]
  write(path.join(own, id, 'context.json'), {
    ...native,
    sourceImage: { ...native.sourceImage, path: sources[id].snapshot.path },
    originalSource: sources[id].original,
    nativeContext: bind(output),
    contextMethod: 'One unmodified native context builder per figure over exact frozen scratch inputs, augmented with ALL author-bound modern paragraph blocks. n80 is added explicitly because shared-display metadata is not yet present; no template was modified.',
    lessons: contexts.map(context => ({ lesson: context.lesson, fullProse: context.fullProse, authoritativeText: context.authoritativeText, binding: context.authorBoundTemplate.snapshot })),
    authoritativeText: contexts.flatMap(context => context.authoritativeText),
    futureTextChangesRequireNewContextReview: true,
  })
}
write(path.join(own, 'authority-bindings.json'), {
  schema: 'ld-s10y-image/author-authority-bindings@1', status: 'pass',
  authority, sources, tools,
  inventory: bind(path.join(own, 'source-inventory.json')),
  contextBuilderCalls: 2,
  independentScienceStatus: 'Not assessed by author; n83 SCI was in flight at delegation.',
  initialFreezeForN80WasNotUsed: true,
  noOriginalImageReopens: true,
})
console.log(JSON.stringify({ status: 'pass', contexts: { 'fig-158': [authority.n80.authoritativeText.length, authority.n83.authoritativeText.length], 'fig-159': authority.n83.authoritativeText.length }, authority: bind(path.join(own, 'authority-bindings.json')) }))
