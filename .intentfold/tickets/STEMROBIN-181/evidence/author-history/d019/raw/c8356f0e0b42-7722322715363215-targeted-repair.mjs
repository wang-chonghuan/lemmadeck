import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n70-figures'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  assert(!fs.existsSync(file))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const at = (degrees, radius) => [
  320 + radius * Math.cos(degrees * Math.PI / 180),
  280 + radius * Math.sin(degrees * Math.PI / 180),
]
const source = load(`${work}/context.json`)
assert.equal(sha(source.edition.binding.path), source.edition.binding.sha256)
const specs = ['fig-125', 'fig-126'].map(id => {
  const spec = load(`${work}/${id}/initial/spec.json`)
  if (id === 'fig-125') {
    spec.objects.find(object => object.id === 'metal-sphere-boundary').radius = 178
    for (let i = 0; i < 12; i++) {
      const surface = at(i * 30, 178)
      spec.objects.find(object => object.id === `surface-positive-mark-${i + 1}`).at = at(i * 30, 136)
      const labelAssertion = spec.assertions.find(assertion => assertion.id === `surface-positive-mark-${i + 1}-bound-position`)
      labelAssertion.point = surface
      labelAssertion.radius = 178
      spec.objects.find(object => object.id === `radial-field-line-${i + 1}`).from = surface
      spec.assertions.find(assertion => assertion.id === `radial-field-line-${i + 1}-endpoints`).from = surface
      const rayAssertion = spec.assertions.find(assertion => assertion.id === `radial-field-line-${i + 1}-starts-at-surface`)
      rayAssertion.point = surface
      rayAssertion.radius = 178
    }
    const radiusTip = at(165, 178)
    spec.objects.find(object => object.id === 'radius-arrow').to = radiusTip
    spec.assertions.find(assertion => assertion.id === 'radius-arrow-connects').to = radiusTip
    const displacement = spec.assertions.find(assertion => assertion.id === 'radius-arrow-displacement')
    displacement.to = radiusTip
    displacement.dx = radiusTip[0] - 320
    displacement.dy = radiusTip[1] - 280
    const distance = spec.assertions.find(assertion => assertion.id === 'radius-arrow-exact-radius')
    distance.b = radiusTip
    distance.value = 178
    spec.objects.find(object => object.id === 'radius-label').at = [110, 340]
  } else {
    spec.objects.find(object => object.id === 'total-positive-charge-label').at = at(15, 220)
  }
  spec.source.inventory[0].description += ' First targeted layout repair moves labels/annotation offsets only; displayed radius remains uncalibrated and the source total charge/field meaning is unchanged.'
  writeNew(`${work}/${id}/repair-1/spec.json`, spec)
  return { id, initial: bind(`${work}/${id}/initial/spec.json`), repaired: bind(`${work}/${id}/repair-1/spec.json`) }
})
writeNew(`${work}/targeted-repair.json`, {
  role: 'author-only-single-targeted-layout-repair',
  repairsUsed: { 'fig-125': 1, 'fig-126': 1, 'fig-127': 0 },
  initialReports: ['fig-125', 'fig-126'].map(id => bind(`${work}/${id}/initial/render.json`)),
  initialPNGs: ['fig-125', 'fig-126'].map(id => bind(`${work}/${id}/initial/${id}.png`)),
  changes: [
    { figure: 'fig-125', reason: 'Native plus-mark and R0/+q label collisions; initial full pixels actually inspected.', delta: 'Uncalibrated sphere radius160->178, annotation radius105->136 with source-bound surface anchors updated; R0 label moved to110,340. Twelve marks/rays and their directions, total charge, all text/font/display fields remain unchanged.' },
    { figure: 'fig-126', reason: 'Native +q stroke collision; initial full pixels inspected.', delta: 'Only +q label radius130->220 along the same15-degree label-bearing, in an open wedge. Dashed reference sphere, all twelve radial rays and R0 relation unchanged.' },
  ],
  specs, minTextPx: 16, widths: [640, 331, 342],
  context: bind(`${work}/context.json`), sourceAndLessonBindingsUnchanged: true,
  noFurtherAuthorRepairsAllowedFor125126: true, nativeToolsChanged: false, independentApproval: false,
})
console.log(JSON.stringify({ repair: bind(`${work}/targeted-repair.json`), specs }, null, 2))
