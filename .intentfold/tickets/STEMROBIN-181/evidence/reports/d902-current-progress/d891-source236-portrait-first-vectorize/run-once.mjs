import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const source = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d870-source236-punctuation-repair/work/10p/pages/0236/figures/tbl-p0236-01.png')
const target = path.join(out, 'work/10p/pages/0236/figures/tbl-p0236-01.png')
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (name, value) => {
  const f = path.join(out, 'FIRST', name)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
assert.equal(sha(source), sha(target))
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'vectorize',
  '--book', '10p', '--page', '236', '--root', path.join(out, 'root'), '--work', path.join(out, 'work'),
]
save('started.json', { command, cwd: repo, source: bind(source),
  reason: 'Missing FIRST vector stage for native unnumbered portrait crop; numbered206207 are not owned by this page.',
  finalizeReplays: 0 })
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
save('stdout.txt', result.stdout || '')
save('stderr.txt', result.stderr || '')
const receipt = save('receipt.json', { command, cwd: repo, exit: result.status,
  stdout: result.stdout, stderr: result.stderr, source: bind(source), png: bind(target),
  svg: fs.existsSync(target.replace(/\.png$/, '.svg')) ? bind(target.replace(/\.png$/, '.svg')) : null,
  parentImages: 0, paidCalls: 0, portraitApproval: false, sourceOrFinalizeReplays: 0 })
console.log(JSON.stringify({ receipt, exit: result.status, stdout: result.stdout, stderr: result.stderr }))
