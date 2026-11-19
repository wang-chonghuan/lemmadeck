import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d886-n87-fig201202-affected-repair')
const F = path.join(D, 'figures/fig-202')
const C = path.join(F, 'targeted-label-recovery')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const original = load(path.join(F, 'fig-202.render.json'))
assert.equal(original.status, 'fail')
assert.deepEqual(original.collisions.map(c => c.id), ['reflected-2-label-label'])
assert.ok(original.displayChecks.every(c => c.status === 'pass'))
fs.mkdirSync(C, { recursive: false })
const spec = load(path.join(F, 'spec.json'))
const label = spec.objects.find(o => o.id === 'reflected-2-label')
assert.deepEqual(label.at, [330, 305])
label.at = [330, 285]
const current = path.join(C, 'spec.json')
fs.writeFileSync(current, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
const diff = spawnSync('diff', ['-u', path.join(F, 'spec.json'), current], { cwd: R, encoding: 'utf8' })
assert.equal(diff.status, 1)
fs.writeFileSync(path.join(D, 'diffs/fig-202.targeted-label-recovery.diff'), diff.stdout, { flag: 'wx' })
const args = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', current, '--svg', path.join(C, 'fig-202.svg'),
  '--report', path.join(C, 'fig-202.render.json'),
]
const result = spawnSync('node', args, {
  cwd: R, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, TMPDIR: path.join(D, 'runtime-tmp') },
})
const receipt = {
  diagnosis: 'FIRST renderer reported only 1/2 label-box overlap. Move label 2 down 20 canvas pixels, leaving every geometry coordinate/assertion and other label unchanged.',
  first: {
    spec: { path: path.join(F, 'spec.json'), sha256: hash(path.join(F, 'spec.json')) },
    render: { path: path.join(F, 'fig-202.render.json'), sha256: hash(path.join(F, 'fig-202.render.json')) },
    unchanged: true,
  },
  change: { object: 'reflected-2-label', field: 'at', before: [330, 305], after: [330, 285] },
  command: 'node', args, cwd: R, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  standaloneValidationReplay: false,
  rendererIntrinsicValidation: true,
  passReplay: false, extraImages: 0,
}
fs.writeFileSync(path.join(D, 'calls/fig-202-targeted-label-recovery.json'),
  `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(`Targeted label recovery renderer: exit ${result.status}`)
assert.equal(result.status, 0, result.stdout || result.stderr)
assert.equal(load(path.join(C, 'fig-202.render.json')).status, 'pass')
