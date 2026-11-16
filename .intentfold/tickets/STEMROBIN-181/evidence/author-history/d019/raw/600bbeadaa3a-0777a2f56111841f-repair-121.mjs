import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const work = '.tmp/STEMROBIN-181/9p-d019-n69-figures'
const initial = `${work}/fig-121/initial`
const repaired = `${work}/fig-121/repair`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const spec = JSON.parse(fs.readFileSync(`${initial}/spec.json`, 'utf8'))
const originalSpec = structuredClone(spec)
const inventory = JSON.parse(fs.readFileSync('.intentfold/tickets/STEMROBIN-181/tmp/d019-n69-figure-source-inventory.json', 'utf8')).figures.find(item => item.id === 'fig-121')
const render = JSON.parse(fs.readFileSync(`${initial}/render.json`, 'utf8'))
assert.equal(render.status, 'fail')
assert(!fs.existsSync(repaired), 'Only one targeted repair')
spec.canvas.height = 1160
spec.canvas.boundingBox = [0, 1160, 640, 0]
for (const [prefix, pixels] of [['positive', inventory.readablePositivePixels], ['negative', inventory.readableNegativePixels]]) {
  for (const [index, pixel] of pixels.entries()) {
    const x = prefix === 'negative' && index === 1 ? 195 : pixel[0]
    const at = [20 + x * 1.35, 1010 - pixel[1] * 3.2]
    spec.objects.find(item => item.id === `${prefix}-${index + 1}-ring`).center = at
    spec.objects.find(item => item.id === `${prefix}-${index + 1}-sign`).at = at
  }
}
spec.objects.find(item => item.id === 'metal-frame').points = [[42, 955], [620, 935], [608, 210], [44, 216]]
spec.objects.find(item => item.id === 'source-unreadable-region').points = [[45, 953], [119, 953], [150, 856], [136, 840], [80, 904], [45, 904]]
for (let index = 0; index < 5; index++) {
  const item = spec.objects.find(item => item.id === `unreadable-hatch-${index}`)
  item.from = [49 + index * 12, 944]
  item.to = [65 + index * 12, 918]
}
spec.objects.find(item => item.id === 'diagram-title').at = [320, 1110]
spec.objects.find(item => item.id === 'unreadable-note').at = [320, 120]
spec.objects.find(item => item.id === 'nonquantitative-note').at = [320, 50]
spec.modernAdditions.push('The sole label-spacing repair expands the unmeasured vertical carrier layout and marginal notes; the second upper minus is regularized within its original two-ion gap. Sign identities, readable counts, source uncertainty and font thresholds are unchanged.')
assert.deepEqual(spec.source, originalSpec.source)
assert.deepEqual(spec.assertions, originalSpec.assertions)
assert.deepEqual(spec.display, originalSpec.display)
assert.deepEqual(spec.objects.map(item => [item.id, item.type, item.text]), originalSpec.objects.map(item => [item.id, item.type, item.text]))
fs.mkdirSync(repaired)
fs.writeFileSync(`${repaired}/spec.json`, `${JSON.stringify(spec, null, 2)}\n`)
fs.writeFileSync(`${repaired}/repair-record.json`, `${JSON.stringify({
  id: 'fig-121', repairsUsed: 1, maximumTargetedRepairs: 1,
  reason: 'Native label bounding-box collisions and title/note margin clearance; no source-symbol or count correction.',
  initial: Object.fromEntries(['spec.json', 'render.json', 'fig-121.svg', 'fig-121.png', 'width-previews.json'].map(name => [name, bind(`${initial}/${name}`)])),
  repairedSpec: bind(`${repaired}/spec.json`),
  sourceInventoryAssertionsDisplayAndTextIdentitiesUnchanged: true,
  figureGeometryRegularizationNotClaimedMeasured: true,
  minTextPxNotLowered: true,
}, null, 2)}\n`)
console.log(JSON.stringify(bind(`${repaired}/spec.json`), null, 2))
