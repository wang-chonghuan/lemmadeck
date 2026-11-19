import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const before = `${O}/fig-197/repair-1/spec.json`
const after = `${O}/fig-197/repair-2/spec.json`
assert.ok(!fs.existsSync(after))
const spec = JSON.parse(fs.readFileSync(before, 'utf8'))
const receipt = `${O}/fig-197/repair-1/render.command.json`
assert.equal(JSON.parse(fs.readFileSync(receipt, 'utf8')).exitCode, 1)
const changes = []
for (const side of ['upper', 'lower']) {
  const a = spec.objects.find(o => o.id === 'slit').at
  const b = spec.objects.find(o => o.id === `lens-${side === 'upper' ? 'top' : 'bottom'}`).at
  const at = t => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
  const name = `${side}-incident-arrow`
  const arrow = spec.objects.find(o => o.id === name)
  changes.push({ object: name, before: structuredClone(arrow), after: { from: at(0.4), to: at(0.7) } })
  arrow.from = at(0.4)
  arrow.to = at(0.7)
  const connects = spec.assertions.find(a => a.id === `${name}-connects`)
  connects.from = arrow.from
  connects.to = arrow.to
  spec.assertions.find(a => a.id === `${name}-start-on-ray`).point = arrow.from
  spec.assertions.find(a => a.id === `${name}-end-on-ray`).point = arrow.to
}
fs.mkdirSync(`${O}/fig-197/repair-2`, { recursive: true })
fs.writeFileSync(after, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
fs.writeFileSync(`${O}/fig-197/repair-2/repair.json`, `${JSON.stringify({
  ordinal: 2, figure: 'fig-197', before: { path: before, sha256: hash(before) },
  after: { path: after, sha256: hash(after) },
  failure: { path: receipt, sha256: hash(receipt) },
  diagnosis: 'The 0.1-fraction incident arrow segments were shorter than the native arrowhead allocation. JSXGraph produced an unsupported marker for materializeArrowheads. Lengthen only those two markers along their unchanged source rays; retain native renderer code and exact endpoint/on-ray assertions.',
  changes, sourceFactsChanged: false, cumulativeContentRepairs: 2,
  nativeRendererModified: false, approval: 'none', review: 'not performed',
}, null, 2)}\n`, { flag: 'wx' })
console.log(`fig-197 repair-2 ${hash(after)}`)
