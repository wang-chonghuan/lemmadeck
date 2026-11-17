import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
export const O = path.dirname(fileURLToPath(import.meta.url))
export const S = `${W}/.agents/skills/ld-s10y-image`
export const F = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n40-author/author-freeze.json`
export const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
export const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
export const bind = file => ({ path: file, sha256: hash(file) })
export function destination(file) {
  const target = path.resolve(O, file)
  assert(target.startsWith(`${O}/`), `Outside ownership: ${target}`)
  assert(!fs.existsSync(target), `Retain existing evidence: ${target}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  return target
}
export function write(file, value) {
  const target = destination(file)
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(target)
}
export function command(name, executable, args, cwd = O) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: `${O}/runtime/` },
  })
  write(`receipts/${name}.json`, {
    executable, args, cwd, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
  })
  return result
}
export const SOURCE = {
  'fig-73': { width: 516, height: 282, sha256: '0dfdac2502fd2fbd59ce2cf5cb720a6c020374cc24302f94c4d4e815239a5551' },
  'fig-74': { width: 610, height: 239, sha256: '53b40bd11f58ad463ee7034da79e6a7da45ec74ea9001dcca7d9c3fbbb20047c' },
  'fig-75': { width: 330, height: 337, sha256: 'fcedad8be34b24689ae7aed0fefda35c9378d564894bd8d3f5e1619820ab2857' },
}
export function verifyInputs() {
  assert.equal(hash(F), '57460be08f809264a7c942aee226687f336cf544a76e45fc4d190fac869388d1')
  const freeze = read(F)
  for (const language of freeze.frozen) {
    for (const value of Object.values(language)) {
      if (value?.path && value?.sha256) assert.equal(hash(value.path), value.sha256, value.path)
    }
  }
  for (const [id, expected] of Object.entries(SOURCE)) {
    const file = `${W}/ssot-resources/soviet10year-textbooks/artifacts/10p/figures/${id}.png`
    assert.equal(hash(file), expected.sha256)
    const bytes = fs.readFileSync(file)
    assert.equal(bytes.readUInt32BE(16), expected.width)
    assert.equal(bytes.readUInt32BE(20), expected.height)
  }
  return freeze
}

const round = n => Number(n.toFixed(9))
const xy = values => values.map(round)
function builder(id, height, text, description) {
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: { path: `${W}/ssot-resources/soviet10year-textbooks/artifacts/10p/figures/${id}.png`, sha256: SOURCE[id].sha256 },
      authoritativeText: text, inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [295, 640], minTextPx: 16 },
    objects: [], assertions: [],
  }
  const points = new Map()
  const point = (name, at) => {
    assert(!points.has(name))
    points.set(name, xy(at))
    // Subpixel anchors are wholly within existing strokes, not new labelled locations.
    spec.objects.push({ id: name, type: 'point', at: xy(at), visible: true,
      size: 0.1, strokeWidth: 0.1, stroke: 'ink', fill: 'ink' })
    return name
  }
  const assertion = (name, type, values) => {
    spec.assertions.push({ id: name, type, ...values, tolerance: 0.00001 })
    return name
  }
  const edge = (name, from, to, type = 'segment', style = {}) => {
    spec.objects.push({ id: name, type, from, to, stroke: 'ink', strokeWidth: 3, ...style })
    assertion(`${name}-connects`, 'connects', { arrow: name, from, to })
    return name
  }
  const displacement = (name, from, to) => {
    const [a, b] = [points.get(from), points.get(to)]
    return assertion(name, 'displacement', { from, to, dx: round(b[0] - a[0]), dy: round(b[1] - a[1]) })
  }
  const polygon = (name, screen, style = {}) => {
    const ids = screen.map(([x, y], index) => point(`${name}-corner-${index}`, [x, height - y]))
    spec.objects.push({ id: name, type: 'polygon', points: ids,
      stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1, ...style })
    ids.forEach((from, index) => displacement(`${name}-edge-${index}`, from, ids[(index + 1) % ids.length]))
    return ids
  }
  const group = (name, description) => {
    spec.source.inventory.push({
      id: name, description, objects: spec.objects.map(item => item.id),
      assertions: spec.assertions.map(item => item.id), requires: ['pointRelationships'],
    })
  }
  const count = (type, n) => assertion(`${id}-${type}-count`, 'objectCount', { objectType: type, count: n })
  return { spec, points, point, edge, assertion, displacement, polygon, group, count }
}

function plane(text) {
  const b = builder('fig-73', 360, text,
    'Inspect one thin plate, seven parallel wavefront section traces, and five rightward normal rays. These traces represent planes, not a numbered grid. Exact spacing and orthogonality straighten the scan for the frozen ideal-plane-wave model; they are uncalibrated modern rectification, not new measured data. No labels, ticks, motion arrows, formulas or answers.')
  const plate = b.polygon('source-plate', [[40, 40], [48, 40], [48, 320], [40, 320]])
  const rays = [58, 118, 178, 238, 298].map((y, i) => {
    const from = b.point(`source-ray-${i + 1}-plate-contact`, [48, 360 - y])
    const to = b.point(`source-ray-${i + 1}-outward-end`, [606, 360 - y])
    b.edge(`source-ray-${i + 1}`, from, to, 'arrow')
    b.displacement(`source-ray-${i + 1}-rightward`, from, to)
    b.assertion(`source-ray-${i + 1}-plate-contact-on-face`, 'pointOnLine', { point: from, a: plate[1], b: plate[2] })
    return { from, to }
  })
  const fronts = [106, 170, 234, 298, 362, 426, 490].map((x, j) => {
    const top = b.point(`source-front-${j + 1}-top`, [x, 320])
    const bottom = b.point(`source-front-${j + 1}-bottom`, [x, 40])
    b.edge(`source-front-${j + 1}`, top, bottom)
    b.assertion(`source-front-${j + 1}-parallel-to-plate`, 'parallel', { a: top, b: bottom, c: plate[1], d: plate[2] })
    const intersections = rays.map((ray, i) => {
      const p = b.point(`source-front-${j + 1}-ray-${i + 1}-intersection`, [x, b.points.get(ray.from)[1]])
      b.assertion(`${p}-on-front`, 'pointOnLine', { point: p, a: top, b: bottom })
      b.assertion(`${p}-on-ray`, 'pointOnLine', { point: p, a: ray.from, b: ray.to })
      b.assertion(`${p}-normal`, 'perpendicular', { a: top, b: bottom, c: ray.from, d: ray.to })
      return p
    })
    return { top, bottom, intersections }
  })
  for (let i = 1; i < rays.length; i++) {
    b.assertion(`source-rays-1-${i + 1}-parallel`, 'parallel', { a: rays[0].from, b: rays[0].to, c: rays[i].from, d: rays[i].to })
  }
  b.count('arrow', 5)
  b.count('segment', 7)
  b.count('polygon', 1)
  b.count('text', 0)
  b.count('grid', 0)
  b.group('source-73-plate-fronts-rays-common-frame',
    'Fresh canonical pixels: one slender vertical plate at the left; seven vertical wavefront traces (scan x about 77,129,184,240,294,347,401); five horizontal rays begin at the plate and cross every front before their rightward arrowheads. There are 35 crossings, not newly marked points. All defining contacts, frame corners, front endpoints and crossings are mapped with within-group relations. Source strokes are uneven; exact parallelism, straightness, equal drawing intervals and normal rays are modern rectification. No source text, number, tick, axis, separate grid or extra object.')
  return { ...b, geometry: { plate, rays, fronts }, inventory: {
    sourceFacts: { plate: 1, wavefronts: 7, rightwardRays: 5, rayFrontCrossings: 35, labels: 0, numericTicks: 0 },
    sourceFrontApproximatePixelX: [77, 129, 184, 240, 294, 347, 401],
    modernRectification: ['Straight parallel front traces and rays; exactly normal ray/front relationships.', 'Uniform uncalibrated drawing spacing; section traces stand for parallel planes, not a lattice.'],
  } }
}

function tray(text) {
  const b = builder('fig-74', 320, text,
    'Inspect one perspective water tray and one lightly contacting straight rod with a left-entering handle, with sixteen line-wavefronts parallel to the rod, three on its left and thirteen on its right. Wavefronts are water-surface lines, not bulk liquid shear waves. Clean straight traces, a common surface plane and a thin contact rod are modern rectification of the scan. No wave arrows, labels, data ticks or answer annotation.')
  const tabs = [
    b.polygon('source-tray-left-support-tab', [[61, 265], [107, 265], [107, 273], [61, 273]], { fill: 'ink' }),
    b.polygon('source-tray-right-support-tab', [[450, 268], [490, 268], [490, 276], [450, 276]], { fill: 'ink' }),
  ]
  const frontWall = b.polygon('source-tray-front-wall', [[16, 224], [520, 228], [520, 267], [15, 264]])
  const rightWall = b.polygon('source-tray-right-wall', [[596, 56], [590, 93], [523, 269], [520, 228]])
  const rim = b.polygon('source-tray-top-rim', [[120, 56], [596, 56], [520, 228], [16, 224]])
  const water = b.polygon('source-water-surface', [[135, 73], [574, 73], [504, 210], [51, 210]])
  const starts = [166, 190, 214, 256, 280, 304, 328, 352, 376, 400, 424, 448, 472, 496, 520, 548]
  const waves = starts.map((x, i) => {
    const top = b.point(`source-wave-${i + 1}-back`, [x, 238])
    const middle = b.point(`source-wave-${i + 1}-middle`, [x - 30, 175])
    const bottom = b.point(`source-wave-${i + 1}-front`, [x - 60, 112])
    b.edge(`source-wave-${i + 1}`, top, bottom)
    b.assertion(`source-wave-${i + 1}-straight`, 'collinear', { a: top, b: middle, c: bottom })
    for (const p of [top, middle, bottom]) b.assertion(`${p}-inside-water`, 'inside', { point: p, container: 'source-water-surface', margin: 1 })
    return { top, middle, bottom }
  })
  const rodTop = b.point('source-rod-back-contact', [224, 226])
  const rodMiddle = b.point('source-rod-middle-contact', [199, 173.5])
  const rodBottom = b.point('source-rod-front-contact', [174, 121])
  const rod = b.polygon('source-contact-rod', [[220, 92], [228, 96], [178, 201], [170, 197]])
  const contact = b.point('source-handle-rod-junction', [224 - 34 * 50 / 105, 192])
  const handle = b.polygon('source-left-entering-handle', [[18, 122], [208, 122], [208, 134], [18, 134]])
  b.assertion('source-rod-contact-axis-straight', 'collinear', { a: rodTop, b: rodMiddle, c: rodBottom })
  b.assertion('source-handle-attaches-to-contact-rod', 'pointOnLine', { point: contact, a: rodTop, b: rodBottom })
  for (const p of [rodTop, rodMiddle, rodBottom, contact]) {
    b.assertion(`${p}-inside-water`, 'inside', { point: p, container: 'source-water-surface', margin: 1 })
  }
  b.displacement('source-contact-rod-direction', rodTop, rodBottom)
  waves.forEach((wave, i) => {
    b.assertion(`source-wave-${i + 1}-parallel-to-rod`, 'parallel', { a: wave.top, b: wave.bottom, c: rodTop, d: rodBottom })
  })
  b.count('segment', 16)
  b.count('arrow', 0)
  b.count('text', 0)
  b.group('source-74-one-tray-contact-rod-and-all-line-waves',
    'Fresh canonical pixels: one oblique rectangular tray with rim, front wall, right wall, water surface and two small dark underside support tabs. One thin diagonal rod lightly touches the water; its horizontal handle enters from the left and joins it near the upper half. Sixteen wavefront lines: three left of the contact rod, thirteen right of it. The first right-hand wave has a bent upper tip (about x250,y50); it is a wave, not another rod. Approximate back/front scan intercept pairs are retained in the external inventory. The rod and handle occlude parts of the first three waves. All wave endpoints/midpoints, contact locations and tray/rod/handle vertices map to within-group relations; wavefronts stay inside the common water surface. Exact straightness and parallelism regularize the scan, with the same side ordering. No arrows, numbers, labels, new scales or deep immersion.')
  return { ...b, geometry: { tabs, frontWall, rightWall, rim, water, waves, rodTop, rodMiddle, rodBottom, rod, handle, contact }, inventory: {
    sourceFacts: { tray: 1, waterSurface: 1, contactRod: 1, attachedHandle: 1, traySupportTabs: 2,
      wavefronts: 16, leftOfRod: 3, rightOfRod: 13, arrows: 0, labels: 0, numericTicks: 0 },
    sourceWaveApproximatePixelIntercepts: {
      backY: 50, backX: [160, 185, 210, 255, 279, 303, 327, 353, 377, 400, 424, 449, 470, 496, 521, 547],
      frontY: 158, frontX: [102, 125, 151, 199, 221, 247, 272, 297, 323, 345, 368, 392, 418, 446, 469, 500],
      rodNotWave: 'At y158 the dark run x161..183 is the contact rod, not an extra seventeenth wavefront.',
    },
    modernRectification: ['Sixteen straight parallel traces instead of ragged curves, retaining three/thirteen side ordering.', 'One planar water surface and thin surface-contact rod; no added vertical motion arrow or submerged length.', 'Perspective drawing coordinates are uncalibrated, not physical measurements.'],
  } }
}

function sphere(text) {
  const b = builder('fig-75', 640, text,
    'Inspect one pulsating sphere, its dashed alternate-radius outline, four concentric spherical-wavefront section traces and eight outward radial rays. Circular sections share one center; they represent spheres, not coplanar physical wavefronts or water ripples. Exact radii, circularity and eight angular directions are schematic modern rectification. The small white patch is source lighting, not a cavity. No labels, new numeric values, ticks or answers.')
  const center = b.point('source-sphere-center', [320, 320])
  const radii = [102, 154, 204, 252]
  const directions = Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4
    return [Math.cos(a), Math.sin(a)]
  })
  const onRadius = (name, r, direction) => {
    const p = b.point(name, [320 + r * direction[0], 320 + r * direction[1]])
    b.assertion(`${name}-on-radius`, 'pointOnCircle', { point: p, center, radius: r })
    return p
  }
  const rays = directions.map((d, i) => {
    const from = onRadius(`source-ray-${i + 1}-sphere-contact`, 48, d)
    const to = onRadius(`source-ray-${i + 1}-outward-end`, 302, d)
    b.edge(`source-ray-${i + 1}`, from, to, 'arrow')
    b.assertion(`source-ray-${i + 1}-radial`, 'collinear', { a: center, b: from, c: to })
    b.displacement(`source-ray-${i + 1}-outward`, from, to)
    return { from, to }
  })
  const fronts = radii.map((radius, j) => {
    const id = `source-wavefront-${j + 1}`
    b.spec.objects.push({ id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 3, fillOpacity: 0 })
    const intersections = directions.map((d, i) => {
      const p = onRadius(`${id}-ray-${i + 1}-intersection`, radius, d)
      b.assertion(`${p}-on-ray`, 'pointOnLine', { point: p, a: rays[i].from, b: rays[i].to })
      const [x, y] = b.points.get(p)
      b.assertion(`${p}-ray-normal-to-front`, 'perpendicular', {
        a: center, b: p, c: xy([x - 10 * d[1], y + 10 * d[0]]), d: xy([x + 10 * d[1], y - 10 * d[0]]),
      })
      return p
    })
    return { id, radius, intersections }
  })
  const pulseRight = onRadius('source-pulse-right', 66, [1, 0])
  const pulseLeft = onRadius('source-pulse-left', 66, [-1, 0])
  // Native circle objects do not implement dash; two native dashed semicircles do.
  for (const [id, start, end] of [
    ['source-pulse-upper-outline', pulseRight, pulseLeft],
    ['source-pulse-lower-outline', pulseLeft, pulseRight],
  ]) {
    b.spec.objects.push({ id, type: 'arc', center, start, end, dash: 2, stroke: 'ink', strokeWidth: 3 })
  }
  b.assertion('source-pulse-diameter-through-center', 'collinear', { a: pulseLeft, b: center, c: pulseRight })
  b.spec.objects.push(
    { id: 'source-pulsating-sphere', type: 'circle', center, radius: 48, stroke: 'ink', strokeWidth: 3, fill: 'ink', fillOpacity: 1 },
    { id: 'source-sphere-light-patch', type: 'circle', center: [348, 318], radius: 11, stroke: 'paper', strokeWidth: 1, fill: 'paper', fillOpacity: 1 },
  )
  b.count('arrow', 8)
  b.count('circle', 6)
  b.count('arc', 2)
  b.count('text', 0)
  b.group('source-75-pulse-four-fronts-and-eight-radial-rays',
    'Fresh canonical pixels: one filled spherical source with a small white light patch, one larger dashed pulsation-phase outline, four nested solid wavefront circles around the same center, and eight arrows pointing away from the source along cardinal/diagonal radii. There are 32 ray/front crossings. The slight scanned ovality and unequal arrow reach are rectified to exact concentric circular sections and exact radial normals. Two native dashed semicircles construct the single source alternate-phase outline; they are not two additional wavefronts. Every defining contact, crossing, arrow end and pulse endpoint is mapped with within-group relations. No printed number, label, unit, axis, calibration, new inward arrow or extra sphere.')
  return { ...b, geometry: { center, rays, fronts, pulseRight, pulseLeft, directions }, inventory: {
    sourceFacts: { pulsatingSphere: 1, dashedAlternateRadiusOutline: 1, solidWavefronts: 4, outwardRadialArrows: 8,
      rayFrontCrossings: 32, lightPatch: 1, labels: 0, numericTicks: 0 },
    sourceApproximatePixelCenter: [163, 163],
    sourceApproximatePixelRadii: { sphere: 23, pulse: 33, solidWavefronts: [51, 77, 102, 126] },
    modernRectification: ['True circular concentric sections and exact radial outward normals.', 'Eight uniformly separated directions and equal drawing arrow reach, without asserting measured source angles or values.', 'The source white lighting patch remains a white patch, not a hole; one dashed phase outline is drawn using two native arcs.'],
  } }
}

export function buildFigures(freeze) {
  const text = freeze.frozen.map(record => {
    const lesson = read(record.template.path)
    return { lesson: freeze.card, text: `${lesson.title}\n\n${lesson.prose.filter(p => p.text?.trim()).map(p => p.text).join('\n\n')}` }
  })
  return [plane(text), tray(text), sphere(text)]
}

function author() {
  const freeze = verifyInputs()
  const snapshots = []
  const copy = (file, relative) => {
    const target = destination(relative)
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    snapshots.push({ original: bind(file), frozen: bind(target) })
  }
  copy(F, 'context/text-author-freeze.json')
  for (const record of freeze.frozen) {
    for (const key of ['template', 'figuresTemplate', 'exercisesTemplate', 'readingText']) {
      copy(record[key].path, `context/${record.language}/${path.basename(record[key].path)}`)
    }
  }
  for (const file of ['SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md',
    'assets/figure-spec.schema.json', 'scripts/validate_spec.py', 'scripts/render_spec.mjs',
    'scripts/materialize_arrowheads.mjs', 'scripts/record_review.py']) copy(`${S}/${file}`, `context/contracts/${file}`)
  write('context/input-bindings.json', {
    textFreeze: bind(F), snapshots,
    nativeDigitLocalization: 'Resolved separately per human instruction; retained old freeze failure is historical, not rewritten here. No author words changed.',
    independentSCI: 'pending', independentZHEN: 'pending',
  })
  fs.mkdirSync(`${O}/runtime`, { recursive: true })
  const attempts = []
  const figures = buildFigures(freeze)
  for (const [index, figure] of figures.entries()) {
    const { spec } = figure
    const id = spec.id
    const inventory = write(`${id}/source-inventory.json`, {
      schema: 'ld-s10y-image/bounded-author-source-inventory@1', figure: id,
      source: spec.source.image, exactDimensions: SOURCE[id],
      imageOpen: { ordinal: index + 1, method: 'functions.view_image', detail: 'original',
        freshCanonicalPNGOpenedBeforeCountsDimensionsAndHashes: true },
      ...figure.inventory, mappings: spec.source.inventory,
      labelsNoneLegitimate: true, independentApproval: false,
    })
    write(`${id}/geometry-definition.json`, figure.geometry)
    const stage = `${O}/${id}/initial`
    const specFile = write(`${id}/initial/${id}.spec.json`, spec)
    const validation = command(`${id}-initial-draft-validation`, 'python3',
      [`${S}/scripts/validate_spec.py`, specFile.path, '--stage', 'draft', '--json'], stage)
    let rendered = null
    if (validation.status === 0) {
      rendered = command(`${id}-initial-native-render`, 'node',
        [`${S}/scripts/render_spec.mjs`, '--spec', `${id}.spec.json`,
          '--svg', `${id}.svg`, '--report', `${id}.render.json`], stage)
    }
    const success = validation.status === 0 && rendered?.status === 0
    attempts.push({ figure: id, inventory, spec: specFile, validationExitCode: validation.status,
      renderExitCode: rendered?.status ?? null, nativeStatus: success ? read(`${stage}/${id}.render.json`).status : 'fail',
      stage, targetedRepairsUsed: 0, initialRetained: true })
    console.log(JSON.stringify(attempts.at(-1)))
  }
  verifyInputs()
  write('build-state.json', { attempts, textFreeze: bind(F), snapshots,
    status: attempts.every(a => a.nativeStatus === 'pass') ? 'AUTHOR-NATIVE-PASS-PREVIEW-PENDING' : 'ACTUAL-INITIAL-FAILURE',
    noGeneration: true, independentApproval: false })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) author()
