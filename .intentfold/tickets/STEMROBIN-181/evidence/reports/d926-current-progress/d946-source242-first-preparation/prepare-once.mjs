import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d946-source242-first-preparation')
assert.ok(!fs.existsSync(path.join(own, 'started.json')), 'First preparation only; do not replay')
const meter = JSON.parse(fs.readFileSync(path.join(repo,
  '.intentfold/tickets/STEMROBIN-181/production-meter.json'), 'utf8'))
assert.equal(meter.sourcePagesFinalized, 472)
assert.equal(meter.imageCalls, 12)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = [
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/production.py'),
  'prepare-range', '--repo', repo, '--book', '10p', '--first', '242', '--last', '242',
  '--work', path.join(own, 'work'),
]
fs.mkdirSync(own, { recursive: true })
fs.writeFileSync(path.join(own, 'started.json'), JSON.stringify({
  command: [python, ...args], cwd: repo, startedAt: new Date().toISOString(),
  imagesLoaded: 0, sourcePagesAdded: 0, offlineOnly: true,
}, null, 2) + '\n', { flag: 'wx' })
const result = spawnSync(python, args, { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(path.join(own, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(path.join(own, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' })
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = {
  schema: 'STEMROBIN-181/d946-source242-first-preparation@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', page: 242, book: '10p',
  status: result.status === 0 ? 'FIRST-PREPARED-UNREAD-NOT-SOURCE-APPROVED' : 'FIRST-PREPARATION-FAIL',
  exitCode: result.status, error: result.error?.message ?? null,
  command: [python, ...args], cwd: repo, recordedAt: new Date().toISOString(),
  stdout: { path: path.join(own, 'stdout.txt'), sha256: sha(path.join(own, 'stdout.txt')) },
  stderr: { path: path.join(own, 'stderr.txt'), sha256: sha(path.join(own, 'stderr.txt')) },
  pageDirectory: path.join(own, 'work/10p/pages/0242'),
  sourcePagesAdded: 0, n90Closed: false, parentNewImages: 0,
  paidCalls: 0, prepareReplays: 0, testsBuild: false,
  databasePublisherDeploy: false, gitCommitPush: false,
}
fs.writeFileSync(path.join(own, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(report))
if (result.status !== 0) process.exitCode = 1
