import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/source-geo68-p64-p67-targeted-repair-evidence'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const action = process.argv[2]
assert(['before', 'finalize'].includes(action))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
if (action === 'before') {
  assert(!fs.existsSync(root))
  fs.mkdirSync(`${root}/before`, { recursive: true })
  const bindings = []
  for (const id of ['0064', '0065', '0066', '0067']) {
    fs.cpSync(`${book}/pages/${id}`, `${root}/before/${id}`, { recursive: true })
    const figures = `.tmp/ld-s10y-lesson/6-8g/pages/${id}/figures`
    if (fs.existsSync(figures)) for (const name of fs.readdirSync(figures)) {
      const file = `${figures}/${name}`
      bindings.push({ path: file, sha256: hash(file) })
    }
  }
  fs.writeFileSync(`${root}/crop-bindings.json`, JSON.stringify(bindings, null, 2) + '\n')
} else {
  for (const page of [64, 65, 67]) {
    const id = String(page).padStart(4, '0')
    const out = `${root}/${id}`
    assert(!fs.existsSync(out))
    fs.mkdirSync(out)
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g', '--page', String(page)]
    const result = spawnSync(executable, args, { encoding: 'utf8' })
    fs.writeFileSync(`${out}/stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${out}/stderr.txt`, result.stderr || '')
    fs.writeFileSync(`${out}/command.json`, JSON.stringify({
      executable, args, cwd: process.cwd(), exitCode: result.status, signal: result.signal,
    }, null, 2) + '\n')
    fs.cpSync(`${book}/pages/${id}`, `${out}/after`, { recursive: true })
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Preserve actual affected failure')
  }
  for (const item of JSON.parse(fs.readFileSync(`${root}/crop-bindings.json`)))
    assert.equal(hash(item.path), item.sha256, 'Source crop must not change')
}
