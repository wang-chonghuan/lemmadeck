import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const context = read('source-context.json')
const inventory = read('source-inventory.json')
assert.equal(read('actual-opens.json').budget.newImages, 1)
assert(inventory.recordedBeforeModernSpecOrRender)

const width = 640
const height = 620
const center = [190, 300]
const radius = 155
const outerDistance = 340
// Orthographic basis: horizontal=(.8,0,.6), vertical=(0,1,0).
// The camera faces from (.6,0,-.8). Normalize before projecting onto the sphere.
const boundary3d = [
  [1, 0.38, 0.02], [1, 0.28, 0.33], [1, -0.06, 0.46],
  [1, -0.36, 0.15], [1, -0.26, -0.28], [1, 0.05, -0.42],
]
const norm = v => Math.hypot(...v)
const scale = (v, r) => v.map(c => c * r)
const spherical = v => scale(v, radius / norm(v))
const screen = v => [center[0] + 0.8 * v[0] + 0.6 * v[2], center[1] - v[1]]
const user = s => [s[0], height - s[1]]
const point = (id, s, visible = false) => ({ id, type: 'point', at: user(s), visible, size: 2, stroke: 'ink', fill: 'ink' })
const pathData = (points, close = false) =>
  points.map((s, i) => `${i ? 'L' : 'M'}${s[0].toFixed(4)} ${s[1].toFixed(4)}`).join(' ') + (close ? ' Z' : '')
const text = (id, at, value, fontSize = 32) => ({
  id, type: 'text', at: user(at), text: value, fontSize, fontWeight: 500,
  labelPlacement: { position: 'CENTER', gap: 0 },
})
const objects = []
const assertions = []
const sourceIds = ['source-vertex']
const relationIds = []
objects.push({ ...point('source-vertex', center, true), size: 3.5 })
for (let i = 0; i < 6; i++) {
  objects.push(point(`source-boundary-${i + 1}`, screen(scale(boundary3d[i], outerDistance)), true))
  sourceIds.push(`source-boundary-${i + 1}`)
}
objects.push({
  id: 'source-panel', type: 'polygon',
  points: [[1, 0.52, -0.65], [1, 0.52, 0.65], [1, -0.52, 0.65], [1, -0.52, -0.65]].map(v => user(screen(scale(v, outerDistance)))),
  fill: 'grid', fillOpacity: 0.18, stroke: 'muted', strokeWidth: 1.5,
})
objects.push({
  id: 'source-arbitrary-boundary', type: 'polygon',
  points: boundary3d.map((_, i) => `source-boundary-${i + 1}`),
  fill: 'accentSoft', fillOpacity: 0.10, stroke: 'ink', strokeWidth: 3.5,
})
objects.push({
  id: 'modern-sphere', type: 'circle', center: 'source-vertex', radius,
  stroke: 'muted', strokeWidth: 2.5, fill: 'paper', fillOpacity: 0,
})
for (let i = 0; i < 6; i++) {
  const n = i + 1
  const boundary = `source-boundary-${n}`
  const start = `modern-arrow-start-${n}`
  const end = `modern-arrow-end-${n}`
  const patch = `modern-sphere-intercept-${n}`
  objects.push(point(start, screen(scale(boundary3d[i], outerDistance * 0.52))))
  objects.push(point(end, screen(scale(boundary3d[i], outerDistance * 0.69))))
  objects.push(point(patch, screen(spherical(boundary3d[i]))))
  objects.push({ id: `source-ray-${n}`, type: 'segment', from: 'source-vertex', to: boundary, stroke: 'ink', strokeWidth: 2 })
  objects.push({ id: `source-outward-arrow-${n}`, type: 'arrow', from: start, to: end, stroke: 'ink', strokeWidth: 2.2 })
  const connected = `source-ray-connected-${n}`
  assertions.push({ id: connected, type: 'connects', arrow: `source-ray-${n}`, from: 'source-vertex', to: boundary })
  relationIds.push(connected)
  assertions.push({ id: `modern-arrow-connected-${n}`, type: 'connects', arrow: `source-outward-arrow-${n}`, from: start, to: end })
  assertions.push({ id: `modern-arrow-on-ray-${n}`, type: 'collinear', a: 'source-vertex', b: start, c: boundary })
  assertions.push({ id: `modern-arrow-end-on-ray-${n}`, type: 'collinear', a: 'source-vertex', b: end, c: boundary })
  assertions.push({ id: `modern-patch-on-ray-${n}`, type: 'collinear', a: 'source-vertex', b: patch, c: boundary })
  sourceIds.push(`source-ray-${n}`, `source-outward-arrow-${n}`)
}
assertions.push({ id: 'source-six-outward-arrows', type: 'objectCount', objectType: 'arrow', count: 6 })

const sphereSamples = []
for (let i = 0; i < 6; i++) {
  const a = boundary3d[i]
  const b = boundary3d[(i + 1) % 6]
  for (let j = 0; j < 40; j++) {
    const t = j / 40
    sphereSamples.push(spherical(a.map((c, k) => c * (1 - t) + b[k] * t)))
  }
}
const patchScreen = sphereSamples.map(screen)
const equator = Array.from({ length: 181 }, (_, i) => {
  const t = i * Math.PI / 90
  return screen([radius * Math.cos(t), radius * 0.32 * Math.sin(t), radius * Math.sqrt(1 - 0.32 ** 2) * Math.sin(t)])
})
objects.push({ id: 'modern-sphere-equator', type: 'svgPath', d: pathData(equator), stroke: 'muted', strokeWidth: 1.5, strokeOpacity: 0.5, dash: 2 })
objects.push({ id: 'modern-spherical-patch', type: 'svgPath', d: pathData(patchScreen, true), stroke: 'accent', strokeWidth: 3, fill: 'accentSoft', fillOpacity: 0.45 })
const angleLoop = sphereSamples.map(v => screen(scale(v, 65 / radius)))
objects.push({ id: 'source-angle-domain-mark', type: 'svgPath', d: pathData(angleLoop, true), stroke: 'muted', strokeWidth: 1.7 })

const radiusEnd = [center[0] - radius * 0.6, center[1] - radius * 0.8]
objects.push(point('modern-radius-end', radiusEnd))
objects.push({ id: 'modern-radius', type: 'segment', from: 'source-vertex', to: 'modern-radius-end', stroke: 'ink', strokeWidth: 2.5 })
assertions.push({ id: 'modern-radius-distance', type: 'distance', a: 'source-vertex', b: 'modern-radius-end', value: radius })
assertions.push({ id: 'modern-radius-on-sphere-silhouette', type: 'pointOnCircle', point: 'modern-radius-end', center: 'source-vertex', radius })
assertions.push({ id: 'modern-radius-connected', type: 'connects', arrow: 'modern-radius', from: 'source-vertex', to: 'modern-radius-end' })
const patchTarget = patchScreen[5]
objects.push(point('modern-patch-target', patchTarget))
objects.push(point('modern-patch-leader-start', [365, 210]))
objects.push({ id: 'modern-patch-leader', type: 'segment', from: 'modern-patch-leader-start', to: 'modern-patch-target', stroke: 'muted', strokeWidth: 1.5 })
assertions.push({ id: 'modern-patch-leader-connected', type: 'connects', arrow: 'modern-patch-leader', from: 'modern-patch-leader-start', to: 'modern-patch-target' })

objects.push(text('modern-sphere-label', [135, 85], 'Sphere'))
objects.push(text('modern-boundary-label', [470, 65], 'Arbitrary boundary'))
objects.push(text('modern-origin-label', [166, 312], 'O'))
objects.push(text('modern-radius-label', [120, 224], 'R'))
objects.push(text('modern-area-label', [370, 186], 'S'))
objects.push(text('modern-solid-angle-label', [254, 358], '\u03a9'))
objects.push(text('modern-origin-description', [188, 500], 'O: vertex = center'))
objects.push(text('modern-area-description', [470, 500], 'S: curved area'))
objects.push(text('modern-equation', [320, 560], '\u03a9 = S / R\u00b2', 36))

const authoritativeText = ['zh', 'en'].map(lang => ({
  lesson: 'phy10-c2-s2-n67',
  text: context.completeAuthoritativeTexts[lang].lesson.prose.map(b => b.text).filter(Boolean).join('\n\n'),
}))
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-134', mode: 'deterministic',
  description: 'Solid angle from a common vertex to an arbitrary noncircular boundary. A sphere centered at that vertex intercepts curved area S at radius R, defining Omega = S / R squared. The six-corner schematic is one arbitrary example, not a circular-cone restriction.',
  source: {
    image: { path: context.source.path, sha256: context.source.sha256 }, authoritativeText,
    inventory: [
      { id: 'source-common-vertex-and-six-rays', description: 'Pixel source: six outward rays share one left vertex and meet the six corners of the noncircular right outline. Modern point markers and arrow positions are regularized; no printed source labels or exact dimensions are claimed.', objects: sourceIds, assertions: [...relationIds, 'source-six-outward-arrows'], requires: ['pointRelationships'] },
      { id: 'source-angle-mark', description: 'Pixel source: small near-vertex angular-domain loop. The modern loop uses the same direction family, with an added prose-supported Omega label.', objects: ['source-angle-domain-mark'], assertions: [] },
      { id: 'source-panel-and-arbitrary-boundary', description: 'Pixel source: a quadrilateral perspective panel and a noncircular six-corner outline. Modern subdued panel fill, schematic projection and all English labels are declared additions.', objects: ['source-panel', 'source-arbitrary-boundary'], assertions: [] },
    ],
  },
  canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, widths: [342, 640] },
  objects, assertions, layout: { minLabelGap: 4 },
}
save('fig-134.spec.json', spec)
const errors = sphereSamples.map(v => Math.abs(norm(v) - radius))
const cameraDots = sphereSamples.map(v => 0.6 * v[0] - 0.8 * v[2])
assert(Math.max(...errors) < 1e-10)
assert(Math.min(...cameraDots) > 0)
save('geometry-evidence.json', {
  schema: 'bounded-n67-fig134-author-geometry@1', role: 'Author computation, not independent review',
  model: { origin: [0, 0, 0], sphereRadius: radius, arbitraryBoundaryPlaneX: outerDistance, dimensionlessBoundaryVertices: boundary3d, screenCenter: center, screenHorizontal: [0.8, 0, 0.6], screenVertical: [0, 1, 0], cameraFacing: [0.6, 0, -0.8] },
  construction: 'Interpolate each arbitrary planar boundary edge, radially normalize every 3D sample to R, then apply the same orthographic projection as the rays. This is a curved spherical patch, not the outer planar area.',
  sphericalPatchSamples: sphereSamples.length, maxSphereRadiusError: Math.max(...errors), minimumVisibleHemisphereDot: Math.min(...cameraDots),
  radiusEndpoint3d: [-radius * 0.6 * 0.8, radius * 0.8, -radius * 0.6 * 0.6],
  projectedRadiusLength: Math.hypot(radiusEnd[0] - center[0], radiusEnd[1] - center[1]),
  diagramCoordinateScaleIsNotPrintedGivenData: true,
  numericAreaSOrOmegaNotInvented: true,
  formula: 'Omega = sphericalPatchArea / R^2',
  custom3dChecksSupplementNative2dAssertions: true,
  sourceInventory: { path: path.join(out, 'source-inventory.json'), sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(out, 'source-inventory.json'))).digest('hex') },
  modernAdditions: inventory.modernAdditionsSeparateFromPixels,
  textAffectedReviewStillPending: true, independentFigureReview: 'HOLD-NOT-REVIEWED',
})
console.log(JSON.stringify({ spec: path.join(out, 'fig-134.spec.json'), objects: objects.length, assertions: assertions.length, labels: 9, displayWidths: [342, 640], nativeFontSize: 32, minimumExpectedLabelPx: 32 * 342 / 640 }, null, 2))
