import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d744-colorplate416417-preparation')
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/production.py', 'prepare-range',
  '--repo', repo, '--book', '10p', '--first', '416', '--last', '417', '--work', path.join(out, 'work'),
]
fs.writeFileSync(path.join(out, 'started.json'), `${JSON.stringify({
  command, preparationOnly: true, candidatePlatePageNumbers: true,
  pdfImageInventory: 'Local420page PDF pages416..419 contain RGB images. This is not yet confirmation of plateI/II identity.',
}, null, 2)}\n`, { flag: 'wx' })
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 180000 })
for (const [name, value] of [['stdout.txt', result.stdout], ['stderr.txt', result.stderr]]) {
  fs.writeFileSync(path.join(out, name), value, { flag: 'wx' })
}
fs.writeFileSync(path.join(out, 'receipt.json'), `${JSON.stringify({ command, exitCode: result.status, imagesOpened: 0 }, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout)
process.exitCode = result.status === 0 ? 0 : 1
