import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const relative = file => path.relative(repo, file)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: relative(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`), 'writes must stay inside author workspace')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const lessonPath = path.join(repo, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n76/lesson.template.json')
const exercisesPath = path.join(path.dirname(lessonPath), 'exercises.template.json')
const sciencePath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n76-science-review.json')
const sourceDir = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures')
const inventoryPath = path.join(own, 'source-inventory.json')
const nativeBuilder = path.join(repo, '.agents/skills/ld-s10y-image/scripts/build_context.py')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const figures = ['fig-140', 'fig-141']
const inventory = read(inventoryPath)
assert.equal(hash(lessonPath), 'a621f639447d39904246920d6345eaece2d3d4a5d1afae66dba0166eb612427e')
assert.equal(hash(sciencePath), '7ad603d2d5ec837bb59607f923c1b88222a29c8a0a6115801861c8937bf5d9bc')
assert.equal(read(sciencePath).status, 'pass')
const lesson = read(lessonPath)
const authoritativeText = lesson.prose.filter(block => block.text?.trim()).map(block => ({
  lesson: lesson.id, text: block.text,
}))

function native(command, args, evidence) {
  const result = spawnSync(command, args, {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never' },
  })
  write(evidence, {
    command, args, cwd: repo,
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  })
  return result.status === 0
}

function group(id, description, objects, assertions, requires) {
  return { id, description, objects, assertions, ...(requires ? { requires } : {}) }
}

function base(id, height) {
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: id === 'fig-140'
      ? 'Points 1 and 2 on one of four uniform-field lines; displacement from 1 to 2 has the same direction as the electric field. All spacings are schematic; no answer annotation.'
      : 'Five parallel equipotential-plane traces crossing five rightward uniform-field lines in a slightly oblique projection. The lesson states physical field normality; projected screen angles and gaps are not measurements.',
    source: {
      image: binding(path.join(sourceDir, `${id}.png`)),
      authoritativeText,
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, widths: [640, 331, 342], maxWidthPx: 640 },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 },
  }
}

function addFields(spec, ys, slope) {
  for (const [index, y] of ys.entries()) {
    const id = `field-${index + 1}`
    const from = [24, y]
    const to = [608, y + slope]
    spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.5 })
    spec.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
    if (index) spec.assertions.push({
      id: `${id}-parallel`, type: 'parallel',
      a: spec.objects.find(object => object.id === 'field-1').from,
      b: spec.objects.find(object => object.id === 'field-1').to,
      c: from, d: to,
    })
  }
  spec.source.inventory.push(group('source-field-lines',
    `${ys.length} source field lines, all with rightward arrowheads in the same shared frame. Coordinates and regularized row gaps are uncalibrated layout, not values or units.`,
    ys.map((_, index) => `field-${index + 1}`),
    spec.assertions.map(item => item.id),
  ))
}

function text(id, at, value) {
  return {
    id, type: 'text', at, text: value, fontSize: 36, fontWeight: 600,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  }
}

function figure140() {
  const spec = base('fig-140', 520)
  addFields(spec, [400, 290, 180, 70], 0)
  spec.objects.push(
    { id: 'displacement', type: 'arrow', from: 'point-1', to: 'point-2', stroke: 'accent', strokeWidth: 6 },
  )
  // JSXGraph needs the named endpoint points constructed before the arrow.
  spec.objects.splice(4, 0,
    { id: 'point-1', type: 'point', at: [170, 290], label: '1', size: 6, stroke: 'ink', fill: 'ink', fontSize: 36, labelPlacement: { position: 'S', gap: 42 } },
    { id: 'point-2', type: 'point', at: [435, 290], label: '2', size: 6, stroke: 'ink', fill: 'ink', fontSize: 36, labelPlacement: { position: 'S', gap: 42 } },
  )
  spec.objects.push(
    text('displacement-vector-label', [318, 346], '\u0394d\u20d7'),
    text('field-vector-label', [580, 464], 'E\u20d7'),
  )
  spec.assertions.push(
    { id: 'displacement-connects', type: 'connects', arrow: 'displacement', from: 'point-1', to: 'point-2' },
    { id: 'point-1-on-field-2', type: 'pointOnLine', point: 'point-1', a: [24, 290], b: [608, 290] },
    { id: 'point-2-on-field-2', type: 'pointOnLine', point: 'point-2', a: [24, 290], b: [608, 290] },
    { id: 'displacement-layout', type: 'displacement', from: 'point-1', to: 'point-2', dx: 265, dy: 0 },
    { id: 'displacement-field-direction', type: 'parallel', a: 'point-1', b: 'point-2', c: [24, 290], d: [608, 290] },
  )
  spec.source.inventory.push(
    group('source-points-and-displacement',
      'Exactly two filled source points 1 and 2 on field line 2, point 1 left of point 2. The heavier displacement arrow connects 1 to 2 rightward; its delta-vector-d label is above the span. The displacement assertion uses drawing coordinates only, not a physical distance.',
      ['point-1', 'point-2', 'displacement', 'displacement-vector-label'],
      ['displacement-connects', 'point-1-on-field-2', 'point-2-on-field-2', 'displacement-layout', 'displacement-field-direction'],
      ['pointRelationships']),
    group('source-field-vector-label', 'Source vector E is above the top-right field arrow; no added potential/work/charge label.',
      ['field-vector-label'], []),
  )
  return spec
}

function figure141() {
  const spec = base('fig-141', 540)
  const planes = [90, 200, 310, 420, 530].map((x, index) => ({
    id: `plane-${index + 1}`, type: 'segment',
    from: [x - 4, 478], to: [x + 4, 30],
    stroke: 'muted', strokeWidth: 3, dash: 2,
  }))
  spec.objects.push(...planes)
  addFields(spec, [430, 340, 250, 160, 70], 5)
  // Restrict field inventory to its own endpoint/parallel assertions.
  const fieldGroup = spec.source.inventory[0]
  fieldGroup.assertions = spec.assertions.filter(item => item.id.startsWith('field-')).map(item => item.id)
  const planeAssertions = []
  for (const [index, plane] of planes.entries()) {
    const connects = { id: `${plane.id}-connects`, type: 'connects', arrow: plane.id, from: plane.from, to: plane.to }
    spec.assertions.push(connects)
    planeAssertions.push(connects.id)
    if (index) {
      const parallel = {
        id: `${plane.id}-parallel`, type: 'parallel',
        a: planes[0].from, b: planes[0].to, c: plane.from, d: plane.to,
      }
      spec.assertions.push(parallel)
      planeAssertions.push(parallel.id)
    }
  }
  const crossingIds = []
  const crossings = []
  for (const plane of planes) {
    const [px, py] = plane.from
    const vx = plane.to[0] - px
    const vy = plane.to[1] - py
    for (const field of spec.objects.filter(object => object.type === 'arrow')) {
      const [fx, fy] = field.from
      const wx = field.to[0] - fx
      const wy = field.to[1] - fy
      const t = ((fx - px) * wy - (fy - py) * wx) / (vx * wy - vy * wx)
      const point = [px + t * vx, py + t * vy]
      const u = (point[0] - fx) / wx
      assert.ok(t > 0 && t < 1 && u > 0 && u < 1, 'crossing must lie inside both finite traces')
      const id = `crossing-${plane.id}-${field.id}`
      for (const [suffix, segment] of [['on-plane', plane], ['on-field', field]]) {
        const assertion = {
          id: `${id}-${suffix}`, type: 'pointOnLine', point,
          a: segment.from, b: segment.to, tolerance: 0.000001,
        }
        spec.assertions.push(assertion)
        crossingIds.push(assertion.id)
      }
      crossings.push({ id, plane: plane.id, field: field.id, at: point, planeParameter: t, fieldParameter: u })
    }
  }
  spec.objects.push(text('field-vector-label', [580, 500], 'E\u20d7'))
  spec.source.inventory.push(
    group('source-projected-plane-traces',
      'Five source broken/interrupted, near-vertical plane traces, in their original left-to-right order and extending above/below the five field lines. Slight slant and dash regularization are noncalibrated modern projection choices. No closed sheet outlines are invented.',
      planes.map(plane => plane.id), planeAssertions),
    group('source-plane-field-crossings',
      'All 25 source plane/field crossings in one frame: each of five projected plane traces intersects each of five directed field lines. Fifty executable incidence assertions bind both segments at every crossing. They check topology in drawing space, not a physical angle, voltage or length.',
      [...planes.map(plane => plane.id), ...[1, 2, 3, 4, 5].map(index => `field-${index}`)], crossingIds),
    group('source-field-vector-label', 'Only source vector E, above the upper right field arrow. No labels/calibration or measured right-angle marker are added.',
      ['field-vector-label'], []),
  )
  write(path.join(own, 'fig-141/projection-bindings.json'), {
    schema: 'ld-s10y-image/author-projection-bindings@1',
    meaning: 'Finite parameters and coordinates refer only to modern projected layout. Physical normality follows the frozen lesson; no projected Euclidean angle claim.',
    crossings,
  })
  return spec
}

const mode = process.argv[2]
if (mode === 'prepare') {
  const nativeRoot = path.join(own, 'native-root')
  const nativeLessons = path.join(nativeRoot, '9p/editions/modern-us-neutral/lessons/phy9-c2-s2-n76')
  fs.mkdirSync(nativeLessons, { recursive: true })
  fs.symlinkSync(lessonPath, path.join(nativeLessons, 'lesson.json'))
  fs.symlinkSync(exercisesPath, path.join(nativeLessons, 'exercises.json'))
  fs.mkdirSync(path.join(nativeRoot, '9p/figures'), { recursive: true })
  for (const id of figures) {
    const source = path.join(sourceDir, `${id}.png`)
    assert.equal(hash(source), inventory.figures[id].source.sha256)
    fs.symlinkSync(source, path.join(nativeRoot, '9p/figures', `${id}.png`))
    const nativeContext = path.join(own, id, 'context.native.json')
    assert.ok(native('python3', [nativeBuilder, '--book', '9p', '--edition', 'modern-us-neutral', '--figure', id, '--root', nativeRoot, '--output', nativeContext],
      path.join(own, id, 'context-command.json')), 'native context build failed')
    const context = read(nativeContext)
    context.sourceImage.path = relative(source)
    context.frozenInputs = { lesson: binding(lessonPath), exercises: binding(exercisesPath), scienceReviewConsumed: binding(sciencePath) }
    context.nativeContext = binding(nativeContext)
    context.completeModernProse = lesson.prose
    context.authoritativeText = authoritativeText
    context.sourceInventory = inventory.figures[id]
    context.contextScope = 'Native figure context plus complete exact frozen modern prose, not a new science review.'
    write(path.join(own, id, 'context.json'), context)
  }
  write(path.join(own, 'input-bindings.json'), {
    lesson: binding(lessonPath), scienceReview: binding(sciencePath), exercises: binding(exercisesPath),
    nativeBuilder: binding(nativeBuilder), validator: binding(validator), renderer: binding(renderer),
    imageSkill: binding(path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md')),
    routing: binding(path.join(repo, '.agents/skills/ld-s10y-image/references/routing.md')),
    figureSpecContract: binding(path.join(repo, '.agents/skills/ld-s10y-image/references/figure-spec.md')),
    qualityGate: binding(path.join(repo, '.agents/skills/ld-s10y-image/references/quality-gate.md')),
    inventory: binding(inventoryPath),
  })
  console.log('Prepared native contexts once per figure; complete modern prose bound.')
} else if (mode === 'specs') {
  for (const spec of [figure140(), figure141()]) {
    assert.deepEqual(read(path.join(own, spec.id, 'context.json')).authoritativeText, spec.source.authoritativeText)
    write(path.join(own, spec.id, 'initial/spec.json'), spec)
  }
  console.log('Authored initial specs from the independent original-pixel inventory.')
} else if (mode === 'render') {
  for (const id of figures) {
    const attempt = path.join(own, id, 'initial')
    const spec = path.join(attempt, 'spec.json')
    const valid = native('python3', [validator, spec, '--stage', 'draft', '--json'], path.join(attempt, 'validation-command.json'))
    if (!valid) {
      console.log(`${id}: initial validation failed; bytes preserved.`)
      continue
    }
    const passed = native('node', [renderer, '--spec', spec, '--svg', path.join(attempt, `${id}.svg`), '--report', path.join(attempt, `${id}.render.json`)],
      path.join(attempt, 'render-command.json'))
    console.log(`${id}: native render ${passed ? 'passed' : 'failed'}; no preview image loaded.`)
  }
} else {
  throw new Error('Expected prepare, specs or render')
}
