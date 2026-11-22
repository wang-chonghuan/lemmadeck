import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const admission = read(process.argv[2])
assert.equal(admission.status, 'PASS_S4_FIGURE171_ONLY')
assert.equal(hash(admission.review.path), admission.review.sha256)
const current = path.join(tmp, 'appendix-s4-source-repair-02')
const figureRoot = path.join(tmp, 'appendix-s4-figure171-author-01/candidate-02')
const lesson = 'geo910-appendix-s4'
const id = 'fig-g10-171'
const edition = path.join(core, 'editions/modern-us-neutral')
const workLesson = path.join(current, `work/adapt/9-10g/modern-us-neutral/lessons/${lesson}`)
const template = path.join(workLesson, 'lesson.template.json')
assert.equal(hash(template), '9c5b2560546198b86ac2b8e76e37807610af00ffdf5a194560e92eb47d00fbe4')
const textReview = path.join(tmp, 'appendix-s4-text-review-01/text-review.json')
assert.equal(hash(textReview), 'f506ba846a8ce04a624689f28c3f1c042a06c1a5a97bfc257f002ae924aa7fa6')
assert.equal(read(textReview).verdict, 'PASS')
const specPath = path.join(figureRoot, 'spec.json')
const svgPath = path.join(figureRoot, `${id}.svg`)
const renderPath = path.join(figureRoot, `${id}.render.json`)
assert.equal(hash(specPath), 'aa8ad80e3e070d2f168b218e568a20221c45024809b4fbfb002c86bf2c218d50')
assert.equal(hash(svgPath), '31ff8269e9ee7ba918b285f51fe672a749dbfcdf3a0971c6534edc550aed7226')
assert.equal(hash(renderPath), 'efd3b41ebab43a1fd7edd23b05e50ec7c22c044145b769be8309f9ba21f3f2fd')
assert.equal(read(renderPath).status, 'pass')
const own = path.join(tmp, 'appendix-s4-finish-01')
assert(!fs.existsSync(own))
assert(!fs.existsSync(path.join(core, 'lessons', lesson)))
assert(!fs.existsSync(path.join(edition, 'lessons', lesson)))
for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
  assert(!fs.existsSync(path.join(edition, `figures/${id}.${suffix}`)))
}
fs.mkdirSync(path.join(own, 'receipts'), { recursive: true })
const copies = []
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  copies.push({ from: bind(from), to: bind(to) })
}
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const run = (name, executable, args) => {
  const result = spawnSync(executable, args, {
    cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '0' },
  })
  const stdout = path.join(own, `receipts/${name}.stdout`)
  const stderr = path.join(own, `receipts/${name}.stderr`)
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
  const receipt = path.join(own, `receipts/${name}.command.json`)
  save(receipt, {
    command: executable, args, cwd: repo, exitCode: result.status,
    streams: { stdout: bind(stdout), stderr: bind(stderr) }, error: result.error?.message || null,
  })
  for (const file of [stdout, stderr, receipt]) fs.chmodSync(file, 0o444)
  assert.equal(result.status, 0, `Stop at ${name}; preserve its actual failure`)
  return bind(receipt)
}
copy(path.join(core, 'book.json'), path.join(own, 'source-index-before.json'))
copy(path.join(edition, 'book.json'), path.join(own, 'edition-index-before.json'))
const previousIDs = read(path.join(core, 'book.json')).lessons.map(row => row.card_id || row.id)
for (const page of ['0308', '0309']) {
  for (const name of ['page.json', 'page.md']) {
    copy(path.join(current, `artifacts/9-10g/pages/${page}/${name}`), path.join(core, `pages/${page}/${name}`))
  }
}
for (const [page, author] of [['0308', 'source308-author'], ['0309', 'source309-author']]) {
  copy(path.join(tmp, `${author}/artifacts/9-10g/pages/${page}/audit.json`), path.join(core, `pages/${page}/audit.json`))
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  copy(path.join(current, `artifacts/9-10g/lessons/${lesson}/${name}`), path.join(core, `lessons/${lesson}/${name}`))
}
for (const suffix of ['png', 'svg']) {
  copy(path.join(current, `artifacts/9-10g/figures/${id}.${suffix}`), path.join(core, `figures/${id}.${suffix}`))
}
const sourceIndex = run('source-reindex', command, [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '9-10g',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json',
])
const nextIDs = read(path.join(core, 'book.json')).lessons.map(row => row.card_id || row.id)
assert.deepEqual(nextIDs.filter(value => value !== lesson), previousIDs)
assert.equal(nextIDs.filter(value => value === lesson).length, 1)
copy(admission.review.path, path.join(own, 'independent-figure-review.json'))
copy(specPath, path.join(own, 'original-reviewed.spec.json'))
copy(renderPath, path.join(own, 'original-reviewed.render.json'))
const spec = read(specPath)
spec.source.image.path = path.relative(repo, path.join(core, `figures/${id}.png`))
assert.equal(spec.source.image.sha256, hash(path.join(core, `figures/${id}.png`)))
const restoredSpec = structuredClone(spec)
restoredSpec.source.image.path = read(specPath).source.image.path
assert.deepEqual(restoredSpec, read(specPath))
const targetSpec = path.join(edition, `figures/${id}.spec.json`)
save(targetSpec, spec)
copy(svgPath, path.join(edition, `figures/${id}.svg`))
const render = read(renderPath)
render.spec = { path: path.relative(repo, targetSpec), sha256: hash(targetSpec) }
render.output.svg.path = path.relative(repo, path.join(edition, `figures/${id}.svg`))
const restoredRender = structuredClone(render)
restoredRender.spec = read(renderPath).spec
restoredRender.output.svg.path = read(renderPath).output.svg.path
assert.deepEqual(restoredRender, read(renderPath))
const targetRender = path.join(edition, `figures/${id}.render.json`)
assert(!JSON.stringify(spec).includes('.intentfold/'))
assert(!JSON.stringify(render).includes('.intentfold/'))
assert(!JSON.stringify(render).includes('.tmp/'))
save(targetRender, render)
const targetReview = path.join(edition, `figures/${id}.review.json`)
const figureRecord = run('figure-record-review', command, [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', targetSpec, '--render', targetRender, '--output', targetReview,
  '--status', 'pass', '--notes',
  `Independent source, mathematical and visual PASS: ${admission.review.path} SHA256 ${admission.review.sha256}. Only source/spec/output metadata paths rebound to durable files; source image, authoritative text, geometry, SVG and declared displays unchanged. Original render failure and one label repair preserved.`,
])
const figuresTemplatePath = path.join(workLesson, 'figures.template.json')
copy(figuresTemplatePath, path.join(own, 'figures.template.before.json'))
const figuresTemplate = read(figuresTemplatePath)
assert.equal(figuresTemplate.figures.length, 1)
const entry = figuresTemplate.figures[0]
assert.equal(entry.id, id)
for (const field of ['png', 'artwork', 'generation']) delete entry[field]
for (const [field, suffix] of [['spec', 'spec.json'], ['svg', 'svg'], ['render', 'render.json'], ['review', 'review.json']]) {
  entry[field] = `figures/${id}.${suffix}`
}
fs.writeFileSync(figuresTemplatePath, JSON.stringify(figuresTemplate, null, 2) + '\n')
const finalized = run('adapt-finalize-adapter', command, [
  path.join(tmp, 'finalize-appendix-s4-once.py'),
])
const native = read(path.join(own, 'receipts/adapt-finalize-native.command.json'))
assert.equal(native.exitCode, 0)
assert(native.nestedRequests.every(request => request.allowed))
assert(native.nestedCompleted.every(result => result.exitCode === 0 && result.cwd === repo && result.capturedStreams))
const rendered = run('render', 'node', [
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', core,
  '--edition', 'modern-us-neutral', '--lesson', lesson,
  '--out', path.join(current, 'work/render/9-10g/modern-us-neutral'),
])
save(path.join(own, 'finish.json'), {
  status: 'S4_NATIVE_FINALIZED_RENDERED_DISPLAY_PENDING', lesson,
  sourceReviewReuse: [
    bind(path.join(tmp, 'source309310-review-01/source-review.json')),
    bind(path.join(tmp, 'source307308-scoped-affected-review-02/affected-review.json')),
  ],
  textReview: bind(textReview), figureIndependentReview: admission.review,
  copies, sourceIndex, figureRecord, finalized, rendered,
  nativeReceipt: bind(path.join(own, 'receipts/adapt-finalize-native.command.json')),
  assets: [targetSpec, path.join(edition, `figures/${id}.svg`), targetRender, targetReview].map(bind),
  outputs: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name =>
    bind(path.join(edition, `lessons/${lesson}/${name}`))),
  sourceFinalizerReplays: 0, rendererReplays: 0, geometryChanges: 0,
  sourceNativeAuditsReused: '309 unchanged; 308 original line audit plus accepted affected-only repair, not a new finalization',
  metadataPathsReboundOnly: true, images: 0, parentPermanentImages: 24,
  repairsReset: false, wholeLessonDelivered: false, published: false,
})
console.log(JSON.stringify({ finish: bind(path.join(own, 'finish.json')) }))
