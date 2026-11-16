import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const out = `${tmp}/source-10c-p43-p46-targeted-repair-evidence`
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const scratch = '.tmp/ld-s10y-lesson/10c/pages'
const tools = '.claude/skills/ld-s10y-lesson/tools'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const sha = raw => createHash('sha256').update(raw).digest('hex')
const binding = file => {
  const raw = fs.readFileSync(file)
  return { path: file, bytes: raw.length, sha256: sha(raw) }
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`])

function snapshot() {
  assert(!fs.existsSync(`${out}/before.manifest.json`), 'Do not overwrite before evidence')
  assert.equal(binding(`${tmp}/source-10c-p43-p46-independent-review.md`).sha256,
    '711c6ade6097c9315deb9020882044a041e72bbdafad0bcfa3903af29b069151')
  const files = []
  for (const page of ['0043', '0044', '0045', '0046']) {
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      files.push(`${durable}/pages/${page}/${name}`)
    }
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      files.push(`${scratch}/${page}/${name}`)
    }
    const figures = `${scratch}/${page}/figures`
    if (fs.existsSync(figures)) files.push(...walk(figures))
  }
  files.push(`${durable}/book.json`)
  files.push(...walk(`${tmp}/source-10c-p43-p46-author-evidence`))
  for (const name of [
    'source-10c-p43-p46-author.md', 'source-10c-p43-p46-author.manifest.json',
    'source-10c-p43-p46-independent-source-first.md',
    'source-10c-p43-p46-independent-review.md',
  ]) files.push(`${tmp}/${name}`)
  files.push(...fs.readdirSync(tools).filter(name => name.endsWith('.py'))
    .map(name => `${tools}/${name}`))
  files.push('.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json')
  const records = [...new Set(files)].map(file => {
    const saved = `${out}/before/${file}`
    fs.mkdirSync(path.dirname(saved), { recursive: true })
    fs.copyFileSync(file, saved, fs.constants.COPYFILE_EXCL)
    assert(fs.readFileSync(file).equals(fs.readFileSync(saved)))
    return { ...binding(file), snapshot: saved }
  })
  write(`${out}/before.manifest.json`, {
    capturedAtUtc: new Date().toISOString(), cwd: root, files: records,
    imageLoads: 0, scope: 'Before bytes, first failures and six existing crops; no gates rerun',
  })
  console.log(JSON.stringify({ preservedFiles: records.length,
    manifest: binding(`${out}/before.manifest.json`) }, null, 2))
}

function run(label, executable, args) {
  const command = `${out}/${label}.command.json`
  assert(!fs.existsSync(command), `Do not repeat ${label}`)
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: root, encoding: 'utf8',
    env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
    maxBuffer: 20 * 1024 * 1024,
  })
  fs.writeFileSync(`${out}/${label}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${out}/${label}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  write(command, { executable, args, cwd: root, startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
    environment: { PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
    stdout: binding(`${out}/${label}.stdout.txt`),
    stderr: binding(`${out}/${label}.stderr.txt`) })
  console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  return result
}

function compare() {
  const before = read(`${out}/before.manifest.json`)
  const changed = new Set(['0043', '0046'].flatMap(page =>
    ['page.md', 'page.json', 'audit.json'].map(name => `${durable}/pages/${page}/${name}`)))
  const unchanged = before.files.filter(entry => !changed.has(entry.path)).map(entry => ({
    ...binding(entry.path), beforeSha256: entry.sha256,
    byteIdentical: fs.readFileSync(entry.path).equals(fs.readFileSync(entry.snapshot)),
  }))
  assert(unchanged.every(entry => entry.byteIdentical), 'Unowned or source/crop bytes changed')
  const pages = []
  for (const page of ['0043', '0046']) {
    const prefix = `${durable}/pages/${page}`
    const old = read(`${out}/before/${prefix}/page.json`)
    const current = read(`${prefix}/page.json`)
    const expected = structuredClone(old)
    const noteIndex = page === '0043' ? 2 : 1
    expected.meta.notes[noteIndex] = page === '0043'
      ? '两次平移标记带箭头，字形呈T/tau-like，字母身份UNKNOWN；\\vec{T}仅为暂定编码，未断言原印大写T；图24无纵轴±1标签，图25有纵轴±1及全部原横轴标签。'
      : '页首两图是n85正文图；后文a=-1另起完整段落，不作空p cont；末段以独立句点止并局部闭合；末尾a/q字母身份UNKNOWN，暂保留a编码，不据方程(1)推断解码；局部闭合不表示n85整体完成。'
    const command = `${out}/finalize-${page}.command.json`
    if (Object.hasOwn(current.meta, 'count_exclusions')) {
      assert(fs.existsSync(command), 'No durable exclusions without authorized affected finalize')
      expected.meta.count_exclusions = current.meta.count_exclusions
    }
    if (page === '0046') {
      assert.equal(old.blocks[6].open, true)
      assert(old.blocks[6].lines.at(-1).endsWith('$\\arcsin a$，'))
      expected.blocks[6].open = false
      expected.blocks[6].lines[7] = old.blocks[6].lines[7].slice(0, -1) + '.'
    }
    assert.deepEqual(current, expected, 'Out-of-scope source block or metadata change')
    assert.equal(fs.readFileSync(`${prefix}/page.json`, 'utf8'),
      JSON.stringify(expected, null, 2) + '\n', 'JSON byte changes exceed exact permitted replacements')
    const oldMd = fs.readFileSync(`${out}/before/${prefix}/page.md`, 'utf8')
    const nowMd = fs.readFileSync(`${prefix}/page.md`, 'utf8')
    const split = text => {
      const end = text.indexOf('\n---\n', 4)
      return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) }
    }
    const oldParts = split(oldMd)
    const newParts = split(nowMd)
    assert.deepEqual(newParts.meta, current.meta)
    let expectedMd = oldMd.replace(JSON.stringify(old.meta.notes[noteIndex]),
      JSON.stringify(expected.meta.notes[noteIndex]))
    let expectedBody = oldParts.body
    if (page === '0046') {
      assert.equal(expectedBody.split('<!-- p open -->').length - 1, 1)
      expectedBody = expectedBody.replace('<!-- p open -->', '<!-- p -->')
        .replace('$\\arcsin a$，', '$\\arcsin a$.')
      expectedMd = expectedMd.replace('<!-- p open -->', '<!-- p -->')
        .replace('$\\arcsin a$，', '$\\arcsin a$.')
    }
    assert.equal(newParts.body, expectedBody, 'Printed rows or body changed outside two replacements')
    if (!fs.existsSync(command)) assert.equal(nowMd, expectedMd, 'MD bytes exceed permitted scopes')
    const firstAudit = read(`${out}/before/${prefix}/audit.json`)
    const audit = read(`${prefix}/audit.json`)
    if (!fs.existsSync(command)) {
      assert.deepEqual(audit, firstAudit)
      assert(fs.readFileSync(`${prefix}/audit.json`)
        .equals(fs.readFileSync(`${out}/before/${prefix}/audit.json`)),
      'Without finalize the first FAIL audit must remain byte-identical')
    }
    else assert.deepEqual(audit.figures, firstAudit.figures, 'Owned crop geometry/metadata drift')
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const saved = `${out}/after-repair/${page}/${name}`
      fs.mkdirSync(path.dirname(saved), { recursive: true })
      fs.copyFileSync(`${prefix}/${name}`, saved, fs.constants.COPYFILE_EXCL)
    }
    pages.push({
      page: Number(page), allOtherBlocksAndMetafieldsIdentical: true,
      allPrintedRowsAndMathUnchangedExcept46TerminalPunctuation: true,
      mdJsonConsistent: true, firstFailureRetained: true,
      currentFiles: ['page.md', 'page.json', 'audit.json'].map(name => binding(`${prefix}/${name}`)),
      audit: { linesMd: audit.lines_md, linesPrinted: audit.lines_printed, errors: audit.errors },
      affectedFinalize: fs.existsSync(command) ? read(command) : null,
    })
  }
  write(`${out}/comparisons.json`, { pages, unchanged })
  console.log(JSON.stringify({ pages, unchangedFileCount: unchanged.length,
    unchangedAll: true, comparisons: binding(`${out}/comparisons.json`) }, null, 2))
}

const action = process.argv[2]
if (action === 'snapshot') snapshot()
else if (action === 'diagnose') {
  assert(fs.existsSync(`${out}/before.manifest.json`))
  const result = run('diagnose', python, ['-B', `${out}/diagnose.py`])
  assert.equal(result.status, 0, 'Preserve diagnostic failure and stop')
} else if (action === 'finalize43' || action === 'finalize46') {
  const page = action.slice(-2)
  assert(fs.existsSync(`${out}/candidate-${page}.json`), 'No visually justified metadata candidate')
  for (const other of ['0043', '0046']) {
    const prior = `${out}/finalize-${other}.command.json`
    if (fs.existsSync(prior)) assert.equal(read(prior).exitCode, 0, 'Previous affected failure: stop')
  }
  const result = run(`finalize-00${page}`, python,
    ['-B', `${tools}/p2c.py`, 'finalize', '--book', '10c', '--page', page])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const target = `${out}/after-finalize/00${page}/${name}`
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(`${durable}/pages/00${page}/${name}`, target, fs.constants.COPYFILE_EXCL)
  }
  assert.equal(result.status, 0, 'Affected finalize failed: retain first/new failure, do not retry')
} else if (action === 'compare-internal') compare()
else if (action === 'compare') {
  const result = run('byte-comparisons', process.execPath, [`${out}/run.mjs`, 'compare-internal'])
  assert.equal(result.status, 0, 'Preserve byte-comparison failure and stop')
}
else if (action === 'strips') {
  const result = run('native-strips', python, ['-B', `${out}/strips.py`])
  assert.equal(result.status, 0, 'Preserve native-strip failure and stop')
}
else if (action === 'margin-copy') {
  const result = run('margin-only', python, ['-B', `${out}/margin-copy.py`])
  assert.equal(result.status, 0, 'Preserve metadata-copy diagnostic failure and stop')
}
else if (action === 'manifest') {
  assert(fs.existsSync(`${out}/comparisons.json`))
  const observations = read(`${out}/observations.json`)
  const files = walk(out).filter(file => !file.includes('/before/'))
  files.push(`${tmp}/source-10c-p43-p46-targeted-repair-author.md`)
  write(`${tmp}/source-10c-p43-p46-targeted-repair-author.manifest.json`, {
    role: 'Targeted author repair/count diagnosis only; no independent PASS',
    capturedAtUtc: new Date().toISOString(), cwd: root,
    files: files.map(binding),
    beforeSnapshot: binding(`${out}/before.manifest.json`),
    comparisons: binding(`${out}/comparisons.json`),
    countResults: observations.count_diagnosis,
    imageBatch: observations.image_batch,
    remainingUNKNOWN: observations.remaining_UNKNOWN,
  })
  console.log(JSON.stringify(binding(`${tmp}/source-10c-p43-p46-targeted-repair-author.manifest.json`)))
} else throw new Error('Unknown scoped evidence action')
