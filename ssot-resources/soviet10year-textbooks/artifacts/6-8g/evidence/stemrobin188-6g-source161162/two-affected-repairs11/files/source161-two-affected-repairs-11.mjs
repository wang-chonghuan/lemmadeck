import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source161-two-affected-repairs-11')
const author = path.join(tmp, 'source6g161162-author-first-10')
const relative = 'artifacts/6-8g/pages/0161'
const reportFile = path.join(tmp, 'source161162-independent-review-11/report.json')
assert.equal(hash(reportFile), '48e78c8654c6b0197ab4dbbf656669e36c53df59fbaae7940372c7585aca7472')
const report = read(reportFile)
const exclusion = {
  kind: 'separator-rule', box: [191, 1788, 420, 6],
  reason: 'Independent source161162 review identified the short footnote separator as native band22, not a prose/math row. Exclude it only in the counting copy; preserve source pixels, glyphs and all native identity/alphabet failures.',
}
const oldNote = 'Wavy source underlines beneath 平行直线束 and 方向; long separators before 问题和习题 and 35.方向; short footnote rule. These marks remain source facts in FIRST, not count exclusions.'
const newNote = 'Original AUTHOR_ONLY metadata had no count exclusions. Independent source review now supports excluding only the short footnote separator from the counting copy; all source marks, FIRST pixels and printing-role UNKNOWNs remain unchanged.'
if (process.argv[2] === 'stage') {
  fs.mkdirSync(own)
  const mappings = []
  for (const file of [
    ...['page.md', 'page.json', 'audit.json'].map(name => `${relative}/${name}`),
    ...['page.png', 'layout.json'].map(name => `work/6-8g/pages/0161/${name}`),
  ]) {
    const source = path.join(author, file)
    const output = path.join(own, file)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(output, file.startsWith('work/') ? 0o444 : 0o644)
    mappings.push({ source: bind(source), output: bind(output) })
  }
  save(path.join(own, 'staging.json'), {
    review: bind(reportFile), defects: report.defects_and_safe_affected_actions.slice(0, 2),
    exclusion, oldNote, newNote, mappings,
    source162Unchanged: true, originalGlyphAndAlphabetFailuresMustRemain: true,
  })
  console.log(JSON.stringify({ staged: own }))
} else {
  assert.equal(process.argv[2], 'finalize')
  const snapshot = path.join(own, '161.prefinalize.md')
  fs.copyFileSync(path.join(own, relative, 'page.md'), snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
  const argv = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g',
    '--page', '161', '--root', path.join(own, 'artifacts'), '--work', path.join(own, 'work'),
    '--books', path.join(repo, 'ssot-resources/soviet10year-textbooks/sources')]
  const startedAt = new Date().toISOString()
  const execution = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  const references = [bind(reportFile), bind(snapshot), bind(path.join(own, 'staging.json')),
    bind(path.join(tmp, 'source161-two-affected-repairs-11.mjs'))]
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `finalize.${kind}`)
    fs.writeFileSync(file, execution[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
    references.push(bind(file))
  }
  const receiptFile = path.join(own, 'finalize.execution.json')
  save(receiptFile, {
    cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: execution.status, signal: execution.signal,
    error: execution.error?.message ?? null, streams,
  })
  console.log(JSON.stringify({ exitCode: execution.status, stdout: execution.stdout }))
  assert.equal(execution.status, 1)
  const beforeFile = path.join(author, relative, 'page.json')
  const afterFile = path.join(own, relative, 'page.json')
  const expected = read(beforeFile)
  assert.ok(expected.blocks[7].lines[0].includes('概念，但是'))
  expected.blocks[7].lines[0] = expected.blocks[7].lines[0].replace('概念，但是', '概念。但是')
  assert.equal(expected.meta.notes[2], oldNote)
  expected.meta.notes[2] = newNote
  expected.meta.count_exclusions = [exclusion]
  assert.deepEqual(read(afterFile), expected)
  const audit = read(path.join(own, relative, 'audit.json'))
  assert.deepEqual([audit.lines_printed, audit.lines_md], [24, 24])
  assert.equal(audit.errors.length, 2)
  assert.ok(audit.errors.some(error => /U\+25BC/.test(error) && /U\+25B8/.test(error)))
  assert.ok(audit.errors.some(error => /小问标号 'a'/.test(error)))
  const record = {
    status: 'SOURCE161_TWO_AFFECTED_REPAIRS_24_24_GLYPH_ALPHABET_FAIL_PRESERVED',
    review: bind(reportFile), before: bind(beforeFile), after: bind(afterFile),
    changedSourceLeaf: '/blocks/7/lines/0', exclusion,
    explanatoryMetadataLeaf: '/meta/notes/2',
    allOtherStructuredLeavesAndPixelsUnchanged: true,
    source162Unchanged: true, contentRevisions: 1,
    rows: [24, 24], errors: audit.errors, receipt: bind(receiptFile),
    independentAffectedReviewPending: true, nativePageApproved: false,
    originalFIRSTsFailuresAndUnknownsPreserved: true, parentImageLoads: 0,
  }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  references.push(bind(receiptFile), bind(recordFile),
    ...['page.md', 'page.json', 'audit.json'].map(file => bind(path.join(own, relative, file))))
  console.log(JSON.stringify(retainCurrent6g(
    'evidence/stemrobin188-6g-source161162/two-affected-repairs11', references,
    ['evidence/stemrobin188-6g-source161162/author-first10/retention.json',
      'evidence/stemrobin188-6g-source161162/independent-review11/retention.json'], record,
  )))
}
