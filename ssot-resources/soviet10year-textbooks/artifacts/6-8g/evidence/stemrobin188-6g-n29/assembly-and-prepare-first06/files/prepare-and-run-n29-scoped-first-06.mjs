import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g')
const own = path.join(tmp, 'n29-draft-first-06')
assert.ok(!fs.existsSync(own))
const book = path.join(own, 'artifacts/6-8g')
const source135136File = path.join(tmp, 'source135136-affected-review-04/report.json')
assert.equal(hash(source135136File), 'c32b743807fa4c02899f988c8f07975a1ad68a2fc430aa51f91b62d94a670a67')
const source135136 = read(source135136File)
assert.equal(source135136.status, 'PASS_AFFECTED_ONLY')
assert.ok(source135136.affectedItems.every(item => item.verdict === 'PASS'))
const source137138File = path.join(tmp, 'source137138-answer339-independent-review-04/report.json')
assert.equal(hash(source137138File), '1a83907e22d316891082829cabae151c01594ef93397420aa832e445f7e10f18')
const source137138 = read(source137138File).SOURCE
assert.equal(source137138.perpage[1].verdict, 'PASS_SCOPED_SOURCE_WITH_LOCAL_UNCERTAINTIES')
const source137AffectedFile = path.join(tmp, 'n26-fig168-answer338-and137336-affected-review-05/report.json')
assert.equal(hash(source137AffectedFile), '5e3e09197d4f421b89f3e4bd49f9834a032e19dbb185f30dc0dd1fa3a90ed670')
const source137 = read(source137AffectedFile).verdicts.source137_ex368_2
assert.equal(source137.verdict, 'PASS_AFFECTED')
const sectionFile = path.join(tmp, 'source132-affected-working-03/artifacts/6-8g/pages/0132/page.json')
assert.equal(hash(sectionFile), 'c918438573f62772bc61dd6c49442ee4d8dee8d1aca13094f9f995fc0a1c1cf4')
const copied = []
fs.mkdirSync(book, { recursive: true })
function copy(item, relative) {
  assert.equal(hash(item.path), item.sha256, item.path)
  const to = path.join(book, relative)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(item.path, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(to), item.sha256)
  copied.push({ source: { path: item.path, sha256: item.sha256 }, output: bind(to) })
}
copy(bind(path.join(core, 'pages/0068/page.json')), 'pages/0068/page.json')
copy(bind(sectionFile), 'pages/0132/page.json')
const current135136 = read(source135136.evidence.bindings.path).entries
for (const page of [135, 136]) {
  const binding = current135136.find(item => item.role === `current-${page}-page.json`)
  assert.ok(binding)
  copy(binding, `pages/0${page}/page.json`)
}
const current137 = source137.currentCandidateBindings.find(item => item.path.endsWith('/page.json'))
copy(current137, 'pages/0137/page.json')
copy({
  path: path.join(source137138.currentbindings.page138.directory, 'page.json'),
  sha256: source137138.currentbindings.page138['page.json'],
}, 'pages/0138/page.json')
for (const number of [187, 188]) {
  const page = number === 187 ? 135 : 136
  const file = path.join(tmp, `source135136-affected-repair-04/work/6-8g/pages/0${page}/figures/fig-${number}.png`)
  const expected = source135136.reuseAndLimitations[`crop${number}`].sha256
  copy({ path: file, sha256: expected }, `figures/fig-${number}.png`)
}
copy(source137.sourcePixelsAnd189Crop[2].copy, 'figures/fig-189.png')
const receiptRoot = path.join(own, 'assemble-first')
fs.mkdirSync(receiptRoot)
save(path.join(receiptRoot, 'inputs.json'), {
  status: 'REUSE_SCOPED_APPROVED_READABLE_SOURCE_FOR_FIRST_N29_ASSEMBLY',
  inherited: [source135136File, source137138File, source137AffectedFile,
    path.join(tmp, 'n26-3351-source132134-affected-review-03/report.json')].map(bind),
  copied, left: { ref: 'p0135#4', literal: '29. 直线和圆周的相关位置' },
  right: { ref: 'p0138#4', literal: '30. 作图问题', excludedFromSelectedStream: true },
  section132UsedOnlyForObservedH2: true,
  sourceLocalUnknowns: [
    source135136.reuseAndLimitations.blackbars,
    source137.localUnknowns, source137138.perpage[1].local_unknowns,
  ],
  sourceAndCropsPASSReusedWithoutReopening: true,
  wholeSourcePagesOrModernLessonApprovalClaimed: false,
  parentImageLoads: 0, coreIndexRebuilt: false, published: false,
  parentReadOnlyDiagnostics: [
    { command: 'jq SOURCE projection on nonexistent source6g137138-independent-FIRST-04/report.json',
      exitCode: 2, resolution: 'Located authoritative source137138-answer339-independent-review-04/report.json.' },
    { command: "sed -n '35, ninety p' assemble.py",
      exitCode: 1, resolution: 'Corrected read-only line address to 35,95p; no producer replay.' },
  ],
})
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const argv = ['-B', path.join(tmp, 'assemble-n29-scoped-first-06.py')]
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
  firstN29Assembly: true, sourceAndFigureReviewsReplayed: false,
  localSourceUnknownsPreserved: true, coreIndexRebuilt: false, published: false,
})
assert.equal(result.status, 0, result.stderr || result.stdout)
const lesson = path.join(book, 'lessons/geo68-c2-s4-n29')
save(path.join(own, 'report.json'), {
  status: 'FIRST_N29_SCOPED_RAW_ASSEMBLY_PASS',
  book: '6-8g', lesson: 'geo68-c2-s4-n29',
  nativeReceipt: bind(receiptFile), input: bind(path.join(receiptRoot, 'inputs.json')),
  outputs: ['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(path.join(lesson, name))),
  counts: { prose: read(path.join(lesson, 'lesson.json')).prose.length,
    exercises: read(path.join(lesson, 'exercises.json')).count },
  left: 'p0135#4', endExclusive: 'p0138#4',
  localSourceUnknownsPreserved: true, N28AndN30NotAssembled: true,
  wholeModernLessonApproved: false, parentImageLoads: 0, published: false,
})
console.log(JSON.stringify({ report: bind(path.join(own, 'report.json')),
  receipt: bind(receiptFile) }))
