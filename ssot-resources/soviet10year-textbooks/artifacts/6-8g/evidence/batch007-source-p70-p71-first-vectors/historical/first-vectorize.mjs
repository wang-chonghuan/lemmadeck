import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/source-reviewed-pairs-first-vectors`
const pairs = [
  { book: '6-8g', pages: [70, 71], review: 'source-6g-p70-p71-affected-review.md', sha256: '2802057d1931c791f9e3b17691114cb8ca73a73ccf76e5956a9c3a32a9dfea74' },
  { book: '9-10g', pages: [64, 65], review: 'source-9g-p64-p65-independent-review.md', sha256: 'ddb8cb7e4406aa508d3aa3b45507aa08b50df1fb158ca39bda021295ead07066' },
]
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
assert(!fs.existsSync(root), 'Preserve first vector command evidence')
const protectedFiles = []
const commands = []
for (const pair of pairs) {
  assert.equal(hash(`${ticket}/${pair.review}`), pair.sha256)
  const base = `ssot-resources/soviet10year-textbooks/artifacts/${pair.book}`
  protectedFiles.push(`${base}/book.json`, `${ticket}/${pair.review}`)
  for (const page of pair.pages) {
    const number = String(page).padStart(4, '0')
    const durable = `${base}/pages/${number}`
    const prepared = `.tmp/ld-s10y-lesson/${pair.book}/pages/${number}`
    protectedFiles.push(...['page.md', 'page.json', 'audit.json'].map(name => `${durable}/${name}`))
    protectedFiles.push(...['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map(name => `${prepared}/${name}`))
    const figures = JSON.parse(fs.readFileSync(`${durable}/page.json`, 'utf8')).meta.figures
    assert(figures.length > 0)
    for (const figure of figures) {
      const png = `${prepared}/figures/${figure.id}.png`
      const svg = `${prepared}/figures/${figure.id}.svg`
      assert(fs.existsSync(png))
      assert(!fs.existsSync(svg), `First vectorization requires absent SVG: ${svg}`)
      protectedFiles.push(png)
    }
    commands.push({ book: pair.book, page, prepared, figures: figures.map(figure => figure.id) })
  }
}
const guard = protectedFiles.map(file => ({ path: file, sha256: hash(file) }))
fs.mkdirSync(root)
write(`${root}/before.json`, { protectedFiles: guard, commands })
const results = []
for (const command of commands) {
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'vectorize', '--book', command.book, '--page', String(command.page)]
  const prefix = `${root}/${command.book}-p${String(command.page).padStart(4, '0')}`
  const startedAtUtc = new Date().toISOString()
  write(`${prefix}.start.json`, { executable, args, cwd: process.cwd(), startedAtUtc, invocationCount: 1 })
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  const record = {
    executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null, invocationCount: 1,
  }
  write(`${prefix}.command.json`, record)
  console.log(result.stdout)
  assert.equal(result.status, 0, 'Preserve first actual vector failure; no retry')
  for (const item of guard) assert.equal(hash(item.path), item.sha256)
  const outputs = command.figures.map(id => {
    const file = `${command.prepared}/figures/${id}.svg`
    assert(fs.existsSync(file))
    return { path: file, sha256: hash(file), bytes: fs.statSync(file).size }
  })
  results.push({ ...command, record, outputs })
}
write(`${root}/after.json`, {
  status: 'FIRST_SOURCE_VECTORS_ONLY_NOT_COMPLETE', results, protectedFiles: guard,
  limits: 'No image opens, source-count rerun, finalize, source edit, assembly, book/modern change or publication. Prior failures and all source UNKNOWN/open boundaries retained.',
})
