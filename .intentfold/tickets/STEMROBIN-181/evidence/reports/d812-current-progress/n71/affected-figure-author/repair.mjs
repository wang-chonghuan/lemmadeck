import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const W = path.dirname(fileURLToPath(import.meta.url))
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const previous = path.join(T, 'evidence/reports/d470-bounded-progress/d441-n71-fig147148-first-author')
const textRoot = path.join(T, 'evidence/reports/d430-source186187-and-n71/d432-n71-first-bilingual-text-author')
const contextRoot = path.join(T, 'evidence/reports/d442-source189-n71-progress/d436-n71-first-figure-contexts')
const textReview = path.join(T, 'evidence/reports/d442-source189-n71-progress/d433-n71-first-independent-text-review/report.json')
const glyphReview = path.join(T, 'evidence/reports/d423-first-review-progress/d410-source186-detail-affected-review/report.json')
const validator = path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const ids = ['fig-147', 'fig-148']
const [mode, figure, round = '2'] = process.argv.slice(2)
assert(['2', '3'].includes(round))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size })
const write = (file, value) => {
  assert(file.startsWith(`${W}/`), 'Write escaped authorized directory')
  assert(!fs.existsSync(file), `Refusing overwrite: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const candidateDir = path.join(W, `round-${round}`)
const preservedFiles = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? preservedFiles(path.join(directory, entry.name))
    : [binding(path.join(directory, entry.name))])

function reconstructMirror(spec) {
  const objects = new Map(spec.objects.map(object => [object.id, object]))
  const point = id => objects.get(id).at
  const [ox] = point('O')
  const circleX = y => ox + Math.sqrt(16 - y * y)
  const slope = y => -y / Math.sqrt(16 - y * y)
  const contacts = spec.id === 'fig-147'
    ? [point('P'), point('C')]
    : [point('C'), point('K'), point('P'), point('E')]
  const lower = spec.id === 'fig-147' ? [5.4, -0.625] : [8.3, -1.17]
  const upper = spec.id === 'fig-147' ? [5.4, 0.625] : [8.35, 0.9]
  const first = contacts[0]
  const last = contacts.at(-1)
  const segments = []
  const deltaLower = (first[1] - lower[1]) / 3
  segments.push([
    lower,
    [lower[0] + (first[0] - lower[0]) * 0.7, lower[1] + deltaLower],
    [first[0] - slope(first[1]) * deltaLower, first[1] - deltaLower],
    first,
  ])
  for (let i = 1; i < contacts.length; i++) {
    const a = contacts[i - 1]
    const b = contacts[i]
    const dy = (b[1] - a[1]) / 3
    segments.push([
      a, [a[0] + slope(a[1]) * dy, a[1] + dy],
      [b[0] - slope(b[1]) * dy, b[1] - dy], b,
    ])
  }
  const deltaUpper = (upper[1] - last[1]) / 3
  segments.push([
    last, [last[0] + slope(last[1]) * deltaUpper, last[1] + deltaUpper],
    [upper[0] + (last[0] - upper[0]) * 0.7, upper[1] - deltaUpper], upper,
  ])
  const [xmin, ymax] = spec.canvas.boundingBox
  const screen = ([x, y]) => [x - xmin, ymax - y].map(value => Number(value.toFixed(12)))
  const pair = p => screen(p).join(' ')
  const d = `M ${pair(lower)} ${segments.map(s =>
    `C ${pair(s[1])} ${pair(s[2])} ${pair(s[3])}`).join(' ')}`
  const oldMirror = objects.get('mirror')
  Object.keys(oldMirror).forEach(key => delete oldMirror[key])
  Object.assign(oldMirror, { id: 'mirror', type: 'svgPath', d, stroke: 'ink', strokeWidth: 5 })
  const xAtY = y => {
    const segment = segments.find(s => y >= s[0][1] && y <= s[3][1])
    assert(segment, 'Hatch outside reconstructed mirror')
    const t = (y - segment[0][1]) / (segment[3][1] - segment[0][1])
    const u = 1 - t
    return u ** 3 * segment[0][0] + 3 * u ** 2 * t * segment[1][0]
      + 3 * u * t ** 2 * segment[2][0] + t ** 3 * segment[3][0]
  }
  const hatchYs = spec.id === 'fig-147'
    ? [-0.55, -0.4, -0.24, -0.08, 0.08, 0.32, 0.54]
    : [-1.1, -0.8, -0.5, -0.18, 0.08, 0.4, 0.7, 0.84]
  hatchYs.forEach((y, i) => {
    const hatch = objects.get(`hatch-${i + 1}`)
    hatch.from = [xAtY(y), y]
    hatch.to = [xAtY(y) + 0.2, y + 0.06]
  })
  for (const contact of contacts) {
    assert(Math.abs(circleX(contact[1]) - contact[0]) < 1e-12)
    assert(segments.some(s => s[0] === contact || s[3] === contact))
  }
  return {
    method: 'Deterministic cubic outline interpolating unchanged circular-model contact anchors, with source-style bowed peripheral silhouette and back-side hatching.',
    physicalContactAnchors: contacts,
    segments,
    actualCircleAssertionsUnchanged: true,
    peripheralEndpointsAreSourceStyleLayoutNotPhysicalData: true,
    exactSphericalProfileOrMeasuredApertureClaimed: false,
    sourceFrameVerdict: 'HOLD_PENDING_PARENT_INDEPENDENT_REVIEW',
  }
}

if (mode === 'author3') {
  assert.equal(round, '3')
  assert.equal(figure, 'fig-148')
  const previousSpecFile = path.join(W, 'round-2/fig-148.spec.json')
  const priorRenderFile = path.join(W, 'round-2/fig-148.render.json')
  const previousSpec = read(previousSpecFile)
  const priorRender = read(priorRenderFile)
  assert.equal(priorRender.status, 'fail')
  assert.equal(priorRender.collisions.length, 1)
  assert.equal(priorRender.collisions[0].id, 'F-label')
  const spec = structuredClone(previousSpec)
  spec.objects.find(object => object.id === 'F').labelPlacement.offset = [-14, 0]
  const unchanged = structuredClone(spec)
  unchanged.objects.find(object => object.id === 'F').labelPlacement.offset = [-18, 0]
  assert.deepEqual(unchanged, previousSpec)
  const file = path.join(candidateDir, 'fig-148.spec.json')
  write(file, spec)
  write(path.join(W, 'repair-round-3.json'), {
    previousSpec: binding(previousSpecFile), previousNativeFAIL: binding(priorRenderFile),
    defect: priorRender.collisions[0],
    correction: 'Move only the F-label four output pixels right, clearing B1 marker padding. No point or ray moves.',
    newSpec: binding(file),
    previousRepairs: 1, newRepairs: 2, cumulativeRepairs: 3,
    successfulFig147Round2UnchangedAndNotRerun: true,
    physicalDataAssertionsTolerancesSourceAndTextUnchanged: true,
    previousRound2FailurePreserved: true,
    humanAllowsOrdinaryReversibleRepairWithoutExtraCountApproval: true,
  })
  console.log(JSON.stringify(binding(file), null, 2))
} else if (mode === 'author') {
  assert.equal(round, '2')
  const inventory = read(path.join(W, 'source-inventory.json'))
  assert(inventory.recordedBeforeDraftInspection && inventory.imagesOpened === 2)
  const review = read(textReview)
  assert.equal(review.SCI, 'PASS')
  assert.equal(review.ZHEN, 'PASS')
  const sourceGlyph = read(glyphReview)
  assert.equal(sourceGlyph.lowerMirrorGlyphAffectedReview.sourceGlyphLiteral, 'C')
  assert.equal(sourceGlyph.lowerMirrorGlyphAffectedReview.isCPrime, false)
  const textFiles = {
    ZHlesson: path.join(textRoot, 'candidate/lesson.template.json'),
    ENlesson: path.join(textRoot, 'candidate/english.lesson.template.json'),
    ZHexercises: path.join(textRoot, 'candidate/exercises.template.json'),
    ENexercises: path.join(textRoot, 'candidate/english.exercises.template.json'),
  }
  const textBindings = {}
  for (const [key, file] of Object.entries(textFiles)) {
    assert.equal(sha(file), review.boundInputs[key].sha256)
    textBindings[key] = binding(file)
  }
  const en = read(textFiles.ENlesson)
  const zh = read(textFiles.ZHlesson)
  const frozenInputs = preservedFiles(previous)
  const outcomes = []
  for (const id of ids) {
    const oldFile = path.join(previous, 'sole-repair', `${id}.spec.json`)
    const oldSpec = read(oldFile)
    const spec = structuredClone(oldSpec)
    const sourceFile = inventory.figures[id].path
    assert.equal(sha(sourceFile), inventory.figures[id].sha256)
    spec.source.image.path = sourceFile
    // Consume both already-approved editions literally; no prose authoring occurs.
    spec.source.authoritativeText = [en, zh].flatMap(lesson => lesson.prose
      .filter(block => block.kind === 'p' && block.text)
      .map(block => ({ lesson: lesson.card_id, text: block.text })))
    const oldContextFile = path.join(contextRoot, `${id}.context.json`)
    const context = read(oldContextFile)
    assert.equal(context.sourceImage.sha256, sha(sourceFile))
    context.sourceImage.path = sourceFile
    context.durablePriorContext = binding(oldContextFile)
    context.currentAuthoritativeBilingualText = {
      review: binding(textReview),
      SCI: 'INHERITED_PASS_UNCHANGED',
      ZHEN: 'INHERITED_PASS_UNCHANGED',
      files: textBindings,
      ENprose: en.prose,
      ZHprose: zh.prose,
      noNewSemanticText: true,
    }
    context.originalPixels = binding(sourceFile)
    context.pixelInventory = binding(path.join(W, 'source-inventory.json'))
    if (id === 'fig-148') context.lowerGlyphSourceObservation = binding(glyphReview)
    write(path.join(W, 'contexts', `${id}.context.json`), context)
    const objects = new Map(spec.objects.map(object => [object.id, object]))
    if (id === 'fig-147') {
      objects.get('S1').labelPlacement = { position: 'S', gap: 44 }
      objects.get('scale-note').at = [4.4, -0.745]
    } else {
      objects.get('B').labelPlacement = { position: 'S', gap: 40 }
      objects.get('F').labelPlacement = { position: 'SW', gap: 20, offset: [-18, 0] }
      objects.get('scale-note').at = [6, -1.325]
      spec.description = 'One combined diagram of four convenient rays from A to a concave spherical mirror and the downward image A_1B_1. O means curvature center. First-order paraxial convergence, not exact spherical focusing. Vertical scale is explicitly enlarged. The lower contact C is resolved by the retained independent SOURCE186 detail observation; historical author uncertainty is preserved separately.'
      const rayGroup = spec.source.inventory.find(group => group.id === 'ray-AOCprime')
      rayGroup.id = 'ray-AOC'
      rayGroup.description = 'Source A, O, A_1 and lower mirror contact C on one straight track, with opposing incident/return arrows. The retained independent d410 detail observation resolves C, with no separate prime. The old discarded C-prime hypothesis and historical HOLD remain immutable prior evidence, not a current global block.'
      spec.source.inventory.find(group => group.id === 'mirror-order').description =
        'Source mirror contacts top-to-bottom E, P, K, C; same contact order retained. Lower C is resolved by the actual positive independent d410 source detail observation, not inferred from prose or the old author hypothesis.'
      spec.source.inventory.find(group => group.id === 'label-list').description =
        'Source A, B, O, B_1, A_1, F, E, P, K and C mapped to instructional math labels. C identity consumes the retained independent d410 source observation. Small modern point dots and vertical enlargement are not source measures.'
    }
    const silhouette = reconstructMirror(spec)
    spec.source.inventory[0].description =
      'One source left-facing concave mirror, visibly bowed right at its middle, with back/right hatching. Modern source-style cubic silhouette passes the unchanged paraxial circular-model contact points. Peripheral curvature and aperture are schematic layout, not measured source values or a new exact spherical profile. All physical radius/point assertions and tolerances remain unchanged.'
    assert.deepEqual(spec.assertions, oldSpec.assertions)
    assert.deepEqual(spec.canvas, oldSpec.canvas)
    assert.deepEqual(spec.display, oldSpec.display)
    const permitted = new Set(['mirror', 'scale-note', ...spec.objects.filter(o => o.id.startsWith('hatch-')).map(o => o.id)])
    for (const oldObject of oldSpec.objects) {
      const current = objects.get(oldObject.id)
      if (oldObject.type === 'point') assert.deepEqual(current.at, oldObject.at)
      if (!permitted.has(oldObject.id)) {
        const old = structuredClone(oldObject)
        const now = structuredClone(current)
        if ((id === 'fig-147' && oldObject.id === 'S1') ||
            (id === 'fig-148' && ['B', 'F'].includes(oldObject.id))) {
          delete old.labelPlacement
          delete now.labelPlacement
        }
        assert.deepEqual(now, old)
      }
    }
    write(path.join(candidateDir, `${id}.spec.json`), spec)
    outcomes.push({
      figure: id, previousSpec: binding(oldFile),
      previousRender: binding(path.join(previous, 'sole-repair', `${id}.render.json`)),
      context: binding(path.join(W, 'contexts', `${id}.context.json`)),
      spec: binding(path.join(candidateDir, `${id}.spec.json`)),
      silhouette,
      physicalPointsRaysCanvasAndAssertionsUnchanged: true,
      toleranceChanges: [],
    })
  }
  write(path.join(W, 'input-bindings.json'), {
    schema: 'd803-repair-input-bindings@1',
    originals: ids.map(id => binding(inventory.figures[id].path)),
    inventory: binding(path.join(W, 'source-inventory.json')),
    previousEntireAuthorBundle: frozenInputs,
    sourceGlyphReview: binding(glyphReview),
    textReview: binding(textReview),
    textBindings,
    contextManifest: binding(path.join(contextRoot, 'manifest.json')),
    validator: binding(validator), renderer: binding(renderer),
  })
  write(path.join(W, 'repair-plan.json'), {
    schema: 'd803-affected-figure-repair@1',
    previousRepairs: 1, newRepairs: 1, cumulativeRepairs: 2,
    humanAllowsOrdinaryReversibleRepairWithoutExtraCountApproval: true,
    oldCountLimitNotTreatedAsPermanentContentProhibition: true,
    preservedFIRSTAndAllPriorRepairsByReference: true,
    candidateSemanticTextChanges: 0,
    independentFIG: 'HOLD_PENDING_PARENT_REVIEW',
    independentDISPLAY: 'HOLD_PENDING_PARENT_REVIEW',
    lowerGlyphC: 'RETAINED_D410_SOURCE_OBSERVATION_PASS',
    outcomes,
  })
  console.log(JSON.stringify({ mode, specs: outcomes.map(o => o.spec), cumulativeRepairs: 2 }, null, 2))
} else if (mode === 'native') {
  assert(ids.includes(figure))
  const file = path.join(candidateDir, `${figure}.spec.json`)
  const receiptFile = path.join(candidateDir, `${figure}.native-execution.json`)
  assert(!fs.existsSync(receiptFile))
  const commands = []
  const run = (executable, args, name) => {
    const result = spawnSync(executable, args, {
      cwd: R, encoding: 'utf8',
      env: { ...process.env, PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never' },
    })
    const stdout = path.join(candidateDir, `${figure}.${name}.stdout.txt`)
    const stderr = path.join(candidateDir, `${figure}.${name}.stderr.txt`)
    fs.writeFileSync(stdout, result.stdout || '')
    fs.writeFileSync(stderr, result.stderr || '')
    commands.push({
      executable, args, workdir: R, exitCode: result.status,
      error: result.error?.message || null,
      stdout: binding(stdout), stderr: binding(stderr),
    })
    return result.status
  }
  const draftExit = run('python3', [validator, file, '--stage', 'draft', '--json'], 'draft')
  const renderExit = draftExit === 0 ? run(process.execPath, [
    renderer, '--spec', file,
    '--svg', path.join(candidateDir, `${figure}.svg`),
    '--png', path.join(candidateDir, `${figure}.640.png`),
    '--report', path.join(candidateDir, `${figure}.render.json`),
  ], 'render') : null
  const result = {
    schema: 'd803-native-actual-execution@1',
    figure, cumulativeRepairRound: Number(round),
    spec: binding(file), validator: binding(validator), renderer: binding(renderer),
    draftExit, renderExit, commands,
    status: draftExit === 0 && renderExit === 0 ? 'PASS' : 'FAIL',
    newImageOpens: 0,
    recordReview: false, independentReview: false, fullCardApproval: false,
  }
  write(receiptFile, result)
  console.log(JSON.stringify(result, null, 2))
  process.exitCode = result.status === 'PASS' ? 0 : 2
} else {
  throw new Error(`Unknown mode: ${mode}`)
}
