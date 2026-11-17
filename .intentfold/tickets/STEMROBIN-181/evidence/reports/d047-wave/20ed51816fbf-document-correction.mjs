import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const A = path.dirname(fileURLToPath(import.meta.url))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const before = bind(`${A}/inputs/before/initial-regularization.json`)
const current = bind(`${A}/regularization.json`)
const corrected = []
for (const name of ['source-observations.json', 'fig-69/initial/source-inventory.json',
  'fig-71/initial/source-inventory.json']) {
  const file = `${A}/${name}`
  const metadata = read(file)
  assert.equal(metadata.regularization.sha256, before.sha256)
  const previous = `${A}/inputs/before/${name.replaceAll('/', '-')}`
  fs.copyFileSync(file, previous, fs.constants.COPYFILE_EXCL)
  metadata.regularization = current
  fs.writeFileSync(file, `${JSON.stringify(metadata, null, 2)}\n`)
  corrected.push({ before: bind(previous), current: bind(file) })
}
for (const number of [69, 71]) {
  const file = `${A}/fig-${number}/initial/geometry-check.json`
  const check = read(file)
  const oldMapping = corrected.find(item => item.current.path.endsWith(`fig-${number}/initial/source-inventory.json`))
  assert.equal(check.sourceMapping.sha256, oldMapping.before.sha256)
  const previous = `${A}/inputs/before/fig-${number}-geometry-check.json`
  fs.copyFileSync(file, previous, fs.constants.COPYFILE_EXCL)
  check.sourceMapping = oldMapping.current
  fs.writeFileSync(file, `${JSON.stringify(check, null, 2)}\n`)
  corrected.push({ before: bind(previous), current: bind(file), geometryChecksUnchanged: true })
}
const invariant = [69, 71].map(number => {
  const F = `${A}/fig-${number}/initial`
  const spec = bind(`${F}/fig-${number}.spec.json`)
  const svg = bind(`${F}/fig-${number}.svg`)
  const report = read(`${F}/fig-${number}.render.json`)
  assert.equal(report.spec.sha256, spec.sha256)
  assert.equal(report.output.svg.sha256, svg.sha256)
  return { figure: number, spec, svg, render: bind(`${F}/fig-${number}.render.json`),
    unchangedFromInitialRender: true }
})
const receipt = {
  status: 'DOCUMENTATION-ONLY-CORRECTED', before, current, corrected, invariant,
  reason: 'Twelve alternating interior vertices produce six schematic zigzag cycles, not three. Neither count is a source-given physical quantity.',
  sourceFactsChanged: false, geometryChanged: false, FigureSpecChanged: false,
  rendererOutputChanged: false, targetedFigureRepair: false,
}
fs.writeFileSync(`${A}/document-correction.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: receipt.status, corrected: corrected.length, specAndOutputChanges: 0 }))
