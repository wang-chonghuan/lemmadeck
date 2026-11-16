import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const id = process.argv[2]
const attempt = process.argv[3]
if (!/^fig-(1[2-9]|20)$/.test(id) || !['initial', 'repair'].includes(attempt)) throw new Error('Outside assigned scope')
const directory = path.join(root, '.tmp/s10y-image/batch007/10c', id)
const attemptDirectory = path.join(directory, attempt)
if (fs.existsSync(attemptDirectory)) throw new Error('Attempt already exists; no duplicate call')
if (attempt === 'repair' && !fs.existsSync(path.join(directory, 'initial', 'execution.json'))) throw new Error('No preserved initial attempt')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
fs.mkdirSync(attemptDirectory)
const spec = path.join(directory, 'spec.json')
fs.copyFileSync(spec, path.join(attemptDirectory, 'spec.json'), fs.constants.COPYFILE_EXCL)
fs.copyFileSync(path.join(directory, 'author-curve-ledger.json'), path.join(attemptDirectory, 'author-curve-ledger.json'), fs.constants.COPYFILE_EXCL)
const relative = p => path.relative(root, p)
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const runs = [
  { kind: 'official-draft-validation', executable: python,
    args: ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', relative(spec), '--stage', 'draft', '--json'] },
  { kind: 'official-render', executable: 'node',
    args: ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', relative(spec),
      '--svg', relative(path.join(attemptDirectory, `${id}.svg`)),
      '--png', relative(path.join(attemptDirectory, `${id}.native.png`)),
      '--report', relative(path.join(attemptDirectory, `${id}.render.json`))] },
]
const env = { ...process.env, PYTHON: path.join(root, python) }
delete env.PWDEBUG
const results = []
for (const run of runs) {
  const start = new Date().toISOString()
  const result = spawnSync(run.executable, run.args, { cwd: root, env, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  for (const stream of ['stdout', 'stderr']) {
    fs.writeFileSync(path.join(attemptDirectory, `${run.kind}.${stream}.txt`), result[stream] || '', { flag: 'wx' })
  }
  results.push({ ...run, command: `env -u PWDEBUG PYTHON=${python} ${run.executable} ${run.args.join(' ')}`,
    start, end: new Date().toISOString(), status: result.status, signal: result.signal, error: result.error?.message || null })
}
const reportPath = path.join(attemptDirectory, `${id}.render.json`)
const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
const outputs = fs.readdirSync(attemptDirectory).filter(n => n !== 'execution.json').map(name => {
  const p = path.join(attemptDirectory, name)
  return { path: relative(p), sha256: hash(p), bytes: fs.statSync(p).size }
})
const execution = { schema: 'STEMROBIN-184/author-render-attempt@1', id, attempt,
  role: 'author only; no independent semantic PASS', spec: { path: relative(spec), sha256: hash(spec) },
  explicitValidateCalls: 1, rendererCalls: 1, note: 'Existing renderer also internally invokes its draft validator; no extra authored validation or retry.',
  results, renderStatus: report?.status || 'no-render-report', renderErrors: report?.errors || null, outputs }
fs.writeFileSync(path.join(attemptDirectory, 'execution.json'), `${JSON.stringify(execution, null, 2)}\n`, { flag: 'wx' })
for (const suffix of ['svg', 'native.png', 'render.json']) {
  const p = path.join(attemptDirectory, `${id}.${suffix}`)
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(directory, `${id}.${suffix}`))
}
console.log(JSON.stringify({ id, attempt, statuses: results.map(r => r.status), renderStatus: execution.renderStatus,
  reportErrors: report?.errors, reportPath: relative(reportPath), specSha256: hash(spec) }, null, 2))
