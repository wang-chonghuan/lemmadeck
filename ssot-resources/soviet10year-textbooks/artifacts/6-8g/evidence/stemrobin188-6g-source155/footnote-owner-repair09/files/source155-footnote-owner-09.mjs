import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const [stage] = process.argv.slice(2)
assert.ok(['stage', 'finalize'].includes(stage))
const own = path.join(tmp, 'source155-footnote-owner-repair-09')
const prior = path.join(tmp, 'source155-count-only-repair-09')
const working = path.join(own, 'artifacts/6-8g/pages/0155')
if (stage === 'stage') {
  const reviewFile = path.join(tmp, 'source155156-and151-affected-independent-review-09/report.json')
  assert.equal(hash(reviewFile), '73bd2d8662d959da9bcb217763d54f511624fee00f4dd5fec29bd59a660bd575')
  assert.ok(read(reviewFile).boundaryReview.links.includes('438 -> fig208 + bottom star note'))
  fs.mkdirSync(own)
  const mappings = []
  for (const relative of [
    'artifacts/6-8g/pages/0155/page.md', 'artifacts/6-8g/pages/0155/page.json',
    'artifacts/6-8g/pages/0155/audit.json', 'work/6-8g/pages/0155/page.png',
    'work/6-8g/pages/0155/layout.json', 'work/6-8g/pages/0155/figures/fig-208.png',
  ]) {
    const source = path.join(prior, relative)
    const output = path.join(own, relative)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(source), hash(output))
    fs.chmodSync(output, relative.endsWith('page.png') || relative.endsWith('layout.json') ? 0o444 : 0o644)
    mappings.push({ source: bind(source), output: bind(output) })
  }
  save(path.join(own, 'staging.json'), {
    status: 'SOURCE155_APPROVED438_FOOTNOTE_OWNERSHIP_STAGED_ONLY',
    review: bind(reviewFile), mappings,
    priorCountRecord: bind(path.join(prior, 'record.json')),
    sourceOwnership: 'Prior independent source review explicitly links438 to the bottom star note',
    parentImageLoads: 0, published: false,
  })
  console.log(JSON.stringify({ staging: bind(path.join(own, 'staging.json')) }))
} else {
  const beforeMd = path.join(prior, 'artifacts/6-8g/pages/0155/page.md')
  const currentMd = path.join(working, 'page.md')
  assert.equal(fs.readFileSync(currentMd, 'utf8'),
    fs.readFileSync(beforeMd, 'utf8').replace('<!-- foot note -->', '<!-- foot note owner-ex 438 -->'))
  const snapshot = path.join(own, 'candidate.prefinalize.md')
  fs.copyFileSync(currentMd, snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
  const argv = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g',
    '--page', '155', '--root', path.join(own, 'artifacts'), '--work', path.join(own, 'work'),
    '--books', path.join(repo, 'ssot-resources/soviet10year-textbooks/sources')]
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `finalize.${kind}`)
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
  }
  const receipt = path.join(own, 'finalize.execution.json')
  save(receipt, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, streams })
  console.log(JSON.stringify({ exitCode: result.status, receipt: bind(receipt),
    stdout: result.stdout, stderr: result.stderr }))
  assert.equal(result.status, 1)
  const beforeFile = path.join(prior, 'artifacts/6-8g/pages/0155/page.json')
  const afterFile = path.join(working, 'page.json')
  const before = read(beforeFile)
  const expected = structuredClone(before)
  assert.equal(expected.blocks[7].kind, 'foot')
  assert.equal(expected.blocks[7].label, 'note')
  expected.blocks[7].owner_exercise = '438'
  assert.deepEqual(read(afterFile), expected)
  const audit = read(path.join(working, 'audit.json'))
  assert.deepEqual(audit.errors, read(path.join(prior, 'artifacts/6-8g/pages/0155/audit.json')).errors)
  assert.equal(audit.lines_printed, 20)
  assert.equal(audit.lines_md, 20)
  const crop = path.join(own, 'work/6-8g/pages/0155/figures/fig-208.png')
  assert.equal(hash(crop), hash(path.join(prior, 'work/6-8g/pages/0155/figures/fig-208.png')))
  const record = {
    status: 'SOURCE155_FOOTNOTE_OWNER438_FINALIZED_GLYPH_FAILURE_UNCHANGED',
    before: bind(beforeFile), after: bind(afterFile),
    changedStructuredLeaves: ['blocks[7].owner_exercise'],
    sourceBodiesAndMetaUnchanged: true, cropAndBoxesUnchanged: true,
    rows: [20, 20], receipt: bind(receipt), currentErrors: audit.errors,
    priorCountRecord: bind(path.join(prior, 'record.json')),
    independentAffectedMetadataReviewPending: true, nativePageApproved: false,
    parentImageLoads: 0, published: false,
  }
  const file = path.join(own, 'record.json')
  save(file, record)
  const refs = [
    'staging.json', 'candidate.prefinalize.md', 'finalize.execution.json',
    'finalize.stdout', 'finalize.stderr', 'record.json',
    'artifacts/6-8g/pages/0155/page.md', 'artifacts/6-8g/pages/0155/page.json',
    'artifacts/6-8g/pages/0155/audit.json', 'work/6-8g/pages/0155/figures/fig-208.png',
  ].map(relative => bind(path.join(own, relative)))
  refs.push(bind(path.join(tmp, 'source155-footnote-owner-09.mjs')))
  const retained = retainCurrent6g('evidence/stemrobin188-6g-source155/footnote-owner-repair09', refs,
    ['evidence/stemrobin188-6g-source155/count-only-repair09/retention.json'], record)
  console.log(JSON.stringify({ record: bind(file), retained }))
}
