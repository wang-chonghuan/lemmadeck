import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n32-draft-first-10')
const book = path.join(own, 'artifacts/6-8g')
const lesson = 'geo68-c3-s1-n32'
const stage = process.argv[2]
assert.ok(['stage', 'run'].includes(stage))
if (stage === 'stage') {
  fs.mkdirSync(book, { recursive: true })
  assert.ok(!fs.existsSync(path.join(own, 'staging.json')))
  const copied = []
  const copy = (source, relative) => {
    const output = path.join(book, relative)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(source), hash(output))
    copied.push({ source: bind(source), output: bind(output) })
  }
  const sources = [
    [149, 'source6g149150-author-first-06'],
    [152, 'source6g151152-author-first-07'],
    [153, 'source6g153154-author-first-07'],
    [154, 'source6g153154-author-first-07'],
    [155, 'source155-footnote-owner-repair-09'],
  ]
  for (const [page, root] of sources) {
    const relative = `pages/${String(page).padStart(4, '0')}/page.json`
    copy(path.join(tmp, root, 'artifacts/6-8g', relative), relative)
  }
  for (const [figure, page, root] of [
    [204, 152, sources[1][1]], [205, 153, sources[2][1]],
    [206, 153, sources[2][1]], [207, 154, sources[3][1]], [208, 155, sources[4][1]],
  ]) copy(path.join(tmp, root, `work/6-8g/pages/${String(page).padStart(4, '0')}/figures/fig-${figure}.png`),
    `figures/fig-${figure}.png`)
  save(path.join(own, 'staging.json'), {
    status: 'N32_SCOPED_SOURCE_STAGED_METADATA_ADMISSION_PENDING', lesson, copied,
    left: 'p0152#7', rightExclusive: 'p0155#6', explicitOwnedFootnote: 'p0155#8 -> 438',
    priorReadableSource: [
      bind(path.join(tmp, 'source151154-independent-review-08/report.json')),
      bind(path.join(tmp, 'source155156-and151-affected-independent-review-09/report.json')),
    ],
    failedPage155StillFailed: true, allGlyphAndPrintingRoleHoldsPreserved: true,
    parentImageLoads: 0, published: false,
  })
  console.log(JSON.stringify({ staging: bind(path.join(own, 'staging.json')) }))
} else {
  const admissionFile = path.join(own, 'admission.json')
  const admission = read(admissionFile)
  assert.equal(admission.status, 'PASS_METADATA_ONLY_N32_SCOPED_ADMISSION')
  assert.equal(hash(admission.review.path), admission.review.sha256)
  const staged = read(path.join(own, 'staging.json'))
  for (const item of staged.copied) assert.equal(hash(item.output.path), item.output.sha256)
  const refs = [bind(admissionFile), bind(path.join(own, 'staging.json')), admission.review,
    ...staged.priorReadableSource, ...staged.copied.flatMap(item => [item.source, item.output])]
  const run = (name, argv) => {
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
    const receipt = path.join(own, `${name}.execution.json`)
    save(receipt, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, streams })
    refs.push(bind(receipt))
    console.log(JSON.stringify({ stage: name, exitCode: result.status, receipt: bind(receipt),
      stdout: result.stdout, stderr: result.stderr }))
    assert.equal(result.status, 0)
    return bind(receipt)
  }
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const code = String.raw`
import json,sys
from pathlib import Path
repo,book,work=map(Path,sys.argv[1:])
assert Path.cwd()==repo
sys.path.insert(0,str(repo/".claude/skills/ld-s10y-lesson/tools"))
import assemble
stream=assemble.load_stream(book)
refs={b["ref"]:b for b in stream}
left,right="p0152#7","p0155#6"
assert refs[left]["kind"]==refs[right]["kind"]=="h3"
assert "".join(refs[left]["lines"])=="32．平行公理"
assert "".join(refs[right]["lines"])=="33▼．非欧几何．几何和物理"
start=next(i for i,b in enumerate(stream) if b["ref"]==left)
end=next(i for i,b in enumerate(stream) if b["ref"]==right)
selected=stream[start:end]
note=refs["p0155#8"]
assert note["kind"]=="foot" and note["label"]=="note" and note["owner_exercise"]=="438"
assert [b["ref"] for b in selected if b["kind"]=="h3"]==[left]
assert all("▼" not in line for b in selected for line in b["lines"])
status=assemble.run(book,repo/"ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
 repo/".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",strict=True,work=work,
 exercise_numbering="book",stream=[refs["p0149#2"],refs["p0149#3"],*selected,note])
if status==0:
 index=json.loads((book/"book.json").read_text())
 assert [row["id"] for row in index["lessons"]]==["geo68-c3-s1-n32"]
 assert index["audit"]["errors"]==[]
 ex=json.loads((book/"lessons/geo68-c3-s1-n32/exercises.json").read_text())
 assert [row["number"] for row in ex["exercises"]]==[str(n) for n in range(432,441)]
 target=next(row for row in ex["exercises"] if row["number"]=="438")
 assert "同位角" in json.dumps(target,ensure_ascii=False)
sys.exit(status)
`
  const assembly = run('assemble-first', [python, '-B', '-c', code, repo, book, path.join(own, 'work/6-8g')])
  const prepare = run('adapt-prepare-first', [python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-prepare', '--book', '6-8g', '--root', path.join(own, 'artifacts'),
    '--work', path.join(own, 'work'), '--edition', 'modern-us-neutral', '--lesson', lesson])
  const raw = path.join(book, 'lessons', lesson)
  const templates = path.join(own, 'work/adapt/6-8g/modern-us-neutral/lessons', lesson)
  const outputs = [
    ...['lesson.json', 'lesson.md', 'exercises.json'].map(file => bind(path.join(raw, file))),
    ...['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(file =>
      bind(path.join(templates, file))),
  ]
  const record = {
    status: 'N32_FIRST_SCOPED_ASSEMBLY_AND_PREPARE_PASS', lesson, assembly, prepare, outputs,
    prose: read(path.join(raw, 'lesson.json')).prose.length,
    exercises: read(path.join(raw, 'exercises.json')).count,
    sourceFigures: 5, explicitFootnote438OwnershipRetained: true,
    page155GlyphFailureUnchanged: true, allSourceIdentityAndPrintingRoleHoldsPreserved: true,
    originalPagesOrCanonicalIndexesRewritten: false, parentImageLoads: 0, published: false,
  }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  refs.push(...outputs, bind(recordFile), bind(path.join(tmp, 'prepare-n32-scoped-first-10.mjs')))
  const retained = retainCurrent6g('evidence/stemrobin188-6g-n32/assembly-and-prepare-first10', refs, [
    'evidence/stemrobin188-6g-source151154/independent-review09/retention.json',
    'evidence/stemrobin188-6g-source155156/independent-review09/retention.json',
    'evidence/stemrobin188-6g-source155/footnote-owner-repair09/retention.json',
  ], record)
  console.log(JSON.stringify({ record: bind(recordFile), retained }))
}
