import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/vectorize-batch007-approved-precursors`
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root), 'Preserve earlier vectorization evidence')
for (const [name, hash] of [
  ['source-review-10c-p35-p38.md',
    '84f8aad58ffe21417f9f3b52a5fcb366b016da533a914f4f741b40611790237e'],
  ['source-10c-p38-metadata-changed-only-review.md',
    'e91bff0a2d18aee13cef409c7ab18f14e08c5e2771f7d973d6a4877461e0b3ff'],
  ['source-geo910-p44-p47-changed-only-review.md',
    'a4cfc00daf43c0d927f962af9b3168f773c51cba0375adcb5bf78e147669f987'],
]) assert.equal(sha(`${ticket}/${name}`), hash)
const scope = [['10c', [36, 38]], ['9-10g', [44, 45, 46, 47]]]
for (const [book, pages] of scope) {
  for (const page of pages) {
    const id = String(page).padStart(4, '0')
    const source = `ssot-resources/soviet10year-textbooks/artifacts/${book}/pages/${id}`
    const doc = JSON.parse(fs.readFileSync(`${source}/page.json`))
    assert.deepEqual(JSON.parse(fs.readFileSync(`${source}/audit.json`)).errors, [])
    assert(doc.meta.figures.length > 0, 'Derive a nonempty figure set')
    for (const figure of doc.meta.figures) {
      assert(!fs.existsSync(`.tmp/ld-s10y-lesson/${book}/pages/${id}/figures/${figure.id}.svg`),
        'Never rerun an existing source vectorization')
    }
  }
}
fs.mkdirSync(root, { recursive: true })
for (const [book, pages] of scope) {
  for (const page of pages) {
    const id = String(page).padStart(4, '0')
    const work = `.tmp/ld-s10y-lesson/${book}/pages/${id}/figures`
    const doc = JSON.parse(fs.readFileSync(
      `ssot-resources/soviet10year-textbooks/artifacts/${book}/pages/${id}/page.json`))
    const inputs = doc.meta.figures.map(f => ({
      id: f.id, png: `${work}/${f.id}.png`, sha256: sha(`${work}/${f.id}.png`),
    }))
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
      'vectorize', '--book', book, '--page', String(page)]
    const startedAtUtc = new Date().toISOString()
    const result = spawnSync(executable, args, { encoding: 'utf8' })
    const name = `${book}-p${page}`
    fs.writeFileSync(`${root}/${name}.stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${root}/${name}.stderr.txt`, result.stderr || '')
    fs.writeFileSync(`${root}/${name}.command.json`, JSON.stringify({
      executable, args, cwd: process.cwd(), startedAtUtc,
      finishedAtUtc: new Date().toISOString(), exitCode: result.status,
      signal: result.signal, error: result.error?.message || null, inputs,
    }, null, 2) + '\n')
    console.log(result.stdout)
    console.error(result.stderr)
    assert.equal(result.status, 0, 'Stop at actual source-vector failure')
    for (const figure of inputs) assert.equal(sha(figure.png), figure.sha256)
  }
}
