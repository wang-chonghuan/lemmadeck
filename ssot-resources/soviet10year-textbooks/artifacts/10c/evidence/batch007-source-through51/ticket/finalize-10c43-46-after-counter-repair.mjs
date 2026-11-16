import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-after-counter-repair'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const action = process.argv[2]
assert(['before', 'finalize'].includes(action))
if (action === 'before') {
  assert(!fs.existsSync(root))
  const bindings = []
  for (const id of ['0043', '0044', '0045', '0046']) {
    fs.cpSync(`${book}/pages/${id}`, `${root}/before/${id}`, { recursive: true })
    for (const name of ['page.png', 'page.grid.png', 'layout.json']) {
      const file = `.tmp/ld-s10y-lesson/10c/pages/${id}/${name}`
      bindings.push({ path: file, sha256: hash(file) })
    }
    const dir = `.tmp/ld-s10y-lesson/10c/pages/${id}/figures`
    if (fs.existsSync(dir)) for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name)
      bindings.push({ path: file, sha256: hash(file) })
    }
  }
  fs.writeFileSync(`${root}/unchanged-pixels.json`, JSON.stringify(bindings, null, 2) + '\n')
} else {
  for (const page of [43, 46]) {
    const id = String(page).padStart(4, '0')
    const out = `${root}/${id}`
    assert(!fs.existsSync(out))
    fs.mkdirSync(out)
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10c', '--page', String(page)]
    const result = spawnSync(executable, args, { encoding: 'utf8' })
    fs.writeFileSync(`${out}/stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${out}/stderr.txt`, result.stderr || '')
    fs.writeFileSync(`${out}/command.json`, JSON.stringify({
      executable, args, cwd: process.cwd(), exitCode: result.status, signal: result.signal,
      toolSha256: hash('.claude/skills/ld-s10y-lesson/tools/layout.py'),
    }, null, 2) + '\n')
    fs.cpSync(`${book}/pages/${id}`, `${out}/after`, { recursive: true })
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Preserve an affected failure')
  }
  for (const item of JSON.parse(fs.readFileSync(`${root}/unchanged-pixels.json`)))
    assert.equal(hash(item.path), item.sha256, 'Pixels/layout/crops cannot drift')
  for (const id of ['0044', '0045'])
    for (const name of ['page.md', 'page.json', 'audit.json'])
      assert.equal(hash(`${book}/pages/${id}/${name}`), hash(`${root}/before/${id}/${name}`))
}
