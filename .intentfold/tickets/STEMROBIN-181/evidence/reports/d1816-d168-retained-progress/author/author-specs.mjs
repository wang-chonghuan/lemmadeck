import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d168-n5-figures23-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d168/figures')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = p => ({path: p, bytes: fs.statSync(p).size, sha256: hash(p)})
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (p, x) => {
  fs.mkdirSync(path.dirname(p), {recursive: true})
  fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n', {flag: 'wx'})
}
assert.equal(hash(path.join(author, 'input-freeze.json')), '0cfe565887d4f6f4bdffdca15ec681a778dd513de874048b94f88bc43c8eafa3')
const input = read(path.join(author, 'input-freeze.json'))
const verified = []
function verifyTree(x) {
  if (!x || typeof x !== 'object') return
  if (x.path && x.sha256 && Number.isInteger(x.bytes)) {
    const actual = binding(x.path)
    assert.equal(actual.sha256, x.sha256, x.path)
    assert.equal(actual.bytes, x.bytes, x.path)
    verified.push(actual)
  } else {
    for (const value of Object.values(x)) verifyTree(value)
  }
}
verifyTree(input)
const settled = read(path.join(author, 'source-settled-inventory.json'))
assert.equal(settled.recordedBeforeAnyFigureSpecOrDrawing, true)
assert.equal(settled.imageOpensAtSettledInventory, 4)
const contexts = Object.fromEntries(['fig-02', 'fig-03'].map(id => {
  const c = read(path.join(author, id + '.input-context.json'))
  verifyTree(c.nativeContexts)
  verifyTree(c.sourceImage)
  verifyTree(c.durableSourceImage)
  return [id, c]
}))
write(path.join(author, 'input-binding-check.json'), {
  status: 'current',
  cwd,
  checkedAt: new Date().toISOString(),
  inputFreeze: binding(path.join(author, 'input-freeze.json')),
  bindings: [...new Map(verified.map(b => [b.path, b])).values()],
  nativeContextCallsReplayed: 0,
  sourceOrTextReviewsReplayed: 0
})

const xy = (o, r, deg) => [o[0] + r * Math.cos(deg * Math.PI / 180), o[1] + r * Math.sin(deg * Math.PI / 180)]
const text = (id, at, value, size = 30) => ({
  id, type: 'text', at, text: value, fontSize: size,
  labelPlacement: {position: 'CENTER'}, fontWeight: 500
})
const segment = (id, from, to, stroke = 'ink', width = 2) => ({
  id, type: 'segment', from, to, stroke, strokeWidth: width
})
const arrow = (id, from, to, stroke = 'ink', width = 2) => ({
  id, type: 'arrow', from, to, stroke, strokeWidth: width
})
const connects = (id, object) => ({
  id, type: 'connects', arrow: object.id, from: object.from, to: object.to
})
const arc = (id, center, radius, start, end, stroke = 'ink', width = 3) => ({
  id, type: 'arc', center, start: xy(center, radius, start),
  end: xy(center, radius, end), stroke, strokeWidth: width
})
const pathObject = (id, commands, height, stroke = 'ink', width = 3) => ({
  id, type: 'svgPath', stroke, strokeWidth: width,
  d: commands.map(([kind, ...values]) => kind + values.map((v, i) => i % 2 ? height - v : v).join(' ')).join(' ')
})
const group = (id, description, objects, assertions, requires = []) => ({
  id, description, objects, assertions, ...(requires.length ? {requires} : {})
})
function base(id, width, height, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description,
    source: {
      image: {path: contexts[id].durableSourceImage.path, sha256: contexts[id].durableSourceImage.sha256},
      authoritativeText: [
        {lesson: 'phy9-c1-s1-n5', text: contexts[id].fullText.zh},
        {lesson: 'phy9-c1-s1-n5', text: contexts[id].fullText.en}
      ],
      inventory: []
    },
    canvas: {width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true},
    display: {purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16},
    objects: [], assertions: [], layout: {minLabelGap: 4}
  }
}
function figure2() {
  const s = base('fig-02', 960, 960,
    "The textbook's historical field-ion microscope cross-section: a needle tip, conducting film, glass bulb, vacuum-pump sidearm and illustrative outward radial ion paths. This uncalibrated schematic is not an atom photograph or apparatus construction/operation instructions.")
  const o = [360, 630]
  s.objects.push({id: 'f02-needle-tip', type: 'point', at: o, size: 3, stroke: 'ink', fill: 'ink'})
  const boundaryArcs = [
    arc('f02-glass-outer-arc', o, 264, -78, 258, 'ink', 3),
    arc('f02-glass-inner-arc', o, 257, -78, 258, 'muted', 2),
    arc('f02-conducting-film', o, 249, -78, 258, 'ink', 5)
  ]
  s.objects.push(...boundaryArcs)
  const left = boundaryArcs[0].end
  const right = boundaryArcs[0].start
  const neck = pathObject('f02-glass-neck-sidearm', [
    ['M', ...left], ['C', 315, 365, 317, 353, 317, 338],
    ['L', 317, 293], ['C', 317, 282, 304, 279, 289, 279],
    ['L', 212, 279], ['M', 212, 223], ['L', 289, 223],
    ['C', 307, 223, 317, 220, 317, 204], ['L', 317, 121],
    ['C', 317, 46, 403, 46, 403, 121], ['L', 403, 337],
    ['C', 403, 354, 404, 365, ...right]
  ], 960, 'ink', 3)
  const innerNeck = pathObject('f02-glass-neck-inner', [
    ['M', ...boundaryArcs[1].end], ['C', 325, 370, 326, 355, 326, 338],
    ['L', 326, 293], ['C', 326, 274, 309, 270, 289, 270],
    ['L', 212, 270], ['M', 212, 232], ['L', 289, 232],
    ['C', 313, 232, 326, 226, 326, 204], ['L', 326, 121],
    ['C', 326, 59, 394, 59, 394, 121], ['L', 394, 337],
    ['C', 394, 355, 395, 370, ...boundaryArcs[1].start]
  ], 960, 'muted', 2)
  const needle = {id: 'f02-metal-needle-stem', type: 'polygon',
    points: [[356, 47], [364, 47], [364, 600], o, [356, 600]],
    stroke: 'ink', strokeWidth: 2, fill: 'accentSoft', fillOpacity: 0.7}
  s.objects.push(neck, innerNeck, needle)
  s.source.inventory.push(group('f02-bulb-neck-pump',
    "Source: one round glass bulb with an open left sidearm and rounded lower neck. Contours are schematic surfaces, not hidden joints; modern clean curves replace scan roughness.",
    ['f02-glass-outer-arc', 'f02-glass-inner-arc', neck.id, innerNeck.id], ['f02-glass-arcs-concentric']))
  s.assertions.push({id: 'f02-glass-arcs-concentric', type: 'pointOnCircle',
    point: boundaryArcs[0].start, center: 'f02-needle-tip', radius: 264})
  s.source.inventory.push(group('f02-needle',
    "Source: one narrow upward metal needle, tip at the bulb center, continuing through the rounded neck. Modern neutral fill replaces uncalibrated source hatching; no joint is added.",
    ['f02-needle-tip', needle.id], ['f02-tip-on-stem']))
  s.assertions.push({id: 'f02-tip-on-stem', type: 'collinear',
    a: [360, 47], b: 'f02-needle-tip', c: [360, 600]})
  s.source.inventory.push(group('f02-film',
    "Source: thin conducting layer follows the inside of the upper bulb. Scan coating marks are material texture, not scale ticks or counted particles.",
    ['f02-conducting-film'], ['f02-film-start-on-radius', 'f02-film-end-on-radius']))
  for (const side of ['start', 'end']) s.assertions.push({
    id: `f02-film-${side}-on-radius`, type: 'pointOnCircle',
    point: boundaryArcs[2][side], center: 'f02-needle-tip', radius: 249
  })
  const angles = [196, 180, 166, 151, 137, 119, 105, 90, 76, 62, 47, 30, 14, 0, -15]
  const rayFacts = []
  for (const [index, angle] of angles.entries()) {
    const stem = `f02-ray-${String(index + 1).padStart(2, '0')}`
    const end = xy(o, 249, angle)
    const a = xy(o, 110, angle)
    const b = xy(o, 160, angle)
    const ray = segment(stem, 'f02-needle-tip', end, 'ink', 2)
    const direction = arrow(stem + '-direction', a, b, 'ink', 2)
    s.objects.push(ray, direction)
    const ids = [`${stem}-endpoints`, `${stem}-arrow-endpoints`, `${stem}-on-film`, `${stem}-radial`]
    s.assertions.push(connects(ids[0], ray), connects(ids[1], direction),
      {id: ids[2], type: 'pointOnCircle', point: end, center: 'f02-needle-tip', radius: 249},
      {id: ids[3], type: 'collinear', a: 'f02-needle-tip', b: a, c: end})
    s.source.inventory.push(group(stem + '-source',
      `Source illustrative ray ${index + 1}, ordered from lower-left through top to lower-right: common tip, film endpoint, outward arrow. It is not an ion population count. Drawing angle is only non-calibrated layout.`,
      ['f02-needle-tip', ray.id, direction.id], ids))
    rayFacts.push({id: stem, sourceEndpointApproximate: settled.figures['fig-02'].rayEndpointsInOriginalPixelCoordinatesApproximate[index],
      origin: o, endpoint: end, arrowStart: a, arrowEnd: b, interpretation: 'illustrative-direction-only'})
  }
  const leaders = [
    segment('f02-film-leader', [636, 835], xy(o, 249, 37), 'muted'),
    segment('f02-needle-leader', [240, 480], [358, 540], 'muted'),
    segment('f02-glass-leader', [560, 318], xy(o, 264, -49), 'muted'),
    segment('f02-ion-leader-1', [439, 553], [435, 666], 'muted'),
    segment('f02-ion-leader-2', [439, 553], [458, 655], 'muted'),
    segment('f02-ion-leader-3', [439, 553], [472, 600], 'muted'),
    arrow('f02-vacuum-direction', [275, 251], [214, 251], 'ink')
  ]
  const labels = [
    text('f02-film-label', [763, 866], 'Conducting film'),
    text('f02-needle-label', [208, 450], 'Metal needle'),
    text('f02-ion-label', [591, 528], 'Ion paths'),
    text('f02-pump-label-1', [159, 318], 'To vacuum'),
    text('f02-pump-label-2', [159, 282], 'pump'),
    text('f02-glass-label', [645, 293], 'Glass bulb')
  ]
  s.objects.push(...leaders, ...labels)
  for (const l of leaders) s.assertions.push(connects(l.id + '-connects', l))
  s.source.inventory.push(group('f02-translated-labels-and-leaders',
    "All five source labels translated into English. Converging ion annotation strokes remain leaders; the leftward pump arrow marks only the visible open sidearm connection.",
    [...leaders.map(x => x.id), ...labels.map(x => x.id)], leaders.map(x => x.id + '-connects')))
  return {spec: s, geometry: {origin: o, rays: rayFacts}}
}

function figure3() {
  const s = base('fig-03', 960, 840,
    "The textbook's source-attributed radial projection geometry: screen arc AB, needle-tip arc ab, symbolic R and r, one common angle alpha measured in radians, and two outward helium-ion paths. Uncalibrated drawing-space geometry does not encode physical radii, magnification or atom silhouettes.")
  const o = [370, 75]
  const R = 670
  const r = 230
  const angles = {A: 106, B: 90, a: 106, b: 90}
  const points = Object.fromEntries(Object.keys(angles).map(id => [id, xy(o, id === id.toUpperCase() ? R : r, angles[id])]))
  for (const id of ['A', 'B', 'a', 'b']) {
    s.objects.push({id: `f03-${id}`, type: 'point', at: points[id], size: 4,
      stroke: 'ink', fill: 'ink', label: id, fontSize: 31,
      labelPlacement: {position: id === 'A' || id === 'a' ? 'NW' : 'NE', offset: [0, -4]}})
  }
  const screen = arc('f03-screen-arc', o, R, 78, 118, 'ink', 4)
  const tip = arc('f03-tip-arc', o, r, 60, 118, 'muted', 2)
  const interval = {id: 'f03-arc-ab', type: 'arc', center: o, start: 'f03-b', end: 'f03-a', stroke: 'ink', strokeWidth: 3}
  const alpha = arc('f03-alpha-arc', o, 340, 90, 106, 'ink', 2)
  s.objects.push(screen, tip, interval, alpha, text('f03-alpha-label', [319, 448], '\u03b1', 32))
  s.source.inventory.push(group('f03-paired-projection-points',
    "Source A and B lie on the screen, a and b on the small tip interval. The unlabeled origin is common to the a-A and b-B rays. Both pairs are regularized to concentric arcs using the approved radial projection model, never measured source lengths.",
    ['f03-A', 'f03-B', 'f03-a', 'f03-b', screen.id, tip.id, interval.id],
    ['f03-a-A-radial', 'f03-b-B-radial', 'f03-screen-equal-radii', 'f03-tip-equal-radii',
      'f03-A-screen', 'f03-B-screen', 'f03-a-tip', 'f03-b-tip'], ['pointRelationships']))
  s.assertions.push(
    {id: 'f03-a-A-radial', type: 'collinear', a: o, b: 'f03-a', c: 'f03-A'},
    {id: 'f03-b-B-radial', type: 'collinear', a: o, b: 'f03-b', c: 'f03-B'},
    {id: 'f03-screen-equal-radii', type: 'equalDistance', a: o, b: 'f03-A', c: o, d: 'f03-B'},
    {id: 'f03-tip-equal-radii', type: 'equalDistance', a: o, b: 'f03-a', c: o, d: 'f03-b'})
  for (const name of ['A', 'B', 'a', 'b']) s.assertions.push({
    id: `f03-${name}-${name.toUpperCase() === name ? 'screen' : 'tip'}`,
    type: 'pointOnCircle', point: `f03-${name}`, center: o,
    radius: name.toUpperCase() === name ? R : r
  })
  const radiusObjects = [
    arrow('f03-radius-R', o, xy(o, R, 118), 'ink', 2),
    arrow('f03-radius-r', o, xy(o, r, 60), 'ink', 2)
  ]
  const radiusLabels = [text('f03-R-label', [172, 433], 'R', 31), text('f03-r-label', [462, 157], 'r', 31)]
  s.objects.push(...radiusObjects, ...radiusLabels)
  for (const object of radiusObjects) s.assertions.push(connects(object.id + '-endpoints', object))
  s.assertions.push(
    {id: 'f03-R-screen-end', type: 'pointOnCircle', point: radiusObjects[0].to, center: o, radius: R},
    {id: 'f03-r-tip-end', type: 'pointOnCircle', point: radiusObjects[1].to, center: o, radius: r})
  s.source.inventory.push(group('f03-symbolic-radii',
    "Source R indicator runs toward the left screen extension, and r toward the right tip extension, from the same unlabeled origin. No physical radius length or calibration is printed.",
    [...radiusObjects.map(x => x.id), ...radiusLabels.map(x => x.id)],
    [...radiusObjects.map(x => x.id + '-endpoints'), 'f03-R-screen-end', 'f03-r-tip-end']))
  const rays = []
  for (const pair of [['a', 'A'], ['b', 'B']]) {
    const id = `f03-ion-${pair.join('-')}`
    const track = segment(id, o, 'f03-' + pair[1], 'ink', 2)
    const direction = arrow(id + '-direction', xy(o, 380, angles[pair[1]]), xy(o, 455, angles[pair[1]]), 'ink', 2)
    s.objects.push(track, direction)
    s.assertions.push(connects(id + '-endpoints', track), connects(id + '-arrow-endpoints', direction),
      {id: id + '-arrow-radial', type: 'collinear', a: o, b: direction.from, c: points[pair[1]]})
    rays.push({id, pair, origin: o, tip: points[pair[0]], screen: points[pair[1]], arrowStart: direction.from, arrowEnd: direction.to})
    s.source.inventory.push(group(id + '-source',
      `Source outward helium-ion path through ${pair[0]} toward ${pair[1]}; arrow direction is outward, not an inward beam.`,
      [track.id, direction.id, 'f03-' + pair[0], 'f03-' + pair[1]],
      [id + '-endpoints', id + '-arrow-endpoints', id + '-arrow-radial', `f03-${pair[0]}-${pair[1]}-radial`],
      ['pointRelationships']))
  }
  s.source.inventory.push(group('f03-one-common-angle',
    "Enlarged pixels resolve exactly one alpha label and one sector arc between the two radial rays. The complete approved text states alpha in radians. The upper converging label leader is not an additional angle marker.",
    [alpha.id, 'f03-alpha-label', 'f03-A', 'f03-B', 'f03-a', 'f03-b'],
    ['f03-a-A-radial', 'f03-b-B-radial', 'f03-screen-equal-radii', 'f03-tip-equal-radii'],
    ['pointRelationships']))
  const left = tip.end
  const right = tip.start
  const surface = pathObject('f03-tip-surface-hills', [
    ['M', ...left], ['C', 275, 279, 281, 292, 292, 290],
    ['C', 300, 288, 301, 300, ...points.a],
    ['C', 316, 302, 320, 291, 332, 300],
    ['C', 342, 307, 353, 300, ...points.b],
    ['C', 381, 309, 388, 299, 397, 301],
    ['C', 409, 302, 413, 293, 425, 294],
    ['C', 440, 294, 449, 280, 460, 281],
    ['C', 472, 282, 478, 280, ...right]
  ], 840, 'ink', 2)
  s.objects.push(surface)
  const leaders = [
    segment('f03-ion-leader-left', xy(o, 530, 106), [545, 575], 'muted'),
    segment('f03-ion-leader-right', xy(o, 530, 90), [545, 575], 'muted'),
    segment('f03-tungsten-leader-a', [510, 449], 'f03-a', 'muted'),
    segment('f03-tungsten-leader-b', [510, 449], 'f03-b', 'muted')
  ]
  const labels = [
    text('f03-helium-label', [654, 637], 'Helium-ion'),
    text('f03-paths-label', [654, 599], 'paths'),
    text('f03-tungsten-label', [657, 463], 'Tungsten atoms')
  ]
  s.objects.push(...leaders, ...labels)
  for (const object of leaders) s.assertions.push(connects(object.id + '-endpoints', object))
  s.source.inventory.push(group('f03-source-tip-surface-and-translated-leaders',
    "Source one open hill-textured tip profile and both translated labels with converging leaders. Modern open texture retains the schematic hills without drawing isolated atom silhouettes. The thin concentric tip arc is an explicitly modern ideal construction for the text's arc-length argument.",
    [surface.id, ...leaders.map(x => x.id), ...labels.map(x => x.id)],
    leaders.map(x => x.id + '-endpoints')))
  return {spec: s, geometry: {origin: o, drawingSpaceOnly: {screenRadius: R, tipRadius: r, angleRadians: 16 * Math.PI / 180},
    points, rays, physicalValuesEncodedByDrawing: false,
    sourceSurfaceNotAnAtomSilhouette: true, alphaInstances: 1}}
}
const constructed = {'fig-02': figure2(), 'fig-03': figure3()}
for (const [id, candidate] of Object.entries(constructed)) {
  const dir = path.join(figures, id, 'candidate-01')
  write(path.join(dir, id + '.spec.json'), candidate.spec)
  write(path.join(author, id + '.geometry-and-mapping.json'), {
    role: 'author-only', sourceFirst: binding(path.join(author, 'source-first-inventory.json')),
    sourceSettled: binding(path.join(author, 'source-settled-inventory.json')),
    candidateSpec: binding(path.join(dir, id + '.spec.json')),
    geometry: candidate.geometry, sourceToObjectAssertions: candidate.spec.source.inventory,
    modernAdditions: [
      'English labels replace source Chinese labels.',
      'Neutral semantic color roles and clean contours replace scan roughness/material hatching.',
      'Rendering coordinates, angles and radii are layout parameters only, never measured physical values.',
      ...(id === 'fig-03' ? ['A concentric ideal tip arc makes the approved source-attributed radial projection mathematics executable; the open hill-textured profile remains schematic.'] : [])
    ],
    repairsInherited: 0, repairsUsedAtCreation: 0, independentReview: false
  })
  console.log(JSON.stringify({id, spec: binding(path.join(dir, id + '.spec.json')), repairs: 0}))
}
