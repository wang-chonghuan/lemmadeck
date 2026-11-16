import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const repo = path.resolve(out, '../../../../..')
const local = (...parts) => path.join(out, ...parts)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: sha(file) })
const write = (file, data) => {
  assert.ok(file.startsWith(`${out}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  assert.ok(!fs.existsSync(file), `refusing to overwrite ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
const initialSpec = read(local('spec/initial.json'))
const initialReport = read(local('render/initial.json'))
assert.equal(initialReport.status, 'fail')
assert.deepEqual(initialReport.collisions.map(item => item.id), [1, 2, 3, 4, 5].map(n => `source-tick-${n}-value-label`))
assert.ok(initialReport.displayChecks.every(item => item.status === 'pass'))
const repaired = structuredClone(initialSpec)
const edits = []
for (const object of repaired.objects) {
  if (!/^source-tick-[1-5]-value$/.test(object.id)) continue
  const before = [...object.at]
  object.at[1] -= 16
  edits.push({ object: object.id, field: 'at', before, after: [...object.at], canvasPixelShift: [0, 16] })
}
assert.equal(edits.length, 5)
const restored = structuredClone(repaired)
for (const edit of edits) restored.objects.find(item => item.id === edit.object).at = edit.before
assert.deepEqual(restored, initialSpec)
write(local('spec/repair.json'), repaired)
write(local('commands/repair-plan.json'), {
  targetedRepairOrdinal: 1,
  maximumTargetedRepairs: 1,
  reason: 'Native initial render found five tick-label/stroke collisions. Move only tick label anchors down 16 canvas pixels.',
  initialSpec: binding(local('spec/initial.json')),
  initialFailure: binding(local('render/initial.json')),
  repairedSpec: binding(local('spec/repair.json')),
  changes: edits,
  allGeometrySourceInventoryAuthorityDisplayColorsAndOtherLabelsUnchanged: true,
  svgEdits: 0,
})
function run(id, executable, args) {
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' }
  delete env.PWDEBUG
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  const entry = {
    id, executable, args, cwd: repo, started, ended: new Date().toISOString(),
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' },
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }
  write(local('commands', `${id}.json`), entry)
  return entry
}
const native = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const validation = run('native-validate-repair', python, [
  path.join(native, 'validate_spec.py'), local('spec/repair.json'), '--stage', 'draft', '--json',
])
const rendering = run('native-render-repair', process.execPath, [
  path.join(native, 'render_spec.mjs'), '--spec', local('spec/repair.json'),
  '--svg', local('svg/repair.svg'), '--report', local('render/repair.json'),
])
write(local('commands/repair-summary.json'), {
  validationExit: validation.exitCode, renderExit: rendering.exitCode,
  nativeCountsTotal: { buildcontext: 1, validateExplicit: 2, validateRendererInternal: 2, render: 2 },
  targetedRepairsTotal: 1,
  status: validation.exitCode === 0 && rendering.exitCode === 0 ? 'pass' : 'fail',
})
console.log(JSON.stringify({
  validationExit: validation.exitCode, renderExit: rendering.exitCode,
  render: fs.existsSync(local('render/repair.json')) ? read(local('render/repair.json')) : rendering.stderr,
}, null, 2))
