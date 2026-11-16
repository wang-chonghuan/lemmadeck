import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const E = path.join(T, 'source-6g-p72-p73-emphasis-affected')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const split = file => {
  const text = fs.readFileSync(file, 'utf8')
  const end = text.indexOf('\n---\n', 4)
  assert(text.startsWith('---\n') && end > 4)
  return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) }
}
const note = '独立唯一StageB R03确认题号数字前缀加粗；仅以下source_emphasis数字span已确认，不延伸到句点、题干或其它UNKNOWN强调范围。R01过/着及R02句点/冒号仍UNRESOLVED，保持原字节，不据数学或语文惯例选字；本批仍HOLD。'
const spans = {
  72: [{ block: 'p0072#6', span: '183' }, { block: 'p0072#7', span: '184' }],
  73: [{ block: 'p0073#2', span: '185' }, { block: 'p0073#3', span: '186' }, { block: 'p0073#5', span: '187' }],
}
const expected = page => spans[page].map(item => ({
  ...item, style: 'bold', basis: '唯一独立StageB R03确认的题号数字；标点及其余强调起止UNKNOWN',
}))
if (process.argv[2] === 'before') {
  assert(!fs.existsSync(E), 'One before snapshot only')
  fs.mkdirSync(E)
  const protectedFiles = {}
  for (const page of [72, 73]) {
    const id = String(page).padStart(4, '0')
    const dir = path.join(E, 'before', id)
    fs.mkdirSync(dir, { recursive: true })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      fs.copyFileSync(path.join(base, id, name), path.join(dir, name), fs.constants.COPYFILE_EXCL)
    const work = path.join(root, '.tmp/ld-s10y-lesson/6-8g/pages', id)
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
      protectedFiles[path.join(work, name)] = hash(path.join(work, name))
    for (const figure of read(path.join(base, id, 'audit.json')).figures) {
      const file = path.join(work, 'figures', `${figure.id}.png`)
      protectedFiles[file] = hash(file)
    }
  }
  for (const name of ['source-6g-p72-p73-independent-source-first.md',
    'source-6g-p72-p73-independent-review.md', 'source-6g-p72-p73-author-report.md',
    'source-6g-p72-p73-author-manifest.json']) {
    const file = path.join(T, name)
    protectedFiles[file] = hash(file)
  }
  fs.writeFileSync(path.join(E, 'protected.json'), JSON.stringify(protectedFiles, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ beforeSnapshot: true, protectedFiles: Object.keys(protectedFiles).length }))
} else {
  assert.equal(process.argv[2], 'finalize')
  assert(fs.existsSync(path.join(E, 'protected.json')))
  const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const layout = path.join(root, '.claude/skills/ld-s10y-lesson/tools/layout.py')
  for (const page of [72, 73]) {
    const id = String(page).padStart(4, '0')
    const dir = path.join(base, id)
    const before = split(path.join(E, 'before', id, 'page.md'))
    const current = split(path.join(dir, 'page.md'))
    assert.equal(current.body, before.body)
    assert.deepEqual(current.meta.source_emphasis, expected(page))
    assert.deepEqual(current.meta.notes, [...before.meta.notes, note])
    const { source_emphasis, notes, ...rest } = current.meta
    const { notes: oldNotes, ...oldRest } = before.meta
    assert.deepEqual(rest, oldRest)
    const startPath = path.join(E, `${id}-start.json`)
    assert(!fs.existsSync(startPath), 'No second affected finalize')
    const start = {
      page, executable: python, args: ['-B', tool, 'finalize', '--book', '6-8g', '--page', String(page)],
      cwd: root, startedAt: new Date().toISOString(), layoutSha256: hash(layout),
    }
    fs.writeFileSync(startPath, JSON.stringify(start, null, 2) + '\n', { flag: 'wx' })
    const call = spawnSync(python, start.args, { cwd: root, encoding: 'utf8' })
    fs.writeFileSync(path.join(E, `${id}-stdout.txt`), call.stdout || '', { flag: 'wx' })
    fs.writeFileSync(path.join(E, `${id}-stderr.txt`), call.stderr || '', { flag: 'wx' })
    const result = { exitCode: call.status, signal: call.signal, error: call.error?.message, endedAt: new Date().toISOString() }
    fs.writeFileSync(path.join(E, `${id}-result.json`), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
    assert.equal(call.status, 0, 'Failure retained; no second finalize')
    assert.equal(hash(layout), start.layoutSha256)
    const afterDir = path.join(E, 'after', id)
    fs.mkdirSync(afterDir, { recursive: true })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      fs.copyFileSync(path.join(dir, name), path.join(afterDir, name), fs.constants.COPYFILE_EXCL)
    assert.deepEqual(split(path.join(dir, 'page.md')), current)
    const oldData = read(path.join(E, 'before', id, 'page.json'))
    const data = read(path.join(dir, 'page.json'))
    assert.deepEqual(data.blocks, oldData.blocks)
    assert.deepEqual(data.audit, oldData.audit)
    const { notes: newNotes, source_emphasis: newSpans, ...newMeta } = data.meta
    const { notes: priorNotes, ...oldMeta } = oldData.meta
    assert.deepEqual(newMeta, oldMeta)
    assert.deepEqual(newNotes, [...priorNotes, note])
    assert.deepEqual(newSpans, expected(page))
    assert.deepEqual(read(path.join(dir, 'audit.json')), read(path.join(E, 'before', id, 'audit.json')))
    console.log(JSON.stringify({ page, ...result, auditUnchanged: true, bodyUnchanged: true, onlyConfirmedMetadataAdded: true }))
  }
  const protectedFiles = read(path.join(E, 'protected.json'))
  for (const [file, value] of Object.entries(protectedFiles)) assert.equal(hash(file), value, file)
  const result = {
    role: 'R03_METADATA_ONLY_AFFECTED_COMPARISON', status: 'PARTIAL_REPAIR_SOURCE_STILL_HOLD',
    affected: ['p0072#6:183', 'p0072#7:184', 'p0073#2:185', 'p0073#3:186', 'p0073#5:187'],
    note, spans, protectedFilesUnchanged: true, bodyBlocksAndAuditsUnchanged: true,
    retainedWarnings: 30, originalReviewUnchanged: true,
    limits: 'R01/R02 remain unresolved;punctuation and other emphasis UNKNOWN;187/unit15 OPEN. Zero images,new source reviews,vectorization,assembly,promotion,Git,DB,production.',
    recordedAt: new Date().toISOString(),
  }
  fs.writeFileSync(path.join(E, 'comparison.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify(result))
}
