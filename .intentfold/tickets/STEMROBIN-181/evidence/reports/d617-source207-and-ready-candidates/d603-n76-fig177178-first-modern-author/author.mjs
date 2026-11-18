import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const tmp = path.dirname(root)
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const pin = p => ({
  path: path.resolve(p), sha256: sha(p), bytes: fs.statSync(p).size,
  mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0'),
})
const save = (name, data) => {
  const p = path.join(root, name)
  assert(!fs.existsSync(p), `Refusing to overwrite ${p}`)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return p
}
const checked = (p, expected) => {
  assert.equal(sha(p), expected, `Input binding drift: ${p}`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
const manifestPath = path.join(tmp, 'd593-n76-first-figure-contexts/manifest.json')
const manifest = checked(manifestPath, '21fcaf1f3ce9382d9490953471e5b12ea88baad39aa18011c0da43d9a4c10f4a')
const textPaths = {
  zh: path.join(tmp, 'd597-n76-r08-first-text-repair/candidate/zh/lesson.template.json'),
  en: path.join(tmp, 'd597-n76-r08-first-text-repair/candidate/en/lesson.template.json'),
}
const lessons = {
  zh: checked(textPaths.zh, manifest.fullZH.sha256),
  en: checked(textPaths.en, manifest.fullEN.sha256),
}
const reviewPath = path.join(tmp, 'd598-n76-r08-first-affected-text-review/report.json')
const review = checked(reviewPath, '4a5e5bfdee7093f900968599a2363a571c6f1e66700d0fd03bac195d03e33526')
assert.equal(review.SCI, 'PASS')
assert.equal(review.ZHEN, 'PASS')
const fullText = Object.entries(lessons).flatMap(([locale, lesson]) =>
  [{ lesson: `${lesson.id}/${locale}`, text: lesson.title },
    ...lesson.prose.filter(p => p.text).map(p => ({
      lesson: `${lesson.id}/${locale}`, text: p.text,
    }))])
const inputs = [pin(manifestPath), ...Object.values(textPaths).map(pin), pin(reviewPath)]
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const native = []
const coverage = []
const sourceMapping = []

for (const number of [177, 178]) {
  const figure = `fig-${number}`
  const contextEntry = manifest.contexts.find(c => c.figure === figure)
  const contextPath = path.join(repo, contextEntry.context.path)
  const context = checked(contextPath, contextEntry.context.sha256)
  inputs.push(pin(contextPath))
  const inventoryPath = path.join(root, `source-inventory-${number}.json`)
  assert.equal(fs.statSync(inventoryPath).mode & 0o777, 0o444)
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
  assert.equal(sha(inventory.source.path), inventory.source.sha256)
  assert.equal(context.sourceImage.sha256, inventory.source.sha256)
  inputs.push(pin(inventory.source.path))
  const prefix = `f${number}`
  const id = suffix => `${prefix}-${suffix}`
  const objects = []
  const assertions = []
  const relation = (suffix, type, data) => {
    const a = { id: id(suffix), type, ...data }
    assertions.push(a)
    return a.id
  }
  const vertex = (suffix, at) => {
    const p = { id: id(suffix), type: 'point', at, visible: true,
      face: '+', size: 0.5, strokeWidth: 1, stroke: 'ink', fill: 'ink' }
    objects.push(p)
    return p.id
  }
  const segment = (suffix, from, to) => {
    const s = { id: id(suffix), type: 'segment', from, to,
      stroke: 'ink', strokeWidth: 4, dash: 0 }
    objects.push(s)
    relation(`${suffix}-connected`, 'connects', { arrow: s.id, from, to })
    return s.id
  }
  const O = vertex('optical-center', [0, 0])
  const axisLeft = vertex('axis-left-end', [-3.75, 0])
  const axisRight = vertex('axis-right-end', [3.75, 0])
  const apexY = number === 177 ? 1.8 : 1.52
  const armY = number === 177 ? 1.52 : 1.8
  const upper = vertex('upper-arrow-apex', [0, apexY])
  const lower = vertex('lower-arrow-apex', [0, -apexY])
  const upperLeft = vertex('upper-arm-left-end', [-0.14, armY])
  const upperRight = vertex('upper-arm-right-end', [0.14, armY])
  const lowerLeft = vertex('lower-arm-left-end', [-0.14, -armY])
  const lowerRight = vertex('lower-arm-right-end', [0.14, -armY])
  const axis = segment('principal-axis', axisLeft, axisRight)
  const lens = segment('lens-symbol', lower, upper)
  const upperArmLeft = segment('upper-arrow-left-arm', upperLeft, upper)
  const upperArmRight = segment('upper-arrow-right-arm', upperRight, upper)
  const lowerArmLeft = segment('lower-arrow-left-arm', lowerLeft, lower)
  const lowerArmRight = segment('lower-arrow-right-arm', lowerRight, lower)

  const focus = (suffix, at) => {
    const p = { id: id(suffix), type: 'point', at, visible: true,
      face: 'o', size: 5, strokeWidth: 3.5, stroke: 'ink', fill: 'paper',
      label: 'F', labelColor: 'ink', fontSize: 32, fontWeight: 400,
      labelPlacement: { position: 'N', gap: 35 } }
    objects.push(p)
    return p.id
  }
  const leftFocus = focus('left-focus', [-2.8, 0])
  const rightFocus = focus('right-focus', [2.8, 0])
  const centerLabel = { id: id('optical-center-text'), type: 'text', at: O,
    text: 'O', fontSize: 32, fontWeight: 400, labelColor: 'ink',
    labelPlacement: { position: 'SW', gap: 26 } }
  objects.push(centerLabel)
  relation('axis-through-center', 'pointOnLine', { point: O, a: axisLeft, b: axisRight })
  relation('lens-through-center', 'pointOnLine', { point: O, a: lower, b: upper })
  relation('axis-lens-perpendicular', 'perpendicular', { a: axisLeft, b: axisRight, c: lower, d: upper })
  relation('left-focus-on-axis', 'pointOnLine', { point: leftFocus, a: axisLeft, b: axisRight })
  relation('right-focus-on-axis', 'pointOnLine', { point: rightFocus, a: axisLeft, b: axisRight })
  relation('left-focus-side', 'displacement', { from: O, to: leftFocus, dx: -2.8, dy: 0 })
  relation('right-focus-side', 'displacement', { from: O, to: rightFocus, dx: 2.8, dy: 0 })
  relation('modern-equal-focal-distance', 'equalDistance', { a: leftFocus, b: O, c: O, d: rightFocus })
  relation('upper-apex-above-center', 'displacement', { from: O, to: upper, dx: 0, dy: apexY })
  relation('lower-apex-below-center', 'displacement', { from: O, to: lower, dx: 0, dy: -apexY })
  const dy = Number((apexY - armY).toFixed(2))
  for (const [suffix, from, to, dx, y] of [
    ['upper-left-direction', upperLeft, upper, 0.14, dy],
    ['upper-right-direction', upperRight, upper, -0.14, dy],
    ['lower-left-direction', lowerLeft, lower, 0.14, -dy],
    ['lower-right-direction', lowerRight, lower, -0.14, -dy],
  ]) relation(suffix, 'displacement', { from, to, dx, dy: y })

  const group = {
    id: id('single-lens-symbol'),
    description: `Original-only inventory ${pin(inventoryPath).sha256}: one solid principal axis, one crossing perpendicular lens symbol, two open ${number === 177 ? 'outward' : 'inward'} chevron arrowheads, two hollow focal markers labeled F above, and optical center O below-left without an independent dot. No dashed lines or light rays. Clean lengths and symmetric focal spacing are modern symbolic regularization, not measured physical data.`,
    requires: ['pointRelationships'],
    objects: objects.map(o => o.id),
    assertions: assertions.map(a => a.id),
  }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: figure, mode: 'deterministic',
    description: `${number === 177 ? 'Converging' : 'Diverging'} thin-lens schematic symbol for the current n76 paraxial lesson; distinguish outward/inward lens arrowheads and identify both focal positions and optical center without adding a ray construction.`,
    source: {
      image: { path: inventory.source.path, sha256: inventory.source.sha256 },
      authoritativeText: fullText,
      inventory: [group],
    },
    canvas: { width: 640, height: 352, boundingBox: [-4, 2.2, 4, -2.2],
      background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640,
      widths: [331, 342, 640], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 3 },
  }
  const specPath = save(`${figure}/spec.json`, spec)
  const command = (executable, args) => {
    const result = spawnSync(executable, args, { cwd: repo, encoding: 'utf8' })
    const receipt = { executable, args, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr }
    native.push({ figure, ...receipt })
    return receipt
  }
  const valid = command('python3', [path.join(skill, 'scripts/validate_spec.py'), specPath, '--stage', 'draft', '--json'])
  save(`${figure}/validate.first.json`, valid)
  assert.equal(valid.exitCode, 0, `Native validation failure: ${figure}`)
  const render = command('node', [path.join(skill, 'scripts/render_spec.mjs'),
    '--spec', specPath, '--svg', path.join(root, figure, `${figure}.svg`),
    '--png', path.join(root, figure, `${figure}.full.native.png`),
    '--report', path.join(root, figure, 'render.first.json')])
  save(`${figure}/render-command.first.json`, render)
  assert.equal(render.exitCode, 0, `Native render failure: ${figure}`)
  const nativeReport = JSON.parse(fs.readFileSync(path.join(root, figure, 'render.first.json'), 'utf8'))
  assert.equal(nativeReport.status, 'pass')

  const points = objects.filter(o => o.type === 'point').map(o => o.id)
  const fields = {
    distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
    collinear: ['a', 'b', 'c'], pointOnLine: ['point', 'a', 'b'],
    perpendicular: ['a', 'b', 'c', 'd'], connects: ['from', 'to'],
    displacement: ['from', 'to'],
  }
  const pointCoverage = points.map(point => {
    const matches = assertions.filter(a => {
      const refs = [...new Set((fields[a.type] || []).map(f => a[f]).filter(v => points.includes(v)))]
      return refs.length >= 2 && refs.includes(point) && refs.every(r => group.objects.includes(r))
    }).map(a => a.id)
    assert(matches.length > 0)
    return { point, group: group.id, groupContainedRelationshipAssertions: matches }
  })
  coverage.push({ figure, nativeValidationPassed: true, mappedPoints: points.length,
    uncoveredPoints: [], pointCoverage })
  sourceMapping.push({
    figure, inventory: pin(inventoryPath), spec: pin(specPath), group: group.id,
    sourceElementMap: [
      { source: 'principal-axis', objects: [axis, axisLeft, axisRight], assertions: [id('principal-axis-connected'), id('axis-through-center')] },
      { source: 'lens-symbol', objects: [lens, O, upper, lower], assertions: [id('lens-symbol-connected'), id('lens-through-center'), id('axis-lens-perpendicular')] },
      { source: 'upper-arrow', objects: [upperArmLeft, upperArmRight, upper, upperLeft, upperRight], assertions: [id('upper-arrow-left-arm-connected'), id('upper-arrow-right-arm-connected'), id('upper-left-direction'), id('upper-right-direction')] },
      { source: 'lower-arrow', objects: [lowerArmLeft, lowerArmRight, lower, lowerLeft, lowerRight], assertions: [id('lower-arrow-left-arm-connected'), id('lower-arrow-right-arm-connected'), id('lower-left-direction'), id('lower-right-direction')] },
      { source: 'left-focus', objects: [leftFocus], labels: [`${leftFocus}-label`], assertions: [id('left-focus-on-axis'), id('left-focus-side')] },
      { source: 'right-focus', objects: [rightFocus], labels: [`${rightFocus}-label`], assertions: [id('right-focus-on-axis'), id('right-focus-side')] },
      { source: 'optical-center', objects: [O, centerLabel.id], labels: [`${centerLabel.id}-label`], assertions: [id('axis-through-center'), id('lens-through-center')] },
    ],
    sourceMeasurements: inventory.subfigures[0].sourceMeasurements,
    modernRegularization: [
      'Canvas is a clean 640x352 symbolic frame, not the source raster dimensions.',
      'Focal positions are balanced at +/-2.8 symbolic units; these are not physical lengths or source pixel measurements.',
      'Axis and lens are straight and perpendicular; open chevrons use clean identical arm lengths.',
      'Construction points use tiny plus strokes fully contained within their associated 4px line footprints; O gains no separately visible dot.',
      'Visible F/F/O labels are regularized to 32 source pixels: 17.1 CSS px at 342 and 16.55 at 331.',
    ],
  })
}
save('input-pins.json', {
  inheritedTextReview: 'SCI/ZHEN effective-composed PASS consumed, not repeated',
  originalD585R08HOLDPreserved: true, inputs,
  completeCurrentTextRead: ['zh', 'en'],
  authoritativeTextScope: 'Complete current lesson title and every nonempty prose/caption block in both locales',
  sourceInventorySealedBeforeContext: true,
})
save('assertion-coverage.json', coverage)
save('source-to-spec.json', sourceMapping)
save('native-before-after.json', {
  kind: 'author-native-evidence-not-independent-FIG-or-DISPLAY',
  firstAttempt: native,
  targetedSpecRepairs: 0, firstFailure: null, before: 'First authored spec',
  after: 'Same first spec; no repair and no pass rerender', passRerenders: 0,
  independentFIG: 'PENDING', independentDISPLAY: 'PENDING',
})
console.log(JSON.stringify({ status: 'FIRST-NATIVE-RENDER-COMPLETE', root, figures: [177, 178], specRepairs: 0 }))
