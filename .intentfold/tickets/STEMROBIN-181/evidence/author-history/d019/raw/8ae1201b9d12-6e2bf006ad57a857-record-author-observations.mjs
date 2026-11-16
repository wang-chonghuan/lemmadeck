import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const work = '.tmp/STEMROBIN-181/9p-d019-n70-figures'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const observations = [
  {
    id: 'fig-125', repairsUsed: 1, revision: 'repair-1',
    full: 'Solid sphere boundary, twelve plus distribution marks, twelve outward exterior rays, center point, +q and upper-left R0 radius arrow all visible. Repair separates R0 and +q from the charge annotations; radius remains uncalibrated.',
    mobile331: 'At331 all twelve marks/rays remain distinct; R0 subscript, +q and center-to-surface radius arrow are readable with no edge loss.',
    mobile342: 'At342 solid outline, twelve exterior arrowheads and both source labels remain visible without overlap.',
    limits: ['The twelve inset plus symbols are surface-distribution annotations, not physical interior charges or a microscopic charge count. Their inward label offset is declared modern layout.'],
  },
  {
    id: 'fig-126', repairsUsed: 1, revision: 'repair-1',
    full: 'Central point and twelve continuous outward rays visible inside and outside dashed reference sphere. R0 arrow ends at the reference radius. +q moved to the outer15-degree wedge and is not intersected by field strokes.',
    mobile331: 'At331 dashed reference circle and all twelve rays remain distinct; R0 and +q readable in open wedges; no added surface plus marks or interior-field solution label.',
    mobile342: 'At342 dashed outline, common center, radius arrow and twelve outward arrowheads remain complete; displaced +q is visible without clipping.',
    limits: ['The original +q label was near the center. Its modern outer-wedge placement is explicit layout regularization; independent reviewer must judge its association with the sole center charge, not treat native collision PASS as semantic approval.'],
  },
  {
    id: 'fig-127', repairsUsed: 0, revision: 'initial',
    full: 'Complete hatched perspective sheet, sigma label and fifteen left/right outward arrow pairs visible. Arrow directions oppose across the sheet; projected shafts/spacing are schematic, not calibrated distances.',
    mobile331: 'At331 sheet boundary, hatching, sigma and all thirty arrowheads remain visible; label has reserved space and outer ends retain margins.',
    mobile342: 'At342 both arrow directions, staggered lengths/origins and complete sheet frame remain visible; no value or answer annotation.',
    limits: ['The label gap and hatch spacing are graphical regularization. The3D normal relation is in source-inventory construction; projected outline angles must not be read as measured2D perpendicularity.'],
  },
]
const figures = observations.map(observation => {
  const dir = `${work}/${observation.id}/${observation.revision}`
  const render = JSON.parse(fs.readFileSync(`${dir}/render.json`, 'utf8'))
  const paths = [`${dir}/${observation.id}.png`, ...[640, 331, 342].map(width => `${dir}/width-${width}.png`)]
  return {
    id: observation.id, repairsUsed: observation.repairsUsed, maximumTargetedRepairs: 1,
    role: 'author-one-round-pixel-observations-not-independent-review',
    images: paths.map((file, i) => ({
      path: file, sha256: sha(file), actualOpened: true, detail: 'original',
      observation: i < 2 ? observation.full : i === 2 ? observation.mobile331 : observation.mobile342,
    })),
    defects: render.status === 'pass' ? [] : render.collisions,
    limitationsForIndependentGate: observation.limits,
  }
})
const out = `${work}/author-observations.json`
assert(!fs.existsSync(out))
fs.writeFileSync(out, `${JSON.stringify({
  role: 'figure-author-only', figures,
  originalPNGsOpenedSeparately: 3, finalFullOutputPNGsOpened: 3, finalWidthPreviewsOpened: 9,
  additionalInitialFullPixelOpens: ['fig-125', 'fig-126'],
  fig127InitialFullOpenIsItsUnchangedFinalFullOpen: true,
  independentApproval: false, nativeStandardsRelaxed: false,
}, null, 2)}\n`)
console.log(JSON.stringify({ path: out, sha256: sha(out) }, null, 2))
