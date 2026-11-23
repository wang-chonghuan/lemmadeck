import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const [id, attempt] = process.argv.slice(2)
assert.ok(['fig-234', 'fig-235'].includes(id))
assert.match(attempt, /^attempt-[1-9][0-9]*$/)
const target = path.join(owned, id, attempt)
assert.ok(!fs.existsSync(target), 'preserve existing attempt; never overwrite')
fs.mkdirSync(target, { recursive: true })
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const currentSpec = path.join(owned, `${id}.spec.json`)
const snapshotSpec = path.join(target, `${id}.spec.json`)
fs.copyFileSync(currentSpec, snapshotSpec)
const commands = []
const reusedEvidence = []
const run = (name, command, argv) => {
  const start = new Date().toISOString()
  const result = spawnSync(command, argv, { cwd, encoding: 'utf8', maxBuffer: 10_000_000 })
  const stdout = path.join(target, `${name}.stdout.txt`)
  const stderr = path.join(target, `${name}.stderr.txt`)
  fs.writeFileSync(stdout, result.stdout ?? '')
  fs.writeFileSync(stderr, result.stderr ?? '')
  commands.push({
    name, cwd, command, argv, startedAt: start, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: { path: stdout, sha256: hash(stdout) }, stderr: { path: stderr, sha256: hash(stderr) },
  })
  fs.writeFileSync(path.join(target, 'execution.json'), `${JSON.stringify({ commands, reusedEvidence }, null, 2)}\n`)
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  return result.status === 0
}
const scripts = '.agents/skills/ld-s10y-image/scripts'
const geometryProjection = (spec) => ({
  source: spec.source,
  canvas: spec.canvas,
  display: spec.display,
  objects: spec.objects.map(({ labelPlacement, ...item }) => item),
})
const previousAttempts = fs.readdirSync(path.join(owned, id))
  .filter((name) => /^attempt-\d+$/.test(name) && name !== attempt)
  .sort((a, b) => Number(b.slice(8)) - Number(a.slice(8)))
const previousAttempt = previousAttempts.find((name) =>
  fs.existsSync(path.join(owned, id, name, 'supplemental-geometry.stdout.txt')),
)
const previousTarget = path.join(owned, id, previousAttempt || 'attempt-1')
const previousGeometry = path.join(previousTarget, 'supplemental-geometry.stdout.txt')
let reuseGeometry = false
if (attempt !== 'attempt-1' && fs.existsSync(previousGeometry)) {
  const previous = JSON.parse(fs.readFileSync(previousGeometry))
  const oldSpec = JSON.parse(fs.readFileSync(path.join(previousTarget, `${id}.spec.json`)))
  const newSpec = JSON.parse(fs.readFileSync(currentSpec))
  reuseGeometry = previous.results.every((item) => item.status === 'pass') &&
    JSON.stringify(geometryProjection(oldSpec)) === JSON.stringify(geometryProjection(newSpec))
  if (reuseGeometry) reusedEvidence.push({
    stage: 'supplemental-geometry', path: previousGeometry, sha256: hash(previousGeometry),
    reason: 'Only point label placement changed; source, canvas, display and geometric objects are identical.',
  })
}
if (!run('validate-draft', 'python3', [`${scripts}/validate_spec.py`, snapshotSpec, '--stage', 'draft', '--json'])) {
  process.exitCode = 1
} else if (!reuseGeometry && !run('supplemental-geometry', 'node', [path.join(owned, 'check-geometry.mjs'), id])) {
  process.exitCode = 1
} else if (!run('native-render', 'node', [
  `${scripts}/render_spec.mjs`, '--spec', snapshotSpec,
  '--svg', path.join(target, `${id}.svg`),
  '--png', path.join(target, `${id}.native.png`),
  '--report', path.join(target, `${id}.native.render.json`),
])) {
  process.exitCode = 1
} else {
  assert.equal(hash(currentSpec), hash(snapshotSpec))
  const native = JSON.parse(fs.readFileSync(path.join(target, `${id}.native.render.json`)))
  assert.equal(native.status, 'pass')
  const finalRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures'
  const final = structuredClone(native)
  final.spec.path = `${finalRoot}/${id}.spec.json`
  final.output.svg.path = `${finalRoot}/${id}.svg`
  for (const suffix of ['svg', 'native.png']) {
    fs.copyFileSync(path.join(target, `${id}.${suffix}`), path.join(owned, `${id}.${suffix}`))
  }
  fs.writeFileSync(path.join(owned, `${id}.render.json`), `${JSON.stringify(final, null, 2)}\n`)
  fs.writeFileSync(path.join(target, 'final-path-map.json'), `${JSON.stringify({
    status: 'AUTHOR_ONLY', promoted: false,
    nativeEvidence: `${id}.native.render.json`, finalMetadata: path.join(owned, `${id}.render.json`),
    rewrites: { 'spec.path': final.spec.path, 'output.svg.path': final.output.svg.path },
    note: 'Structured metadata relocation only; current SVG/spec hashes unchanged. All actual writes remain in owned author root.',
  }, null, 2)}\n`)
  console.log(`AUTHOR_ONLY: ${id} native PASS; final-path metadata prepared without promotion.`)
}
