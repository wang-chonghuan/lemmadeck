import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck'
const figure = process.argv[2]
const stage = process.argv[3] || 'first-candidates'
if (!['fig-245', 'fig-246'].includes(figure) || !['first-candidates', 'repair-candidate'].includes(stage)) {
  throw new Error('expected scoped figure and candidate stage')
}
const folder = path.join(out, stage, figure)
const spec = path.join(folder, 'spec.json')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const run = (name, executable, args) => {
  const receiptPath = path.join(folder, `${name}.receipt.json`)
  if (fs.existsSync(receiptPath)) throw new Error('immutable execution already exists')
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  fs.writeFileSync(path.join(folder, `${name}.stdout.txt`), result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(folder, `${name}.stderr.txt`), result.stderr || '', { flag: 'wx' })
  const receipt = {
    schema: 'bounded-figure-author/native-execution@1',
    figure, stage, operation: name, executable, args, cwd: root,
    startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    spec: { path: spec, sha256: sha(spec) },
    status: result.status === 0 ? 'pass' : 'fail',
    authorOnly: true,
  }
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
  return receipt
}
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const validation = run('validate', 'python3', [validator, spec, '--stage', 'draft', '--json'])
const render = run('render', 'node', [renderer, '--spec', spec,
  '--svg', path.join(folder, `${figure}.svg`),
  '--png', path.join(folder, `${figure}.preview.png`),
  '--report', path.join(folder, `${figure}.render.json`)])
const bindings = fs.readdirSync(folder).filter((file) => !file.endsWith('.bytes.json')).map((file) => {
  const absolute = path.join(folder, file)
  fs.chmodSync(absolute, 0o444)
  return { file: absolute, sha256: sha(absolute), size: fs.statSync(absolute).size, mode: '0444' }
})
fs.writeFileSync(path.join(folder, 'candidate.bytes.json'), `${JSON.stringify({
  schema: 'bounded-figure-author/immutable-candidate-bytes@1',
  figure, stage, nativeValidation: validation.status, nativeRender: render.status, bindings,
}, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(path.join(folder, 'candidate.bytes.json'), 0o444)
console.log(JSON.stringify({
  figure, stage, validation: validation.status, render: render.status,
  report: path.join(folder, `${figure}.render.json`), preservedCandidateFiles: bindings.length,
}))
