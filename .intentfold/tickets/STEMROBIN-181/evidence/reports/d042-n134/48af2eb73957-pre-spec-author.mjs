import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const scratch = path.dirname(owned)
const currentFreeze = path.join(scratch, 'd042-9p-n134-text-repair/repair-freeze.json')
const previousFreeze = path.join(scratch, 'd040-9p-n134-author/author-freeze.json')
const source = path.join(
  workspace, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-303.png',
)
const skill = path.join(workspace, '.agents/skills/ld-s10y-image')
const expectedCurrent = '9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef'
const expectedPrevious = 'ab08cd85ebc7fffe66cfc16be0c9a6b5b7bd25c92c4ef0dece5af711d8b82753'
const expectedSource = 'a0b28f523c7554fea8ba59bca7fc2321f37da09db624f97aae94e3fa97a9901b'
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const hash = filename => digest(fs.readFileSync(filename))
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const record = filename => ({ path: filename, sha256: hash(filename) })
const destination = relative => {
  const filename = path.resolve(owned, relative)
  assert(filename.startsWith(`${owned}${path.sep}`), 'Write escaped ownership.')
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  return filename
}
const write = (relative, value) => {
  const filename = destination(relative)
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return record(filename)
}
const copy = (filename, relative) => {
  const target = destination(relative)
  fs.copyFileSync(filename, target, fs.constants.COPYFILE_EXCL)
  return { original: record(filename), snapshot: record(target) }
}
const command = (id, executable, args) => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: workspace,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    executable, args, cwd: workspace, startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error) : null,
  }
  write(`commands/${id}.json`, receipt)
  return receipt
}

function verifyInputs() {
  assert.equal(hash(currentFreeze), expectedCurrent, 'Current text freeze changed.')
  assert.equal(hash(previousFreeze), expectedPrevious, 'Previous text freeze changed.')
  assert.equal(hash(source), expectedSource, 'Original PNG changed.')
  const current = read(currentFreeze)
  for (const language of current.languages) {
    for (const binding of [
      ...language.templates, language.normalizedText, language.markdown,
    ]) {
      assert.equal(hash(binding.path), binding.sha256, `Stale input: ${binding.path}`)
    }
  }
  for (const binding of current.raw3) {
    assert.equal(hash(binding.path), binding.sha256, `Raw identity changed: ${binding.path}`)
  }
  assert.equal(hash(current.displayTitle.path), current.displayTitle.sha256)
  return current
}

const round = value => Number(value.toFixed(6))
const cubic = (points, t) => {
  const weights = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3]
  return [0, 1].map(axis => round(
    points.reduce((sum, point, index) => sum + point[axis] * weights[index], 0),
  ))
}

// These are qualitative, source-bound drawing anchors, not measured physical data.
const curves = {
  a: [
    [[-240, -200], [-125, -197], [-37, -186], [-22, -146]],
    [[-22, -146], [-15, -110], [-11, -45], [-8, 0]],
    [[-8, 0], [-5, 98], [2, 126], [25, 150]],
    [[25, 150], [62, 184], [156, 198], [240, 200]],
  ],
  b: [
    [[-240, -200], [-159, -196], [-131, -184], [-118, -133]],
    [[-118, -133], [-104, -92], [-108, -45], [-100, 0]],
    [[-100, 0], [-100, 82], [-102, 98], [-55, 123]],
    [[-55, 123], [18, 175], [151, 193], [240, 200]],
  ],
}

function loop(letter, origin) {
  const upper = [curves[letter][0][0]]
  for (const segment of curves[letter]) {
    for (let index = 1; index <= 24; index += 1) {
      upper.push(cubic(segment, index / 24))
    }
  }
  const half = upper.slice(0, -1)
  const polygon = [...half, ...half.map(([x, y]) => [-x, -y])]
    .map(([x, y]) => [round(origin[0] + x), round(origin[1] + y)])
  return {
    polygon,
    pairs: half.map((_, index) => ({
      a: polygon[index], b: polygon[index + half.length],
    })),
  }
}

function buildSpec(current) {
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id: 'fig-303',
    mode: 'deterministic',
    description: 'Compare the source two-panel soft/hard ferromagnetic hysteresis loops on equal qualitative I-versus-B0 scales: panel (a) has a much narrower loop, smaller enclosed area, smaller remanence and smaller coercive-field magnitude than panel (b). No portrait, apparatus, wires, numerical calibration or answers are present in the original PNG. Exact origin-centered opposite-vertex pairs are a justified modern regularization of the qualitative source contours, not additional experimental data.',
    source: {
      image: { path: source, sha256: expectedSource },
      authoritativeText: current.languages.map(language => {
        const template = read(language.templates.find(item =>
          item.path.endsWith('/lesson.template.json')).path)
        const normalized = read(language.normalizedText.path)
        assert.deepEqual(template.prose, normalized.prose)
        return {
          lesson: 'phy9-c2-s7-n134',
          text: normalized.prose.map(item => item.text ?? item.label ?? '').filter(Boolean).join('\n\n'),
        }
      }),
      inventory: [],
    },
    canvas: {
      width: 640, height: 1160,
      boundingBox: [0, 1160, 640, 0],
      background: 'paper', keepAspectRatio: true,
    },
    display: {
      purpose: 'instructional', layout: 'inline',
      minTextPx: 16, widths: [316, 640], maxWidthPx: 640,
    },
    objects: [],
    assertions: [],
  }
  for (const [letter, origin, title] of [
    ['a', [300, 850], '(a) Soft magnetic'],
    ['b', [300, 290], '(b) Hard magnetic'],
  ]) {
    const prefix = `fig303${letter}`
    const { polygon, pairs } = loop(letter, origin)
    const xFrom = [54, origin[1]]
    const xTo = [553, origin[1]]
    const yFrom = [300, origin[1] - 240]
    const yTo = [300, origin[1] + 230]
    const xAxis = `${prefix}-B0-axis`
    const yAxis = `${prefix}-I-positive-axis`
    const negativeAxis = `${prefix}-I-negative-axis`
    spec.objects.push(
      { id: `${prefix}-loop`, type: 'polygon', points: polygon, stroke: 'ink', strokeWidth: 4, fillOpacity: 0 },
      { id: xAxis, type: 'arrow', from: xFrom, to: xTo, stroke: 'ink', strokeWidth: 3 },
      { id: yAxis, type: 'arrow', from: origin, to: yTo, stroke: 'ink', strokeWidth: 3 },
      { id: negativeAxis, type: letter === 'a' ? 'arrow' : 'segment', from: origin, to: yFrom, stroke: 'ink', strokeWidth: 3 },
      { id: `${prefix}-I-label`, type: 'text', at: [264, origin[1] + 220], text: 'I', fontSize: 36, labelPlacement: { position: 'CENTER' } },
      { id: `${prefix}-B0-label`, type: 'text', at: [576, origin[1] - 35], text: 'B\u2080', fontSize: 36, labelPlacement: { position: 'CENTER' } },
      { id: `${prefix}-zero-label`, type: 'text', at: origin, text: '0', fontSize: 36, labelPlacement: { position: 'SW', gap: 34 } },
      { id: `${prefix}-panel-label`, type: 'text', at: [320, origin[1] + 280], text: title, fontSize: 36, labelPlacement: { position: 'CENTER' } },
    )
    spec.assertions.push(
      { id: `${prefix}-loop-opposite-vertices`, type: 'centralSymmetry', center: origin, pairs },
      { id: `${prefix}-axes-perpendicular`, type: 'perpendicular', lines: [xAxis, yAxis] },
      { id: `${prefix}-origin-on-B0`, type: 'pointOnLine', point: origin, line: [xFrom, xTo] },
      { id: `${prefix}-origin-on-I`, type: 'pointOnLine', point: origin, line: [yFrom, yTo] },
      { id: `${prefix}-B0-arrow-direction`, type: 'connects', arrow: xAxis, from: xFrom, to: xTo },
      { id: `${prefix}-I-positive-direction`, type: 'connects', arrow: yAxis, from: origin, to: yTo },
      { id: `${prefix}-I-negative-direction`, type: 'connects', arrow: negativeAxis, from: origin, to: yFrom },
      { id: `${prefix}-saturation-extents`, type: 'distance', a: [60, origin[1] - 200], b: [540, origin[1] + 200], value: Math.hypot(480, 400) },
    )
    spec.source.inventory.push(
      {
        id: `${prefix}-source-loop`,
        description: letter === 'a'
          ? 'Original upper subfigure: one very narrow closed, solid two-branch S-shaped hysteresis contour, with negative/positive saturation ends and nonzero positive/negative I intercepts near the I axis; the B0 intercepts are much closer to the origin than in the lower panel. It encloses far less area. No curve-direction arrows, numerical ticks, labelled point coordinates, grid, apparatus, people or wires.'
          : 'Original lower subfigure: one much wider closed, solid two-branch hysteresis contour. It has broad horizontal separation of its near-vertical branches, negative/positive saturation ends, larger-magnitude I-axis remanence intercepts and larger-magnitude B0-axis coercive intercepts than the upper panel, and far more enclosed area. No numerical ticks, labelled point coordinates, grid, apparatus, people or wires.',
        objects: [`${prefix}-loop`],
        assertions: [`${prefix}-loop-opposite-vertices`, `${prefix}-saturation-extents`],
      },
      {
        id: `${prefix}-source-coordinate-frame`,
        description: 'Each source panel has its own crossing axes: vertical I and horizontal B0, positive I arrow upward, positive B0 arrow rightward, and a printed zero near the crossing. The source upper panel also shows a downward terminal on its negative I axis; the lower negative I axis ends as a plain line. Preserve these two separate but equally scaled qualitative frames. No numeric ranges, tick values, distances or units are printed.',
        objects: [xAxis, yAxis, negativeAxis, `${prefix}-I-label`, `${prefix}-B0-label`, `${prefix}-zero-label`],
        assertions: [
          `${prefix}-axes-perpendicular`, `${prefix}-origin-on-B0`, `${prefix}-origin-on-I`,
          `${prefix}-B0-arrow-direction`, `${prefix}-I-positive-direction`, `${prefix}-I-negative-direction`,
        ],
      },
      {
        id: `${prefix}-source-panel-identity`,
        description: `Source panel ${letter === 'a' ? 'upper Cyrillic a' : 'lower Cyrillic be'} is localized to (${letter}), matching frozen bilingual Figure 303${letter} references. The English soft/hard descriptor is a justified modern addition from the text, not printed source content.`,
        objects: [`${prefix}-panel-label`],
        assertions: ['fig303-two-panels', 'fig303-source-label-count'],
      },
    )
  }
  spec.assertions.push(
    { id: 'fig303-two-panels', type: 'objectCount', objectType: 'polygon', count: 2 },
    { id: 'fig303-source-label-count', type: 'objectCount', objectType: 'text', count: 8 },
    { id: 'fig303-equal-horizontal-scales', type: 'equalDistance', pairs: [[[54, 850], [553, 850]], [[54, 290], [553, 290]]] },
    { id: 'fig303-equal-vertical-scales', type: 'equalDistance', pairs: [[[300, 610], [300, 1080]], [[300, 50], [300, 520]]] },
  )
  return spec
}

function crossings(points, origin, axis) {
  const result = []
  const fixed = axis === 'horizontal' ? 1 : 0
  const varying = 1 - fixed
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]
    const b = points[(index + 1) % points.length]
    const da = a[fixed] - origin[fixed]
    const db = b[fixed] - origin[fixed]
    if (da === 0) result.push(a[varying] - origin[varying])
    if (da * db < 0) {
      const t = -da / (db - da)
      result.push(a[varying] + (b[varying] - a[varying]) * t - origin[varying])
    }
  }
  return [...new Set(result.map(round))].sort((a, b) => a - b)
}

function geometryChecks(spec) {
  const panels = ['a', 'b'].map(letter => {
    const polygon = spec.objects.find(item => item.id === `fig303${letter}-loop`).points
    const origin = spec.objects.find(item => item.id === `fig303${letter}-zero-label`).at
    const horizontal = crossings(polygon, origin, 'horizontal')
    const vertical = crossings(polygon, origin, 'vertical')
    assert.equal(horizontal.length, 2)
    assert.equal(vertical.length, 2)
    assert(horizontal[0] < 0 && horizontal[1] > 0)
    assert(vertical[0] < 0 && vertical[1] > 0)
    const twiceArea = polygon.reduce((sum, a, index) => {
      const b = polygon[(index + 1) % polygon.length]
      return sum + a[0] * b[1] - b[0] * a[1]
    }, 0)
    return {
      panel: letter, origin, vertices: polygon.length,
      horizontalIntercepts: horizontal, verticalIntercepts: vertical,
      coerciveHalfWidth: horizontal[1], remanenceMagnitude: vertical[1],
      enclosedArea: Math.abs(twiceArea) / 2,
      extrema: {
        xMin: Math.min(...polygon.map(point => point[0])) - origin[0],
        xMax: Math.max(...polygon.map(point => point[0])) - origin[0],
        yMin: Math.min(...polygon.map(point => point[1])) - origin[1],
        yMax: Math.max(...polygon.map(point => point[1])) - origin[1],
      },
    }
  })
  assert(panels[0].coerciveHalfWidth < panels[1].coerciveHalfWidth)
  assert(panels[0].remanenceMagnitude < panels[1].remanenceMagnitude)
  assert(panels[0].enclosedArea < panels[1].enclosedArea)
  assert.deepEqual(panels[0].extrema, panels[1].extrema)
  assert(spec.objects.every(item => !['image', 'svgPath', 'grid'].includes(item.type)))
  return {
    schema: 'ld-s10y-image/author-geometry-check@1',
    status: 'pass',
    spec: record(path.join(owned, 'fig-303.spec.json')),
    panels,
    checkedRelationships: [
      'Two separate vertically stacked coordinate frames with matched axis scales.',
      'Exactly two nonzero opposite remanence and coercive crossings per source loop.',
      'Soft loop coercive width, remanence magnitude and enclosed area are all smaller.',
      'Equal positive/negative qualitative saturation extents after declared regularization.',
      'Every defining contour vertex is covered by an executable native centralSymmetry pair.',
      'No invented apparatus, wires, historical portrait, calibration, grid or branch arrows.',
    ],
    numericMeaning: 'All reported coordinates and areas are uncalibrated drawing units, not source measurements or physical material constants.',
  }
}

function author() {
  const current = verifyInputs()
  assert(!fs.existsSync(path.join(owned, 'build-state.json')), 'Existing attempt must be preserved.')
  const bindings = [
    copy(source, 'inputs/original/fig-303.png'),
    copy(previousFreeze, 'inputs/previous-author-freeze.json'),
    copy(currentFreeze, 'inputs/current-repair-freeze.json'),
    copy(current.displayTitle.path, 'inputs/display-title.json'),
  ]
  for (const language of current.languages) {
    for (const binding of [
      ...language.templates, language.normalizedText, language.markdown,
    ]) {
      bindings.push(copy(binding.path, `inputs/${language.language}/${path.basename(binding.path)}`))
    }
  }
  for (const filename of [
    'references/routing.md', 'references/figure-spec.md',
    'references/generation.md', 'references/quality-gate.md',
    'assets/figure-spec.schema.json', 'scripts/validate_spec.py',
    'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs',
  ]) {
    bindings.push(copy(path.join(skill, filename), `inputs/contracts/${filename}`))
  }
  const png = fs.readFileSync(source)
  write('source-inventory.json', {
    schema: 'ld-s10y-image/independent-source-inventory@1',
    source: record(source),
    dimensions: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) },
    imageOpenOrdinal: 1,
    inventoryMethod: 'Direct full-resolution view_image of the specified original PNG before choosing a renderer or reading other source inventories.',
    actualSubject: 'Two vertically stacked I-versus-B0 hysteresis-loop comparison plots; not a portrait or apparatus.',
    routingHistory: [
      { stage: 'initial-human-intent', requested: 'Source-bound Stoletov portrait, conditional on actual original.', observation: 'Original PNG is not a portrait; no semantic image generation attempted.' },
      { stage: 'refined-human-intent', requested: 'Possibly two-panel closed-ring apparatus; inspect actual PNG and use instructional deterministic geometry.', observation: 'Actual PNG contains two hysteresis plots and no apparatus or wires. Both frozen languages explicitly identify 303a as soft and 303b as hard. The separate Stoletov paragraph describes a method, not an object visible in this image.' },
      { stage: 'current-authority', requested: expectedCurrent, observation: 'Current bilingual lesson templates and normalized prose are byte-verified. Display-title sidecar is separately bound and does not mutate native/raw identity.' },
    ],
    facts: [
      'Upper panel: narrow closed S-shaped solid loop; lower panel: much wider closed solid loop.',
      'Each loop spans negative and positive B0 and I and has nonzero intercepts on both axes.',
      'Each panel has an I axis upward arrow, a B0 axis rightward arrow and a nearby zero label.',
      'The upper negative I axis has an apparent downward terminal arrow; the lower one is a plain line.',
      'Top source panel marker is a; lower marker is Cyrillic be, localized by authoritative prose to b.',
      'No numerical tick values, measured coordinates, grid, apparatus, wires, component labels, people or dates are printed in the image.',
    ],
    sourceFactsNotInferred: [
      'No physical coercivity/remanence values are available; source stroke positions cannot be promoted to calibrated data.',
      'The historical identity and closed-ring method remain intact in the prose, without inventing a diagram or portrait.',
    ],
    modernAdditions: [
      'Clean English panel descriptors from the frozen text.',
      'Matched qualitative extents and scales for the stated soft/hard comparison.',
      'Exactly opposite contour vertices around each origin, preserving the source unbiased-loop structure without claiming experimental precision.',
      'Smooth sampled cubic contours and legible 36px native labels at 316px and 640px.',
    ],
    outputMappings: buildSpec(current).source.inventory,
  })
  const specBinding = write('fig-303.spec.json', buildSpec(current))
  const spec = read(specBinding.path)
  write('geometry-check.json', geometryChecks(spec))
  const validation = command('initial-spec-validation', 'python3', [
    path.join(skill, 'scripts/validate_spec.py'), specBinding.path,
    '--stage', 'rendered', '--json',
  ])
  let render = null
  if (validation.exitCode === 0) {
    render = command('initial-native-render', 'node', [
      path.join(skill, 'scripts/render_spec.mjs'),
      '--spec', specBinding.path,
      '--svg', destination('fig-303.svg'),
      '--png', destination('preview/fig-303.native.png'),
      '--report', destination('fig-303.render.json'),
    ])
  }
  const attempts = [{
    id: 'initial', spec: specBinding,
    validation: record(path.join(owned, 'commands/initial-spec-validation.json')),
    render: render ? record(path.join(owned, 'commands/initial-native-render.json')) : null,
    validationExitCode: validation.exitCode,
    renderExitCode: render?.exitCode ?? null,
    targetedRepair: false,
  }]
  for (const filename of ['fig-303.spec.json', 'fig-303.svg', 'fig-303.render.json']) {
    const original = path.join(owned, filename)
    if (fs.existsSync(original)) copy(original, `attempts/initial/${filename}`)
  }
  verifyInputs()
  write('build-state.json', {
    schema: 'ld-s10y-image/bounded-author-state@1',
    status: validation.exitCode === 0 && render?.exitCode === 0
      ? 'NATIVE-RENDERED-AUTHOR-INSPECTION-PENDING'
      : 'INITIAL-NATIVE-FAILURE-TARGETED-REPAIR-AVAILABLE',
    inputs: bindings, attempts,
    originalTextAuthority: record(previousFreeze),
    currentTextAuthority: record(currentFreeze),
    geometryReboundAfterRendering: false,
    geometryRenderedAgainstCurrentText: true,
    targetedRepairsUsed: 0,
    generationCalls: 0,
    independentApproval: 'pending',
  })
  console.log(JSON.stringify({
    status: read(path.join(owned, 'build-state.json')).status,
    validation: validation.exitCode, render: render?.exitCode ?? null,
    spec: specBinding,
  }, null, 2))
}

function freeze() {
  const current = verifyInputs()
  const state = read(path.join(owned, 'build-state.json'))
  const observations = read(path.join(owned, 'author-observations.json'))
  const report = read(path.join(owned, 'fig-303.render.json'))
  const spec = read(path.join(owned, 'fig-303.spec.json'))
  assert.equal(report.status, 'pass')
  assert.equal(report.spec.sha256, hash(path.join(owned, 'fig-303.spec.json')))
  assert.equal(report.output.svg.sha256, hash(path.join(owned, 'fig-303.svg')))
  assert.equal(observations.independentApproval, false)
  assert(observations.imageOpens.length <= 8)
  assert.equal(observations.outputs.native.sha256, hash(path.join(owned, 'preview/fig-303.native.png')))
  assert.equal(observations.outputs.mobile.sha256, hash(path.join(owned, 'preview/fig-303.mobile-316.png')))
  for (let index = 0; index < current.languages.length; index += 1) {
    const prose = read(current.languages[index].normalizedText.path).prose
    assert.equal(
      spec.source.authoritativeText[index].text,
      prose.map(item => item.text ?? item.label ?? '').filter(Boolean).join('\n\n'),
    )
  }
  for (const binding of state.inputs) {
    assert.equal(hash(binding.original.path), binding.original.sha256)
    assert.equal(hash(binding.snapshot.path), binding.snapshot.sha256)
  }
  const artifactNames = [
    'author.mjs', 'make-mobile-preview.py', 'source-inventory.json',
    'build-state.json', 'geometry-check.json', 'fig-303.spec.json',
    'fig-303.svg', 'fig-303.render.json', 'author-observations.json',
    'preview/fig-303.native.png', 'preview/fig-303.mobile-316.png',
    'preview/pixel-check.json', 'commands/mobile-preview.json',
    'commands/initial-spec-validation.json', 'commands/initial-native-render.json',
    'attempts/initial/fig-303.spec.json', 'attempts/initial/fig-303.svg',
    'attempts/initial/fig-303.render.json',
  ]
  const binding = write('author-freeze.json', {
    schema: 'ld-s10y-image/bounded-figure-author-freeze@1',
    ticket: 'STEMROBIN-181', card: 'phy9-c2-s7-n134', figure: 'fig-303',
    frozenAt: new Date().toISOString(),
    status: 'AUTHOR-FROZEN-NATIVE-SPEC-RENDER-PASS-CURRENT-ZHEN-BOUND-INDEPENDENT-APPROVAL-PENDING',
    ownedOutputRoot: owned,
    renderer: { mode: 'deterministic', evidence: record(path.join(owned, 'fig-303.render.json')) },
    actualSourceSubject: 'Two hysteresis-loop comparison panels, not a portrait or closed-ring apparatus.',
    source: record(source),
    sourceInventory: record(path.join(owned, 'source-inventory.json')),
    authoritativeText: {
      status: 'current-final-repair-freeze-bound',
      repairFreeze: record(currentFreeze),
      previousFreeze: record(previousFreeze),
      languages: current.languages.map((language, index) => ({
        language: language.language,
        lessonTemplate: language.templates.find(item => item.path.endsWith('/lesson.template.json')),
        prose: language.normalizedText, markdown: language.markdown,
        sourceAuthoritativeTextIndex: index,
        textSha256: digest(spec.source.authoritativeText[index].text),
        verbatimCompleteProseBinding: true,
      })),
      displayTitleSeparate: current.displayTitle,
      rawIdentity: current.raw3,
      rawIdentityMutated: false,
      geometryRebindRequired: false,
      reason: 'No earlier spec/render existed. Initial geometry was rendered after receiving and verifying the final text-repair freeze.',
    },
    display: {
      ...spec.display,
      preserveAspectRatio: 'contain; intrinsic SVG viewBox 640x1160',
      declaredMobileWidthPx: 316,
      mobileIsActualHeadedProductMeasurement: false,
      measurementScope: 'User-supplied actual mobile media width tested by native renderer screen CTM. Product/offline lesson not opened.',
      checks: report.displayChecks,
    },
    figureSpec: record(path.join(owned, 'fig-303.spec.json')),
    outputs: { svg: record(path.join(owned, 'fig-303.svg')) },
    nativeGeometryChecks: record(path.join(owned, 'geometry-check.json')),
    authorObservations: record(path.join(owned, 'author-observations.json')),
    attempts: state.attempts,
    attemptCount: state.attempts.length,
    targetedRepairsUsed: state.targetedRepairsUsed,
    targetedRepairsAllowed: 1,
    generation: { calls: 0, metadata: null, reason: 'Original is instructional mathematical plots, so n-azure semantic/portrait generation is not applicable.' },
    imageOpens: observations.imageOpens,
    imageOpenCount: observations.imageOpens.length,
    imageOpenLimit: 8,
    preservation: { allBoundInputsRehashedBeforeFreeze: true, inputSnapshots: state.inputs, otherWorkerFilesWritten: 0 },
    boundaries: {
      sameResumedInvocation: true, setupUpdateGrill: false,
      backendOperations: 0, gitOperations: 0, appOperations: 0,
      dependencyEdits: 0, charterEdits: 0, databaseOperations: 0,
      sourcePageOpens: 0, productPageOpens: 0,
      canonicalWrites: 0, promotion: false, reviewApprovalRecorded: false,
      nativeRendererInMemoryBrowserOnly: true,
    },
    approval: {
      independentFigureReview: 'pending', independentScienceReview: 'pending',
      independentBilingualReview: 'pending', wholeCardApproved: false,
      figurePromotable: false, canonicalPromotionPerformed: false,
    },
    artifacts: artifactNames.map(name => record(path.join(owned, name))),
  })
  console.log(JSON.stringify({ status: read(binding.path).status, ...binding, imageOpenCount: observations.imageOpens.length }, null, 2))
}

if (process.argv[2] === 'freeze') freeze()
else author()
