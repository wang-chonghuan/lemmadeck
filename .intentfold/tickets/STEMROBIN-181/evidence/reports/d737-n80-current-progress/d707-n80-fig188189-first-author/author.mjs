import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d707-n80-fig188189-first-author')
const prepared = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d701-source217-consume-prepare80')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (name, value) => {
  const output = path.join(owned, name)
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const requirements = path.join(prepared, 'preauthor-source-requirements.json')
fs.copyFileSync(requirements, path.join(owned, 'preauthor-source-requirements.frozen.json'), fs.constants.COPYFILE_EXCL)
const lessonPath = path.join(prepared, 'root/10p/lessons/phy10-c2-s2-n80/lesson.json')
const exercisePath = path.join(prepared, 'root/10p/lessons/phy10-c2-s2-n80/exercises.json')
const templatePath = path.join(prepared, 'work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s2-n80/lesson.template.json')
const lesson = read(lessonPath)
const exercises = read(exercisePath)
const template = read(templatePath)
const priorEyeSpec = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d693-n79-fig184185-first-author/fig-185.first.spec.json')
const eyeOutline = read(priorEyeSpec).objects.find(o => o.id === 'eye-outline')
if (eyeOutline?.type !== 'svgPath') throw new Error('Existing eye path missing')
const authoritativeText = template.prose.filter(p => p.text).map(p => ({
  lesson: lesson.id,
  text: p.text,
})).concat(exercises.exercises.map(e => ({
  lesson: lesson.id, exercise: e.number, text: e.text,
})), [{
  lesson: lesson.id,
  text: 'Image-first authoring basis: the prepared n80 template is not approved modern prose; d703 is in progress. For small angles in radians, phi is approximately h/d0 and phi1 is approximately h/F. d0 = 25 cm is a conventional comparison distance, not a universal near point. An object in the magnifier focal plane yields a paraxial parallel bundle, with relaxed viewing only for an appropriate eye state. The source substitution prose literally contains phi2; its ambiguity is retained, not corrected here.',
}])
const binding = [requirements, lessonPath, exercisePath, templatePath, priorEyeSpec].map(p => ({
  path: p, sha256: hash(p),
}))
write('input-binding.json', {
  ticket: 'STEMROBIN-181', card: lesson.id, bindings: binding,
  requirementsFreeze: { path: path.join(owned, 'preauthor-source-requirements.frozen.json'), sha256: hash(requirements) },
  modernProseApproved: false, wholeCardApproved: false,
})

function make(id) {
  const objects = []
  const assertions = []
  const groups = []
  const point = (name, at, visible = true) => {
    objects.push({ id: name, type: 'point', at, visible, size: 1, strokeWidth: 1, stroke: 'ink', fill: 'ink' })
    return name
  }
  const assertion = (name, type, fields) => assertions.push({ id: name, type, ...fields })
  const edge = (name, from, to, type = 'segment', stroke = 'ink', strokeWidth = 3) => {
    objects.push({ id: name, type, from, to, stroke, strokeWidth })
    assertion(`${name}-endpoints`, 'connects', { arrow: name, from, to })
    return name
  }
  const text = (name, at, value, position = 'CENTER', offset = [0, 0]) => objects.push({
    id: name, type: 'text', at, text: value, fontSize: 28,
    labelPlacement: { position, offset },
  })
  const measure = (name, from, to, label, position, offset) => objects.push({
    id: name, type: 'measure', from, to, label, stroke: 'muted', strokeWidth: 2,
    capSize: 6, fontSize: 28, labelPlacement: { position, offset },
  })
  const disp = (name, from, to, dx, dy) => assertion(name, 'displacement', { from, to, dx, dy })
  const col = (name, a, b, c) => assertion(name, 'collinear', { a, b, c })
  const group = (name, description, objectIds, assertionIds, relational = true) => groups.push({
    id: name, description, objects: objectIds, assertions: assertionIds,
    ...(relational ? { requires: ['pointRelationships'] } : {}),
  })
  const angle = (name, centre, rayPoint, axisPoint, radius, slope, side, labelAt, label) => {
    const c = objects.find(o => o.id === centre).at
    const norm = Math.hypot(1, slope)
    const ray = point(`${name}-ray-end`, [c[0] + side * radius / norm, c[1] + side * radius * slope / norm])
    const axis = point(`${name}-axis-end`, [c[0] + side * radius, c[1]])
    objects.push({
      id: name, type: 'arc', center: centre,
      start: ray,
      end: axis, stroke: 'accent', strokeWidth: 3,
    })
    assertion(`${name}-ray-radius`, 'distance', { a: centre, b: ray, value: radius })
    assertion(`${name}-axis-radius`, 'distance', { a: centre, b: axis, value: radius })
    col(`${name}-ray-alignment`, centre, rayPoint, ray)
    col(`${name}-axis-alignment`, centre, axisPoint, axis)
    text(`${name}-label`, labelAt, label)
    return {
      objects: [centre, rayPoint, axisPoint, ray, axis, name, `${name}-label`],
      assertions: [`${name}-ray-radius`, `${name}-axis-radius`, `${name}-ray-alignment`, `${name}-axis-alignment`],
    }
  }

  const magnifier = id === 'fig-189'
  const objectX = magnifier ? 210 : 90
  const h = magnifier ? 90 : 90
  const eyeX = 790
  const base = point('object-base', [objectX, 170])
  const tip = point('object-tip', [objectX, 170 + h])
  const nodal = point('eye-centre', [eyeX, 170])
  const axisEnd = point('retinal-axis', [918, 170])
  edge('object-height', base, tip, 'segment', 'ink', 4)
  edge('optical-axis', base, axisEnd, 'segment', 'muted', 2)
  disp('height-value', base, tip, 0, h)
  col('axis-through-eye', base, nodal, axisEnd)
  assertion('height-normal-to-axis', 'perpendicular', { a: base, b: tip, c: base, d: axisEnd })
  measure('h-dimension', base, tip, 'h', 'W', [-18, 0])
  objects.push(structuredClone(eyeOutline))
  const lensTop = point('eye-lens-top', [790, 210])
  const lensBottom = point('eye-lens-bottom', [790, 130])
  objects.push(
    { id: 'eye-lens-left', type: 'arc', center: [860, 170], start: lensTop, end: lensBottom, stroke: 'ink', strokeWidth: 2 },
    { id: 'eye-lens-right', type: 'arc', center: [720, 170], start: lensBottom, end: lensTop, stroke: 'ink', strokeWidth: 2 },
  )
  disp('eye-lens-height', lensBottom, lensTop, 0, 80)
  disp('eye-centre-to-top', nodal, lensTop, 0, 40)
  group('source-eye', 'Source eye outline and eye-lens shape; existing identification-only outline path reused. Axial and off-axis retinal locations are checked separately.', ['eye-outline', lensTop, lensBottom, nodal, 'eye-lens-left', 'eye-lens-right'], ['eye-lens-height', 'eye-centre-to-top'])
  group('source-h-and-axis', 'Source object interval h is normal to its common optical axis; symbolic size, not a physical value inferred from pixels.', [base, tip, nodal, axisEnd, 'object-height', 'h-dimension', 'optical-axis'], ['height-value', 'height-normal-to-axis', 'axis-through-eye', 'object-height-endpoints', 'optical-axis-endpoints'])

  if (!magnifier) {
    const slope = -h / (eyeX - objectX)
    const retina = point('retinal-tip', [918, 170 + slope * 128])
    const rayMid = point('unaided-ray-mid', [470, 170 + h * (eyeX - 470) / (eyeX - objectX)])
    edge('unaided-ray-in', tip, nodal)
    edge('unaided-ray-direction', rayMid, nodal, 'arrow')
    edge('unaided-ray-eye', nodal, retina)
    edge('retinal-height', retina, axisEnd, 'segment', 'accent', 4)
    col('unaided-external-ray', tip, rayMid, nodal)
    col('unaided-internal-continuation', tip, nodal, retina)
    disp('retinal-inversion', axisEnd, retina, 0, slope * 128)
    group('source-unaided-rays', 'Source oblique incident ray points toward the eye and continues to the opposite retinal side; an axial reference bounds the retinal interval.', [tip, nodal, rayMid, retina, axisEnd, 'unaided-ray-in', 'unaided-ray-direction', 'unaided-ray-eye', 'retinal-height'], ['unaided-ray-in-endpoints', 'unaided-ray-direction-endpoints', 'unaided-ray-eye-endpoints', 'retinal-height-endpoints', 'unaided-external-ray', 'unaided-internal-continuation', 'retinal-inversion'])
    const a = angle('phi-angle', nodal, tip, base, 190, slope, -1, [585, 234], '\u03c6')
    group('source-phi', 'Source phi is the unaided visual angle between object-tip direction and the axis. Equal-radius endpoints and collinearity make the actual arc executable; the h/d0 relation is a small-angle approximation.', a.objects, a.assertions)
    const dStart = point('d0-start', [objectX, 65])
    const dEnd = point('d0-end', [eyeX, 65])
    edge('d0-object-guide', base, dStart, 'segment', 'muted', 1)
    edge('d0-eye-guide', nodal, dEnd, 'segment', 'muted', 1)
    measure('d0-dimension', dStart, dEnd, 'd\u2080', 'S', [0, 20])
    disp('d0-reference-span', dStart, dEnd, eyeX - objectX, 0)
    disp('d0-start-projection', dStart, base, 0, 105)
    disp('d0-end-projection', dEnd, nodal, 0, 105)
    assertion('d0-equals-object-eye-span', 'equalDistance', { a: dStart, b: dEnd, c: base, d: nodal })
    group('source-d0', 'Source d0 brackets the axial object-to-eye distance. The conventional 25 cm comparison is in bound authoritative text, not a universal near point or an anatomical eye-length claim.', [base, nodal, dStart, dEnd, 'd0-object-guide', 'd0-eye-guide', 'd0-dimension'], ['d0-object-guide-endpoints', 'd0-eye-guide-endpoints', 'd0-reference-span', 'd0-start-projection', 'd0-end-projection', 'd0-equals-object-eye-span'])
  } else {
    const focal = 480
    const lensX = objectX + focal
    const slope = -h / focal
    const centre = point('magnifier-centre', [lensX, 170])
    const top = point('magnifier-top', [lensX, 280])
    const bottom = point('magnifier-bottom', [lensX, 80])
    edge('magnifier-upper', centre, top, 'arrow', 'accent', 4)
    edge('magnifier-lower', centre, bottom, 'arrow', 'accent', 4)
    col('magnifier-transverse-line', bottom, centre, top)
    assertion('magnifier-normal-to-axis', 'perpendicular', { a: bottom, b: top, c: base, d: axisEnd })
    disp('focal-plane-location', base, centre, focal, 0)
    col('magnifier-on-axis', base, centre, nodal)
    disp('magnifier-near-eye-gap', centre, nodal, 100, 0)
    group('source-converging-magnifier', 'Source double outward-arrow converging lens near the eye, with object in its focal plane. Arrow endpoints, transverse lens plane and source-to-lens axial F are executable.', [base, centre, nodal, top, bottom, axisEnd, 'magnifier-upper', 'magnifier-lower'], ['magnifier-upper-endpoints', 'magnifier-lower-endpoints', 'magnifier-transverse-line', 'magnifier-normal-to-axis', 'focal-plane-location', 'magnifier-on-axis', 'magnifier-near-eye-gap'])
    const intercept = point('magnifier-off-axis', [lensX, 210])
    const eyeChief = point('eye-chief-entry', [eyeX, 170 + slope * 100])
    const eyeOther = point('eye-other-entry', [eyeX, 210 + slope * 100])
    const retina = point('retinal-tip', [918, 170 + slope * 128])
    edge('chief-incident', tip, centre)
    edge('other-incident', tip, intercept)
    edge('chief-emergent', centre, eyeChief, 'arrow')
    edge('other-emergent', intercept, eyeOther, 'arrow')
    edge('chief-eye-focus', eyeChief, retina)
    edge('other-eye-focus', eyeOther, retina)
    edge('retinal-height', retina, axisEnd, 'segment', 'accent', 4)
    col('chief-through-optical-centre', tip, centre, eyeChief)
    disp('other-intercept-height', centre, intercept, 0, 40)
    disp('chief-bundle-slope', centre, eyeChief, 100, slope * 100)
    disp('other-bundle-slope', intercept, eyeOther, 100, slope * 100)
    assertion('parallel-emergent-bundle', 'parallel', { a: centre, b: eyeChief, c: intercept, d: eyeOther })
    disp('retinal-inversion', axisEnd, retina, 0, slope * 128)
    const rayObjects = [tip, centre, intercept, eyeChief, eyeOther, retina, axisEnd, 'chief-incident', 'other-incident', 'chief-emergent', 'other-emergent', 'chief-eye-focus', 'other-eye-focus', 'retinal-height']
    const rayAssertions = rayObjects.filter(name => objects.find(o => o.id === name)?.type !== 'point').map(name => `${name}-endpoints`)
    group('source-parallel-ray-bundle', 'Source two rays from the same object tip; after the thin magnifier they form a near-axis parallel bundle entering the eye and meet at one inverted retinal position. Appropriate-eye relaxed viewing is conditional in authoritative text; anatomy is schematic.', rayObjects, rayAssertions.concat(['chief-through-optical-centre', 'other-intercept-height', 'chief-bundle-slope', 'other-bundle-slope', 'parallel-emergent-bundle', 'retinal-inversion']))
    const incidentAngle = angle('phi1-incident-angle', centre, tip, base, 155, slope, -1, [500, 243], '\u03c6\u2081')
    group('source-phi1-incident', 'Source first phi1 marks the incoming chief-ray angle relative to the common axis. Exact equal-radius arc endpoints and collinearity enforce that angle.', incidentAngle.objects, incidentAngle.assertions)
    const outgoingAngle = angle('phi1-emergent-angle', centre, eyeChief, nodal, 72, slope, 1, [727, 112], '\u03c6\u2081')
    group('source-phi1-emergent', 'Source second phi1 marks the emergent chief-ray angle relative to the same axis. Parallel-bundle and chief-ray continuity assertions bind equality to the incident angle; h/F is a small-angle approximation.', outgoingAngle.objects, outgoingAngle.assertions)
    const fStart = point('F-start', [objectX, 45])
    const fEnd = point('F-end', [lensX, 45])
    edge('F-object-guide', base, fStart, 'segment', 'muted', 1)
    edge('F-lens-guide', centre, fEnd, 'segment', 'muted', 1)
    measure('F-dimension', fStart, fEnd, 'F', 'S', [0, 17])
    disp('F-span', fStart, fEnd, focal, 0)
    disp('F-start-projection', fStart, base, 0, 125)
    disp('F-end-projection', fEnd, centre, 0, 125)
    assertion('F-equals-object-lens-span', 'equalDistance', { a: fStart, b: fEnd, c: base, d: centre })
    group('source-F', 'Source F brackets the object-base to magnifier axial focal distance, not object-to-eye distance. Clean guides and caps replace the scanned brace.', [base, centre, fStart, fEnd, 'F-object-guide', 'F-lens-guide', 'F-dimension'], ['F-object-guide-endpoints', 'F-lens-guide-endpoints', 'F-span', 'F-start-projection', 'F-end-projection', 'F-equals-object-lens-span'])
  }
  const imagePath = path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/${id}.png`)
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: magnifier
      ? 'Thin converging magnifier near an appropriate eye: object in focal plane, two incident rays, parallel paraxial output, phi1 on both sides, symbolic h and F; horizontal rotation of source.'
      : 'Unaided visual angle phi at a conventional d0 comparison distance, symbolic h and inverted retinal interval; horizontal rotation of source. phi approximately h/d0 only for small angles.',
    source: { image: { path: imagePath, sha256: hash(imagePath) }, authoritativeText, inventory: groups },
    canvas: { width: 960, height: 380, boundingBox: [0, 380, 960, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    layout: { minLabelGap: 4 }, objects, assertions,
  }
}

for (const id of ['fig-188', 'fig-189']) write(`${id}.first.spec.json`, make(id))
write('author-freeze.json', {
  status: 'FIRST-AUTHOR-SPECS-FROZEN-NATIVE-PENDING',
  rawInventory: { path: path.join(owned, 'rawinventory.json'), sha256: hash(path.join(owned, 'rawinventory.json')) },
  specs: ['fig-188', 'fig-189'].map(id => ({ path: path.join(owned, `${id}.first.spec.json`), sha256: hash(path.join(owned, `${id}.first.spec.json`)) })),
  imageOpens: 2, contentRepairs: { 'fig-188': 0, 'fig-189': 0 },
  independentReview: false, promoted: false, wholeCardApproved: false,
})
