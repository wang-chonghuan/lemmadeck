import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d156-n9-crystal-appearance-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d156/figures/fig-13')
const runId = `D156-repair01-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
const write = (file, value) => {
  assert.ok(file.startsWith(`${evidence}/`) || file.startsWith(`${output}/`))
  assert.ok(!fs.existsSync(file), `Preserve existing output: ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const original = path.join(output, 'fig-13.spec.json')
const spec = JSON.parse(fs.readFileSync(original, 'utf8'))
const arc = spec.objects.find(object => object.id === 'middle-right-remnant-arc')
assert.deepEqual(arc.start, [251, 252])
assert.deepEqual(arc.end, [251, 232])
assert.equal(arc.strokeWidth, 10)
arc.start = [251, 247]
arc.end = [251, 237]
arc.strokeWidth = 20
const specPath = path.join(output, 'fig-13.repair-01.spec.json')
write(specPath, spec)
write(path.join(evidence, `${runId}.content-change.json`), {
  runId, figure: 'fig-13', repairOrdinal: 1, cause: 'D156-F13-01',
  original: binding(original), repaired: binding(specPath),
  changes: [{ object: arc.id, start: arc.start, end: arc.end, strokeWidth: arc.strokeWidth }],
  unchanged: 'All site anchors, other objects, source bindings, complete approved ZH/EN text, inventory mappings and assertions.',
  furtherContentRepairsAuthorized: 0
})
function native(stage, command, args) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: process.env })
  write(path.join(evidence, `${runId}.${stage}.receipt.json`), {
    schema: 'STEMROBIN-181/D156-native-receipt@1', runId, stage,
    command: [command, ...args], cwd, exitCode: result.status,
    signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    executionError: result.error?.message || null,
    currentSpec: binding(specPath), independentReview: false,
    repairOrdinal: 1
  })
  console.log(JSON.stringify({ runId, stage, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  return result.status === 0
}
if (native('validate-02', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft', '--json'])) {
  native('render-02', 'node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specPath,
    '--svg', path.join(output, 'fig-13.repair-01.svg'),
    '--png', path.join(output, 'fig-13.repair-01.preview.png'),
    '--report', path.join(output, 'fig-13.repair-01.render.json')
  ])
}
