import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = process.cwd()
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const inputs = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author-inputs-01')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const manifest = JSON.parse(fs.readFileSync(path.join(inputs, 'manifest.json'), 'utf8'))
if (manifest.bindings.length !== 12) throw new Error('Expected exactly 12 input bindings')
write('bindings.before.json', {
  manifest: { path: path.relative(repo, path.join(inputs, 'manifest.json')), sha256: hash(path.join(inputs, 'manifest.json')) },
  bindings: manifest.bindings.map(binding => ({
    ...binding,
    actualSha256: hash(binding.path),
    bytes: fs.statSync(binding.path).size,
    matchesManifest: hash(binding.path) === binding.sha256,
  })),
})
if (manifest.bindings.some(binding => hash(binding.path) !== binding.sha256)) throw new Error('Input binding drift: authoring stopped')
for (const number of [85, 86]) {
  const inventory = path.join(root, `fig-g10-${number}.first-pixel-inventory.json`)
  if ((fs.statSync(inventory).mode & 0o777) !== 0o444) throw new Error(`Unsealed inventory ${number}`)
}
const point = (id, at, label, extra = {}) => ({
  id, type: 'point', at, label, visible: false, fontSize: 28, fontWeight: 500, labelColor: 'ink', ...extra,
})
const segment = (id, from, to, dash = 0) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, dash,
})
const connect = object => ({
  id: `${object.id}-connectivity`, type: 'connects', arrow: object.id, from: object.from, to: object.to,
})
const common = (number, textFilter, height, box) => {
  const context = JSON.parse(fs.readFileSync(path.join(inputs, `fig-g10-${number}.context.json`), 'utf8'))
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id: `fig-g10-${number}`,
    mode: 'deterministic',
    source: {
      image: context.sourceImage,
      authoritativeText: context.completeEditionProse.filter(textFilter).map(entry => ({
        lesson: context.lesson, text: entry.text,
      })),
      inventory: [],
    },
    canvas: { width: 480, height, boundingBox: box, background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 480, minTextPx: 16, widths: [480, 300] },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 },
  }
}
const spec85 = common(85, entry => entry.kind === 'p' && entry.source_refs.some(ref => ['p0219#6', 'p0219#9'].includes(ref)), 480, [-4.6, 4.35, 4.6, -4.85])
const net = { slantRadius: 3.6, angleRadians: 5 * Math.PI / 6, apex: [0, 3.4] }
net.baseRadius = net.slantRadius * net.angleRadians / (2 * Math.PI)
net.startAngle = -Math.PI / 2 - net.angleRadians / 2
net.endAngle = -Math.PI / 2 + net.angleRadians / 2
const sectorPoint = angle => [net.apex[0] + net.slantRadius * Math.cos(angle), net.apex[1] + net.slantRadius * Math.sin(angle)]
const contact = sectorPoint(-Math.PI / 2)
const O = [contact[0], contact[1] - net.baseRadius]
spec85.description = 'Complete cone surface net: a circular lateral sector and its tangent circular base; S is the sector center, A and A1 are its radial endpoints, and O is the base center. No numerical measures are displayed.'
spec85.objects = [
  point('S', net.apex, 'S', { labelPlacement: { position: 'N', gap: 21 } }),
  point('A', sectorPoint(net.startAngle), 'A', { labelPlacement: { position: 'NW', gap: 15 } }),
  point('A1', sectorPoint(net.endAngle), 'A\u2081', { labelPlacement: { position: 'NE', gap: 15 } }),
  point('O', O, 'O', { visible: true, size: 3, stroke: 'ink', fill: 'ink', labelPlacement: { position: 'E', gap: 15 } }),
  segment('sector-left-radius', 'S', 'A'),
  segment('sector-right-radius', 'S', 'A1'),
  { id: 'sector-lateral-arc', type: 'arc', center: 'S', start: 'A', end: 'A1', stroke: 'ink', strokeWidth: 3 },
  { id: 'base-circle', type: 'circle', center: 'O', radius: net.baseRadius, stroke: 'ink', strokeWidth: 3, fillOpacity: 0 },
]
spec85.assertions = [
  { id: 'A-on-lateral-circle', type: 'pointOnCircle', point: 'A', center: 'S', radius: net.slantRadius },
  { id: 'A1-on-lateral-circle', type: 'pointOnCircle', point: 'A1', center: 'S', radius: net.slantRadius },
  { id: 'equal-slant-radii', type: 'equalDistance', a: 'S', b: 'A', c: 'S', d: 'A1' },
  { id: 'contact-on-sector', type: 'pointOnCircle', point: contact, center: 'S', radius: net.slantRadius },
  { id: 'contact-on-base', type: 'pointOnCircle', point: contact, center: 'O', radius: net.baseRadius },
  { id: 'external-circle-tangency', type: 'distance', a: 'S', b: 'O', value: net.slantRadius + net.baseRadius },
  { id: 'contact-normal-alignment', type: 'collinear', a: 'S', b: 'O', c: contact },
  ...spec85.objects.filter(object => object.type === 'segment').map(connect),
]
spec85.source.inventory = [{
  id: 'source85-complete-net',
  description: 'One unframed panel: solid S-A and S-A1 radii, solid lower A-A1 sector arc, complete solid circle touching that arc at its lower point, center dot O, and only labels S, A, A1, O. Contact has no source mark and is represented by a coordinate literal in both pointOnCircle assertions. Canvas alignment, exact circularity and arc/circumference-compatible sizing are modern regularization, not printed numeric or symmetry givens.',
  objects: spec85.objects.map(object => object.id),
  assertions: spec85.assertions.map(assertion => assertion.id),
  requires: ['pointRelationships'],
}]
write('fig-g10-85.initial.spec.json', spec85)
write('fig-g10-85.construction.json', {
  provenance: 'FIRST pixels + complete supplied N61 context; no source SVG, old spec, answer or other source image used',
  regularization: {
    ...net, contact, baseCenter: O,
    explanation: 'Uniform scale and centered downward orientation are chosen for readability. The source is a complete cone net, so the chosen sector arc length equals the chosen circular-base circumference. The raster visual ratio is not an exact given. This required net compatibility is not an exercise answer; none of these parameters or relations adds a visible annotation.',
  },
  executableConstructionResiduals: {
    sectorArcMinusBaseCircumference: net.slantRadius * net.angleRadians - 2 * Math.PI * net.baseRadius,
    contactToBaseMinusBaseRadius: Math.hypot(contact[0] - O[0], contact[1] - O[1]) - net.baseRadius,
    centerDistanceMinusRadiusSum: Math.hypot(net.apex[0] - O[0], net.apex[1] - O[1]) - (net.slantRadius + net.baseRadius),
  },
  sourcePrintedMeasures: [],
  addedVisibleGeometry: [],
  sourceCodepointIdentity: 'Historical source Unicode/font HOLD retained; modern mathematical labels follow the supplied edition notation.',
})

const spec86 = common(86, entry => entry.kind === 'p' && entry.source_refs.some(ref => ['p0219#15', 'p0220#6'].includes(ref)), 480, [-4.8, 4.4, 4.8, -5.2])
const projection = {
  lowerRadius: 3, upperRadius: 1.55, lowerCenterY: -2, upperCenterY: 2.5,
  sinElevation: 0.42, sectionFrontAzimuth: 3 * Math.PI / 4,
}
projection.cosElevation = Math.sqrt(1 - projection.sinElevation ** 2)
projection.worldHeight = (projection.upperCenterY - projection.lowerCenterY) / projection.cosElevation
const project = ([x, y, z]) => [x, projection.lowerCenterY + z * projection.cosElevation - y * projection.sinElevation]
const rimWorld = (radius, angle, z) => [radius * Math.cos(angle), radius * Math.sin(angle), z]
const frontAngle = projection.sectionFrontAzimuth
const rearAngle = frontAngle + Math.PI
const worldPoints = {
  O: [0, 0, 0],
  O1: [0, 0, projection.worldHeight],
  A: rimWorld(projection.lowerRadius, frontAngle, 0),
  B: rimWorld(projection.lowerRadius, rearAngle, 0),
  A1: rimWorld(projection.upperRadius, frontAngle, projection.worldHeight),
  B1: rimWorld(projection.upperRadius, rearAngle, projection.worldHeight),
}
const screenPoints = Object.fromEntries(Object.entries(worldPoints).map(([id, value]) => [id, project(value)]))
const lerp = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t)
const upperCenter = screenPoints.O1
const upperRy = projection.upperRadius * projection.sinElevation
const generatorDelta = screenPoints.B.map((value, i) => value - screenPoints.B1[i])
const bx = screenPoints.B1[0] / projection.upperRadius
const by = (screenPoints.B1[1] - upperCenter[1]) / upperRy
const dx = generatorDelta[0] / projection.upperRadius
const dy = generatorDelta[1] / upperRy
const rearExitT = -2 * (bx * dx + by * dy) / (dx * dx + dy * dy)
const rearExit = lerp(screenPoints.B1, screenPoints.B, rearExitT)
const axisExit = [upperCenter[0], upperCenter[1] - upperRy]
const silhouetteSin = (projection.upperRadius - projection.lowerRadius) * projection.sinElevation / (projection.upperCenterY - projection.lowerCenterY)
const rightAngle = Math.asin(silhouetteSin)
const leftAngle = Math.PI - rightAngle
const silhouettes = {
  leftLower: project(rimWorld(projection.lowerRadius, leftAngle, 0)),
  leftUpper: project(rimWorld(projection.upperRadius, leftAngle, projection.worldHeight)),
  rightLower: project(rimWorld(projection.lowerRadius, rightAngle, 0)),
  rightUpper: project(rimWorld(projection.upperRadius, rightAngle, projection.worldHeight)),
}
const screen = p => {
  const [xmin, ymax, xmax, ymin] = spec86.canvas.boundingBox
  return [(p[0] - xmin) * spec86.canvas.width / (xmax - xmin), (ymax - p[1]) * spec86.canvas.height / (ymax - ymin)]
}
// svgPath's coordinates are offsets from the canvas's top-left, in user units.
const raw = p => [p[0] - spec86.canvas.boundingBox[0], spec86.canvas.boundingBox[1] - p[1]]
const ellipseArc = (center, radius, startAngle, endAngle) => {
  const at = angle => [center[0] + radius * Math.cos(angle), center[1] - radius * projection.sinElevation * Math.sin(angle)]
  const start = raw(at(startAngle))
  const end = raw(at(endAngle))
  return `M ${start.join(' ')} A ${radius} ${radius * projection.sinElevation} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 ${end.join(' ')}`
}
const ellipseFull = (center, radius) =>
  ellipseArc(center, radius, 0, Math.PI) + ' ' + ellipseArc(center, radius, Math.PI, 2 * Math.PI).replace(/^M [^A]+/, '')
spec86.description = 'Circular frustum in one explicitly documented orthographic projection. Parallel coaxial circular bases carry opposite diameter endpoints A/B and A1/B1; A1-A is the front generator and O1-O is the height. Preserve the source solid/dashed visibility without adding an apex or measurements.'
spec86.objects = [
  point('A', screenPoints.A, 'A', { labelPlacement: { position: 'SW', gap: 18 } }),
  point('B', screenPoints.B, 'B', { labelPlacement: { position: 'NE', gap: 18, offset: [4, -12] } }),
  point('O', screenPoints.O, 'O', { labelPlacement: { position: 'S', gap: 23 } }),
  point('A1', screenPoints.A1, 'A\u2081'),
  point('B1', screenPoints.B1, 'B\u2081', { labelPlacement: { position: 'NE', gap: 18 } }),
  point('O1', screenPoints.O1, 'O\u2081'),
  { id: 'upper-circular-rim-projection', type: 'svgPath', d: ellipseFull(screenPoints.O1, projection.upperRadius), stroke: 'ink', strokeWidth: 3 },
  { id: 'lower-front-rim-projection', type: 'svgPath', d: ellipseArc(screenPoints.O, projection.lowerRadius, rightAngle, leftAngle), stroke: 'ink', strokeWidth: 3 },
  { id: 'lower-rear-rim-projection', type: 'svgPath', d: ellipseArc(screenPoints.O, projection.lowerRadius, leftAngle, rightAngle + 2 * Math.PI), stroke: 'ink', strokeWidth: 3, dash: 1 },
  segment('left-silhouette', silhouettes.leftUpper, silhouettes.leftLower),
  segment('right-silhouette', silhouettes.rightUpper, silhouettes.rightLower),
  segment('upper-diameter', 'A1', 'B1'),
  segment('lower-diameter', 'A', 'B', 1),
  segment('front-generator', 'A1', 'A'),
  segment('rear-generator-exposed', 'B1', rearExit),
  segment('rear-generator-hidden', rearExit, 'B', 1),
  segment('axis-exposed', 'O1', axisExit),
  segment('axis-hidden', axisExit, 'O', 1),
]
spec86.assertions = [
  { id: 'lower-diameter-collinearity', type: 'collinear', a: 'A', b: 'O', c: 'B' },
  { id: 'upper-diameter-collinearity', type: 'collinear', a: 'A1', b: 'O1', c: 'B1' },
  { id: 'lower-projected-center-midpoint', type: 'equalDistance', a: 'O', b: 'A', c: 'O', d: 'B' },
  { id: 'upper-projected-center-midpoint', type: 'equalDistance', a: 'O1', b: 'A1', c: 'O1', d: 'B1' },
  { id: 'parallel-projected-diameters', type: 'parallel', a: 'A', b: 'B', c: 'A1', d: 'B1' },
  { id: 'common-projected-axis', type: 'displacement', from: 'O', to: 'O1', dx: 0, dy: projection.upperCenterY - projection.lowerCenterY },
  { id: 'rear-transition-on-generator', type: 'collinear', a: 'B1', b: 'B', c: rearExit },
  { id: 'axis-transition-on-height', type: 'collinear', a: 'O1', b: 'O', c: axisExit },
  ...spec86.objects.filter(object => object.type === 'segment').map(connect),
]
spec86.source.inventory = [{
  id: 'source86-projected-frustum',
  description: 'One unframed panel: complete solid upper rim; solid front and dashed rear lower rim; solid silhouette generators; solid A1-A and A1-B1; dashed A-B; B1-B and O1-O exposed solid inside the upper disk, hidden dashed below its front rim; only labels A, B, O, A1, B1, O1. No apex, numerical givens or angle marks. Curves are exact projected circles, not unrelated ellipses. All unlabeled silhouette/visibility anchors are coordinate literals; their projection, tangency and clipping construction is recorded separately. Camera, dimensions and legible label placements are modern regularization, not source measures.',
  objects: spec86.objects.map(object => object.id),
  assertions: spec86.assertions.map(assertion => assertion.id),
  requires: ['pointRelationships'],
}]
write('fig-g10-86.initial.spec.json', spec86)
const length3 = (a, b) => Math.hypot(...a.map((value, i) => value - b[i]))
const tangentResidual = angle => {
  const generator = [
    (projection.upperRadius - projection.lowerRadius) * Math.cos(angle),
    (projection.upperCenterY - projection.lowerCenterY) - (projection.upperRadius - projection.lowerRadius) * projection.sinElevation * Math.sin(angle),
  ]
  const tangent = [-projection.lowerRadius * Math.sin(angle), -projection.lowerRadius * projection.sinElevation * Math.cos(angle)]
  return generator[0] * tangent[1] - generator[1] * tangent[0]
}
write('fig-g10-86.construction.json', {
  provenance: 'FIRST pixels + complete supplied N61 context; no source SVG, old spec, answer or other source image used',
  explicitProjection: {
    ...projection,
    formula: '[screenX, screenY] = [worldX, lowerCenterY + worldZ*cosElevation - worldY*sinElevation]',
    orthographicCamera: 'Positive worldY is toward the viewer; screen y is upward before the canvas transform. Parallel planes z=0 and z=H map to ellipses with the same flattening sinElevation. World axis is perpendicular to both circular base planes; apparent 2D section angles and generator lengths are NOT asserted to be their true 3D values.',
    worldPoints, screenPoints, silhouettes, silhouetteAngles: [leftAngle, rightAngle],
    upperDiskClipping: { rearExitT, rearExit, axisExit },
    cameraAndDimensionsAreSourceGivens: false,
    symmetryNote: 'Opposite diameter endpoints and coaxial circular sections follow the full supplied edition description, not guessed letters or source pixel metric symmetry.',
    curveFallback: 'Native FigureSpec has no ellipse object. Only the exact circle projections use schema-supported svgPath elliptical arcs. All named points, lines and labels remain native deterministic objects.',
    screenPixels: Object.fromEntries(Object.entries(screenPoints).map(([id, p]) => [id, screen(p)])),
  },
  executableConstructionResiduals: {
    frontRearTrueGeneratorLengthDifference: length3(worldPoints.A1, worldPoints.A) - length3(worldPoints.B1, worldPoints.B),
    rearTransitionEllipseEquationMinusOne: (rearExit[0] / projection.upperRadius) ** 2 + ((rearExit[1] - upperCenter[1]) / upperRy) ** 2 - 1,
    axisTransitionEllipseEquationMinusOne: ((axisExit[1] - upperCenter[1]) / upperRy) ** 2 - 1,
    leftProjectedSilhouetteTangencyCross: tangentResidual(leftAngle),
    rightProjectedSilhouetteTangencyCross: tangentResidual(rightAngle),
  },
  sourcePrintedMeasures: [],
  addedVisibleGeometry: [],
  sourceCodepointIdentity: 'Historical source Unicode/font HOLD retained; modern mathematical labels follow the supplied edition notation.',
})
write('routes-and-native.json', {
  figures: [85, 86].map(number => ({
    figure: `fig-g10-${number}`, mode: 'deterministic', purpose: 'instructional',
    reason: number === 85 ? 'Only exact circular net geometry and mathematical labels' : 'Only projected circular frustum geometry and mathematical labels',
    semanticArtworkRequired: false, paidOrModelCalls: 0, specSchema: 'ld-s10y-image/figure-spec@2',
    initialInventory: { path: `fig-g10-${number}.first-pixel-inventory.json`, sha256: hash(path.join(root, `fig-g10-${number}.first-pixel-inventory.json`)), mode: '0444' },
    context: { path: path.relative(repo, path.join(inputs, `fig-g10-${number}.context.json`)), sha256: hash(path.join(inputs, `fig-g10-${number}.context.json`)), completeProseAndExercisesRead: true },
  })),
  native: ['.agents/skills/ld-s10y-image/assets/figure-spec.schema.json', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs'].map(file => ({ path: file, sha256: hash(path.join(repo, file)) })),
  restrictions: 'Offline author only. No reviewer verdict, record_review, promotion, template application, lesson approval, backend, network, dependency changes, git writes or formal tests.',
})
console.log('Created only the two initial author drafts, construction records, routes/native bindings and 12 before-bindings.')
