import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const anchorResume = process.argv[2] === '--anchor-resume'
const anchorReview = anchorResume ? bind(path.resolve(process.argv[3])) : null
if (anchorResume) {
  assert.equal(anchorReview.sha256, process.argv[4])
  const verdict = read(anchorReview.path)
  assert((verdict.verdict || verdict.status).startsWith('PASS'))
}
const own = path.join(tmp, 'appendix-s4-finish-01')
const current = path.join(tmp, 'appendix-s4-source-repair-02')
const lesson = 'geo910-appendix-s4'
const id = 'fig-g10-171'
const canonicalEdition = path.join(core, 'editions/modern-us-neutral')
const scopedEdition = path.join(current, 'artifacts/9-10g/editions/modern-us-neutral')
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const failedPath = path.join(own, 'receipts/adapt-finalize-native.command.json')
const failed = read(failedPath)
assert.equal(failed.exitCode, 1)
assert.equal(failed.exception.message, '教学脚注 owner-ex 无法唯一绑定已出现的原题')
assert(!fs.existsSync(path.join(own, 'finish.json')))
assert(!fs.existsSync(path.join(canonicalEdition, `lessons/${lesson}/lesson.json`)))
if (!anchorResume) assert(!fs.existsSync(path.join(scopedEdition, `lessons/${lesson}/lesson.json`)))
const previousIDs = read(path.join(own, 'source-index-before.json')).lessons.map(row => row.card_id || row.id)
assert.deepEqual(read(path.join(core, 'book.json')).lessons
  .map(row => row.card_id || row.id).filter(value => value !== lesson), previousIDs)
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  assert(!fs.existsSync(to), to)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
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
  assert.equal(result.status, 0, `Stop at ${name}, preserve its failure`)
  return bind(receipt)
}
if (!anchorResume) {
  for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
    const asset = path.join(canonicalEdition, `figures/${id}.${suffix}`)
    copy(asset, path.join(scopedEdition, `figures/${id}.${suffix}`))
  }
} else {
  assert.equal(hash(path.join(current, 'work/adapt/9-10g/modern-us-neutral/lessons/geo910-appendix-s4/lesson.template.json')),
    '348e81a2b70ccd60bf9a2c4da797b18335e846a5141cc58ff0d9ecb9338fd9e4')
  assert.equal(read(path.join(own, 'receipts/adapt-finalize-scoped-native.command.json')).exitCode, 2)
}
const figureReview = read(path.join(canonicalEdition, `figures/${id}.review.json`))
assert.equal(figureReview.status, 'pass')
assert.equal(figureReview.spec.sha256, hash(path.join(canonicalEdition, `figures/${id}.spec.json`)))
assert.equal(figureReview.render.sha256, hash(path.join(canonicalEdition, `figures/${id}.render.json`)))
assert.equal(figureReview.outputs.svg.sha256, hash(path.join(canonicalEdition, `figures/${id}.svg`)))
const nativePath = path.join(own, `receipts/${anchorResume ? 'adapt-finalize-anchor-native' : 'adapt-finalize-scoped-native'}.command.json`)
let finalized
if (anchorResume && fs.existsSync(nativePath)) {
  assert.equal(hash(nativePath), 'a49c80f3e6a857c54534db5a8c01f0454690574f8e160230bead84792d8ecc5e')
  finalized = bind(nativePath)
} else {
  finalized = run(anchorResume ? 'adapt-finalize-anchor-adapter' : 'adapt-finalize-scoped-adapter', command, [
    path.join(tmp, 'finalize-appendix-s4-once.py'), anchorResume ? '--anchor-resume' : '--scoped-resume',
  ])
}
const native = read(nativePath)
assert.equal(native.exitCode, 0)
assert(native.nestedRequests.every(request => request.allowed))
assert(native.nestedCompleted.every(result => result.exitCode === 0 && result.cwd === repo && result.capturedStreams))
const outputs = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
for (const name of outputs) {
  copy(path.join(scopedEdition, `lessons/${lesson}/${name}`), path.join(canonicalEdition, `lessons/${lesson}/${name}`))
}
const indexCode = `
import json,pathlib,sys
sys.path.insert(0,sys.argv[1])
import edition
core=pathlib.Path(sys.argv[2]);scoped=pathlib.Path(sys.argv[3])
rows=json.loads((scoped/'book.json').read_text())['lessons']
assert len(rows)==1 and rows[0]['id']=='geo910-appendix-s4'
edition.update_book_index(core,core/'editions/modern-us-neutral',pathlib.Path(sys.argv[4]),rows)
print(json.dumps({'rowsAdded':1,'copiedNativeReadyDocuments':4,'sourceRevalidation':False}))
`
const index = run('edition-index-ready-output-attachment', command, [
  '-B', '-c', indexCode, path.join(repo, '.claude/skills/ld-s10y-lesson/tools'),
  core, scopedEdition, path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
])
const rendered = run('render', 'node', [
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', core,
  '--edition', 'modern-us-neutral', '--lesson', lesson,
  '--out', path.join(current, 'work/render/9-10g/modern-us-neutral'),
])
save(path.join(own, 'finish.json'), {
  status: 'S4_SCOPED_NATIVE_FINALIZED_RENDERED_DISPLAY_PENDING', lesson,
  canonicalFinalizeFailure: bind(failedPath),
  failureDiagnosis: 'Whole canonical page stream has unresolved teaching-footnote owner-ex; no S4 content verdict',
  scopedAuthority: {
    root: path.join(current, 'artifacts/9-10g'),
    rawLesson: bind(path.join(current, `artifacts/9-10g/lessons/${lesson}/lesson.json`)),
    source308: bind(path.join(current, 'artifacts/9-10g/pages/0308/page.json')),
    source309: bind(path.join(current, 'artifacts/9-10g/pages/0309/page.json')),
    sourceRefresh: bind(path.join(current, 'source-refresh.json')),
  },
  rawSourceIndex: bind(path.join(own, 'receipts/source-reindex.command.json')),
  nativeFigureRecord: bind(path.join(own, 'receipts/figure-record-review.command.json')),
  sourceReviewReuse: [
    bind(path.join(tmp, 'source309310-review-01/source-review.json')),
    bind(path.join(tmp, 'source307308-scoped-affected-review-02/affected-review.json')),
  ],
  textReview: bind(path.join(tmp, 'appendix-s4-text-review-01/text-review.json')),
  anchorAffectedReview: anchorReview,
  anchorRepair: anchorResume ? bind(path.join(tmp, 'appendix-s4-anchor-repair-02/repair.json')) : null,
  originalAnchorFailure: anchorResume ? bind(path.join(own, 'receipts/adapt-finalize-scoped-native.command.json')) : null,
  figureIndependentReview: bind(path.join(tmp, 'appendix-s4-figure171-review-01/figure-review.json')),
  finalized, nativeReceipt: bind(nativePath), index, rendered,
  outputs: outputs.map(name => bind(path.join(canonicalEdition, `lessons/${lesson}/${name}`))),
  assets: ['spec.json', 'svg', 'render.json', 'review.json'].map(suffix =>
    bind(path.join(canonicalEdition, `figures/${id}.${suffix}`))),
  sourceFinalizerReplays: 0, sourceVectorizationReplays: 0,
  nativeFigureRenderReplays: 0, figureRecordReplays: 0,
  nativeFinalizeCalls: anchorResume ? 3 : 2,
  anchorRepairs: anchorResume ? 1 : 0,
  geometryChanges: 0, metadataPathRebindingOnly: true, images: 0, parentPermanentImages: 24,
  canonicalCombinedSourceRebuildStillBlocked: true,
  wholeLessonDelivered: false, published: false, sharedSkillsChanged: false,
})
fs.chmodSync(path.join(own, 'finish.json'), 0o444)
console.log(JSON.stringify({ finish: bind(path.join(own, 'finish.json')) }))
