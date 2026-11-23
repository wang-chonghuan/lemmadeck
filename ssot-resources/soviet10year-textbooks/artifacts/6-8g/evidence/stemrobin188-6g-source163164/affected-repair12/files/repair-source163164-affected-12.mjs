import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source163164-affected-repair-12')
const author = path.join(tmp, 'source6g163164-author-first-11')
const reviewFile = path.join(tmp, 'source163164-first-and161-affected-review-12/report.json')
assert.equal(hash(reviewFile), '69a2780be434e95e2c17bb5420091b327dfe666a47bb89b6a609e55dca38db87')
const note163 = 'Independent source review12 restores the visible be-shaped submarker, missing Chinese word and three alpha-like mathematical label forms. Encodings are visible-shape transport only; original digital codepoint/alphabet identities remain UNKNOWN in metadata. Prior FIRST, placeholder candidate and native PASS remain historical, not repaired-source approval.'
const note164 = 'Independent source review12 restores eight visible a-/be-shaped submarkers and two printed semicolons. Latin a is shape transport only, not certified alphabet identity; UNKNOWN codepoint/alphabet metadata and every resulting native failure are preserved. Prior FIRST, placeholder candidate and native PASS remain historical, not repaired-source approval.'
if (process.argv[2] === 'stage') {
  fs.mkdirSync(own)
  const mappings = []
  for (const [page, figure] of [[163, 217], [164, 218]]) {
    const id = `0${page}`
    for (const relative of [
      ...['page.md', 'page.json', 'audit.json'].map(name => `artifacts/6-8g/pages/${id}/${name}`),
      ...['page.png', 'layout.json', `figures/fig-${figure}.png`].map(name =>
        `work/6-8g/pages/${id}/${name}`),
    ]) {
      const from = path.join(author, relative)
      const to = path.join(own, relative)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(to, relative.endsWith('page.png') ? 0o444 : 0o644)
      mappings.push({ from: bind(from), to: bind(to) })
    }
  }
  save(path.join(own, 'staging.json'), { review: bind(reviewFile), mappings, note163, note164 })
  console.log(JSON.stringify({ staged: own }))
} else {
  assert.equal(process.argv[2], 'finalize')
  const references = [bind(reviewFile), bind(path.join(own, 'staging.json')),
    bind(path.join(tmp, 'repair-source163164-affected-12.mjs'))]
  const pages = []
  for (const [page, figure] of [[163, 217], [164, 218]]) {
    const id = `0${page}`
    const folder = path.join(own, `artifacts/6-8g/pages/${id}`)
    const snapshot = path.join(own, `${id}.prefinalize.md`)
    fs.copyFileSync(path.join(folder, 'page.md'), snapshot, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(snapshot, 0o444)
    const argv = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g',
      '--page', String(page), '--root', path.join(own, 'artifacts'), '--work', path.join(own, 'work')]
    const startedAt = new Date().toISOString()
    const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
    const streams = {}
    for (const name of ['stdout', 'stderr']) {
      const file = path.join(own, `${id}.${name}`)
      fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
      streams[name] = bind(file)
      references.push(bind(file))
    }
    const receiptFile = path.join(own, `${id}.execution.json`)
    save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, streams })
    const expected = read(path.join(author, `artifacts/6-8g/pages/${id}/page.json`))
    if (page === 163) {
      expected.blocks[2].lines[1] = expected.blocks[2].lines[1].replace('UNKNOWN)', 'б）')
      expected.blocks[4].lines[0] = expected.blocks[4].lines[0].replace('直线上两条', '直线上的两条')
      for (const index of [2, 3])
        expected.blocks[7].lines[index] = expected.blocks[7].lines[index].replaceAll(String.raw`\mathrm{UNKNOWN}`, String.raw`\alpha`)
      expected.meta.notes.push(note163)
    } else {
      for (const block of [expected.blocks[8], expected.blocks[9]]) {
        let marker = 0
        block.lines = block.lines.map(line => line.replaceAll('UNKNOWN)', () => marker++ % 2 ? 'б)' : 'a)'))
        assert.equal(marker, 4)
      }
      for (const index of [1, 4])
        expected.blocks[9].lines[index] = expected.blocks[9].lines[index].replace('图形？б)', '图形；б)')
      expected.meta.notes.push(note164)
    }
    const afterFile = path.join(folder, 'page.json')
    assert.deepEqual(read(afterFile), expected)
    const crop = path.join(own, `work/6-8g/pages/${id}/figures/fig-${figure}.png`)
    assert.equal(hash(crop), hash(path.join(author, `work/6-8g/pages/${id}/figures/fig-${figure}.png`)))
    const audit = read(path.join(folder, 'audit.json'))
    assert.deepEqual([audit.lines_printed, audit.lines_md], page === 163 ? [21, 21] : [25, 25])
    assert.equal(result.status, page === 163 ? 0 : 1)
    if (page === 164) assert.ok(audit.errors.some(item => /小问标号 'a'/.test(item)))
    pages.push({ page, before: bind(path.join(author, `artifacts/6-8g/pages/${id}/page.json`)),
      after: bind(afterFile), nativeExitCode: result.status, errors: audit.errors,
      rows: [audit.lines_printed, audit.lines_md], contentRevisionsUsed: 1,
      receipt: bind(receiptFile), sourceCrop: bind(crop), unchangedCrop: true })
    references.push(bind(snapshot), bind(receiptFile), bind(crop),
      ...['page.md', 'page.json', 'audit.json'].map(name => bind(path.join(folder, name))))
  }
  const record = { status: 'SOURCE163164_AFFECTED_REPAIR_AUTHOR_ONLY_164_NATIVE_ALPHABET_FAIL',
    review: bind(reviewFile), pages, allOtherStructuredLeavesUnchanged: true,
    oldFIRSTsPlaceholderCandidatesAndNativePASSPreserved: true,
    shapeTransportIsNotAlphabetIdentity: true, independentAffectedReviewPending: true,
    parentImageLoads: 0, wholeLessonApproved: false, dependentAssemblyStopped: true }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  references.push(bind(recordFile))
  console.log(JSON.stringify(retainCurrent6g(
    'evidence/stemrobin188-6g-source163164/affected-repair12', references,
    ['evidence/stemrobin188-6g-source163164/author-first11/retention.json',
      'evidence/stemrobin188-6g-source163164/independent-review12/retention.json'], record,
  )))
}
