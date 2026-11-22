import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n29-draft-first-06')
const reportFile = path.join(own, 'report.json')
assert.equal(hash(reportFile), '3b8263a19425b41b4b7f1436f6b5efc2e902a8f42ece6c2018fc84b8a2daeb2b')
const report = read(reportFile)
assert.equal(report.status, 'FIRST_N29_SCOPED_RAW_ASSEMBLY_PASS')
const references = new Map()
function gather(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    assert.equal(hash(value.path), value.sha256, value.path)
    references.set(value.path, { path: value.path, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) gather(child)
}
gather(bind(reportFile))
gather(report)
const assemblyReceipt = read(report.nativeReceipt.path)
assert.equal(assemblyReceipt.cwd, repo)
assert.equal(assemblyReceipt.exitCode, 0)
gather(assemblyReceipt.streams)
gather(read(report.input.path))
for (const name of ['prepare-and-run-n29-scoped-first-06.mjs',
  'assemble-n29-scoped-first-06.py', 'retain-and-prepare-n29-first-06.mjs'])
  gather(bind(path.join(tmp, name)))
const receiptRoot = path.join(own, 'adapt-prepare-first')
fs.mkdirSync(receiptRoot)
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const argv = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
  '--book', '6-8g', '--root', path.join(own, 'artifacts'),
  '--work', path.join(own, 'work'), '--edition', 'modern-us-neutral',
  '--lesson', 'geo68-c2-s4-n29']
const startedAt = new Date().toISOString()
const result = spawnSync(command, argv, {
  cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
for (const name of ['stdout', 'stderr'])
  fs.writeFileSync(path.join(receiptRoot, name), result[name] ?? '', { flag: 'wx' })
const receiptFile = path.join(receiptRoot, 'execution.json')
save(receiptFile, {
  command, argv, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  streams: Object.fromEntries(['stdout', 'stderr'].map(name =>
    [name, bind(path.join(receiptRoot, name))])),
  nativeFirstAdaptPrepareOnly: true, published: false,
})
gather(bind(receiptFile))
gather(read(receiptFile).streams)
assert.equal(result.status, 0, result.stderr || result.stdout)
const lessonDirectory = path.join(own, 'artifacts/6-8g/editions/modern-us-neutral/lessons/geo68-c2-s4-n29')
const templates = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
  .map(name => bind(path.join(lessonDirectory, name)))
gather(templates)
const preparedFile = path.join(own, 'retained-and-prepared.json')
save(preparedFile, {
  status: 'N29_FIRST_RAW_ASSEMBLY_AND_ISOLATED_MODERN_PREPARATION',
  rawAssembly: bind(reportFile), prepareReceipt: bind(receiptFile), templates,
  counts: report.counts, modernTextFiguresAnswersPending: true,
  originalOpaqueMarkersAndDamagedLabelsPreserved: true,
  rawCanonicalLessonOrIndexChanged: false, sourceProducerReplays: 0,
  fullLessonApproved: false, parentImageLoads: 0, published: false,
})
gather(bind(preparedFile))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/assembly-and-prepare-first06',
  [...references.values()],
  [
    'evidence/stemrobin188-6g-source135136/affected-review04/retention.json',
    'evidence/stemrobin188-6g-source135136/affected-repair04/retention.json',
    'evidence/stemrobin188-6g-source137138/independent-first04/retention.json',
    'evidence/stemrobin188-6g-source137138/one-literal-repair05/retention.json',
    'evidence/stemrobin188-6g-n26/168137336-independent-review05/retention.json',
    'evidence/stemrobin188-6g-n26/335-source132134-affected03/retention.json',
  ],
  { status: 'N29_FIRST_RAW_ASSEMBLY_AND_ISOLATED_MODERN_PREPARATION',
    lesson: 'geo68-c2-s4-n29', rawProseBlocks: 23, rawExercises: 9,
    originalFigures: [187, 188, 189], rawAssembleCalls: 1, adaptPrepareCalls: 1,
    rawCanonicalLessonOrIndexChanged: false, localUnknownsPreserved: true,
    modernTextFiguresAnswersPending: true, sourceProducerReplays: 0 },
)
console.log(JSON.stringify({ prepared: bind(preparedFile), retained, templates }))
