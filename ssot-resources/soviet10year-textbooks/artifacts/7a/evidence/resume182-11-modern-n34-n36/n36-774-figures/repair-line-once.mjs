import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { base, root, hash, writeNew } from './author-graphs.mjs'

assert.equal(process.cwd(), root)
const id = 'fig-choice-n36-774-line'
const firstSpec = path.join(base, `${id}.spec.FIRST.json`)
const firstReceipt = path.join(base, `${id}.render.FIRST.receipt.json`)
const failure = JSON.parse(fs.readFileSync(firstReceipt, 'utf8'))
assert.equal(failure.exitCode, 2)
for (const file of failure.filesPreservedAtCompletion) assert.equal(hash(file.path), file.sha256)
assert.equal(hash(firstSpec), failure.spec.sha256)
const spec = JSON.parse(fs.readFileSync(firstSpec, 'utf8'))
const xAxis = spec.objects.find(object => object.id === 'x-axis')
const yAxis = spec.objects.find(object => object.id === 'y-axis')
xAxis.ticks.find(tick => tick.label === '6').labelPlacement.gap = 35
yAxis.ticks.find(tick => tick.label === '6').labelPlacement.gap = 25
yAxis.ticks.find(tick => tick.label === '-1').labelPlacement.gap = 8
spec.objects.find(object => object.id === 'origin-label').at = [-0.36, -0.3]
const repairedSpec = writeNew(`${id}.spec.REPAIR1.json`, spec)
const declaration = writeNew(`${id}.repair.REPAIR1.json`, {
  schema: 'n36-774/targeted-repair@1',
  parentFirstFailure: { path: firstReceipt, sha256: hash(firstReceipt) },
  originalSpec: { path: firstSpec, sha256: hash(firstSpec) },
  repairedSpec: { path: repairedSpec, sha256: hash(repairedSpec) },
  changes: [
    'x-axis label 6 keeps its x coordinate and S placement; gap 18 -> 35 px avoids the affine curve.',
    'y-axis label 6 keeps its y coordinate and W placement; gap 13 -> 25 px avoids the affine curve.',
    'y-axis label -1 keeps its y coordinate and W placement; gap 13 -> 8 px clears the nearby x-axis -1 label.',
    'Origin numeral anchor (-0.28,-0.35) -> (-0.36,-0.3) clears the y-axis -1 label; no marker is introduced.',
  ],
  unchanged: ['all curves', 'all tick coordinates', 'grid', 'frame', 'formula labels', 'written prompt', 'display widths', 'font sizes', 'mathematical assertions'],
  repairCount: 1, maximumRepairs: 1, independentGraphGate: 'parent-owned pending',
})
const outputs = {
  svg: path.join(base, `${id}.REPAIR1.svg`),
  render: path.join(base, `${id}.render.REPAIR1.json`),
  preview: path.join(base, `${id}.preview.REPAIR1.png`),
}
for (const file of Object.values(outputs)) assert.ok(!fs.existsSync(file))
const runtime = path.join(base, 'runtime')
const env = {
  ...process.env, TMPDIR: `${path.join(runtime, 'tmp')}/`,
  HOME: path.join(runtime, 'home'), XDG_CACHE_HOME: path.join(runtime, 'cache'),
  XDG_CONFIG_HOME: path.join(runtime, 'config'), PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}
for (const stage of ['validate', 'render']) {
  const command = stage === 'validate' ? 'python3' : process.execPath
  const args = stage === 'validate'
    ? ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', repairedSpec, '--stage', 'draft', '--json']
    : [
        '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
        '--spec', repairedSpec, '--svg', outputs.svg, '--report', outputs.render, '--png', outputs.preview,
      ]
  const receiptName = `${id}.${stage}.REPAIR1.receipt.json`
  assert.ok(!fs.existsSync(path.join(base, receiptName)))
  const result = spawnSync(command, args, {
    cwd: root, env, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = writeNew(receiptName, {
    schema: 'n36-774/command-receipt@1', attempt: 'REPAIR1', figure: id, stage,
    cwd: root, command, args, spec: { path: repairedSpec, sha256: hash(repairedSpec) },
    repair: { path: declaration, sha256: hash(declaration) },
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: result.stdout || '', stderr: result.stderr || '',
    filesPreservedAtCompletion: Object.entries(outputs)
      .filter(([, file]) => fs.existsSync(file))
      .map(([role, file]) => ({ role, path: file, sha256: hash(file) })),
    independentGraphGate: { owner: 'parent', status: 'pending' },
  })
  console.log(JSON.stringify({ stage, exitCode: result.status, receipt, sha256: hash(receipt) }))
  if (result.status !== 0) {
    console.log(result.stdout || '')
    console.error(result.stderr || '')
    process.exitCode = 1
    break
  }
}
