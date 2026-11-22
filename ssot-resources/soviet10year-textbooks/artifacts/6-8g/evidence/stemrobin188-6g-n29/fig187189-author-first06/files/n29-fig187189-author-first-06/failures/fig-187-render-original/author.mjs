import fs from 'node:fs'
import path from 'node:path'
import { R, OWN, bind, hash, write, run } from './evidence.mjs'

if (process.cwd() !== R) throw new Error('exact cwd required')
const contextPath = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n29-text-and-answers-author-collection-06/figure-author-context.json')
if (hash(contextPath) !== '986029252be656af77056812b695a2efa8b26f88a5b13cc35c52a5bc346387cd') throw new Error('context drift')
const context = JSON.parse(fs.readFileSync(contextPath))
for (const b of [context.candidateText, context.candidateExercises, context.sourceLesson, context.figuresTemplate, ...context.originalFigures.map(x => x.source)]) {
  if (hash(b.path) !== b.sha256) throw new Error('binding drift: ' + b.path)
}
const lesson = JSON.parse(fs.readFileSync(context.candidateText.path))
const prose = lesson.prose
if (prose.length !== 23) throw new Error('candidate prose count changed')
for (const id of ['fig-187', 'fig-188', 'fig-189']) {
  const seal = JSON.parse(fs.readFileSync(path.join(OWN, 'first', `${id}.seal.json`)))
  if (hash(seal.inventory.path) !== seal.inventory.sha256 || (fs.statSync(seal.inventory.path).mode & 0o777) !== 0o444) throw new Error('FIRST not sealed')
}
const point = (id, at, label, position = 'NE', visible = true) => ({ id, type: 'point', at, ...(label ? { label, fontSize: 28, fontWeight: 500, labelPlacement: { position, offset: [0, 0] } } : {}), visible, size: 2.1, strokeWidth: 1, stroke: 'ink', fill: 'ink' })
const segment = (id, from, to, width = 2.4) => ({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: width })
const text = (id, at, content, position = 'CENTER') => ({ id, type: 'text', at, text: content, fontSize: 28, fontWeight: 500, labelPlacement: { position, offset: [0, 0] } })
const fact = (id, type, fields) => ({ id, type, ...fields, tolerance: 1e-7 })
const onCircle = (id, p, o, radius) => fact(id, 'pointOnCircle', { point: p, center: o, radius })
const base = (id, description, canvas, display, indexes) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: { image: context.originalFigures.find(x => x.id === id).source, authoritativeText: indexes.map(i => ({ lesson: 'geo68-c2-s4-n29', text: prose[i].text })), inventory: [] },
  canvas: { ...canvas, background: 'paper', keepAspectRatio: true },
  display: { ...display, purpose: 'instructional', minTextPx: 16 },
  objects: [], assertions: [], layout: { minLabelGap: 4 }
})
const s187 = base('fig-187', 'Compare the actual source three line-circle cases in left-to-right order, with center-to-line distance h and radius r.', { width: 960, height: 480, boundingBox: [0, 16, 32, 0] }, { layout: 'scroll', widths: [640] }, [0, 3, 4, 5, 6, 7, 8, 11])
const braces = (id, fromX, toX, y, up) => {
  const x1 = fromX * 30, x2 = toX * 30, sy = (16 - y) * 30, mid = (x1 + x2) / 2, d = up ? -7 : 7
  return { id, type: 'svgPath', d: `M ${x1} ${sy} L ${x1} ${sy + d} L ${mid - 8} ${sy + d} L ${mid} ${sy + 2 * d} L ${mid + 8} ${sy + d} L ${x2} ${sy + d} L ${x2} ${sy}`, stroke: 'ink', strokeWidth: 1.2, fill: 'paper', fillOpacity: 0 }
}
for (const [index, cx, h] of [[0, 4.7, 5.3], [1, 15.5, 3.6], [2, 26.3, 2.5]]) {
  const g = ['source-left', 'source-middle', 'source-right'][index]
  const prefix = ['left', 'middle', 'right'][index], r = 3.6, cy = 9, px = cx + h
  const O = `${prefix}-O`, A = `${prefix}-A`, B = index === 1 ? A : `${prefix}-B`
  const objs = [point(O, [cx, cy], 'O', 'W'), point(A, [cx + r, cy], 'A', index === 0 ? 'SE' : 'E')]
  if (index !== 1) objs.push(point(B, [px, cy], 'B', index === 0 ? 'E' : 'NE'))
  objs.push({ id: `${prefix}-circle`, type: 'circle', center: O, radius: r, stroke: 'ink', strokeWidth: 2.8 },
    segment(`${prefix}-radial`, O, index === 0 ? B : A),
    segment(`${prefix}-p`, [px, 3.4], [px, 14.7]),
    text(`${prefix}-p-name`, [px, 14.4], 'p', 'NE'),
    braces(`${prefix}-h-bracket`, cx, px, cy + 0.1, true),
    braces(`${prefix}-r-bracket`, cx, cx + r, cy - 0.1, false),
    text(`${prefix}-h-name`, [(cx + px) / 2, cy + 1.15], 'h'),
    text(`${prefix}-r-name`, [cx + r / 2, cy - 1.2], 'r'),
    text(`${prefix}-comparison`, [cx, 3.7], ['h > r', 'h = r', 'h < r'][index]),
    text(`${prefix}-panel`, [cx, 1.35], ['(a)', '(b)', '(c)'][index]))
  const assertions = [
    onCircle(`${prefix}-A-on-circle`, A, O, r),
    fact(`${prefix}-r-length`, 'distance', { a: O, b: A, value: r }),
    fact(`${prefix}-h-length`, 'distance', { a: O, b: B, value: h }),
    fact(`${prefix}-foot-on-p`, 'pointOnLine', { point: B, a: [px, 3.4], b: [px, 14.7] }),
    fact(`${prefix}-radius-perpendicular-p`, 'perpendicular', { a: O, b: A, c: [px, 3.4], d: [px, 14.7] }),
    fact(`${prefix}-radial-covers-O`, 'pointOnLine', { point: O, a: O, b: A })
  ]
  if (index !== 1) assertions.push(fact(`${prefix}-O-A-B-collinear`, 'collinear', { a: O, b: A, c: B }))
  if (index === 2) {
    const dy = Math.sqrt(r * r - h * h)
    for (const [name, y] of [['upper', cy + dy], ['lower', cy - dy]]) {
      const id = `right-${name}-crossing`
      objs.push({ ...point(id, [px, y]), size: 1, strokeWidth: 0.6 })
      assertions.push(onCircle(`${id}-on-circle`, id, O, r), fact(`${id}-on-p`, 'pointOnLine', { point: id, a: B, b: [px, 14.7] }))
    }
  }
  s187.objects.push(...objs); s187.assertions.push(...assertions)
  s187.source.inventory.push({ id: g, description: `Sealed FIRST ${g}; circle, all source points, solid radial/vertical strokes, h/r spans and inequality. Modern English panel label maps order only. Faint printing is regularized, not a source dash fact.`, objects: objs.map(o => o.id), assertions: assertions.map(a => a.id), requires: ['pointRelationships'] })
}
const s188 = base('fig-188', 'A tangent through the radius endpoint is perpendicular to that radius; retain the source NE contact and NW-SE tangent.', { width: 480, height: 480, boundingBox: [-5, 5, 5, -5] }, { layout: 'inline', maxWidthPx: 480, widths: [480, 358, 300] }, [7, 8, 9, 10, 11, 15])
const O188 = [-0.8, -0.7], r188 = 3.3, q = Math.SQRT1_2
const A188 = [O188[0] + r188 * q, O188[1] + r188 * q]
const t188a = [A188[0] - 3.1 * q, A188[1] + 3.1 * q], t188b = [A188[0] + 3.7 * q, A188[1] - 3.7 * q]
const corner1 = [A188[0] - .4 * q, A188[1] - .4 * q], corner2 = [A188[0], A188[1] - .8 * q], corner3 = [A188[0] + .4 * q, A188[1] - .4 * q]
s188.objects = [point('source-center', O188, 'O', 'W'), point('source-contact', A188, 'A', 'NE', false),
  { id: 'source-circle', type: 'circle', center: 'source-center', radius: r188, stroke: 'ink', strokeWidth: 2.8 },
  segment('source-radius', 'source-center', 'source-contact'), segment('source-tangent', t188a, t188b),
  text('source-p-name', [t188a[0] + .3, t188a[1] + .1], 'p', 'NE'),
  segment('source-right-angle-side-1', corner1, corner2, 1.6), segment('source-right-angle-side-2', corner2, corner3, 1.6)]
s188.assertions = [onCircle('contact-on-circle', 'source-contact', 'source-center', r188),
  fact('radius-length', 'distance', { a: 'source-center', b: 'source-contact', value: r188 }),
  fact('contact-on-tangent', 'pointOnLine', { point: 'source-contact', a: t188a, b: t188b }),
  fact('radius-perpendicular-tangent', 'perpendicular', { a: 'source-center', b: 'source-contact', c: t188a, d: t188b }),
  fact('right-angle-corner', 'perpendicular', { a: corner1, b: corner2, c: corner2, d: corner3 })]
s188.source.inventory = [{ id: 'source-single', description: 'Sealed FIRST: center O, contact A, circle, radial stroke, NW-SE tangent p and interior-side square angle corner. A marker hidden because source does not establish an independent round contact dot.', objects: s188.objects.map(x => x.id), assertions: s188.assertions.map(x => x.id), requires: ['pointRelationships'] }]
const s189 = base('fig-189', 'Show the actual source right-hand tangent scene, horizontal contact radius and lower-right oblique exterior-point segment; unknown original glyphs remain unknown.', { width: 480, height: 480, boundingBox: [-5, 5, 5, -5] }, { layout: 'inline', maxWidthPx: 480, widths: [480, 358, 300] }, [17, 18, 19, 20])
const o189 = [-.8, .55], r189 = 3.45, a189 = [2.65, .55], b189 = [2.65, -3.3]
const lengthOB = Math.hypot(b189[0] - o189[0], b189[1] - o189[1])
const crossing = [o189[0] + (b189[0] - o189[0]) * r189 / lengthOB, o189[1] + (b189[1] - o189[1]) * r189 / lengthOB]
s189.objects = [point('source-center', o189, 'O', 'NW'),
  point('source-contact-anonymous', a189, 'A', 'E', false),
  point('source-lower-anonymous', b189, 'B', 'E', false),
  { ...point('source-oblique-circle-crossing-anonymous', crossing), size: 1, strokeWidth: .6 },
  { id: 'source-circle', type: 'circle', center: 'source-center', radius: r189, stroke: 'ink', strokeWidth: 2.8 },
  segment('source-horizontal-contact-stroke', 'source-center', 'source-contact-anonymous'),
  segment('source-oblique-lower-stroke', 'source-center', 'source-lower-anonymous', 1.6),
  segment('source-vertical-stroke', [2.65, -4.4], [2.65, 4.4]),
  text('modern-p-name', [2.65, 4.15], 'p', 'E')]
s189.assertions = [onCircle('contact-on-circle', 'source-contact-anonymous', 'source-center', r189),
  onCircle('oblique-crossing-on-circle', 'source-oblique-circle-crossing-anonymous', 'source-center', r189),
  fact('contact-on-tangent', 'pointOnLine', { point: 'source-contact-anonymous', a: [2.65, -4.4], b: [2.65, 4.4] }),
  fact('lower-on-tangent-modern-proof-binding', 'pointOnLine', { point: 'source-lower-anonymous', a: 'source-contact-anonymous', b: [2.65, -4.4] }),
  fact('oblique-crossing-on-lower-stroke', 'collinear', { a: 'source-center', b: 'source-oblique-circle-crossing-anonymous', c: 'source-lower-anonymous' }),
  fact('contact-radius-perpendicular-tangent', 'perpendicular', { a: 'source-center', b: 'source-contact-anonymous', c: 'source-contact-anonymous', d: 'source-lower-anonymous' }),
  fact('contact-radius-length', 'distance', { a: 'source-center', b: 'source-contact-anonymous', value: r189 }),
  fact('lower-oblique-length', 'distance', { a: 'source-center', b: 'source-lower-anonymous', value: lengthOB })]
s189.source.inventory = [{ id: 'source-single', description: 'Sealed FIRST source-center, anonymous contact, anonymous lower stroke neighborhood and anonymous lower-right circumference crossing. A and p are deliberate modern labels from theorem givens, B is a deliberate modern label from the explicit proof variable B on p; NONE establishes original damaged glyph identity. Completion of damaged lower joining strokes is edition-proof-based modern regularization. No original lower/contact glyph recovered.', objects: s189.objects.map(x => x.id), assertions: s189.assertions.map(x => x.id), requires: ['pointRelationships'] }]
const addendum = {
  status: 'AUTHOR_ONLY_NO_SOURCE_GLYPH_RECOVERY',
  createdAt: new Date().toISOString(), bindings: { context: bind(contextPath), candidateText: bind(context.candidateText.path), ninePromptsFileReferenceOnly: bind(context.candidateExercises.path), rawSourceProse: bind(context.sourceLesson.path), sourceFigureTemplate: bind(context.figuresTemplate.path) },
  candidateTextApproval: 'pending independent review; unchanged mathematical givens/spec context only',
  coordinatePolicy: 'All coordinate lengths are internal normalized drawing choices, never new numerical givens.',
  fig187: { additions: ['English panel (a)/(b)/(c) labels replace original Cyrillic panel glyphs by source order.', 'Bracket strokes redrawn continuously with the same endpoints; no new scale.'], contextualTextMismatch: 'Candidate prose still cites Cyrillic panel glyphs. Text owner must map those references to English (a)/(b)/(c) before promotion; no prose file changed here.' },
  fig188: { additions: ['Uniform vector thickness, neutral semantic ink and normalized isotropic circle geometry.'], sourceContactDot: 'No new visible contact dot; labelled hidden anchor.' },
  fig189: { originalFactsRemainUnknown: ['contact glyph identity UNKNOWN', 'lower glyph identity UNKNOWN', 'upper p-like glyph not independently certain', 'precise damaged lower joining pixels/dot unknown', 'faint/broken dash intent unknown'],
    justifiedModernLabels: [
      { label: 'A', object: 'source-contact-anonymous', basis: 'Exact candidate p0137#2 explicitly gives tangent through A; maps anonymous horizontal contact point, NOT original pixel identity.' },
      { label: 'p', object: 'modern-p-name', relation: 'source-vertical-stroke', basis: 'Exact candidate p0137#2 explicitly names tangent p; maps source vertical stroke, NOT original pixel identity.' },
      { label: 'B', object: 'source-lower-anonymous', basis: 'Exact candidate p0137#4,p0137#7 proof explicitly uses B on p distinct from A and OB. It names the existing lower exterior source-stroke neighborhood in the modern diagram only, NOT original lower glyph identity.' }
    ],
    regularizations: ['Complete circle and continuous damaged strokes preserve observed center/right contact/lower exterior composition; exact joining based on explicit modern proof B on p.', 'No invented interior/upper B configuration or right-angle square.', 'Anonymous circle/oblique crossing uses a small meeting marker, not a recovered original labelled point.'],
    hold: 'Original printing/glyph identity unresolved permanently in local record; modern candidate does not require deciding it. Independent source-fidelity review still pending.'
  }, independentReviewPerformed: false, reviewFileCreated: false, sharedCorePromoted: false
}
write(path.join(OWN, 'addendum.json'), addendum)
for (const spec of [s187, s188, s189]) write(path.join(OWN, 'figures', `${spec.id}.spec.json`), spec)
write(path.join(OWN, 'image-ledger.json'), { batch: 1, freshBatchLimit: 8, contextLimit: 24, chargedLoads: 3, sourceLoads: ['fig-187 once before FIRST', 'fig-188 once before FIRST', 'fig-189 once before FIRST'], generatedOrLoadedContacts: [], reopens: 0, failedImageLoads: 0, parentPermanentLoads: 24, newParentLoads: 0, newPaidCalls: 0, noNinthImage: true })
write(path.join(OWN, 'authorship.json'), { createdAt: new Date().toISOString(), cwd: R, authorHelper: bind(new URL(import.meta.url).pathname), sourceFirstSeals: ['fig-187', 'fig-188', 'fig-189'].map(id => bind(path.join(OWN, 'first', `${id}.seal.json`))), specs: [s187, s188, s189].map(s => bind(path.join(OWN, 'figures', `${s.id}.spec.json`))), addendum: bind(path.join(OWN, 'addendum.json')) })
const id = process.argv[2]
if (id) {
  const spec = path.join(OWN, 'figures', `${id}.spec.json`)
  run(`${id}-draft`, [path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B', path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), spec, '--stage', 'draft', '--json'])
}
