import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const manifestPath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d403-n70-first-figure-contexts.json')
const expectedManifest = 'fcbb87005cb5ce6bada77ab4449cd4737b4d17b0fe958894740b56714a824d0d'
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const ids = ['fig-141', 'fig-142', 'fig-143']
const widths = [640, 331, 342]
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const local = file => path.join(own, file)
const absolute = file => path.resolve(repo, file)
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`), 'Ownership violation')
  assert.ok(!fs.existsSync(file), `Do not replace retained evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(hash(manifestPath), expectedManifest)
const manifest = read(manifestPath)
assert.equal(manifest.card, 'phy10-c2-s2-n70')
const contexts = ids.map(id => manifest.contexts.find(item => item.figure === id))
const inputRecords = [manifest.fullZH, manifest.fullEN, manifest.textReview, ...contexts.flatMap(item => [item, item.originalImage])]
for (const record of inputRecords) assert.equal(hash(absolute(record.path)), record.sha256, record.path)

const sourceObservations = {
  schema: 'd404/source-pixel-observations@1',
  method: 'Direct original PNG observations, one open each, before creating any spec or reading any existing modern figure.',
  firstBatch: ids,
  noCropsOrReopens: true,
  figures: [
    {
      id: 'fig-141',
      sourceImage: contexts[0].originalImage,
      subfigures: ['One shared side-view spherical-mirror frame; no separate panels.'],
      points: [
        { id: 's141-O', label: 'O', fact: 'Black point at intersection of horizontal principal axis and upward-right secondary axis, left of F.' },
        { id: 's141-F', label: 'F', fact: 'Black point on principal axis between O and P; short vertical focal-plane line passes through it.' },
        { id: 's141-P', label: 'P', fact: 'Vertex on the principal axis at the middle of the curved mirror.' },
        { id: 's141-K', label: 'K', fact: 'Secondary-axis intersection with the mirror, above P.' },
        { id: 's141-mirror-top', label: null, fact: 'Unlabelled upper end of mirror.' },
        { id: 's141-mirror-bottom', label: null, fact: 'Unlabelled lower end of mirror.' }
      ],
      linesAndCurves: [
        { id: 's141-principal', fact: 'Solid nearly horizontal unarrowed axis extends to both sides; O, F, P lie on it.' },
        { id: 's141-secondary', fact: 'Solid unarrowed sloping axis extends below-left of O and above-right of K; O and K lie on it.' },
        { id: 's141-mirror', fact: 'One thick continuous mirror curve on the right, concave toward O; right/back side has a bank of short oblique hatch strokes.' },
        { id: 's141-focal-plane', fact: 'Short solid vertical line through F, perpendicular to principal axis; original Chinese label means focal plane.' },
        { id: 's141-radius-brace', fact: 'Sloping unarrowed brace above OK labelled R, from the vicinity of O to K.' },
        { id: 's141-half-radius-brace', fact: 'Horizontal unarrowed brace between F and P labelled R/2.' }
      ],
      directedRays: [],
      dashedLines: [],
      labels: ['O', 'F', 'P', 'K', 'R', 'R/2', 'Chinese focal-plane label'],
      relationships: ['O,F,P collinear in that order', 'O,K define secondary axis', 'P,K and both mirror endpoints on the sphere centered at O', 'OK=OP=R', 'FP=R/2 in the schematic paraxial model', 'focal-plane trace through F perpendicular to OP'],
      texturePolicy: 'Backing hatch bank identifies the nonreflecting side; individual hatch spacing is print texture, not a source scale, grid, or numerical datum.',
      modernChanges: ['Translate focal-plane label to English.', 'Regularize scan skew and braces without altering source relations.', 'Retain approximate/paraxial scope in an explicit label; R/2 is not a universal exact focusing assertion.', 'Backing hatches are regularized; not represented as counted source data.']
    },
    {
      id: 'fig-142',
      sourceImage: contexts[1].originalImage,
      subfigures: ['One vertically mounted optical-disk apparatus; no separate panels.'],
      points: [],
      apparatus: [
        { id: 's142-source', fact: 'Top central light apparatus: upper clamp/knob, narrow vertical neck and wider lower housing just above disk.' },
        { id: 's142-disk', fact: 'Round front-facing optical disk with thick perimeter and a repeated graduation band; triangular perimeter marks are apparatus graduations, not ray-direction arrows.' },
        { id: 's142-mirror-region', fact: 'Reflector/support region crosses the middle-lower portion of the disk; two thick side fittings are visible.' },
        { id: 's142-support', fact: 'Long narrow vertical support below disk, ending at a small base.' }
      ],
      traces: [
        { id: 's142-parallel-traces', fact: 'Three narrow near-vertical illuminated trace bands are visually suggested in the upper central disk, separated by heavy print screening.' },
        { id: 's142-reflected-traces-unresolved', fact: 'Oblique light/reflection traces and the exact reflector contact points cannot be reliably separated from the horizontal screened texture on this single original observation.' }
      ],
      directedRays: 'No independently resolvable drawn ray arrowheads; do not reinterpret perimeter triangles or reflector fittings as arrowheads.',
      dashedLines: 'No reliably identifiable intentional dashed construction line; raster interruptions are not evidence of dashed-ray semantics.',
      labels: [],
      exactCountsNotResolved: ['Individual small perimeter ticks', 'All reflected traces and contact points', 'Fine clamp/reflector features occluded by screening'],
      outcome: 'HOLD',
      reason: 'Required source completeness cannot be honestly established. A deterministic apparatus silhouette alone would omit unresolved scientific traces; text context cannot replace independent pixel inventory. No paid artwork or fabricated rays.',
      modernChanges: [],
      scope: 'The incomplete draft exists only to retain a real native validation failure, not as a renderable or publishable replacement.'
    },
    {
      id: 'fig-143',
      sourceImage: contexts[2].originalImage,
      subfigures: ['One shared principal-axis ray frame.'],
      points: [
        { id: 's143-O', label: 'O', fact: 'Black point on principal axis to the left of the ray crossing.' },
        { id: 's143-F', label: 'F', fact: 'Dense common ray-crossing region on axis between O and mirror.' },
        { id: 's143-P', label: 'P', fact: 'Mirror vertex at principal-axis intersection on right.' },
        { id: 's143-mirror-top', label: null, fact: 'Unlabelled upper end of mirror.' },
        { id: 's143-mirror-bottom', label: null, fact: 'Unlabelled lower end of mirror.' }
      ],
      incidentLevels: ['upper-3', 'upper-2', 'upper-1', 'central-axis', 'lower-1', 'lower-2', 'lower-3'],
      rayFacts: [
        'Seven solid approximately horizontal levels: six off-axis incoming rays and the central shared principal-axis path.',
        'Each of the six off-axis incident rays has a rightward arrowhead before reaching the mirror.',
        'Six solid oblique reflected paths run from the six mirror contact levels toward F and continue to the left.',
        'Reflected arrows point away from the mirror: top mirror contact continues through F toward lower-left, and bottom contact continues through F toward upper-left; paired intermediate paths have the same reversal.',
        'No separate central-ray arrowhead can be resolved on the shared axis; do not add one as an original fact.',
        'Mirror is a continuous concave curve on the right with oblique right-side backing hatches.'
      ],
      dashedLines: [],
      focalPlane: 'Absent from this source; do not import Figure 141 focal-plane trace.',
      labels: ['O', 'F', 'P', 'printed 143 caption outside the scientific frame'],
      relationships: ['O,F,P collinear with F between O and P', 'All incoming off-axis levels parallel to OP', 'Each incident endpoint lies on mirror', 'Each reflected path crosses the schematic F and continues left', 'All six incident arrows point toward mirror and six reflected arrows away', 'All elements share one frame'],
      texturePolicy: 'Backing hatches and scan skew are nonnumerical print conventions.',
      modernChanges: ['Regularize scan skew and spacing; preserve all six off-axis rays and central axis.', 'Explicit Paraxial approximation and Schematic, not to scale labels; the common F is a model construction, not exact all-aperture spherical focusing.', 'Regularized hatches and small construction endpoint markers are modern rendering aids, not extra source data.', 'Do not copy the embedded printed caption into the ray frame.']
    }
  ]
}

function builder(id, height) {
  const context = read(absolute(contexts.find(item => item.figure === id).path))
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: '',
    source: {
      image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
      authoritativeText: context.lessons.flatMap(lesson => lesson.prose.flatMap(block =>
        block.nearbyText.map(text => ({ lesson: lesson.lesson, text })))),
      inventory: []
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 }
  }
  const xy = (x, y) => [x, height - y]
  const point = (name, x, y, size = 0.01) => {
    spec.objects.push({ id: name, type: 'point', at: xy(x, y), size, strokeWidth: size === 0.01 ? 0.01 : 2, stroke: 'ink', fill: 'ink' })
    return name
  }
  const segment = (name, from, to, style = {}) => {
    spec.objects.push({ id: name, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, dash: 0, ...style })
    spec.assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
  }
  const arrow = (name, from, to) => {
    spec.objects.push({ id: name, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3, dash: 0 })
    spec.assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
  }
  const text = (name, x, y, value) => spec.objects.push({
    id: name, type: 'text', at: xy(x, y), text: value, fontSize: 32, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 }
  })
  const relation = (name, type, fields) => spec.assertions.push({ id: name, type, ...fields })
  const circlePoint = (name, center, radius) => relation(`${name}-on-sphere`, 'pointOnCircle', { point: name, center, radius })
  const inventory = (name, description, objects, assertions, requires = []) => spec.source.inventory.push({ id: name, description, objects, assertions, ...(requires.length ? { requires } : {}) })
  return { spec, xy, point, segment, arrow, text, relation, circlePoint, inventory }
}

function figure141() {
  const b = builder('fig-141', 460)
  const { spec, xy, point, segment, text, relation, circlePoint, inventory } = b
  spec.description = 'One shared spherical-mirror frame: center O, vertex P, secondary-axis contact K, schematic paraxial focus F, radius R and FP=R/2, with the perpendicular focal-plane trace. The focus and focal plane retain the approved approximate scope.'
  const O = point('s141-O', 95, 245, 3)
  const F = point('s141-F', 320, 245, 3)
  const P = point('s141-P', 545, 245)
  const R = 450
  const mx = y => 95 + Math.sqrt(R * R - (y - 245) ** 2)
  const K = point('s141-K', mx(135), 135)
  const top = point('s141-mirror-top', mx(85), 85)
  const bottom = point('s141-mirror-bottom', mx(405), 405)
  spec.objects.push({ id: 's141-mirror', type: 'arc', center: O, start: bottom, end: top, stroke: 'ink', strokeWidth: 5, dash: 0 })
  for (let y = 95; y <= 400; y += 18) segment(`s141-backing-${y}`, xy(mx(y) + 3, y), xy(mx(y) + 17, y - 12), { strokeWidth: 2 })
  segment('s141-principal', xy(25, 245), xy(605, 245))
  const slope = (135 - 245) / (mx(135) - 95)
  segment('s141-secondary', xy(35, 245 + slope * (35 - 95)), xy(600, 245 + slope * (600 - 95)))
  const ft = point('s141-focal-plane-top', 320, 208)
  const fb = point('s141-focal-plane-bottom', 320, 313)
  segment('s141-focal-plane', ft, fb)
  spec.objects.push({ id: 's141-radius-brace', type: 'svgPath', d: `M 95 207 L 98 197 L 305 145 L 307 133 L 316 142 L ${mx(135) - 3} 90 L ${mx(135)} 100`, stroke: 'ink', strokeWidth: 2, dash: 0 })
  spec.objects.push({ id: 's141-half-radius-brace', type: 'svgPath', d: 'M 320 227 L 325 215 L 421 215 L 432 205 L 443 215 L 540 215 L 545 227', stroke: 'ink', strokeWidth: 2, dash: 0 })
  text('s141-O-text', 95, 279, 'O')
  text('s141-F-text', 320, 279, 'F')
  text('s141-P-text', 570, 278, 'P')
  text('s141-K-text', 584, 119, 'K')
  text('s141-R-text', 295, 109, 'R')
  text('s141-half-R-text', 433, 186, 'R/2')
  text('s141-plane-text', 320, 343, 'Focal plane')
  text('modern141-scope', 292, 427, 'Paraxial approximation')
  relation('s141-O-F-P', 'collinear', { a: O, b: F, c: P })
  relation('s141-O-P-radius', 'distance', { a: O, b: P, value: R })
  relation('s141-O-K-radius', 'distance', { a: O, b: K, value: R })
  relation('s141-paraxial-half-radius', 'equalDistance', { a: O, b: F, c: F, d: P })
  relation('s141-F-on-plane', 'collinear', { a: ft, b: F, c: fb })
  relation('s141-plane-normal', 'perpendicular', { a: ft, b: fb, c: O, d: P })
  relation('s141-K-on-secondary', 'pointOnLine', { point: K, a: O, b: xy(600, 245 + slope * (600 - 95)) })
  for (const p of [P, K, top, bottom]) circlePoint(p, O, R)
  inventory('source141-shared-frame', sourceObservations.figures[0].relationships.join('; '),
    [O, F, P, K, top, bottom, ft, fb, 's141-principal', 's141-secondary', 's141-mirror', 's141-focal-plane'],
    spec.assertions.filter(item => ['collinear', 'distance', 'equalDistance', 'perpendicular', 'pointOnLine', 'pointOnCircle'].includes(item.type)).map(item => item.id),
    ['pointRelationships'])
  inventory('source141-annotations', 'Source O,F,P,K,R,R/2 and focal-plane label; braces remain unarrowed. Solid axes/curve/plane, no dashed source line.',
    ['s141-radius-brace', 's141-half-radius-brace', 's141-O-text', 's141-F-text', 's141-P-text', 's141-K-text', 's141-R-text', 's141-half-R-text', 's141-plane-text'],
    ['s141-O-K-radius', 's141-paraxial-half-radius', 's141-plane-normal'])
  inventory('source141-backing', sourceObservations.figures[0].texturePolicy,
    spec.objects.filter(item => item.id.startsWith('s141-backing-')).map(item => item.id),
    spec.assertions.filter(item => item.id.startsWith('s141-backing-')).map(item => item.id))
  return spec
}

function figure142() {
  const b = builder('fig-142', 960)
  const { spec, xy, point, segment, inventory } = b
  spec.description = 'HOLD: screened optical-disk experiment. Known apparatus silhouette retained in an unrenderable first draft, but complete source ray paths, contact points, graduation counts and fine fittings cannot be independently resolved. No invented exact focusing or artwork.'
  const center = point('s142-disk-center', 320, 470)
  spec.objects.push({ id: 's142-disk', type: 'circle', center, radius: 230, stroke: 'ink', strokeWidth: 5, fill: 'paper', fillOpacity: 1 })
  spec.objects.push({ id: 's142-source-housing', type: 'polygon', points: [xy(273, 182), xy(367, 182), xy(367, 211), xy(273, 211)], stroke: 'ink', fill: 'paper', fillOpacity: 1 })
  segment('s142-source-neck', xy(320, 95), xy(320, 181), { strokeWidth: 12 })
  segment('s142-support', xy(320, 704), xy(320, 885), { strokeWidth: 10 })
  segment('s142-base', xy(286, 889), xy(354, 889), { strokeWidth: 8 })
  spec.assertions.push({ id: 's142-disk-radius', type: 'distance', a: center, b: xy(550, 470), value: 230 })
  inventory('source142-apparatus-known', 'One circular disk, upper source housing and neck, lower support/base; these alone are not a complete scientific replacement.',
    ['s142-disk', 's142-source-housing', 's142-source-neck', 's142-support', 's142-base'],
    ['s142-disk-radius'])
  inventory('source142-unresolved-required-facts', 'HOLD: all reflected traces/contact points, exact graduation inventory and occluded fine source/reflector fittings must be resolved independently from original pixels, not inferred from prose. Missing required object is deliberate truthful blocking evidence.',
    ['s142-unresolved-required-source-traces-and-fittings'], [])
  return spec
}

function figure143() {
  const b = builder('fig-143', 640)
  const { spec, xy, point, segment, arrow, text, relation, circlePoint, inventory } = b
  spec.description = 'Seven incident levels in one frame: six off-axis solid parallel rays toward a concave mirror and the shared central axis. Six reflected paths cross the model F and continue left, with reversed arrow directions. The common crossing is explicitly the paraxial approximation, schematic and not to scale; not exact arbitrary-aperture spherical focusing.'
  const O = point('s143-O', 70, 305, 3)
  const F = point('s143-F', 320, 305, 3)
  const P = point('s143-P', 570, 305)
  const R = 500
  // Display heights are exaggerated in the explicitly not-to-scale source-style ray schematic.
  const mx = y => 70 + Math.sqrt(R * R - (y - 305) ** 2)
  const top = point('s143-mirror-top', mx(91), 91)
  const bottom = point('s143-mirror-bottom', mx(519), 519)
  spec.objects.push({ id: 's143-mirror', type: 'arc', center: O, start: bottom, end: top, stroke: 'ink', strokeWidth: 5, dash: 0 })
  for (let y = 100; y <= 510; y += 20) segment(`s143-backing-${y}`, xy(mx(y) + 3, y), xy(mx(y) + 19, y - 12), { strokeWidth: 2 })
  segment('s143-central-axis', xy(22, 305), xy(614, 305))
  relation('s143-O-F-P', 'collinear', { a: O, b: F, c: P })
  relation('s143-paraxial-F-position', 'equalDistance', { a: O, b: F, c: F, d: P })
  const levelNames = ['upper-3', 'upper-2', 'upper-1', 'lower-1', 'lower-2', 'lower-3']
  const offsets = [-180, -120, -60, 60, 120, 180]
  const sourcePoints = [O, F, P, top, bottom]
  for (const [index, offset] of offsets.entries()) {
    const prefix = `s143-${levelNames[index]}`
    const y = 305 + offset
    const entry = point(`${prefix}-incident-entry`, 22, y)
    const contact = point(`${prefix}-contact`, mx(y), y)
    const outX = 112
    const outY = 305 + offset * (outX - 320) / (mx(y) - 320)
    const exit = point(`${prefix}-reflected-exit`, outX, outY)
    sourcePoints.push(entry, contact, exit)
    segment(`${prefix}-incident`, entry, contact)
    arrow(`${prefix}-incident-direction`, xy(247, y), xy(276, y))
    segment(`${prefix}-reflected`, contact, exit)
    const arrowX = 154
    const arrowY = 305 + offset * (arrowX - 320) / (mx(y) - 320)
    arrow(`${prefix}-reflected-direction`, xy(arrowX, arrowY), xy(outX, outY))
    relation(`${prefix}-incident-parallel`, 'parallel', { a: entry, b: contact, c: O, d: P })
    relation(`${prefix}-reflection-through-model-F`, 'collinear', { a: contact, b: F, c: exit })
    circlePoint(contact, O, R)
  }
  for (const p of [P, top, bottom]) circlePoint(p, O, R)
  text('s143-O-text', 70, 272, 'O')
  text('s143-F-text', 320, 272, 'F')
  text('s143-P-text', 552, 272, 'P')
  text('modern143-scope', 320, 41, 'Paraxial approximation')
  text('modern143-scale', 320, 592, 'Schematic, not to scale')
  inventory('source143-shared-frame-and-rays', 'Source pixel inventory: O,F,P; six off-axis incident entries/contact points/reflected exits; one central axis; all incoming solid paths parallel to OP and all six solid reflected paths continue through the approximate model F. Every source point and every directed edge is mapped. No focal plane or dashed source path.',
    [...sourcePoints, ...spec.objects.filter(item => item.type === 'segment' && !item.id.startsWith('s143-backing-') || item.type === 'arrow' || item.id === 's143-mirror').map(item => item.id)],
    spec.assertions.filter(item => !item.id.startsWith('s143-backing-')).map(item => item.id),
    ['pointRelationships'])
  inventory('source143-labels', 'Only O,F,P inside source frame; embedded printed figure number excluded from diagram content.',
    ['s143-O-text', 's143-F-text', 's143-P-text'], ['s143-O-F-P'])
  inventory('source143-backing', sourceObservations.figures[2].texturePolicy,
    spec.objects.filter(item => item.id.startsWith('s143-backing-')).map(item => item.id),
    spec.assertions.filter(item => item.id.startsWith('s143-backing-')).map(item => item.id))
  return spec
}

function prepare() {
  write(local('source-observations.json'), sourceObservations)
  write(local('actual-opens.json'), {
    schema: 'd404/actual-opens@1', limit: 24, parentPermanentCount: 24, parentNewImageOpens: 0,
    count: 3, reopens: 0, crops: 0,
    batches: [{ batch: 1, purpose: 'canonical-original-pixels', count: 3, files: contexts.map(item => bind(absolute(item.originalImage.path))) }],
    counterNeverReset: true
  })
  const tools = ['SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md', 'assets/figure-spec.schema.json', 'scripts/validate_spec.py', 'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs']
  const retainedInputs = [manifestPath, ...inputRecords.map(item => absolute(item.path)), ...tools.map(item => path.join(skill, item)),
    '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
    path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d022-n86-figures-author/author.mjs')]
  const copies = retainedInputs.map((file, index) => {
    const dest = local(`inputs/${String(index).padStart(2, '0')}-${path.basename(file)}`)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(file, dest, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(file), hash(dest))
    fs.chmodSync(dest, 0o444)
    return { original: bind(file), retained: bind(dest) }
  })
  write(local('inputs.json'), {
    manifest: bind(manifestPath), records: copies,
    launcherInspection: {
      renderer: 'render_spec.mjs launch uses isolated chromium.launch({executablePath,headless:true}); no persistent profile or CDP.',
      snapshotPattern: 'd022 author.mjs previews(): isolated chromium.launch({headless:true}), newContext, setContent SVG, declared width, PNG screenshot, close finally.',
      forbiddenEntrypointsNotExecuted: ['ld-s10y-image/tests/arrowhead-print.test.mjs (headless:false)', 'headed/GUI/Inspector/CUA/OS-input'],
      override: 'User specifically requires headless author previews; these are not formal product DISPLAY acceptance.'
    },
    textReview: 'Existing independent SCI/ZHEN PASS retained only by binding, not repeated.'
  })
  const specs = [figure141(), figure142(), figure143()]
  for (const spec of specs) write(local(`${spec.id}/initial.spec.json`), spec)
  write(local('preparation.json'), {
    scope: ids, book: '10p', own, noPermanentWorkers: true, noPaidGeneration: true,
    sourceInventory: bind(local('source-observations.json')),
    initialSpecs: specs.map(spec => bind(local(`${spec.id}/initial.spec.json`)))
  })
}

function native(name, executable, args) {
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }
  delete env.PWDEBUG
  const start = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  write(local(`native/${name}.json`), {
    name, command: [executable, ...args], cwd: repo, startedAt: start, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null, headlessBoundary: true, inheritedPWDEBUGRemoved: true, htmlReportOpen: 'never'
  })
  console.log(name, 'exit', result.status, result.stdout?.trim().slice(0, 700), result.stderr?.trim().slice(0, 700))
  return result.status === 0
}

function initial() {
  for (const id of ids) {
    const spec = local(`${id}/initial.spec.json`)
    native(`${id}-initial-draft`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), spec, '--stage', 'draft', '--json'])
    native(`${id}-initial-render`, 'node', [path.join(skill, 'scripts/render_spec.mjs'), '--spec', spec,
      '--svg', local(`${id}/initial.svg`), '--report', local(`${id}/initial.render.json`)])
  }
}

function repair() {
  for (const id of ['fig-141', 'fig-143']) {
    const original = local(`${id}/initial.spec.json`)
    const initialReport = local(`${id}/initial.render.json`)
    assert.equal(read(initialReport).status, 'fail')
    assert.ok(!fs.existsSync(local(`${id}/repair.spec.json`)), 'Only one repair allowed')
    const spec = read(original)
    const moves = id === 'fig-141'
      ? [
          ['s141-F-text', [287, 277]],
          ['s141-K-text', [575, 75]],
          ['s141-half-R-text', [433, 190]]
        ]
      : [['s143-P-text', [612, 272]]]
    for (const [name, [x, y]] of moves) {
      const item = spec.objects.find(object => object.id === name)
      item.at = [x, spec.canvas.height - y]
    }
    if (id === 'fig-141') {
      spec.objects.find(item => item.id === 's141-half-radius-brace').d =
        'M 320 241 L 325 232 L 421 232 L 432 222 L 443 232 L 540 232 L 545 241'
    }
    const repaired = local(`${id}/repair.spec.json`)
    write(repaired, spec)
    write(local(`${id}/repair.json`), {
      figure: id, repairs: 1, maximum: 1, trigger: bind(initialReport),
      reason: id === 'fig-141'
        ? 'Move F away from the vertical focal-plane stroke, K away from the extended secondary axis, and move the half-radius brace/label apart. All source geometry, semantic assertions, arrows, colors, widths and font sizes unchanged.'
        : 'Move P label into clear space just to the right of the mirror/backing, away from reflected rays and point clearance. All source geometry, semantic assertions, arrows, colors, widths and font sizes unchanged.',
      originalSpec: bind(original), repairedSpec: bind(repaired), labelMoves: moves,
      fontFloorUnchanged: 16, fontSizeUnchanged: 32, factsOmitted: 0, assertionsWeakened: 0,
      generatedSVGEdited: false
    })
    native(`${id}-sole-repair-draft`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), repaired, '--stage', 'draft', '--json'])
    native(`${id}-sole-repair-render`, 'node', [path.join(skill, 'scripts/render_spec.mjs'), '--spec', repaired,
      '--svg', local(`${id}/repair.svg`), '--report', local(`${id}/repair.render.json`)])
  }
}

async function previews() {
  const { chromium } = await import(path.join(repo, '.agents/skills/node_modules/playwright-core/index.mjs'))
  assert.equal(process.env.PWDEBUG, undefined, 'PWDEBUG must be unset')
  const browser = await chromium.launch({ headless: true })
  const rows = []
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1 })
    try {
      const page = await context.newPage()
      for (const id of ids) {
        const attempt = fs.existsSync(local(`${id}/repair.spec.json`)) ? 'repair' : 'initial'
        const renderPath = local(`${id}/${attempt}.render.json`)
        if (!fs.existsSync(renderPath) || read(renderPath).status !== 'pass') continue
        const specPath = local(`${id}/${attempt}.spec.json`)
        const svgPath = local(`${id}/${attempt}.svg`)
        const spec = read(specPath)
        for (const width of spec.display.widths) {
          const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
          const errors = []
          const onError = error => errors.push(error.message)
          page.on('pageerror', onError)
          await page.setViewportSize({ width, height })
          await page.setContent('<!doctype html><html><head><style>html,body{margin:0;background:white}svg{display:block;width:100%;height:auto}</style></head><body></body></html>')
          await page.locator('body').evaluate((body, markup) => { body.innerHTML = markup }, fs.readFileSync(svgPath, 'utf8'))
          const measures = await page.locator('svg').evaluate(svg => ({
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height,
            labels: [...svg.querySelectorAll('text')].map(node => {
              const matrix = node.getScreenCTM()
              const rect = node.getBoundingClientRect()
              return { id: node.getAttribute('data-label-id'), text: node.textContent,
                px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
                rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
            }),
            arrowheads: [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => node.getAttribute('data-arrowhead-for'))
          }))
          assert.equal(measures.width, width)
          assert.equal(errors.length, 0)
          assert.ok(measures.labels.every(item => item.px >= spec.display.minTextPx && item.rect.x >= 0 && item.rect.y >= 0 &&
            item.rect.x + item.rect.width <= width && item.rect.y + item.rect.height <= height))
          assert.equal(measures.arrowheads.length, spec.objects.filter(item => item.type === 'arrow').length)
          const png = local(`${id}/preview-${width}.png`)
          assert.ok(!fs.existsSync(png))
          await page.screenshot({ path: png, type: 'png', animations: 'disabled' })
          page.off('pageerror', onError)
          rows.push({ figure: id, width, viewport: { width, height }, spec: bind(specPath), svg: bind(svgPath), png: bind(png), measurements: measures, pageErrors: errors, status: 'pass' })
        }
      }
    } finally { await context.close() }
  } finally { await browser.close() }
  write(local('preview-report.json'), {
    schema: 'd404/headless-author-preview@1', status: 'pass', role: 'AUTHOR_ONLY; not independent FIG or product DISPLAY',
    method: 'Existing d022 SVG snapshot pattern; isolated headless Playwright; no lesson or parent pane opened.',
    command: ['env', '-u', 'PWDEBUG', 'PLAYWRIGHT_HTML_OPEN=never', 'node', local('author.mjs'), 'previews'],
    widths, rows
  })
}

if (process.argv[2] === 'prepare') prepare()
else if (process.argv[2] === 'initial') initial()
else if (process.argv[2] === 'repair') repair()
else if (process.argv[2] === 'previews') await previews()
else throw new Error('Expected prepare, initial, repair or previews')
