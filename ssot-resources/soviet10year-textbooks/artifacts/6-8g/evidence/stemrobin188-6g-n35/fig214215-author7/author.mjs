import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const book = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const finalRoot = `${book}/editions/modern-us-neutral`
const templates = `${book}/evidence/stemrobin188-6g-n35/text-author7`
const scripts = '.agents/skills/ld-s10y-image/scripts'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const hashFile = filename => hash(fs.readFileSync(filename))
const write = (filename, value) => {
  assert.ok(path.resolve(filename).startsWith(`${owned}/`))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`)
}
const asciiJson = value => JSON.stringify(value).replace(
  /[\u007f-\uffff]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
)
const bindings = ['lesson.template.json', 'exercises.template.json'].map(name => {
  const filename = `${templates}/${name}`
  const fullJsonText = fs.readFileSync(filename, 'utf8')
  JSON.parse(fullJsonText)
  return { path: filename, sha256: hash(fullJsonText), fullJsonText }
})
// Lossless JSON serialization binds all approved text, not cross-figure claims.
const authoritativeText = bindings.map(binding => ({
  lesson: 'geo68-c3-s2-n35',
  text: asciiJson(binding),
}))
const point = (id, label, x, y, visible = true, position = 'N') => ({
  id, type: 'point', at: [x, -y], label, visible,
  size: 3, strokeWidth: 1, stroke: 'ink', fill: 'ink',
  fontSize: 20, fontWeight: 500,
  labelPlacement: { position, offset: [position === 'NW' ? -8 : 0, position === 'S' ? 10 : -10] },
})
const text = (id, label, x, y) => ({
  id, type: 'text', at: [x, -y], text: label,
  fontSize: 20, fontWeight: 500, labelPlacement: { position: 'CENTER' },
})
const segment = (id, from, to, stroke = 'ink', strokeWidth = 2) => ({
  id, type: 'segment', from, to, stroke, strokeWidth,
})
const arrow = (id, from, to) => ({
  id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 2.4,
})
const relation = (id, type, fields) => ({ id, type, ...fields })
const group = (id, description, objects, assertions, requires = []) => ({
  id, description, objects, assertions, ...(requires.length ? { requires } : {}),
})
const common = (id, height, description) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: {
    image: { path: `${book}/figures/${id}.png`, sha256: hashFile(`${book}/figures/${id}.png`) },
    authoritativeText, inventory: [],
  },
  canvas: {
    width: 400, height, boundingBox: [0, 0, 400, -height],
    background: 'paper', keepAspectRatio: true,
  },
  display: {
    layout: 'inline', purpose: 'instructional',
    maxWidthPx: 400, minTextPx: 16, widths: [331, 358, 400],
  },
  layout: { minLabelGap: 6 },
  objects: [], assertions: [],
})

const fig214 = common('fig-214', 640,
  'Two vertically stacked panels compare rays on distinct parallel supporting lines using the joining line AC. Panel a has both rays on the same side; panel b has them on opposite sides. No measured lengths or answer annotations.')
for (const [panel, coordinates, trace, tips] of [
  ['a', { A: [145, 85], B: [330, 134.025], C: [80, 215], D: [310, 275.95] },
    [[38, -299], [178, -19]], [[365, -143.3], [345, -285.225]]],
  ['b', { A: [225, 385], B: [340, 415.475], C: [150, 535], D: [35, 504.525] },
    [[117, -601], [253, -329]], [[365, -422.1], [20, -500.55]]],
]) {
  const id = letter => `${panel}-${letter}`
  for (const [letter, [x, y]] of Object.entries(coordinates)) {
    fig214.objects.push(point(id(letter), letter, x, y, ['A', 'C'].includes(letter),
      ['A', 'C'].includes(letter) ? 'NW' : 'N'))
  }
  fig214.objects.push(
    segment(`${panel}-AC-trace`, ...trace, 'muted', 1.5),
    segment(`${panel}-AB`, id('A'), id('B'), 'ink', 2.4),
    segment(`${panel}-CD`, id('C'), id('D'), 'ink', 2.4),
    arrow(`${panel}-AB-continuation`, id('B'), tips[0]),
    arrow(`${panel}-CD-continuation`, id('D'), tips[1]),
    text(`${panel}-panel`, panel, 205, panel === 'a' ? 315 : 622),
  )
  const facts = [
    relation(`${panel}-parallel-supports`, 'parallel', { a: id('A'), b: id('B'), c: id('C'), d: id('D') }),
    relation(`${panel}-AC-start-on-line`, 'collinear', { a: id('A'), b: id('C'), c: trace[0] }),
    relation(`${panel}-AC-end-on-line`, 'collinear', { a: id('A'), b: id('C'), c: trace[1] }),
    relation(`${panel}-AB-continues`, 'collinear', { a: id('A'), b: id('B'), c: tips[0] }),
    relation(`${panel}-CD-continues`, 'collinear', { a: id('C'), b: id('D'), c: tips[1] }),
    relation(`${panel}-AB-connection`, 'connects', { arrow: `${panel}-AB`, from: id('A'), to: id('B') }),
    relation(`${panel}-CD-connection`, 'connects', { arrow: `${panel}-CD`, from: id('C'), to: id('D') }),
    relation(`${panel}-AC-connection`, 'connects', { arrow: `${panel}-AC-trace`, from: trace[0], to: trace[1] }),
    relation(`${panel}-AB-tail-connection`, 'connects', { arrow: `${panel}-AB-continuation`, from: id('B'), to: tips[0] }),
    relation(`${panel}-CD-tail-connection`, 'connects', { arrow: `${panel}-CD-continuation`, from: id('D'), to: tips[1] }),
  ]
  fig214.assertions.push(...facts)
  fig214.source.inventory.push(group(`source-214-${panel}`,
    panel === 'a'
      ? 'Upper subfigure: A is above/right of C on a thin joining stroke extending beyond both points; heavier AB and CD traces slope down/right and lie on distinct parallel supports, both right of AC. A and C have intersection dots; B and D label the right-going traces without separate printed dots. A/C labels lie left of AC, B/D above their rightward trace portions; panel label is below. Original glyph/script/printing/dash roles UNKNOWN. No given values or finite endpoint data.'
      : 'Lower subfigure: A is above/right of C on an extended thin joining stroke; AB slopes down/right, while CD runs up/left on a distinct parallel support. B is right/below A; D is left/above C. A/C have intersection dots; B/D are labelled trace portions without separate printed dots. A is labelled upper-left, C lower-right in the source; B is below its rightward trace and D above its leftward trace. Panel label below. Original glyph/script/printing/dash roles UNKNOWN. No values or finite endpoint data.',
    Object.keys(coordinates).map(id).concat([
      `${panel}-AC-trace`, `${panel}-AB`, `${panel}-CD`,
      `${panel}-AB-continuation`, `${panel}-CD-continuation`, `${panel}-panel`,
    ]),
    facts.map(item => item.id), ['pointRelationships']))
}
// Preserve the lower source label bands, independent of automatic placement.
fig214.objects.find(item => item.id === 'b-C').labelPlacement = { position: 'SE', offset: [8, 8] }
fig214.objects.find(item => item.id === 'b-B').labelPlacement = { position: 'S', offset: [0, 10] }

const fig215 = common('fig-215', 360,
  'One nested-ray row in panel a and two common-line rows in panel b, disjoint above and overlapping below. Preserve the label bands and source point ordering; rays continue indefinitely without numerical length data or answer annotations.')
const rowInputs = [
  ['a', 65, { A: 140, B: 360, C: 260, D: 360 }],
  ['b-upper', 204, { A: 260, B: 362, C: 142, D: 40 }],
  ['b-lower', 288, { A: 142, B: 362, C: 260, D: 40 }],
]
for (const [row, y, coordinates] of rowInputs) {
  const id = letter => `${row}-${letter}`
  for (const [letter, x] of Object.entries(coordinates)) {
    fig215.objects.push(point(id(letter), letter, x, y, ['A', 'C'].includes(letter),
      row === 'a' && letter === 'D' ? 'S' : 'N'))
  }
  const left = [22, -y], right = [378, -y]
  fig215.objects.push(
    segment(`${row}-common-support`, left, right, 'muted', 1.2),
    arrow(`${row}-AB-ray`, id('A'), right),
    arrow(`${row}-CD-ray`, id('C'), row === 'a' ? right : left),
  )
  const facts = [
    relation(`${row}-ABC-collinear`, 'collinear', { a: id('A'), b: id('C'), c: id('B') }),
    relation(`${row}-ACD-collinear`, 'collinear', { a: id('A'), b: id('C'), c: id('D') }),
    relation(`${row}-AB-tail-on-support`, 'collinear', { a: id('A'), b: id('B'), c: right }),
    relation(`${row}-CD-tail-on-support`, 'collinear', { a: id('C'), b: id('D'), c: row === 'a' ? right : left }),
    relation(`${row}-AB-origin-connection`, 'connects', { arrow: `${row}-AB-ray`, from: id('A'), to: right }),
    relation(`${row}-CD-origin-connection`, 'connects', { arrow: `${row}-CD-ray`, from: id('C'), to: row === 'a' ? right : left }),
    relation(`${row}-support-connection`, 'connects', { arrow: `${row}-common-support`, from: left, to: right }),
  ]
  fig215.assertions.push(...facts)
  const description = {
    a: 'Top panel a: a single horizontal common-line row with origin dots A left of C; the upper label band reads A, C, B from left to right, and D occupies the lower band at the same rightward printed trace position as B. Both AB and CD go right, the latter nested in the former. The stroke extends left of A. B/D have no independent dots. Their aligned printed label anchors are diagrammatic, not a given equality or a finite endpoint. Panel label below.',
    'b-upper': 'Panel b upper row: one horizontal common line; left-to-right upper labels D, C, A, B; origin dots C and A. AB goes right from A and CD left from C, disjoint on their common support. B/D have no separate dots. The gap between origins belongs to the common supporting line, not to either ray.',
    'b-lower': 'Panel b lower row: one horizontal common line; left-to-right upper labels D, A, C, B; origin dots A and C. AB goes right from A and CD left from C, overlapping between the origins. B/D have no separate dots. A single panel b label below covers BOTH rows, not a new panel c.',
  }[row]
  fig215.source.inventory.push(group(`source-215-${row}`,
    `${description} Original glyph/script/printing/dash roles UNKNOWN. No given measurements, axes, tick marks or finite-length data.`,
    Object.keys(coordinates).map(id).concat([
      `${row}-common-support`, `${row}-AB-ray`, `${row}-CD-ray`,
    ]), facts.map(item => item.id), ['pointRelationships']))
}
fig215.objects.push(text('a-panel', 'a', 205, 134), text('b-panel', 'b', 205, 340))
fig215.source.inventory.push(group('source-215-panel-bands',
  'Two vertically arranged panels: a has one row, b has two rows. The first panel label lies between a and b; the second below both b rows. Modern labels a/b follow approved prose; original lower-panel glyph/script role UNKNOWN.',
  ['a-panel', 'b-panel'], []))
for (const object of fig215.objects) {
  if (object.type === 'point' && object.labelPlacement.position === 'N') {
    object.labelPlacement.offset = [0, -16]
  }
}

const additions = [
  'Modern a/b panel labels follow the approved templates, never copied source script.',
  'Arrowheads encode the approved ray semantics and are modern continuation marks; source arrowhead, printing and dash roles remain UNKNOWN.',
  'B/D labelled invisible point anchors retain the source trace labels without inventing separate printed dots or finite endpoints.',
  'Coordinate distances and display trace limits are layout choices only; no distance/equality/displacement assertions or numeric labels are introduced.',
  'Neutral thinner support traces and label spacing regularize the printing while keeping the source panel topology and label sides.',
  'All approved JSON text is bound losslessly as ASCII-escaped JSON strings with original file SHA; no text or other-figure context is omitted and no unrelated theorem is drawn.',
]

function relationships(spec) {
  const result = []
  const get = id => spec.objects.find(item => item.id === id)
  const at = id => get(id).at
  const check = (id, predicate, detail) => {
    assert.ok(predicate, `${spec.id}: ${id}`)
    result.push({ id, status: 'pass', detail })
  }
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  if (spec.id === 'fig-214') {
    for (const panel of ['a', 'b']) {
      const [A, B, C, D] = ['A', 'B', 'C', 'D'].map(letter => at(`${panel}-${letter}`))
      check(`${panel}-source-origin-order`, A[0] > C[0] && A[1] > C[1], 'A is above/right of C.')
      check(`${panel}-distinct-parallel-supports`, Math.abs(cross(A, B, C)) > 1,
        'The two supports are distinct; native parallel assertion checks their directions.')
      const sides = cross(A, C, B) * cross(A, C, D)
      check(`${panel}-half-plane-inside`, panel === 'a' ? sides > 0 : sides < 0,
        panel === 'a' ? 'B and D lie strictly inside the same AC half-plane.' : 'B and D lie strictly inside opposite AC half-planes.')
      check(`${panel}-source-ray-order`,
        B[0] > A[0] && B[1] < A[1] && (panel === 'a'
          ? D[0] > C[0] && D[1] < C[1]
          : D[0] < C[0] && D[1] > C[1]),
        'The labelled ray portions preserve the source directional ordering.')
      for (const [origin, sample, suffix] of [['A', 'B', 'AB'], ['C', 'D', 'CD']]) {
        const O = at(`${panel}-${origin}`), P = at(`${panel}-${sample}`)
        const tail = get(`${panel}-${suffix}-continuation`).to
        const dot = (P[0] - O[0]) * (tail[0] - P[0]) + (P[1] - O[1]) * (tail[1] - P[1])
        check(`${panel}-${suffix}-continuation-order`, dot > 0,
          'The continuation arrow extends beyond the labelled sample on the ray, not toward its origin.')
      }
    }
    check('source-panels-vertical', at('a-A')[1] > at('b-A')[1], 'Panel a above panel b, unchanged topology.')
  } else {
    for (const [row, order] of [
      ['a', ['A', 'C', 'B']], ['b-upper', ['D', 'C', 'A', 'B']], ['b-lower', ['D', 'A', 'C', 'B']],
    ]) {
      const values = order.map(letter => at(`${row}-${letter}`)[0])
      check(`${row}-source-point-order`, values.every((value, index) => !index || values[index - 1] < value),
        `Left-to-right ${order.join(', ')}; no metric spacing premise.`)
      const A = at(`${row}-A`), B = at(`${row}-B`), C = at(`${row}-C`), D = at(`${row}-D`)
      const ab = Math.sign(B[0] - A[0]), cd = Math.sign(D[0] - C[0])
      check(`${row}-ray-directions`, ab === 1 && cd === (row === 'a' ? 1 : -1),
        'Directed rays are derived from origin-to-labelled-point order.')
      check(`${row}-ray-topology`, row === 'a'
        ? ab === cd && A[0] < C[0]
        : row === 'b-upper' ? C[0] < A[0] : A[0] < C[0],
      { a: 'CD is nested inside AB.', 'b-upper': 'The opposed rays are disjoint.', 'b-lower': 'The opposed rays overlap between A and C.' }[row])
    }
    check('a-two-label-bands',
      get('a-B').labelPlacement.position === 'N' && get('a-D').labelPlacement.position === 'S',
      'B above and D below the common trace; not merged into a single label.')
    check('b-shared-two-row-panel', at('b-upper-A')[1] > at('b-lower-A')[1]
      && !spec.objects.some(item => item.type === 'text' && item.text === 'c'),
    'One b label covers the upper disjoint and lower overlap rows.')
  }
  const labels = spec.objects.filter(item => item.label || item.text)
  check('visible-English-math-only', labels.every(item => /^[A-Dab]$/.test(item.label || item.text)), 'Only A/B/C/D and a/b appear in the SVG.')
  check('minimum-declared-label-size', labels.every(item => item.fontSize * 331 / 400 >= 16),
    'Every actual label is at least 16.55px at 331px and 17.9px at 358px.')
  return result
}

const manifest = {
  schema: 'n35-modern-figure-author-candidate@1',
  status: 'authoring', role: 'MODERN FIGURE AUTHOR ONLY',
  lesson: 'geo68-c3-s2-n35', scope: ['fig-214', 'fig-215'],
  cwd, owned, root: finalRoot, authoritativeText: bindings.map(({ fullJsonText, ...binding }) => binding),
  approval: 'pending-independent-approval', canonicalWrites: 0,
  additions,
  images: {
    sourceOpens: 2, sourceReopens: 0, sourceCrops: 0, sourcePages: 0,
    contextImageLoads: 2, batchImageLimit: 8, contextImageLimit: 24,
    sourceDimensions: { 'fig-214': [384, 626], 'fig-215': [393, 356] },
    screenshotOpens: 0, screenshotReopens: 0, screenshotCrops: 0,
    nativeRasterDecodes: 0, nativeSvgDisplayInstances: 0,
    rendererBrowsers: 0, headedDisplayBrowsers: 0, closedBrowsers: 0,
  },
  firstFailures: [
    { phase: 'read-only-file-discovery', exitCode: 2, reason: 'Owned scratch was not created yet; broad rg reported its absence. No figure rendering or content failed.' },
    { phase: 'read-only-media-path-lookup', exitCode: 2, reason: 'Guessed lesson-media.ts/render_lesson.mjs paths absent; located existing render_lesson.js. No outputs or unrelated files changed.' },
    {
      phase: 'spec-validation', figure: 'fig-214', revision: 1, exitCode: 2,
      reason: 'Native validator requires <=352px and the 331px mobile product width. Added 331px; all labels remain >=16px. Geometry unchanged.',
      spec: { path: path.join(owned, 'figures/fig-214.spec.r1.json'), sha256: hashFile(path.join(owned, 'figures/fig-214.spec.r1.json')) },
      validation: { path: path.join(owned, 'figures/fig-214.validation.r1.json'), sha256: hashFile(path.join(owned, 'figures/fig-214.validation.r1.json')) },
    },
  ],
  figures: [],
}
const previousManifestPath = path.join(owned, 'manifest.json')
if (fs.existsSync(previousManifestPath)) {
  const previous = JSON.parse(fs.readFileSync(previousManifestPath, 'utf8'))
  manifest.figures = previous.figures
  manifest.images = previous.images
  manifest.firstFailures = previous.firstFailures
  for (const failure of manifest.firstFailures) {
    if (failure.phase !== 'render' || failure.evidence) continue
    const names = failure.figure === 'fig-214'
      ? ['fig-214.spec.r2.json', 'fig-214.r2.svg', 'fig-214.render.r2.json']
      : ['fig-215.spec.r1.json', 'fig-215.r1.svg', 'fig-215.render.r1.json']
    failure.evidence = names.map(name => {
      const filename = path.join(owned, 'figures', name)
      return { path: filename, sha256: hashFile(filename) }
    })
    failure.repair = failure.figure === 'fig-214'
      ? 'NW label offsets moved 8px left; geometry and display sizes unchanged.'
      : 'All upper-band labels moved 6px upward to clear the six A/C origin markers; no point or topology changes.'
  }
}
for (const spec of [fig214, fig215]) {
  const directory = path.join(owned, 'figures')
  const specPath = path.join(directory, `${spec.id}.spec.json`)
  const svgPath = path.join(directory, `${spec.id}.svg`)
  const renderPath = path.join(directory, `${spec.id}.render.json`)
  const previous = manifest.figures.find(item => item.id === spec.id)
  if (previous && previous.spec.sha256 === hash(`${JSON.stringify(spec, null, 2)}\n`)) {
    assert.equal(hashFile(previous.spec.path), previous.spec.sha256)
    assert.equal(hashFile(previous.svg.path), previous.svg.sha256)
    assert.equal(hashFile(previous.render.path), previous.render.sha256)
    console.log(`REUSE unchanged PASS: ${spec.id}`)
    continue
  }
  const revision = spec.id === 'fig-214' ? 3 : 2
  write(specPath, spec)
  const assertions = relationships(spec)
  const validation = spawnSync('python3', [`${scripts}/validate_spec.py`, specPath, '--stage', 'draft', '--json'], { cwd, encoding: 'utf8' })
  write(path.join(directory, `${spec.id}.validation.json`), {
    exitCode: validation.status, stdout: validation.stdout, stderr: validation.stderr,
    specSha256: hashFile(specPath),
  })
  if (validation.status !== 0) {
    manifest.status = 'failed-candidate'
    manifest.firstFailures.push({
      phase: 'spec-validation', figure: spec.id, revision, exitCode: validation.status,
      stdout: validation.stdout, stderr: validation.stderr, specSha256: hashFile(specPath),
    })
    write(path.join(owned, 'manifest.json'), manifest)
    throw new Error(validation.stdout || validation.stderr)
  }
  const args = [`${scripts}/render_spec.mjs`, '--spec', specPath, '--svg', svgPath, '--report', renderPath]
  const rendering = spawnSync('node', args, { cwd, encoding: 'utf8' })
  manifest.images.rendererBrowsers += 1
  manifest.images.closedBrowsers += 1
  if (rendering.status !== 0) {
    manifest.firstFailures.push({
      phase: 'render', figure: spec.id, revision, exitCode: rendering.status,
      stdout: rendering.stdout, stderr: rendering.stderr, specSha256: hashFile(specPath),
    })
    manifest.status = 'failed-candidate'
    write(path.join(owned, 'manifest.json'), manifest)
    throw new Error(`Render failed for ${spec.id}; original report retained.`)
  }
  const report = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
  assert.equal(report.status, 'pass')
  report.root = finalRoot
  report.spec.path = `${finalRoot}/figures/${spec.id}.spec.json`
  report.output.svg.path = `${finalRoot}/figures/${spec.id}.svg`
  write(renderPath, report)
  const relationshipPath = path.join(directory, `${spec.id}.relationships.json`)
  write(relationshipPath, {
    schema: 'n35-point-relationships@1', status: 'pass', figure: spec.id,
    sourceSha256: spec.source.image.sha256, specSha256: hashFile(specPath),
    checks: assertions, insideMethod: 'Signed half-plane cross-products; no invented visible set/frame polygons.',
  })
  manifest.figures.push({
    id: spec.id, status: 'render-pass-awaiting-display', currentRevision: revision,
    source: spec.source.image,
    spec: { path: specPath, final: `figures/${spec.id}.spec.json`, sha256: hashFile(specPath) },
    svg: { path: svgPath, final: `figures/${spec.id}.svg`, sha256: hashFile(svgPath) },
    render: { path: renderPath, final: `figures/${spec.id}.render.json`, sha256: hashFile(renderPath) },
    relationships: { path: relationshipPath, sha256: hashFile(relationshipPath), checks: assertions.length },
    validation: { path: path.join(directory, `${spec.id}.validation.json`), sha256: hashFile(path.join(directory, `${spec.id}.validation.json`)) },
    objects: spec.objects.length, labels: report.labels,
    nativeAssertions: spec.assertions.length,
    sourceInventoryGroups: spec.source.inventory.length,
    executions: [{ revision, command: 'node', argv: args, cwd,
      exitCode: rendering.status, stdout: rendering.stdout, stderr: rendering.stderr }],
    rerenderedUnchangedPass: 0, display: spec.display,
  })
  write(path.join(owned, 'manifest.json'), manifest)
}
manifest.status = 'render-pass-awaiting-display'
write(path.join(owned, 'manifest.json'), manifest)
console.log(JSON.stringify({
  status: manifest.status,
  figures: manifest.figures.map(({ id, objects, labels, nativeAssertions, relationships }) => ({
    id, objects, labels, nativeAssertions, relationshipChecks: relationships.checks,
  })),
}, null, 2))
