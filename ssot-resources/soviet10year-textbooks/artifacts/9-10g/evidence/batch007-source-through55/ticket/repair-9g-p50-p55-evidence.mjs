import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p50-p55-targeted-repair-evidence'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const pages = [50, 51, 52, 53, 54, 55]
const affected = [50, 51, 53, 55]
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  return { path: from, sha256: hash(from) }
}
const action = process.argv[2]
assert(['before', 'finalize'].includes(action))
if (action === 'before') {
  assert(!fs.existsSync(root))
  const bindings = []
  for (const page of pages) {
    const id = String(page).padStart(4, '0')
    for (const name of ['page.md', 'page.json', 'audit.json'])
      bindings.push(copy(`${book}/pages/${id}/${name}`, `${root}/before/${id}/${name}`))
    for (const name of ['page.png', 'page.grid.png', 'layout.json'])
      bindings.push(copy(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/${name}`, `${root}/work-before/${id}/${name}`))
    const dir = `.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures`
    if (fs.existsSync(dir)) for (const name of fs.readdirSync(dir))
      bindings.push(copy(`${dir}/${name}`, `${root}/work-before/${id}/figures/${name}`))
  }
  fs.writeFileSync(`${root}/before.json`, JSON.stringify(bindings, null, 2) + '\n')
} else {
  assert(fs.existsSync(`${root}/before.json`))
  for (const page of affected) {
    const id = String(page).padStart(4, '0')
    const out = `${root}/${id}`
    assert(!fs.existsSync(out), 'Affected finalize once')
    fs.mkdirSync(out)
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9-10g', '--page', String(page)]
    const result = spawnSync(executable, args, {
      encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
    })
    fs.writeFileSync(`${out}/stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${out}/stderr.txt`, result.stderr || '')
    fs.writeFileSync(`${out}/command.json`, JSON.stringify({
      executable, args, cwd: process.cwd(), exitCode: result.status, signal: result.signal,
      error: result.error?.message || null,
    }, null, 2) + '\n')
    for (const name of ['page.md', 'page.json', 'audit.json'])
      copy(`${book}/pages/${id}/${name}`, `${out}/after/${name}`)
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Preserve failed affected attempt')
  }
}
