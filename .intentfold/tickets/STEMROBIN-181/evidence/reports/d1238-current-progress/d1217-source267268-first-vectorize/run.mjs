import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const outputs = []
for (const [page, directory, expected] of [
  [267, 'd1206-source267-caption-enum-repair', '30e2beac18aa789e30dc4d70feef9e5db91d608b4027c5d0c80efaa5d9c01195'],
  [268, 'd1207-source268-count-text-repair', '5634789558174ee01a5d4daeb998b1eecadec4449ec65c5f22b88c612d99f79a'],
]) {
  const from = path.join(tmp, directory, 'work/10p/pages', String(page).padStart(4, '0'), 'figures/fig-228.png')
  assert.equal(sha(from), expected)
  const scope = path.join(own, 'source' + page)
  const work = path.join(scope, 'work')
  const png = path.join(work, '10p/pages', String(page).padStart(4, '0'), 'figures/fig-228.png')
  const svg = png.replace(/\.png$/, '.svg')
  fs.mkdirSync(path.dirname(png), { recursive: true })
  fs.copyFileSync(from, png, fs.constants.COPYFILE_EXCL)
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'vectorize', '--book', '10p',
    '--page', String(page), '--root', path.join(scope, 'root'), '--work', work]
  save(path.join(scope, 'started.json'), {
    page, command, source: bind(from), parentImageOpens: 0, firstExecution: true,
  })
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 180000, maxBuffer: 12 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = save(path.join(scope, 'receipt.json'), {
    page, command, exitCode: result.status, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
  })
  assert.equal(sha(from), expected)
  assert.equal(sha(png), expected)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  outputs.push({ page, source: bind(from), png: bind(png), svg: bind(svg), receipt })
  console.log(JSON.stringify({ page, status: 'FIRST-VECTORIZE-PASS', receipt }))
}
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', status: 'FIRST-VECTORIZE-PASS',
  outputs, independentSvgReviewPending: true, globalFigureOwnershipUnresolved: true,
  sourceConsumption: false, completeCard: false, parentImageOpens: 0,
  passedNativeReplays: 0, paidCalls: 0,
})
