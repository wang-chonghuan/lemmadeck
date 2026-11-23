import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const approvalFile = path.join(tmp, 'n30-errata-proposals-independent-review-18/approval.json')
assert.equal(hash(approvalFile), 'cc2e3c763aa6c8f253325d5b5dca1445b2db7a9383fefda6ea69a127a07fa1cf')
const approval = read(approvalFile)
assert.equal(approval.status, 'pass')
assert.equal(approval.approvedCorrections.length, 2)
const own = path.join(tmp, 'n30-errata-bound-working-18')
assert.ok(!fs.existsSync(own))
const initial = path.join(tmp, 'n30-draft-first-18/artifacts/6-8g')
const book = path.join(own, 'artifacts/6-8g')
const work = path.join(own, 'work')
const copied = []
function copy(from, relative) {
  const to = path.join(book, relative)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
  assert.equal(hash(from), hash(to))
  copied.push({ from: bind(from), to: bind(to) })
}
for (const page of fs.readdirSync(path.join(initial, 'pages')))
  copy(path.join(initial, `pages/${page}/page.json`), `pages/${page}/page.json`)
copy(path.join(initial, 'book.json'), 'book.json')
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  copy(path.join(initial, 'lessons/geo68-c2-s4-n30', name), `lessons/geo68-c2-s4-n30/${name}`)
for (const number of [190, 191, 192, 193])
  copy(path.join(initial, `figures/fig-${number}.png`), `figures/fig-${number}.png`)
const oldPage = path.join(tmp, 'source6g139140-author-first-04/artifacts/6-8g/pages/0139')
copy(path.join(oldPage, 'audit.json'), 'pages/0139/audit.json')
const currentPage = path.join(book, 'pages/0139/page.json')
const page = read(currentPage)
assert.deepEqual(page.meta.errata, [])
const original = structuredClone(page)
page.meta.errata = approval.approvedCorrections.map(({ id, block, original, reason }) =>
  ({ id, block, original, reason: `${reason} The preceding disclaimer is historical: these exact spans were subsequently approved by the independent source-bound review, approval SHA256 ${hash(approvalFile)}.` }))
const restored = structuredClone(page)
restored.meta.errata = []
assert.deepEqual(restored, original)
fs.writeFileSync(currentPage, JSON.stringify(page, null, 2) + '\n')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const refs = [bind(approvalFile)]
function run(name, argv) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `${name}.${kind}`)
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
    refs.push(bind(file))
  }
  const file = path.join(own, `${name}.execution.json`)
  save(file, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, streams })
  refs.push(bind(file))
  console.log(JSON.stringify({ stage: name, receipt: bind(file), exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr }))
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return bind(file)
}
const registration = run('metadata-only-registration', [python, '-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import blocks,p2c
old,out=map(Path,sys.argv[2:])
original=json.loads((old/"page.json").read_text())
candidate=json.loads((out/"page.json").read_text())
old_meta,old_blocks=blocks.parse((old/"page.md").read_text())
assert candidate["blocks"]==original["blocks"]
errors=p2c._validate_page_errata(candidate["meta"],candidate["blocks"],139)
assert not errors,errors
md=blocks.dump(candidate["meta"],candidate["blocks"],139)
new_meta,new_blocks=blocks.parse(md)
assert new_meta==candidate["meta"]
assert new_blocks==old_blocks
assert blocks.printed_lines(new_blocks)==blocks.printed_lines(old_blocks)==26
(out/"page.md").write_text(md)
print(json.dumps({"nativeErrataValidation":"PASS","parseDump":"PASS",
 "unchangedFaithfulBlocks":True,"printedLines":26,"nativeFinalizerReplays":0}))
`, path.join(repo, '.claude/skills/ld-s10y-lesson/tools'),
  oldPage, path.join(book, 'pages/0139')])
const prepare = run('affected-adapt-prepare', [python, '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
  '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', 'geo68-c2-s4-n30',
  '--root', path.join(own, 'artifacts'), '--work', work])
const template = path.join(work, 'adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30')
const native = read(path.join(template, 'lesson.template.json'))
assert.equal(native.errata.length, 2)
const previewFile = path.join(tmp, 'n30-proposed-math-preview-18/lesson.template.json')
const preview = read(previewFile)
assert.deepEqual(preview.source, native.source)
preview.errata = native.errata.map(item => {
  const approved = approval.approvedCorrections.find(candidate => candidate.id === item.id)
  assert.ok(approved)
  assert.equal(item.original, approved.original)
  assert.equal(item.source.block, approved.block)
  assert.equal(item.source.sha256, hash(currentPage))
  return { ...item, corrected: approved.corrected }
})
const preparedSnapshot = path.join(own, 'lesson.native-prepared-with-bound-errata.json')
fs.copyFileSync(path.join(template, 'lesson.template.json'), preparedSnapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(preparedSnapshot, 0o444)
fs.writeFileSync(path.join(template, 'lesson.template.json'), JSON.stringify(preview, null, 2) + '\n')
const exerciseFile = path.join(tmp, 'n30-text-author-first-18/exercises.template.json')
assert.deepEqual(read(exerciseFile).source, read(path.join(template, 'exercises.template.json')).source)
fs.copyFileSync(exerciseFile, path.join(template, 'exercises.template.json'))
save(path.join(own, 'registration-and-binding.json'), {
  status: 'TWO_APPROVED_ERRATA_NATIVE_REGISTERED_AND_BOUND_TEXT_REVIEW_PENDING',
  approval: bind(approvalFile), registration, affectedPrepare: prepare,
  source139: bind(currentPage), unchangedSourceAudit: bind(path.join(book, 'pages/0139/audit.json')),
  preparedSnapshot: bind(preparedSnapshot), candidateLesson: bind(path.join(template, 'lesson.template.json')),
  candidateExercises: bind(path.join(template, 'exercises.template.json')),
  candidateProseBytesEqualApprovedPreview: preview.prose.every((item, index) =>
    JSON.stringify(item) === JSON.stringify(read(previewFile).prose[index])),
  copied, copyBindingsArePreRegistrationHistory: true,
  sourceTextRevisions: 0, sourceMetadataRevisions: 1,
  approvedFormulaCorrections: 2, originalSourceAndFIRSTUnchanged: true,
  sourceFinalizerOrAssemblyReplays: 0, images: 0, published: false,
})
refs.push(...copied.flatMap(item => [item.from, bind(item.to.path)]),
  bind(path.join(book, 'pages/0139/page.md')), bind(currentPage), bind(preparedSnapshot),
  ...['lesson.template.json', 'exercises.template.json', 'figures.template.json']
    .map(name => bind(path.join(template, name))),
  bind(path.join(own, 'registration-and-binding.json')),
  bind(path.join(tmp, 'register-prepare-n30-errata-18.mjs')),
  bind(previewFile), bind(path.join(tmp, 'n30-proposed-math-preview-18/context.json')),
  bind(path.join(tmp, 'prepare-n30-math-candidate-18.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/errata-registration-and-binding18', refs,
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json',
    'evidence/stemrobin188-6g-n30/text-author-first18/retention.json',
    'evidence/stemrobin188-6g-n30/errata-proposals-independent18/retention.json'],
  {
    status: 'APPROVED_ERRATA_NATIVE_REGISTERED_AND_BOUND_TEXT_REVIEW_PENDING',
    sourceMetadataRevisions: 1, sourceTextRevisions: 0, formulaCorrections: 2,
    nativeRegistrationCalls: 1, affectedPrepareCalls: 1,
    sourceFinalizerOrAssemblyReplays: 0,
  },
)))
