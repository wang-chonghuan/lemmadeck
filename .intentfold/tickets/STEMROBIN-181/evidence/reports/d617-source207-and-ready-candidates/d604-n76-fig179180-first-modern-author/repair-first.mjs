import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const pin = file => ({path: file, sha256: sha(file), bytes: fs.statSync(file).size})
const write = (file, data) => {
  assert(!fs.existsSync(file), `Refusing overwrite: ${file}`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}
const changes = {
  179: {
    O: {position: 'SW', gap: 26, offset: [0, 0]},
    'F-left': {position: 'SW', gap: 26, offset: [0, 0]},
    A1: {position: 'S', gap: 26, offset: [-45, 12]},
  },
  180: {B: {position: 'NW', gap: 26, offset: [0, 0]}},
}

const n = Number(process.argv[2])
assert([179, 180].includes(n))
const before = path.join(own, `fig-${n}.spec.json`)
const beforeRender = path.join(own, `fig-${n}.render.json`)
const after = path.join(own, `fig-${n}.repair1.spec.json`)
const firstSpec = JSON.parse(fs.readFileSync(before, 'utf8'))
const repaired = structuredClone(firstSpec)
assert.equal(JSON.parse(fs.readFileSync(beforeRender, 'utf8')).status, 'fail')
for (const [id, placement] of Object.entries(changes[n])) {
  repaired.objects.find(o => o.id === id).labelPlacement = placement
}
assert.deepEqual(repaired.assertions, firstSpec.assertions)
assert.deepEqual(repaired.source, firstSpec.source)
assert.deepEqual(repaired.objects.map(({labelPlacement, ...o}) => o),
  firstSpec.objects.map(({labelPlacement, ...o}) => o))
write(after, repaired)
for (const suffix of ['spec.json', 'render.json', 'svg', 'native-invocation.json']) {
  fs.chmodSync(path.join(own, `fig-${n}.${suffix}`), 0o444)
}
write(path.join(own, `fig-${n}.repair1.before-after.json`), {
  status: 'FIRST-NATIVE-FAIL-PRESERVED-ONE-TARGETED-LABEL-REPAIR',
  firstSpec: pin(before), firstRenderFAIL: pin(beforeRender),
  firstSVG: pin(path.join(own, `fig-${n}.svg`)), repairedSpec: pin(after),
  changes: Object.entries(changes[n]).map(([id, afterPlacement]) => ({
    id, before: firstSpec.objects.find(o => o.id === id).labelPlacement, after: afterPlacement,
  })),
  geometryChanged: false, assertionsChanged: false, sourceTextChanged: false,
  repairWave: 1, figureSpecRepairs: 1, furtherRepairsAllowed: false,
})
const render = path.join(own, `fig-${n}.repair1.render.json`)
const svg = path.join(own, `fig-${n}.repair1.svg`)
const result = spawnSync(process.execPath, [
  path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec', after, '--svg', svg, '--report', render,
], {cwd: repo, encoding: 'utf8'})
write(path.join(own, `fig-${n}.repair1.native-invocation.json`), {
  status: result.status, stdout: result.stdout, stderr: result.stderr,
  nativeValidatorInvocations: 1, nativeRendererInvocations: 1,
  repairWave: 1, furtherRepairsAllowed: false,
  independentFIGPassClaimed: false, independentDISPLAYPassClaimed: false,
})
console.log(result.stdout)
console.error(result.stderr)
process.exitCode = result.status ?? 1
