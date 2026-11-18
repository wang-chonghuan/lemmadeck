import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const attempt = process.argv[2] || 'initial'
assert(['initial', 'repair-1'].includes(attempt))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const spec = path.join(out, 'fig-134.spec.json')
const target = path.join(out, attempt)
fs.mkdirSync(target)
fs.copyFileSync(spec, path.join(target, 'fig-134.spec.json'), fs.constants.COPYFILE_EXCL)
const command = [
  path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec', path.join(target, 'fig-134.spec.json'),
  '--svg', path.join(target, 'fig-134.svg'),
  '--report', path.join(target, 'fig-134.render.json'),
]
const startedUtc = new Date().toISOString()
const proc = spawnSync(process.execPath, command, {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const finishedUtc = new Date().toISOString()
fs.writeFileSync(path.join(target, 'stdout.txt'), proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(target, 'stderr.txt'), proc.stderr || '', { flag: 'wx' })
const outputs = ['fig-134.spec.json', 'fig-134.svg', 'fig-134.render.json', 'stdout.txt', 'stderr.txt']
  .filter(name => fs.existsSync(path.join(target, name)))
  .map(name => ({ path: path.join(target, name), sha256: hash(path.join(target, name)), bytes: fs.statSync(path.join(target, name)).size }))
const receipt = {
  schema: 'bounded-n67-fig134-native-render-receipt@1', role: 'First author native result, not independent visual review',
  attempt, command: [process.execPath, ...command], cwd: root, startedUtc, finishedUtc,
  exitCode: proc.status, error: proc.error?.message || null, outputs,
  noScreenshotOutputRequested: true, stableRendererUnmodified: true,
  nativeBrowserOnlyInsideExistingJSXGraphRenderer: true,
}
fs.writeFileSync(path.join(target, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(receipt, null, 2))
if (proc.stdout) console.log(proc.stdout)
if (proc.stderr) console.error(proc.stderr)
process.exitCode = proc.status ?? 1
