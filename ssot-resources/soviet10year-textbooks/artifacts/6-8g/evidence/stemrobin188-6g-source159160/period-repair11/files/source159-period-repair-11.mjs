import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source159-period-repair-11')
const author = path.join(tmp, 'source6g159160-author-first-09')
const relative = 'artifacts/6-8g/pages/0159'
const reportFile = path.join(tmp, 'source159160-independent-review-10/report.json')
const before = '445** 不利用'
const after = '445**. 不利用'
assert.equal(process.cwd(), repo)
assert.equal(hash(reportFile), 'ae0ae17e6c81a0434e70407e132491e4b04cf8ad8812c5cdfd988eedd559a6db')
if (process.argv[2] === 'stage') {
  fs.mkdirSync(own)
  const mappings = []
  for (const file of [
    ...['page.md', 'page.json', 'audit.json'].map(name => `${relative}/${name}`),
    ...['page.png', 'layout.json'].map(name => `work/6-8g/pages/0159/${name}`),
  ]) {
    const source = path.join(author, file)
    const target = path.join(own, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(target, file.startsWith('work/') ? 0o444 : 0o644)
    assert.equal(hash(source), hash(target))
    mappings.push({ source: bind(source), target: bind(target) })
  }
  save(path.join(own, 'staging.json'), {
    review: bind(reportFile), before, after, mappings, onlyLeaf: '/blocks/3/lines/0',
    originalGlyphRolesUnknown: true, source160NotTouched: true, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ staged: own }))
} else {
  assert.equal(process.argv[2], 'finalize')
  const original = fs.readFileSync(path.join(author, relative, 'page.md'), 'utf8')
  const candidate = path.join(own, relative, 'page.md')
  assert.equal(original.split(before).length, 2)
  assert.equal(fs.readFileSync(candidate, 'utf8'), original.replace(before, after))
  const snapshot = path.join(own, '0159.prefinalize.md')
  fs.copyFileSync(candidate, snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
  const argv = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g',
    '--page', '159', '--root', path.join(own, 'artifacts'),
    '--work', path.join(own, 'work'),
    '--books', path.join(repo, 'ssot-resources/soviet10year-textbooks/sources')]
  const startedAt = new Date().toISOString()
  const execution = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const references = [bind(reportFile), bind(snapshot), bind(path.join(own, 'staging.json')),
    bind(path.join(tmp, 'source159-period-repair-11.mjs'))]
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `finalize.${kind}`)
    fs.writeFileSync(file, execution[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
    references.push(bind(file))
  }
  const receiptFile = path.join(own, 'finalize.execution.json')
  save(receiptFile, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: execution.status, signal: execution.signal,
    error: execution.error?.message ?? null, streams })
  console.log(JSON.stringify({ exitCode: execution.status, stdout: execution.stdout }))
  assert.equal(execution.status, 0)
  const expected = read(path.join(author, relative, 'page.json'))
  expected.blocks[3].lines[0] = expected.blocks[3].lines[0].replace(before, after)
  assert.deepEqual(read(path.join(own, relative, 'page.json')), expected)
  const audit = read(path.join(own, relative, 'audit.json'))
  assert.deepEqual(audit.errors, [])
  assert.deepEqual([audit.lines_printed, audit.lines_md], [24, 24])
  references.push(bind(receiptFile), ...['page.md', 'page.json', 'audit.json'].map(file =>
    bind(path.join(own, relative, file))))
  const record = {
    status: 'SOURCE159_ONE_PERIOD_REPAIRED_AFFECTED_REVIEW_PENDING',
    before: bind(path.join(author, relative, 'page.json')),
    after: bind(path.join(own, relative, 'page.json')), onlyLeaf: '/blocks/3/lines/0',
    rows: [24, 24], nativeReceipt: bind(receiptFile), contentRevisions: 1,
    unchangedOtherStructuredLeaves: true, source160NotTouched: true,
    allFIRSTFailuresAndGlyphRoleHoldsPreserved: true, parentImageLoads: 0,
  }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  references.push(bind(recordFile))
  console.log(JSON.stringify(retainCurrent6g(
    'evidence/stemrobin188-6g-source159160/period-repair11', references,
    ['evidence/stemrobin188-6g-source159160/author-first09/retention.json',
      'evidence/stemrobin188-6g-source159160/independent-review10/retention.json'], record,
  )))
}
