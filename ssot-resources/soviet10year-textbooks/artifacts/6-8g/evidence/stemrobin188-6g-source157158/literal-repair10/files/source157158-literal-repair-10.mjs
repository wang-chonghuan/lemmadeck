import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'source157158-literal-repair-10')
const author = path.join(tmp, 'source6g157158-author-first-09')
const reportFile = path.join(tmp, 'source157158-independent-review-09/report.json')
const report = read(reportFile)
const mode = process.argv[2]
assert.ok(['stage', 'finalize'].includes(mode))
if (mode === 'stage') {
  fs.mkdirSync(own)
  const mappings = []
  for (const page of ['0157', '0158']) {
    const relatives = [
      ...['page.md', 'page.json', 'audit.json'].map(file => `artifacts/6-8g/pages/${page}/${file}`),
      ...['page.png', 'layout.json'].map(file => `work/6-8g/pages/${page}/${file}`),
      ...(page === '0157' ? ['work/6-8g/pages/0157/figures/fig-212.png'] : []),
    ]
    for (const relative of relatives) {
      const source = path.join(author, relative)
      const output = path.join(own, relative)
      fs.mkdirSync(path.dirname(output), { recursive: true })
      fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(output, relative.endsWith('page.png') || relative.endsWith('layout.json') ? 0o444 : 0o644)
      assert.equal(hash(source), hash(output))
      mappings.push({ source: bind(source), output: bind(output) })
    }
  }
  save(path.join(own, 'staging.json'), {
    status: 'TWO_LITERAL_SOURCE_REPAIRS_STAGED', review: bind(reportFile), mappings,
    scope: report.defects.map(item => ({ id: item.id, before: item.candidate, after: item.actual_source })),
    parentImageLoads: 0, published: false,
  })
  console.log(JSON.stringify({ staged: own }))
} else {
  const results = []
  const refs = [bind(reportFile), bind(path.join(own, 'staging.json')),
    bind(path.join(tmp, 'source157158-literal-repair-10.mjs'))]
  for (const defect of report.defects) {
    const page = String(defect.physical).padStart(4, '0')
    const relative = `artifacts/6-8g/pages/${page}`
    const beforeMd = path.join(author, relative, 'page.md')
    const candidate = path.join(own, relative, 'page.md')
    const original = fs.readFileSync(beforeMd, 'utf8')
    assert.equal(original.split(defect.candidate).length, 2)
    assert.equal(fs.readFileSync(candidate, 'utf8'), original.replace(defect.candidate, defect.actual_source))
    const snapshot = path.join(own, `${page}.prefinalize.md`)
    fs.copyFileSync(candidate, snapshot, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(snapshot, 0o444)
    const argv = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g',
      '--page', String(defect.physical), '--root', path.join(own, 'artifacts'),
      '--work', path.join(own, 'work'),
      '--books', path.join(repo, 'ssot-resources/soviet10year-textbooks/sources')]
    const startedAt = new Date().toISOString()
    const execution = spawnSync(argv[0], argv.slice(1), {
      cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    })
    const streams = {}
    for (const kind of ['stdout', 'stderr']) {
      const file = path.join(own, `${page}.finalize.${kind}`)
      fs.writeFileSync(file, execution[kind] ?? '', { flag: 'wx' })
      streams[kind] = bind(file)
      refs.push(bind(file))
    }
    const receiptFile = path.join(own, `${page}.finalize.execution.json`)
    save(receiptFile, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
      exitCode: execution.status, signal: execution.signal, error: execution.error?.message ?? null, streams })
    console.log(JSON.stringify({ page, exitCode: execution.status, receipt: bind(receiptFile), stdout: execution.stdout }))
    assert.equal(execution.status, 0)
    const beforeJson = path.join(author, relative, 'page.json')
    const afterJson = path.join(own, relative, 'page.json')
    const expected = read(beforeJson)
    assert.equal(expected.blocks[2].lines[1], defect.candidate)
    expected.blocks[2].lines[1] = defect.actual_source
    assert.deepEqual(read(afterJson), expected)
    const audit = read(path.join(own, relative, 'audit.json'))
    assert.deepEqual(audit.errors, [])
    assert.equal(audit.lines_printed, audit.lines_md)
    refs.push(bind(snapshot), bind(receiptFile), ...['page.md', 'page.json', 'audit.json'].map(file =>
      bind(path.join(own, relative, file))))
    results.push({ physical: defect.physical, defect: defect.id, before: bind(beforeJson), after: bind(afterJson),
      changedLeaf: '/blocks/2/lines/1', rows: [audit.lines_printed, audit.lines_md], receipt: bind(receiptFile) })
  }
  const crop = path.join(own, 'work/6-8g/pages/0157/figures/fig-212.png')
  assert.equal(hash(crop), hash(path.join(author, 'work/6-8g/pages/0157/figures/fig-212.png')))
  refs.push(bind(crop))
  const record = {
    status: 'TWO_LITERAL_REPAIRS_FINALIZED_AFFECTED_REVIEW_PENDING', results,
    allOtherStructuredLeavesAndCropUnchanged: true, previousReview: bind(reportFile),
    wholeUnit33Closure: 'UNKNOWN', parentImageLoads: 0, published: false,
  }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  refs.push(bind(recordFile))
  const retained = retainCurrent6g('evidence/stemrobin188-6g-source157158/literal-repair10', refs,
    ['evidence/stemrobin188-6g-source157158/author-first09/retention.json',
      'evidence/stemrobin188-6g-source157158/independent-review09/retention.json'], record)
  console.log(JSON.stringify({ record: bind(recordFile), retained }))
}
