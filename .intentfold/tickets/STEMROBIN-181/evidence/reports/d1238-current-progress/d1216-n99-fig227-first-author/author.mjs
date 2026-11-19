import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp'
const lessonId = 'phy10-c2-s4-n99'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-227.png'
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
assert.equal(process.cwd(), repo, 'sole delegated cwd')
assert.equal(out, path.join(repo, scratch, 'd1216-n99-fig227-first-author'))

const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const ref = file => ({
  path: path.resolve(file),
  sha256: hash(fs.readFileSync(file)),
  bytes: fs.statSync(file).size,
})
function write(name, value) {
  const file = path.resolve(out, name)
  assert.ok(file.startsWith(`${out}/`), 'exclusive write scope')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
function command(name, executable, args) {
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PYTHON: python },
    maxBuffer: 16 * 1024 * 1024,
  })
  write(`commands/${name}.json`, {
    cwd: repo, executable, args, started,
    ended: new Date().toISOString(),
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
  return result
}
const at = (x, screenY) => [x, 720 - screenY]
const frame = { x0: 132, y0: 570, speedUnit: 518, massUnit: 53, cutoff: 8.4 }
const graph = (beta, gamma) => [
  frame.x0 + frame.speedUnit * beta,
  frame.y0 - frame.massUnit * gamma,
]

function context() {
  const inventory = read(path.join(out, 'source.inventory.json'))
  assert.equal(ref(path.join(repo, source)).sha256, inventory.sourceImage.sha256)
  const git = command('branch-at-context', 'git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  assert.equal(git.stdout.trim(), 'codex/STEMROBIN-181-textbooks')
  const freezePath = path.join(repo, scratch, 'd1212-n99-two-errata-repair/current-candidate-freeze.json')
  const existingFreeze = read(freezePath)
  const bindings = []
  const textSets = []
  for (const version of ['corrected-current', 'author-FIRST']) {
    const base = version === 'corrected-current'
      ? path.join(repo, scratch, 'd1212-n99-two-errata-repair')
      : path.join(repo, scratch, 'd1204-n99-first-bilingual-text-author/FIRST')
    for (const locale of ['zh', 'en']) {
      const file = path.join(base, locale, 'lesson.template.json')
      const bytes = fs.readFileSync(file)
      const doc = JSON.parse(bytes)
      assert.equal(doc.card_id, lessonId)
      assert.deepEqual(doc.figures.map(figure => figure.id), ['fig-227'])
      assert.equal(doc.exercise_count, 0)
      const binding = {
        version, locale, ...ref(file),
        stableDuringContextRead: hash(fs.readFileSync(file)) === hash(bytes),
        matchesExistingCandidateFreeze: version === 'corrected-current'
          ? existingFreeze.candidates.find(item => item.locale === locale && item.kind === 'lesson').current.sha256 === hash(bytes)
          : null,
      }
      bindings.push(binding)
      textSets.push({
        version, locale, template: binding, title: doc.title,
        prose: doc.prose.map(block => ({
          kind: block.kind, id: block.id, label: block.label,
          text: block.text, source_refs: block.source_refs,
        })),
        figureDefinition: doc.figures,
      })
      if (version !== 'corrected-current') continue
      const root = path.join(out, 'context-inputs', locale)
      const lessonDir = path.join(root, '10p/editions/modern-us-neutral/lessons', lessonId)
      fs.mkdirSync(lessonDir, { recursive: true })
      write(path.relative(out, path.join(lessonDir, 'lesson.json')), {
        title: doc.title, prose: doc.prose,
      })
      write(path.relative(out, path.join(lessonDir, 'exercises.json')), { exercises: [] })
      const figureDir = path.join(root, '10p/figures')
      fs.mkdirSync(figureDir, { recursive: true })
      const link = path.join(figureDir, 'fig-227.png')
      if (!fs.existsSync(link)) fs.symlinkSync(path.join(repo, source), link)
      command(`native-context-${locale}`, python, [
        path.join(skill, 'scripts/build_context.py'),
        '--book', '10p', '--edition', 'modern-us-neutral',
        '--figure', 'fig-227', '--root', root,
        '--output', path.join(out, `context.${locale}.native.json`),
      ])
    }
  }
  const refsForGraph = new Set(['p0265#4', 'p0265#5', 'p0265#7', 'p0265#8', 'p0266#7'])
  const definitionChecks = ['zh', 'en'].map(locale => {
    const first = textSets.find(item => item.locale === locale && item.version === 'author-FIRST')
    const current = textSets.find(item => item.locale === locale && item.version === 'corrected-current')
    const defining = item => item.prose.filter(block =>
      block.source_refs.some(reference => refsForGraph.has(reference)))
    assert.deepEqual(current.figureDefinition, first.figureDefinition)
    assert.deepEqual(defining(current), defining(first), 'numerical errata must not change graph definition')
    return {
      locale, figureEntryUnchanged: true, graphDefiningProseUnchanged: true,
      definingSourceRefs: [...refsForGraph],
      definingProseSha256: hash(JSON.stringify(defining(current))),
    }
  })
  const stableAtBuild = bindings.filter(item => item.version === 'corrected-current')
    .every(item => item.stableDuringContextRead && item.matchesExistingCandidateFreeze)
  const payload = {
    schema: 'stemrobin/fig227-author-context@1',
    ticket: 'STEMROBIN-181', batch: 'D037', lesson: lessonId,
    builtAt: new Date().toISOString(),
    sourceImage: ref(path.join(repo, source)),
    inventoryFreeze: ref(path.join(out, 'source.inventory.json')),
    nativeContextMethod: 'Existing build_context.py on scope-local minimal lesson inputs and read-only symlink to canonical PNG. No promoted edition exists for this unfinished card.',
    currentCandidateFreeze: ref(freezePath),
    correctedCurrentStableBeforeContextBuild: stableAtBuild,
    firstAlsoBound: true,
    firstBindingReason: 'Retain original FIRST provenance in addition to corrected-current, even though both corrected templates already match their freeze.',
    templates: bindings, textSets, definitionChecks,
    canonicalErrata: ref(path.join(repo,
      '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1211-source266-errata/modern-errata-records.json')),
    numericalErrataAffectFigureDefinition: false,
    sourceFacts: inventory.pixelFacts,
    clarityAdditions: inventory.clarityAdditionsDistinctFromSource,
    regularization: inventory.modernRegularization,
  }
  write('context.json', payload)
  write('inventory-freeze.json', {
    schema: 'stemrobin/fig227-pre-drawing-freeze@1',
    frozenAt: new Date().toISOString(),
    source: payload.sourceImage,
    inventory: payload.inventoryFreeze,
    context: ref(path.join(out, 'context.json')),
    specExistsAtFreeze: fs.existsSync(path.join(out, 'fig-227.spec.json')),
    svgExistsAtFreeze: fs.existsSync(path.join(out, 'fig-227.svg')),
    imagesLoaded: 1,
    independentReview: 'not performed or authorized',
  })
  console.log(JSON.stringify({ status: 'context-frozen', stableAtBuild, bindings }, null, 2))
}

function spec() {
  const frozen = read(path.join(out, 'inventory-freeze.json'))
  assert.equal(frozen.specExistsAtFreeze, false)
  assert.equal(frozen.svgExistsAtFreeze, false)
  assert.equal(ref(path.join(out, 'source.inventory.json')).sha256, frozen.inventory.sha256)
  const ctx = read(path.join(out, 'context.json'))
  const inventory = read(path.join(out, 'source.inventory.json'))
  const objects = []
  const assertions = []
  const segment = (id, start, end, stroke = 'ink', width = 2) => {
    objects.push({ id, type: 'segment', from: at(...start), to: at(...end), stroke, strokeWidth: width, dash: 0 })
  }
  const text = (id, value, x, y, fontSize = 26, position = 'CENTER', color = 'ink') => {
    objects.push({
      id, type: 'text', text: value, at: at(x, y),
      fontSize, fontWeight: 400, labelColor: color,
      labelPlacement: { position, gap: 10 },
    })
  }
  for (const [id, start, end] of [
    ['src-227-m-axis', [132, 589], [132, 85]],
    ['src-227-v-axis', [98, 570], [755, 570]],
  ]) {
    objects.push({ id, type: 'arrow', from: at(...start), to: at(...end), stroke: 'ink', strokeWidth: 3, dash: 0 })
    assertions.push({
      id: `${id}-connects`, type: 'connects', arrow: id,
      from: at(...start), to: at(...end),
    })
  }
  assertions.push(
    { id: 'src-227-axes-perpendicular', type: 'perpendicular',
      a: at(132, 570), b: at(132, 85), c: at(132, 570), d: at(755, 570) },
    { id: 'src-227-axis-arrow-count', type: 'objectCount', objectType: 'arrow', count: 2 },
  )
  text('src-227-m-label', 'm', 104, 86, 28)
  text('src-227-v-label', 'v', 752, 606, 28)
  text('src-227-origin-label', 'O', 112, 606, 26)
  for (let index = 1; index <= 8; index += 1) {
    const y = frame.y0 - frame.massUnit * index
    segment(`src-227-m-tick-${index}`, [119, y], [132, y])
    text(`src-227-m-value-${index}`, `${index === 1 ? '' : index}m\u2080`, 111, y, 26, 'W')
    assertions.push({
      id: `src-227-m-ordinate-${index}`, type: 'displacement',
      from: at(132, frame.y0), to: at(132, y), dx: 0, dy: frame.massUnit * index,
    })
  }
  for (let index = 1; index <= 9; index += 1) {
    const x = frame.x0 + frame.speedUnit * index / 10
    const halfHeight = index === 5 ? 9 : 6
    segment(`src-227-v-tick-${index}`, [x, 570 - halfHeight], [x, 570 + halfHeight])
    assertions.push({
      id: `src-227-v-abscissa-${index}`, type: 'displacement',
      from: at(132, 570), to: at(x, 570), dx: frame.speedUnit * index / 10, dy: 0,
    })
  }
  text('src-227-half-c-label', '0.5c', 391, 606, 26)
  text('src-227-c-label', 'c', 650, 606, 28)
  segment('src-227-c-limit', [650, 570], [650, 124.8], 'muted', 1.5)
  assertions.push(
    { id: 'src-227-c-abscissa', type: 'displacement',
      from: at(132, 570), to: at(650, 570), dx: 518, dy: 0 },
    { id: 'src-227-limit-parallel-m-axis', type: 'parallel',
      a: at(650, 570), b: at(650, 124.8), c: at(132, 570), d: at(132, 85) },
    { id: 'src-227-limit-at-c', type: 'displacement',
      from: at(650, 570), to: at(650, 124.8), dx: 0, dy: 445.2 },
    { id: 'src-227-curve-count', type: 'objectCount', objectType: 'svgPath', count: 1 },
    { id: 'src-227-curve-start-ordinate', type: 'displacement',
      from: at(132, 570), to: at(132, 517), dx: 0, dy: 53 },
  )
  // Equal beta steps resolve the gentle start; equal gamma steps resolve the steep end.
  const betaValues = new Set()
  for (let index = 0; index <= 950; index += 1) betaValues.add(index / 1000)
  for (let index = 320; index <= 840; index += 1) {
    const gamma = index / 100
    betaValues.add(Math.sqrt(1 - 1 / gamma ** 2))
  }
  const betaEnd = Math.sqrt(1 - 1 / frame.cutoff ** 2)
  betaValues.add(betaEnd)
  const samples = [...betaValues].filter(beta => beta <= betaEnd).sort((a, b) => a - b)
    .map(beta => {
      const gamma = 1 / Math.sqrt(1 - beta ** 2)
      return { beta, gamma, screen: graph(beta, gamma) }
    })
  objects.push({
    id: 'src-227-mass-curve', type: 'svgPath',
    d: samples.map((sample, index) =>
      `${index ? 'L' : 'M'} ${sample.screen[0].toFixed(8)} ${sample.screen[1].toFixed(8)}`
    ).join(' '),
    stroke: 'accent', strokeWidth: 3.5, dash: 0,
  })
  text('add-227-relativistic-mass-title', 'Relativistic mass m', 400, 36, 28)
  text('add-227-rest-mass-note', 'm\u2080: invariant rest mass', 400, 648, 24, 'CENTER', 'muted')
  text('add-227-domain-note', '0 \u2264 v < c; c is a limit, not a curve point', 400, 685, 22, 'CENTER', 'muted')
  const payload = {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-227', mode: 'deterministic',
    description: 'Historical relativistic mass m versus speed v in one inertial frame, not increasing invariant rest mass m_0. Preserve the original scale and solid curve; analytic regularization follows equation (8.9).',
    source: {
      image: { path: source, sha256: inventory.sourceImage.sha256 },
      inventory: inventory.inventory,
      authoritativeText: ctx.textSets.filter(item => item.version === 'corrected-current')
        .flatMap(item => item.prose.filter(block => block.text.trim()).map(block => ({
          lesson: lessonId, text: block.text,
        }))),
    },
    canvas: { width: 800, height: 720, boundingBox: [0, 720, 800, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects, assertions, layout: { minLabelGap: 4 },
  }
  write('fig-227.spec.json', payload)
  write('curve-construction.json', {
    schema: 'stemrobin/fig227-analytic-construction@1',
    spec: ref(path.join(out, 'fig-227.spec.json')), frame,
    method: 'Sample authoritative equation (8.9); piecewise-linear screen path has no labels, ticks or point markers.',
    samples: samples.length, betaEnd, upperCutoffIsUnlabeledDrawingTruncation: true,
    toleranceScreenPx: 1e-7,
    sourceInventoryFreeze: frozen.inventory,
    customChecksRequired: 'check stage parses the actual FigureSpec path, independently checks its inverse relation and tick endpoints. Native schema has no function-curve assertion type.',
  })
  console.log(JSON.stringify({ status: 'FIRST-spec-authored', spec: ref(path.join(out, 'fig-227.spec.json')) }))
}

function check() {
  const file = path.join(out, 'fig-227.spec.json')
  const spec = read(file)
  const byId = new Map(spec.objects.map(item => [item.id, item]))
  assert.equal(hash(JSON.stringify(spec.source.inventory)),
    hash(JSON.stringify(read(path.join(out, 'source.inventory.json')).inventory)))
  const curve = byId.get('src-227-mass-curve')
  assert.equal(curve.dash, 0)
  assert.equal(byId.get('src-227-c-limit').dash, 0)
  assert.equal(spec.objects.filter(item => item.type === 'svgPath').length, 1)
  assert.ok(/^M [0-9.]+ [0-9.]+(?: L [0-9.]+ [0-9.]+)+$/.test(curve.d))
  const vertices = curve.d.match(/[ML] [0-9.]+ [0-9.]+/g).map(token => {
    const [, x, y] = token.split(' ')
    return [Number(x), Number(y)]
  })
  let maxInverseError = 0
  let maxEquationError = 0
  let maxSagittaPx = 0
  for (let index = 0; index < vertices.length; index += 1) {
    const [x, y] = vertices[index]
    const beta = (x - frame.x0) / frame.speedUnit
    const gamma = (frame.y0 - y) / frame.massUnit
    assert.ok(beta >= 0 && beta < 1, 'no data at or beyond c')
    assert.ok(gamma >= 1 && gamma <= 8.40000001)
    assert.ok(x >= 0 && x <= 800 && y >= 0 && y <= 720)
    const inverse = Math.sqrt(Math.max(0, (gamma - 1) * (gamma + 1))) / gamma
    maxInverseError = Math.max(maxInverseError, Math.abs(beta - inverse))
    maxEquationError = Math.max(maxEquationError, Math.abs(gamma - 1 / Math.sqrt((1 - beta) * (1 + beta))))
    if (!index) continue
    const previous = vertices[index - 1]
    assert.ok(x > previous[0] && y < previous[1], 'strictly rising mass versus speed')
    const middleBeta = ((x + previous[0]) / 2 - frame.x0) / frame.speedUnit
    const analyticY = frame.y0 - frame.massUnit / Math.sqrt((1 - middleBeta) * (1 + middleBeta))
    maxSagittaPx = Math.max(maxSagittaPx, Math.abs(analyticY - (y + previous[1]) / 2))
  }
  assert.ok(maxInverseError < 1e-7)
  assert.ok(maxEquationError < 1e-7)
  assert.ok(maxSagittaPx < 0.01, 'subpixel curve interpolation')
  assert.deepEqual(vertices[0], [132, 517])
  for (let index = 1; index <= 8; index += 1) {
    const tick = byId.get(`src-227-m-tick-${index}`)
    assert.deepEqual(tick.from, at(119, 570 - 53 * index))
    assert.deepEqual(tick.to, at(132, 570 - 53 * index))
    assert.equal(byId.get(`src-227-m-value-${index}`).text, `${index === 1 ? '' : index}m\u2080`)
  }
  for (let index = 1; index <= 9; index += 1) {
    const tick = byId.get(`src-227-v-tick-${index}`)
    assert.ok(Math.abs((tick.from[0] - frame.x0) / frame.speedUnit - index / 10) < 1e-12)
    assert.equal(tick.from[0], tick.to[0])
    assert.equal((tick.from[1] + tick.to[1]) / 2, at(0, 570)[1])
  }
  assert.equal(byId.get('src-227-half-c-label').text, '0.5c')
  assert.equal(byId.get('src-227-c-label').text, 'c')
  assert.deepEqual(byId.get('src-227-half-c-label').at, at(391, 606))
  assert.deepEqual(byId.get('src-227-c-label').at, at(650, 606))
  assert.equal(spec.objects.filter(item => item.type === 'point').length, 0)
  const sourceMapped = new Set(spec.source.inventory.flatMap(group => group.objects))
  const additions = spec.objects.filter(item => !sourceMapped.has(item.id)).map(item => item.id)
  assert.deepEqual(additions, [
    'add-227-relativistic-mass-title', 'add-227-rest-mass-note', 'add-227-domain-note',
  ])
  write('geometry-check.json', {
    schema: 'stemrobin/fig227-author-geometry-check@1', status: 'pass',
    spec: ref(file), source: ref(path.join(repo, source)),
    sourceInventory: ref(path.join(out, 'source.inventory.json')),
    vertexCount: vertices.length, maxInverseError, maxEquationError, maxSagittaPx,
    exactLeftEndpoint: vertices[0], unlabeledUpperTruncation: vertices.at(-1),
    massTickCount: 8, interiorSpeedTickCount: 9, curveCount: 1,
    sourceSolidCurveAndSolidBoundaryPreserved: true,
    domain: '0 <= v/c < 1; no curve point or finite mass at c',
    additionsDistinctFromSource: additions,
    independentReview: false,
  })
  console.log(JSON.stringify(read(path.join(out, 'geometry-check.json')), null, 2))
}

function render() {
  const specFile = path.join(out, 'fig-227.spec.json')
  const validator = path.join(skill, 'scripts/validate_spec.py')
  command('validate-draft', python, [validator, specFile, '--stage', 'draft', '--json'])
  command('render-FIRST', process.execPath, [
    path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile,
    '--svg', path.join(out, 'fig-227.svg'),
    '--png', path.join(out, 'fig-227.full.png'),
    '--report', path.join(out, 'fig-227.render.json'),
  ])
  assert.equal(read(path.join(out, 'fig-227.render.json')).status, 'pass')
  command('validate-rendered', python, [validator, specFile, '--stage', 'rendered', '--json'])
  command('render-determinism-only', process.execPath, [
    path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile,
    '--svg', path.join(out, 'fig-227.repeat.svg'),
    '--report', path.join(out, 'fig-227.repeat.render.json'),
  ])
  assert.equal(read(path.join(out, 'fig-227.repeat.render.json')).status, 'pass')
  const first = ref(path.join(out, 'fig-227.svg'))
  const repeat = ref(path.join(out, 'fig-227.repeat.svg'))
  assert.equal(first.sha256, repeat.sha256)
  write('determinism.json', {
    status: 'pass', first, repeat, byteIdentical: true,
    scope: 'Renderer determinism only; not source fidelity or independent review.',
  })
  console.log(JSON.stringify({ status: 'render-pass', first, repeat }, null, 2))
}

const action = process.argv[2]
assert.ok(['context', 'spec', 'check', 'render'].includes(action))
;({ context, spec, check, render })[action]()
