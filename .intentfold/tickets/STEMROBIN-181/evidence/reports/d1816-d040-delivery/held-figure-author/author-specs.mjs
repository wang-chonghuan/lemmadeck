import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const lessonId = 'phy10-c2-s6-n118'
const read = (file) => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'))
const authoritativeText = ['modern-us-neutral', 'modern-us-neutral-en'].flatMap((edition) => {
  const lesson = read(`inputs/text/${edition}/lesson.template.json`)
  const exercises = read(`inputs/text/${edition}/exercises.template.json`)
  return [
    { lesson: `${lessonId}:${edition}`, text: lesson.title },
    ...lesson.prose.filter((item) => item.text).map((item) => ({
      lesson: `${lessonId}:${edition}`, text: item.text,
    })),
    ...exercises.exercises.map((item) => ({
      lesson: `${lessonId}:${edition}`, exercise: item.number, text: item.text,
    })),
  ]
})
const originalInventory = read('source-inventory-first.json')
const raw = read('inputs/evidence/raw-contour-report.json')
if (raw.raw['fig-245'].verdict !== 'PASS' || raw.raw['fig-246'].verdict !== 'PASS') {
  throw new Error('supplied raw contour evidence does not pass')
}

// Pixel-like author coordinates are converted once to native user space.
const p = ([x, y]) => [x, -y]
function draft(id, height, description) {
  const source = originalInventory.figures.find((item) => item.id === id)
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: { path: path.join(out, `inputs/originals/${id}.png`), sha256: source.sha256 },
      authoritativeText, inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, 0, 640, -height], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    objects: [], assertions: [], layout: { minLabelGap: 3, avoidRegions: [] },
  }
  const add = (object) => { spec.objects.push(object); return object.id }
  const assertion = (item) => { spec.assertions.push(item); return item.id }
  const polygon = (id, points, extra = {}) => add({
    id, type: 'polygon', points: points.map(p), stroke: 'ink', strokeWidth: 2,
    fill: 'paper', fillOpacity: 1, ...extra,
  })
  const rect = (id, x, y, width, height, extra = {}) =>
    polygon(id, [[x, y], [x + width, y], [x + width, y + height], [x, y + height]], extra)
  const circle = (id, at, radius, extra = {}) =>
    add({ id, type: 'circle', center: p(at), radius, stroke: 'ink', strokeWidth: 2, ...extra })
  const text = (id, at, value, extra = {}) => add({
    id, type: 'text', at: p(at), text: value, fontSize: 18, fontWeight: 400,
    labelPlacement: { position: 'CENTER', gap: 0 }, ...extra,
  })
  const edge = (id, from, to, extra = {}) => {
    const type = extra.type || 'segment'
    add({ id, type, from: p(from), to: p(to), stroke: 'ink', strokeWidth: 2, ...extra })
    assertion({ id: `${id}-connection`, type: 'connects', arrow: id, from: p(from), to: p(to) })
    return id
  }
  const lens = (id, x, y, rx, ry) => polygon(id, Array.from({ length: 32 }, (_, i) => {
    const t = i * 2 * Math.PI / 32
    return [x + rx * Math.cos(t), y + ry * Math.sin(t)]
  }), { fillOpacity: 0.2, fill: 'accentSoft' })
  const inventory = (id, description, objects, assertions = []) =>
    spec.source.inventory.push({ id, description, objects, assertions })
  const inside = (id, at, container) =>
    assertion({ id, type: 'inside', point: p(at), container, margin: 2 })
  const avoid = (x, y, width, height) => spec.layout.avoidRegions.push([x, -y, x + width, -y - height])
  return { spec, add, assertion, polygon, rect, circle, text, edge, lens, inventory, inside, avoid }
}

const a = draft('fig-245', 670,
  'Optical soundtrack recording: retain the numbered folded chain 1 through 8, the two imaging dependencies, and text-supported shared mirror/coil motion. This is an authored symbolic schematic, not a contour reconstruction, calibrated ray trace, or assertion of unknown source hardware.')
const film245 = []
film245.push(a.rect('part8-film-main', 504, 30, 53, 110))
film245.push(a.polygon('part8-film-bend', [[557, 30], [605, 55], [589, 92], [557, 63]]))
film245.push(a.rect('part8-film-picture-area', 520, 34, 25, 102, { strokeWidth: 1 }))
for (let i = 0; i < 5; i++) {
  film245.push(a.rect(`part8-long-edge-hole-${i + 1}`, 508, 38 + i * 19, 8, 10, { strokeWidth: 1.5 }))
}
for (let i = 0; i < 2; i++) {
  const x = 574 + i * 16, y = 44 + i * 8
  film245.push(a.polygon(`part8-short-edge-hole-${i + 1}`,
    [[x, y], [x + 10, y + 5], [x + 6, y + 13], [x - 4, y + 8]], { strokeWidth: 1.5 }))
}
for (let i = 0; i < 3; i++) {
  film245.push(a.rect(`part8-authored-frame-${i + 1}`, 523, 40 + i * 28, 16, 21, { strokeWidth: 1 }))
}
film245.push(a.rect('part8-recording-band', 524, 92, 21, 4, { fill: 'accentSoft', fillOpacity: 1, strokeWidth: 1 }))
film245.push(a.text('part8-label', [448, 60], '8 Film'))
a.inventory('s245-film', 'Pixels: upper bent film-like strip. Supplied RAW contour report additionally identifies five long-edge holes and two short-edge holes. Authored additions: upright/right-bent orthographic ribbon, three abstract frame boxes and a recording band; no claim of exact original emulsion or image content.', film245)

a.circle('part1-lamp', [60, 410], 16)
a.rect('part1-base', 53, 428, 14, 16, { fill: 'ink' })
a.edge('part1-filament-a', [53, 410], [60, 416], { strokeWidth: 1.5 })
a.edge('part1-filament-b', [60, 416], [67, 408], { strokeWidth: 1.5 })
a.lens('part2-condenser', 145, 410, 10, 31)
a.rect('part3-plate', 213, 381, 38, 58, { fill: 'accentSoft', fillOpacity: 0.65 })
a.polygon('part3-authored-taper', [[219, 408], [244, 397], [244, 417], [219, 411]], { strokeWidth: 1 })
a.lens('part4-lens', 345, 410, 10, 32)
a.polygon('part5-mirror', [[508, 431], [556, 383], [562, 389], [514, 437]], { fill: 'accentSoft', fillOpacity: 1 })
a.rect('part6-slit-screen', 495, 277, 80, 16, { fill: 'accentSoft', fillOpacity: 0.65 })
a.rect('part6-narrow-slit', 514, 284, 42, 3, { strokeWidth: 1, fill: 'paper' })
a.lens('part7-lens', 535, 195, 32, 10)
const nodes245 = [[60, 410], [145, 410], [232, 410], [345, 410], [535, 410], [535, 285], [535, 195], [535, 95]]
const optical245 = nodes245.slice(1).map((to, i) =>
  a.edge(`optical-${i + 1}-to-${i + 2}`, nodes245[i], to, { type: 'arrow', stroke: 'accent', strokeWidth: 2 }))
for (const [n, x, name] of [[1, 60, 'Source'], [2, 145, 'Condenser'], [3, 240, 'Aperture'], [4, 345, 'Lens']]) {
  a.text(`part${n}-number`, [x, 473], String(n), { fontWeight: 600 })
  a.text(`part${n}-name`, [x, 498], name)
}
a.text('part5-label', [581, 351], '5 Mirror')
a.text('part6-label', [438, 285], '6 Slit')
a.text('part7-label', [438, 195], '7 Lens')
a.inventory('s245-parts-1-to-4',
  'Pixels: lamp-like part 1, oval 2, aperture plate 3 and oval 4 in this order. Text identifies source, condenser, wedge-shaped aperture and lens. Authored regularization: front-on symbols and a finite tapered quadrilateral opening, NOT an ideal triangle or an exact fine source aperture.',
  ['part1-lamp', 'part1-base', 'part2-condenser', 'part3-plate', 'part3-authored-taper', 'part4-lens',
    ...[1, 2, 3, 4].flatMap((n) => [`part${n}-number`, `part${n}-name`])])
a.inventory('s245-reflected-branch',
  'Pixels: route turns at plate 5 and rises through slit plate 6 and oval 7 to upper film 8. Text identifies mirror, narrow slit and lens. Authored regularization: horizontal incoming / vertical reflected axes and directional arrowheads; distances are not source measurements.',
  ['part5-mirror', 'part5-label', 'part6-slit-screen', 'part6-narrow-slit', 'part6-label', 'part7-lens', 'part7-label',
    ...optical245], optical245.map((id) => `${id}-connection`))

a.rect('text-supported-coil', 461, 392, 28, 36, { fillOpacity: 0 })
a.rect('text-supported-coil-inner', 465, 396, 20, 28, { fillOpacity: 0, strokeWidth: 1 })
a.edge('text-supported-shared-axle', [450, 410], [580, 410], { stroke: 'muted', dash: 2, strokeWidth: 2 })
a.add({ id: 'authored-turn-arc', type: 'arc', center: p([535, 410]), start: p([579, 410]), end: p([571, 435]), stroke: 'muted', strokeWidth: 2 })
a.edge('authored-turn-head-a', [580, 420], [579, 410], { type: 'arrow', stroke: 'muted' })
a.edge('authored-turn-head-b', [578, 427], [571, 435], { type: 'arrow', stroke: 'muted' })
a.text('coil-label', [474, 472], 'Coil')
a.text('axle-label', [572, 472], 'Axle')
a.text('coupled-motion-label', [443, 535], 'Mirror + coil turn together')
a.text('audio-drive-label', [320, 574], 'Audio current -> coil -> mirror motion')
a.text('image4-dependency-label', [320, 607], 'Lens 4: aperture 3 -> slit screen 6')
a.text('image7-dependency-label', [320, 637], 'Lens 7: slit 6 -> film 8')
a.assertion({ id: 'coil-axle-crosses-coil', type: 'inside', point: p([475, 410]), container: 'text-supported-coil' })
a.assertion({ id: 'mirror-axle-intersection', type: 'inside', point: p([535, 410]), container: 'part5-mirror' })
a.inventory('s245-tiny-assembly-and-text-mechanics',
  'Pixels: an unidentified tiny dark assembly beside mirror 5 and axle-like interrupted features; exact identity remains UNKNOWN. Separate text fact: mirror and coil share a horizontal axle in a permanent magnetic field. Authored replacement: square coil symbol, shared dashed axle and opposed rotational arrowheads. No visible magnet or pole labels are invented and the drawn coil is NOT an identification of the source blob.',
  ['text-supported-coil', 'text-supported-coil-inner', 'text-supported-shared-axle', 'authored-turn-arc',
    'authored-turn-head-a', 'authored-turn-head-b', 'coil-label', 'axle-label', 'coupled-motion-label', 'audio-drive-label'],
  ['text-supported-shared-axle-connection', 'authored-turn-head-a-connection', 'authored-turn-head-b-connection',
    'coil-axle-crosses-coil', 'mirror-axle-intersection'])
a.inventory('text245-imaging-dependencies',
  'Authoritative text, not independently measured source optics: lens 4 images aperture 3 on the slit screen 6, and lens 7 images the slit light band on film 8. Captions explicitly retain both dependencies. No focal lengths, magnification, exact aperture profile or ideal ray envelope is asserted.',
  ['image4-dependency-label', 'image7-dependency-label'],
  ['optical-3-to-4-connection', 'optical-4-to-5-connection', 'optical-5-to-6-connection',
    'optical-6-to-7-connection', 'optical-7-to-8-connection'])
a.avoid(40, 379, 40, 66)
a.avoid(130, 372, 31, 72)
a.avoid(207, 375, 52, 72)
a.avoid(328, 371, 35, 77)
a.avoid(493, 274, 85, 24)
a.avoid(498, 179, 77, 32)
a.avoid(499, 27, 111, 116)

const b = draft('fig-246', 615,
  'Optical sound playback: retain film frames, adjacent variable-width soundtrack with circular enlargement, a narrow-slit optical chain feeding a phototube, amplifier, and raised electrical route to two speakers around a screen in a separate projection region. Symbolic reconstruction, not a calibrated waveform or exact apparatus drawing.')
b.rect('source-left-region', 15, 185, 384, 395, { fillOpacity: 0, stroke: 'muted' })
b.rect('source-right-region', 415, 185, 210, 395, { fillOpacity: 0, stroke: 'muted' })
b.text('left-region-label', [129, 551], 'Optical playback')
b.text('right-region-label', [520, 551], 'Projection room')
b.inventory('s246-source-regions',
  'Pixels: left apparatus/amplifier region and separate right projection-room region, both outlined; a circular film enlargement is above the left region and electrical wiring rises above the right. Authored addition: English Optical playback region label; Projection room translates the original label.',
  ['source-left-region', 'source-right-region', 'left-region-label', 'right-region-label'])

const film246 = []
film246.push(b.rect('film-body', 203, 232, 56, 229, { strokeWidth: 1.5 }))
film246.push(b.rect('film-picture-region', 213, 236, 32, 222, { strokeWidth: 1 }))
film246.push(b.rect('film-soundtrack-region', 245, 236, 6, 222, { strokeWidth: 1 }))
const frameAssertions = []
for (let i = 0; i < 6; i++) {
  const y = 240 + i * 36
  const frameId = b.rect(`film-frame-${i + 1}`, 215, y, 28, 28, { strokeWidth: 1 })
  film246.push(frameId)
  film246.push(b.polygon(`authored-neutral-thumbnail-${i + 1}`,
    [[218, y + 24], [225, y + 14 + i % 3], [230, y + 19], [236, y + 11], [240, y + 24]],
    { fill: 'accentSoft', fillOpacity: 0.35, strokeWidth: 1 }))
  frameAssertions.push(b.inside(`frame-${i + 1}-in-film`, [229, y + 14], 'film-body'))
}
for (let i = 0; i < 15; i++) {
  const y = 238 + i * 14.5
  for (const [side, x] of [['left', 206], ['right', 253]]) {
    film246.push(b.rect(`film-${side}-hole-${i + 1}`, x, y, 3, 7, { strokeWidth: 1 }))
  }
}
const widths = [1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3]
const stripe = widths.map((w, i) => [248 - w / 2, 238 + i * 11.5])
  .concat([...widths].reverse().map((w, i) => [248 + w / 2, 238 + (widths.length - 1 - i) * 11.5]))
film246.push(b.polygon('film-variable-width-stripe', stripe, { fill: 'ink', fillOpacity: 1, strokeWidth: 1 }))
film246.push(b.rect('illuminated-soundtrack-sample', 245, 343, 6, 4, { fill: 'accentSoft', fillOpacity: 1, strokeWidth: 1 }))
film246.push(b.text('film-label', [228, 211], 'Film'))
b.edge('film-motion', [270, 397], [270, 435], { type: 'arrow', stroke: 'muted' })
b.inventory('s246-film-detail',
  'Pixels: vertical film, picture frames, both perforated edges and narrow adjacent sound region. Supplied RAW report counts six visible frames. Authored additions: six neutral abstract landscape thumbnails, fifteen schematic holes per edge (NOT an asserted source hole count), illustrative variable-width dark stripe and small illuminated soundtrack sample. No timing scale, soundtrack amplitude or film gauge is invented.',
  [...film246, 'film-motion'], [...frameAssertions, 'film-motion-connection'])

const enlarged = []
enlarged.push(b.circle('soundtrack-enlargement-circle', [225, 112], 62))
enlarged.push(b.edge('soundtrack-enlargement-left-boundary', [205, 59], [205, 165], { strokeWidth: 1 }))
enlarged.push(b.edge('soundtrack-enlargement-right-boundary', [242, 59], [242, 165], { strokeWidth: 1 }))
const wide = [4, 7, 12, 5, 9, 14, 6, 4, 11, 7, 13, 5, 9, 4, 11]
const wideStripe = wide.map((w, i) => [223 - w / 2, 62 + i * 7])
  .concat([...wide].reverse().map((w, i) => [223 + w / 2, 62 + (wide.length - 1 - i) * 7]))
enlarged.push(b.polygon('soundtrack-enlargement-stripe', wideStripe, { fill: 'ink', fillOpacity: 1, strokeWidth: 1 }))
for (let i = 0; i < 3; i++) {
  enlarged.push(b.rect(`soundtrack-enlargement-hole-${i + 1}`, 249, 74 + i * 29, 12, 13, { strokeWidth: 1.5 }))
}
enlarged.push(b.edge('soundtrack-enlargement-leader', [248, 232], [244, 171], { stroke: 'muted', strokeWidth: 1.5 }))
enlarged.push(b.text('soundtrack-label', [225, 25], 'Soundtrack'))
b.inventory('s246-soundtrack-enlargement',
  'Pixels: circular enlargement and leader to narrow film strip, dark varying-width feature, straight separating contours and three right-side holes. Authored regularization: smooth circle and illustrative symmetric varying-width stripe; this is NOT a calibrated trace or a claim of the exact original contour.',
  enlarged, ['soundtrack-enlargement-left-boundary-connection', 'soundtrack-enlargement-right-boundary-connection',
    'soundtrack-enlargement-leader-connection'])

b.circle('playback-lamp', [43, 345], 13)
b.rect('playback-lamp-base', 38, 361, 10, 14, { fill: 'ink' })
b.lens('playback-condenser', 86, 345, 7, 24)
b.rect('playback-slit-plate', 119, 319, 25, 52, { fill: 'accentSoft', fillOpacity: 0.65 })
b.rect('playback-narrow-slit', 123, 343.5, 17, 3, { strokeWidth: 1 })
b.lens('playback-lens-before-film', 171, 345, 7, 24)
b.lens('playback-lens-after-film', 285, 345, 7, 24)
b.circle('playback-phototube', [340, 345], 17)
b.rect('playback-phototube-base', 334, 364, 12, 14, { fill: 'ink' })
b.edge('phototube-cathode-symbol', [343, 333], [343, 355], { strokeWidth: 2 })
b.edge('phototube-anode-symbol', [333, 343], [338, 343], { strokeWidth: 2 })
const opticalNodes = [[43, 345], [86, 345], [132, 345], [171, 345], [248, 345], [285, 345], [340, 345]]
const optical246 = opticalNodes.slice(1).map((to, i) =>
  b.edge(`playback-optical-${i + 1}`, opticalNodes[i], to, { strokeWidth: 1.5, stroke: 'accent' }))
b.text('source-label', [59, 405], 'Source')
b.text('slit-label', [132, 287], 'Slit')
b.text('phototube-label', [339, 407], 'Phototube')
b.inventory('s246-optical-apparatus',
  'Pixels: source, three oval optics, a narrow-slot plate and phototube-like receiver along the optical route with vertical film between second and third optics. Text: narrow beam reads soundtrack and transmitted light reaches the photoelectric tube. Authored regularization: standard lamp/lens/phototube symbols and centerline; phototube electrodes are symbolic additions, not scan-level hardware identification.',
  ['playback-lamp', 'playback-lamp-base', 'playback-condenser', 'playback-slit-plate', 'playback-narrow-slit',
    'playback-lens-before-film', 'playback-lens-after-film', 'playback-phototube', 'playback-phototube-base',
    'phototube-cathode-symbol', 'phototube-anode-symbol', 'source-label', 'slit-label', 'phototube-label', ...optical246],
  [...optical246.map((id) => `${id}-connection`), 'phototube-cathode-symbol-connection', 'phototube-anode-symbol-connection'])

b.rect('amplifier-body', 277, 469, 107, 56, { fillOpacity: 0.1, fill: 'accentSoft' })
b.text('amplifier-label', [330.5, 497], 'Amplifier')
const wires = [
  ['tube-wire-a-down', [335, 378], [335, 440]],
  ['tube-wire-a-across', [335, 440], [277, 440]],
  ['tube-wire-a-to-amp', [277, 440], [277, 485]],
  ['tube-wire-b-down', [345, 378], [345, 451]],
  ['tube-wire-b-across', [345, 451], [268, 451]],
  ['tube-wire-b-to-amp', [268, 451], [268, 510]],
  ['tube-wire-b-amp-input', [268, 510], [277, 510]],
  ['amp-output-to-gap', [384, 485], [406, 485]],
  ['gap-riser', [406, 485], [406, 151]],
  ['raised-circuit-route', [406, 151], [600, 151]],
  ['right-speaker-feed', [600, 151], [600, 290]],
  ['left-speaker-branch', [442, 151], [442, 290]],
]
const wireIds = wires.map(([id, from, to]) => b.edge(id, from, to, { stroke: 'muted', strokeWidth: 2 }))
b.assertion({ id: 'speaker-branch-is-on-raised-route', type: 'pointOnLine', point: p([442, 151]), a: p([406, 151]), b: p([600, 151]) })
b.rect('screen', 469, 290, 111, 72, { fill: 'accentSoft', fillOpacity: 0.12 })
const speakers = []
for (const [side, x] of [['left', 430], ['right', 588]]) {
  speakers.push(b.rect(`speaker-${side}`, x, 290, 24, 75, { fill: 'accentSoft', fillOpacity: 0.35 }))
  speakers.push(b.circle(`speaker-${side}-upper-driver`, [x + 12, 310], 6, { strokeWidth: 1.5 }))
  speakers.push(b.circle(`speaker-${side}-lower-driver`, [x + 12, 343], 8, { strokeWidth: 1.5 }))
}
b.text('screen-label', [524, 390], 'Screen')
b.text('speakers-label', [524, 427], 'Speakers')
b.inside('amp-within-left-region', [330.5, 497], 'source-left-region')
b.inside('screen-within-right-region', [524, 326], 'source-right-region')
b.inside('left-speaker-within-right-region', [442, 327], 'source-right-region')
b.inside('right-speaker-within-right-region', [600, 327], 'source-right-region')
b.inventory('s246-amplifier-and-room-signal-route',
  'Pixels: two receiver connections descend to amplifier, electrical route crosses the region gap then rises and branches above the right region to two speakers flanking a single screen. Amplifier/Projection room labels are translated. Authored addition: simplified speaker driver symbols and straight orthogonal routing; no hidden circuit internals or digital playback are asserted.',
  ['amplifier-body', 'amplifier-label', 'screen', 'screen-label', 'speakers-label', ...speakers, ...wireIds],
  [...wireIds.map((id) => `${id}-connection`), 'speaker-branch-is-on-raised-route',
    'amp-within-left-region', 'screen-within-right-region', 'left-speaker-within-right-region', 'right-speaker-within-right-region'])
b.avoid(29, 318, 325, 62)
b.avoid(199, 229, 65, 236)
b.avoid(163, 47, 124, 129)
b.avoid(426, 286, 193, 83)

for (const { spec } of [a, b]) {
  const candidate = path.join(out, 'first-candidates', spec.id)
  fs.mkdirSync(candidate, { recursive: true })
  fs.writeFileSync(path.join(candidate, 'spec.json'), `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(path.join(candidate, 'spec.json'), 0o444)
}
const decisions = {
  schema: 'bounded-figure-author/author-decisions@1',
  role: 'cap1+cap2 author only; NOT independent review or approval',
  lesson: lessonId, figures: ['fig-245', 'fig-246'],
  independentPixelInventory: 'source-inventory-first.json',
  supplementaryRawReport: 'inputs/evidence/raw-contour-report.json',
  sourceUnknownsPreserved: originalInventory.figures.flatMap((item) => item.sourceUncertainty.map((detail) => ({ figure: item.id, detail }))),
  displayContract: { purpose: 'instructional', layout: 'scroll', fixedMediaWidthPx: 640, widthsTestedByRenderer: [640], minTextPx: 16, authoredFontPx: 18 },
  productMeasurement: 'No server/product inspection authorized. User expressly declares current fixed 640px scroll media; no 390px inline display or production scroll-end acceptance is claimed.',
  modernAdditions: [
    'Orthographic symbols and regularized nonmeasured spacing, retaining source region topology.',
    'Figure 245 aperture is a tapered quadrilateral schematic based on text, not an ideal triangle or resolved source contour.',
    'Figure 245 square coil/shared axle comes from text; tiny source assembly identity remains unknown, and no unseen magnet poles are drawn.',
    'Figure 245 optical direction arrowheads and symbolic opposed rotation heads; the recording band is not a positive-print dark stripe.',
    'Figure 246 six neutral landscape thumbnails and schematic perforation repetition; no calibrated waveform, film standard or hidden wiring.',
    'English-only visible labels and semantic vector colors; no raster artwork or model calls.',
  ],
  limitations: [
    'Connections/assertions establish topology and declared containment, not a physical optical simulation or independent source-fidelity approval.',
    'Current render metadata intentionally references author scratch files; parent must bind durable final output paths and obtain independent review before promotion.',
    'No canonical assets, lesson manifests, native finalization, review files, publisher or database operations.',
  ],
  repairBudget: { maximumSmallestNativeDefectRepairs: 1, used: 0 },
}
fs.writeFileSync(path.join(out, 'author-decisions.json'), `${JSON.stringify(decisions, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: 'authored-first-candidates', figures: [a.spec.id, b.spec.id], objects: [a.spec.objects.length, b.spec.objects.length] }))
