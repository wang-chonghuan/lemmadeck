import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const E = path.join(T, 'source-10c-p54-p55-affected-repair')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const split = file => {
  const text = fs.readFileSync(file, 'utf8')
  const end = text.indexOf('\n---\n', 4)
  assert(text.startsWith('---\n') && end > 4)
  return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) }
}
const replace = text => text.replaceAll('\\arccos', '\\operatorname{arc\\,cos}')
const exclusions = [
  {
    kind: 'scan-artifact', box: [797, 0, 898, 19],
    reason: 'Frozen independent StageA/StageB and affected allocation clarification identify a dark uneven TOP page-margin trace outside all body/figure/caption/footer objects. Counting-only edge no-body allocation; exact physical origin UNKNOWN. Original PNG and extracted figures unchanged.',
  },
  {
    kind: 'scan-artifact', box: [230, 2479, 1377, 33],
    reason: 'Frozen independent StageA/StageB and affected allocation clarification identify a thin irregular BOTTOM page-margin trace beyond the footer, outside all meaningful content. Counting-only edge no-body allocation; exact physical origin UNKNOWN. Original PNG and extracted figures unchanged.',
  },
]
const note = 'Affected source-only repair after unique StageB: three arc cos gaps now explicit; two independently supported NON-CONTENT margin boxes apply to counting only. Previous no-exclusions note describes the retained FIRST-author state. Exact trace physical origin remains UNKNOWN; no source pixels, figure/caption/body ownership, row breaks or open boundary changed. Original FIRST finalize17/15 exit1 remains retained history, not rewritten.';
if (process.argv[2] === 'before') {
  assert(!fs.existsSync(E), 'One before snapshot only')
  fs.mkdirSync(E)
  const protectedFiles = {}
  for (const page of [54, 55]) {
    const id = String(page).padStart(4, '0')
    const dir = path.join(E, 'before', id)
    fs.mkdirSync(dir, { recursive: true })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      fs.copyFileSync(path.join(base, id, name), path.join(dir, name), fs.constants.COPYFILE_EXCL)
    const work = path.join(root, '.tmp/ld-s10y-lesson/10c/pages', id)
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
      protectedFiles[path.join(work, name)] = hash(path.join(work, name))
    for (const figure of read(path.join(base, id, 'audit.json')).figures) {
      const file = path.join(work, 'figures', `${figure.id}.png`)
      protectedFiles[file] = hash(file)
    }
  }
  for (const name of ['source-10c-p54-p55-independent-source-first.md', 'source-10c-p54-p55-independent-review.md',
    'source-10c-p55-margin-allocation-clarification.md', 'source-10c-p54-p55-author-evidence/full-author-report.md',
    'source-10c-p54-p55-author-evidence/full-author-manifest.json']) {
    const file = path.join(T, name)
    protectedFiles[file] = hash(file)
  }
  for (const id of ['0052', '0053'])
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const file = path.join(base, id, name)
      protectedFiles[file] = hash(file)
    }
  fs.writeFileSync(path.join(E, 'protected.json'), JSON.stringify(protectedFiles, null, 2) + '\n', { flag: 'wx' })
  fs.writeFileSync(path.join(E, 'expected.json'), JSON.stringify({ exclusions, note }, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ beforeSnapshot: true, protectedFiles: Object.keys(protectedFiles).length }))
} else {
  assert.equal(process.argv[2], 'finalize')
  assert(fs.existsSync(path.join(E, 'protected.json')))
  const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const layout = path.join(root, '.claude/skills/ld-s10y-lesson/tools/layout.py')
  const comparisons = []
  for (const page of [54, 55]) {
    const id = String(page).padStart(4, '0')
    const dir = path.join(base, id)
    const before = split(path.join(E, 'before', id, 'page.md'))
    const current = split(path.join(dir, 'page.md'))
    const tokenCount = page === 54 ? 6 : 3
    assert.equal((before.body.match(/\\arccos/g) || []).length, tokenCount)
    assert.equal(current.body, replace(before.body))
    if (page === 54) assert.deepEqual(current.meta, before.meta)
    else {
      const { count_exclusions, notes, ...rest } = current.meta
      const { notes: oldNotes, ...oldRest } = before.meta
      assert.deepEqual(rest, oldRest)
      assert.deepEqual(notes, [...oldNotes, note])
      assert.deepEqual(count_exclusions, exclusions)
    }
    const startPath = path.join(E, `${id}-start.json`)
    assert(!fs.existsSync(startPath), 'No second affected finalize')
    const start = {
      page, executable: python, args: ['-B', tool, 'finalize', '--book', '10c', '--page', String(page)],
      cwd: root, startedAt: new Date().toISOString(), observedLayoutSha256: hash(layout),
      toolIdentityLimit: 'Before/after filesystem hash, not subprocess-loaded-module certificate',
    }
    fs.writeFileSync(startPath, JSON.stringify(start, null, 2) + '\n', { flag: 'wx' })
    const call = spawnSync(python, start.args, { cwd: root, encoding: 'utf8' })
    fs.writeFileSync(path.join(E, `${id}-stdout.txt`), call.stdout || '', { flag: 'wx' })
    fs.writeFileSync(path.join(E, `${id}-stderr.txt`), call.stderr || '', { flag: 'wx' })
    const result = { exitCode: call.status, signal: call.signal, error: call.error?.message, endedAt: new Date().toISOString() }
    fs.writeFileSync(path.join(E, `${id}-result.json`), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
    assert.equal(call.status, 0, 'Failure retained; no second affected finalize')
    assert.equal(hash(layout), start.observedLayoutSha256)
    const afterDir = path.join(E, 'after', id)
    fs.mkdirSync(afterDir, { recursive: true })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      fs.copyFileSync(path.join(dir, name), path.join(afterDir, name), fs.constants.COPYFILE_EXCL)
    assert.deepEqual(split(path.join(dir, 'page.md')), current)
    const oldData = read(path.join(E, 'before', id, 'page.json'))
    const data = read(path.join(dir, 'page.json'))
    assert.deepEqual(data.blocks, oldData.blocks.map(block => ({
      ...block, lines: block.lines.map(replace),
    })))
    assert.deepEqual(data.meta, current.meta)
    const oldAudit = read(path.join(E, 'before', id, 'audit.json'))
    const audit = read(path.join(dir, 'audit.json'))
    assert.deepEqual(audit.figures, oldAudit.figures)
    assert.deepEqual(audit.normalizations, [])
    if (page === 54) assert.deepEqual(audit, oldAudit)
    else {
      const { lines_printed, errors, count_exclusions, ...rest } = audit
      const { lines_printed: oldLines, errors: oldErrors, count_exclusions: oldExclusions, ...oldRest } = oldAudit
      assert.deepEqual(rest, oldRest)
      assert.equal(lines_printed, 15)
      assert.deepEqual(errors, [])
      assert.deepEqual(count_exclusions, exclusions)
    }
    const comparison = {
      page, ...result, tokensChanged: tokenCount, linesPrinted: audit.lines_printed, linesMd: audit.lines_md,
      mdSha256: hash(path.join(dir, 'page.md')), jsonSha256: hash(path.join(dir, 'page.json')),
      zeroNormalizations: true, figuresUnchanged: true, bodyOnlySpecifiedTokensChanged: true,
    }
    comparisons.push(comparison)
    console.log(JSON.stringify(comparison))
  }
  const protectedFiles = read(path.join(E, 'protected.json'))
  for (const [file, value] of Object.entries(protectedFiles)) assert.equal(hash(file), value, file)
  const result = {
    role: 'SOURCE_AFFECTED_ONLY_COMPARISON', status: 'AFFECTED_FINALIZE_PASS_INDEPENDENT_COMPARISON_PENDING',
    pages: comparisons, protectedFilesUnchanged: true, originalFirstFailureRetained: true,
    originalReviewsAndAuthorPackageUnchanged: true,
    limits: 'No source visual opens;no math/punctuation/row/figure edits;counting-only two independently supported no-content margin boxes. PhysicaloriginUNKNOWN,unit86OPEN,final现在，为了写出方OPEN. No vectors/assembly/promotion/answers/choices/Git/DB/production.',
    recordedAt: new Date().toISOString(),
  }
  fs.writeFileSync(path.join(E, 'comparison.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify(result))
}
