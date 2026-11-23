import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const delivery = read(path.join(tmp, 'batch-06-delivery.json'))
assert.equal(delivery.completeOfflineLessons.length, 4)
assert.equal(delivery.finish, 'review')
const own = path.join(tmp, 'n30-draft-first-18')
assert.ok(!fs.existsSync(own))
const book = path.join(own, 'artifacts/6-8g')
fs.mkdirSync(book, { recursive: true })
const copied = []
function copy(source, relative) {
  const output = path.join(book, relative)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(output), hash(source))
  copied.push({ source: bind(source), output: bind(output) })
}
const reports = [
  ['source137138-answer339-independent-review-04/report.json', '1a83907e22d316891082829cabae151c01594ef93397420aa832e445f7e10f18'],
  ['source139140-answer338-independent-review-05/report.json', 'db4993ed051b9147c484350d675642f096ce7f4d6ebe1c702318920782ece154'],
  ['source141142-answer338-affected-independent-review-06/report.json', '645dde879b640d7cb5ebbb1e6e9b46018fea5967c1b920379b43f020b9cab12c'],
].map(([relative, expected]) => {
  const file = path.join(tmp, relative)
  assert.equal(hash(file), expected)
  return bind(file)
})
const pageBindings = [
  [138, read(reports[0].path).SOURCE.currentbindings.page138],
  [139, read(reports[1].path).verdicts.SOURCE139140.candidate_bindings.page139],
  [140, read(reports[1].path).verdicts.SOURCE139140.candidate_bindings.page140],
  [141, read(reports[2].path).verdicts.SOURCE141142.candidate_bindings.page141],
  [142, read(reports[2].path).verdicts.SOURCE141142.candidate_bindings.page142],
]
for (const [, item] of pageBindings)
  assert.equal(hash(path.join(item.directory, 'page.json')), item['page.json'])
copy(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0068/page.json'),
  'pages/0068/page.json')
copy(path.join(tmp, 'source132-affected-working-03/artifacts/6-8g/pages/0132/page.json'),
  'pages/0132/page.json')
for (const [page, root] of [
  [138, 'source6g137138-author-first-04'],
  [139, 'source6g139140-author-first-04'], [140, 'source6g139140-author-first-04'],
  [141, 'source6g141142-author-first-05'], [142, 'source6g141142-author-first-05'],
]) copy(path.join(tmp, root, `artifacts/6-8g/pages/0${page}/page.json`),
  `pages/0${page}/page.json`)
for (const [number, page, root] of [
  [190, 138, 'source6g137138-author-first-04'],
  [191, 139, 'source6g139140-author-first-04'],
  [192, 140, 'source6g139140-author-first-04'],
  [193, 140, 'source6g139140-author-first-04'],
]) copy(path.join(tmp, root, `work/6-8g/pages/0${page}/figures/fig-${number}.png`),
  `figures/fig-${number}.png`)
const cropBindings = [
  ...read(path.join(tmp, 'source137138-answer339-independent-review-04/SOURCE-detail-supplement.json'))
    .crops.filter(item => item.figure === '190'),
  ...read(reports[1].path).verdicts.SOURCE139140.native_crops,
]
for (const item of cropBindings) assert.equal(hash(item.path), item.sha256)
save(path.join(own, 'staging.json'), {
  status: 'N30_FIRST_SCOPED_APPROVED_READABLE_SOURCE_STAGED', copied, reports,
  left: 'p0138#4', rightExclusive: 'p0142#7',
  localSourceUnknownsPreserved: true, sourceReviewsReplayed: false,
  knownMathIssue: 'Source139 literally uses capital C as a radius; source-fidelity PASS is not mathematical correction approval.',
  parentImageLoads: 0, published: false,
})
const refs = [bind(path.join(own, 'staging.json')), ...reports, ...copied.flatMap(item => [item.source, item.output])]
function run(name, argv) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
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
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const assembly = run('first-assembly', [python, '-B', '-c', String.raw`
import json,sys
from pathlib import Path
repo,book,work=map(Path,sys.argv[1:])
assert Path.cwd()==repo
sys.path.insert(0,str(repo/".claude/skills/ld-s10y-lesson/tools"))
import assemble
stream=assemble.load_stream(book);refs={b["ref"]:b for b in stream}
left,right="p0138#4","p0142#7"
assert "".join(refs[left]["lines"])=="30. 作图问题"
assert refs[left]["kind"]=="h3" and refs[right]["kind"]=="exhead"
assert "".join(refs[right]["lines"])=="第二章补充习题"
start=next(i for i,b in enumerate(stream) if b["ref"]==left)
end=next(i for i,b in enumerate(stream) if b["ref"]==right)
selected=stream[start:end]
assert [b["ref"] for b in selected if b["kind"]=="h3"]==[left]
assert not any(b["kind"] in ("h1","h2") for b in selected)
status=assemble.run(book,repo/"ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
 repo/".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",strict=True,
 work=work,exercise_numbering="book",stream=[refs["p0068#1"],refs["p0132#6"],*selected])
if status==0:
 index=json.loads((book/"book.json").read_text())
 assert [r["id"] for r in index["lessons"]]==["geo68-c2-s4-n30"]
 ex=json.loads((book/"lessons/geo68-c2-s4-n30/exercises.json").read_text())
 assert [r["number"] for r in ex["exercises"]]==[str(n) for n in range(373,381)]
 assert len(json.loads((book/"lessons/geo68-c2-s4-n30/lesson.json").read_text())["figures"])==4
sys.exit(status)
`, repo, book, path.join(own, 'work/6-8g')])
const prepare = run('first-adapt-prepare', [python, '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare', '--book', '6-8g',
  '--root', path.join(own, 'artifacts'), '--work', path.join(own, 'work'),
  '--edition', 'modern-us-neutral', '--lesson', 'geo68-c2-s4-n30'])
const raw = path.join(book, 'lessons/geo68-c2-s4-n30')
const templates = path.join(own, 'work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30')
const outputs = [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(path.join(raw, name))),
  ...['lesson.template.json', 'exercises.template.json', 'figures.template.json']
    .map(name => bind(path.join(templates, name))),
]
const record = {
  status: 'N30_FIRST_SCOPED_RAW_ASSEMBLY_AND_ADAPT_PREPARE_PASS_AUTHORING_PENDING',
  lesson: 'geo68-c2-s4-n30', assembly, prepare, outputs,
  prose: read(path.join(raw, 'lesson.json')).prose.length, exercises: 8, figures: 4,
  knownMathIssue: read(path.join(own, 'staging.json')).knownMathIssue,
  originalSourceAndHoldsUnchanged: true, parentImageLoads: 0, published: false,
}
save(path.join(own, 'record.json'), record)
refs.push(...outputs, bind(path.join(own, 'record.json')), bind(path.join(tmp, 'prepare-run-n30-scoped-first-18.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/assembly-and-prepare-first18', refs, [
    'evidence/stemrobin188-6g-source137138/independent-first04/retention.json',
    'evidence/stemrobin188-6g-source139140/independent-first05/retention.json',
    'evidence/stemrobin188-6g-source141142/independent-first06/retention.json',
  ], record)))
