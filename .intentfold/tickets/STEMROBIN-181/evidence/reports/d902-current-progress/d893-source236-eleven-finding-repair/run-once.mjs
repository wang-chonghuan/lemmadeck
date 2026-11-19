import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.dirname(new URL(import.meta.url).pathname)
const prior = path.join(tmp, 'd870-source236-punctuation-repair')
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const save = (name, value) => {
  const f = path.join(out, name)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, item.name)
    const target = path.join(to, item.name)
    if (item.isDirectory()) copyTree(source, target)
    else if (item.isFile()) {
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o644)
      assert.equal(sha(source), sha(target))
    }
  }
}
copyTree(path.join(prior, 'root/10p/pages/0236'), path.join(out, 'root/10p/pages/0236'))
copyTree(path.join(prior, 'work/10p/pages/0236'), path.join(out, 'work/10p/pages/0236'))
const original = path.join(prior, 'root/10p/pages/0236/page.md')
const firstReview = path.join(tmp, 'd883-source236-first-independent-review/report.current.json')
assert.equal(sha(firstReview), 'e009743cddc78ac759e31828cb1db680c553f6cb21722056fadc71ccbf296ab8')
function run(name, args) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', ...args]
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = save('calls/' + name + '/receipt.json', { command, cwd: repo, exit: r.status, stdout: r.stdout, stderr: r.stderr })
  assert.equal(r.status, 0, r.stdout + r.stderr)
  return receipt
}
const patch = run('patch-FIRST', [path.join(out, 'patch.py')])
const native = run('finalize-retry3', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10p', '--page', '236',
  '--root', path.join(out, 'root'), '--work', path.join(out, 'work'),
])
const page = path.join(out, 'root/10p/pages/0236')
const audit = read(path.join(page, 'audit.json'))
assert.deepEqual([audit.lines_printed, audit.lines_md], [26, 26])
const png = path.join(out, 'work/10p/pages/0236/figures/tbl-p0236-01.png')
assert.equal(sha(png), sha(path.join(prior, 'work/10p/pages/0236/figures/tbl-p0236-01.png')))
const report = save('report.json', {
  ticket: 'STEMROBIN-181', physicalPage: 236, status: 'ELEVEN-FINDINGS-REPAIRED-NATIVE26-26-AFFECTED-REVIEW-PENDING',
  original: bind(original), firstReview: bind(firstReview), changes: bind(path.join(out, 'changes.json')),
  patch, native, outputs: ['page.md', 'page.json', 'audit.json'].map(n => bind(path.join(page, n))),
  portraitPNGUnchanged: bind(png),
  portraitSVGReuse: bind(path.join(tmp, 'd891-source236-portrait-first-vectorize/work/10p/pages/0236/figures/tbl-p0236-01.svg')),
  firstSourceFailuresPreserved: true, repairRoundsCumulative: 2, parentImages: 0, paidCalls: 0,
  portraitVectorReplays: 0, wholeSourceReviewReplays: 0, sourceApproval: false,
})
console.log(JSON.stringify({ report, sourceRows: [26, 26], portraitUnchanged: true, paidCalls: 0 }))
