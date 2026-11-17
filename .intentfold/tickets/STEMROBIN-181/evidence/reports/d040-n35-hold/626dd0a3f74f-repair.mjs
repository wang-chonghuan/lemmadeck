import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const bind = p => ({
  path: p,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const receipt = path.join(owned, 'author-repair.json')
assert(!fs.existsSync(receipt), 'Only one author repair')
const failedPath = path.join(owned, 'initial/fig-63.render.json')
const failed = JSON.parse(fs.readFileSync(failedPath))
assert.equal(failed.status, 'fail')
assert.equal(failed.displayChecks[0].measuredMinPx, 16)
const specPath = path.join(owned, 'fig-63.spec.json')
const before = bind(specPath)
assert.equal(before.sha256, failed.spec.sha256)
const spec = JSON.parse(fs.readFileSync(specPath))
const objectById = new Map(spec.objects.map(o => [o.id, o]))
const changed = []
const moveText = (id, y) => {
  const object = objectById.get(id)
  assert.equal(object.type, 'text')
  object.at[1] = 610 - y
  changed.push(id)
}
for (const id of ['step-up', 'step-down-35', 'step-down-6', 'step-down-220']) {
  moveText(`${id}-name`, 400)
}
moveText('generator-name', 212)
for (const id of ['transmission-110', 'transmission-35', 'transmission-6']) {
  moveText(`${id}-voltage-number`, 258)
}
moveText('users-220-middle-voltage-unit', 300)
moveText('users-220-lower-voltage-unit', 412)
for (const [id, ys] of [
  ['users-220-upper', [240, 254]],
  ['users-220-middle', [330, 350]],
  ['users-220-lower', [440, 454]],
]) {
  for (let index = 0; index < 2; index++) {
    const object = objectById.get(`${id}-wire-${index + 1}`)
    object.from[1] = object.to[1] = 610 - ys[index]
    const check = spec.assertions.find(a => a.id === `${object.id}-connects`)
    check.from = [...object.from]
    check.to = [...object.to]
    changed.push(object.id)
  }
  const parallel = spec.assertions.find(a => a.id === `${id}-paired-conductors`)
  const first = objectById.get(`${id}-wire-1`)
  const second = objectById.get(`${id}-wire-2`)
  Object.assign(parallel, { a: [...first.from], b: [...first.to], c: [...second.from], d: [...second.to] })
}
fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`)
const addition = 'Observed render-failure repair: increase two-line clearance without shrinking type; move Generator above the station border; separate the three final horizontal output pairs and their two source voltage labels vertically. Station identity, order, all branch endpoints, and all source numbers are unchanged.'
for (const file of ['context.json', 'source-inventory.json']) {
  const p = path.join(owned, file)
  const data = JSON.parse(fs.readFileSync(p))
  data.modernRegularization.push(addition)
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`)
}
fs.writeFileSync(receipt, `${JSON.stringify({
  schema: 'ld-s10y-image/bounded-author-repair@1',
  reason: 'Actual initial label/geometry collision failure; single authorized repair.',
  initialFailure: bind(failedPath), before, after: bind(specPath), changedObjects: changed,
  changedVoltageText: false, changedFontSizes: false, initialArtifactsPreserved: true,
}, null, 2)}\n`)
console.log(`Single repair applied to ${changed.length} label/port objects.`)
