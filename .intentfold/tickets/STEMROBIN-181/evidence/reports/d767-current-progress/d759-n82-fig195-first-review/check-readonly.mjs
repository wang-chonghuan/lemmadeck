import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const ticket = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`
const author = `${ticket}/d743-n82-fig195-first-author`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = read(`${author}/report.json`)
const spec = read(`${author}/fig-195.spec.json`)
const oldSpec = read(`${author}/d732.fig-195.spec.json`)
const render = read(`${author}/fig-195.render.json`)
const display = read(`${author}/display-640.json`)
const textReview = read(`${ticket}/d742-n82-first-bilingual-text-review/affected-review.json`)
const bindings = []
const checks = []
const bind = (name, file, expected) => {
  const actual = hash(file)
  assert.equal(actual, expected, name)
  bindings.push({ name, path: file, sha256: actual })
}
const check = (id, fn) => {
  const detail = fn()
  checks.push({ id, status: 'PASS', ...(detail ? { detail } : {}) })
}
const points = new Map(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]))
const objects = new Map(spec.objects.map(o => [o.id, o]))
const assertions = new Map(spec.assertions.map(a => [a.id, a]))
const p = value => typeof value === 'string' ? points.get(value) : value
const v = (a, b) => [b[0] - a[0], b[1] - a[1]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const len = a => Math.hypot(...a)
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`)
const angle = (a, b) => Math.acos(dot(a, b) / (len(a) * len(b)))
const A = p('A'), B = p('B'), C = p('C'), D = p('D')

check('requested-hashes-and-current-native-pass-reused', () => {
  bind('author-report', `${author}/report.json`, 'e0f24f52933e0cd59bc1609a1837292d45531b7060bb84e6d301ce56b3cde9b2')
  bind('candidate-spec', `${author}/fig-195.spec.json`, 'a0c347104f7191e0524226c8c5ac2a916ae821df211efe94b9d086b86603f1c2')
  bind('candidate-svg', `${author}/fig-195.svg`, '26b31395491e97b63e8c240ed8db949f9343493780ab205b0d06fff0d4820ee7')
  bind('affected-text-review', `${ticket}/d742-n82-first-bilingual-text-review/affected-review.json`, '16b03e73feb1b945a72fbcf3b28d94da0931a1a9343eab0e2834ec102f54ad8d')
  bind('source-original', spec.source.image.path, spec.source.image.sha256)
  for (const [name, ref] of Object.entries(report.candidate)) bind(name, ref.path, ref.sha256)
  bind('display-640', report.actualDisplay.evidence.path, report.actualDisplay.evidence.sha256)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(`${author}/fig-195.spec.json`))
  assert.equal(render.output.svg.sha256, hash(`${author}/fig-195.svg`))
  assert.equal(path.resolve(repo, render.spec.path), `${author}/fig-195.spec.json`)
  assert.equal(path.resolve(repo, render.output.svg.path), `${author}/fig-195.svg`)
  assert.deepEqual(render.collisions, [])
  assert.equal(textReview.status, 'PASS')
  assert.equal(textReview.whole_card_approved, false)
})
check('complete-current-authoritative-prose-binding', () => {
  const expected = ['en', 'zh'].flatMap(locale => {
    const ref = report.currentModernInputs[locale]
    bind(`current-${locale}-lesson`, ref.path, ref.sha256)
    const lesson = read(ref.path)
    assert.equal(lesson.card_id, 'phy10-c2-s3-n82')
    assert.equal(lesson.figures[0].id, 'fig-195')
    assert.equal(ref.sha256, textReview.bindings[`${locale === 'en' ? 'english' : 'chinese'}_lesson`].sha256)
    return lesson.prose.filter(block => typeof block.text === 'string' && block.text.trim())
      .map(block => ({ lesson: `phy10-c2-s3-n82:${locale}`, text: block.text }))
  })
  assert.deepEqual(spec.source.authoritativeText, expected)
  assert.equal(expected.length, 32)
  const ref = report.currentModernInputs.requirements
  bind('source-requirements', ref.path, ref.sha256)
  assert.equal(read(ref.path).card, 'phy10-c2-s3-n82')
  return { blocks: 32, en: 16, zh: 16, currentEnglish: 'd745', unchangedChinese: 'd732' }
})
check('metadata-only-delta-and-byte-identical-svg', () => {
  for (const key of ['originalSpec', 'originalSvg', 'originalRender', 'delta', 'equivalence']) {
    const ref = report.originalD732ProvenanceAndDelta[key]
    bind(key, ref.path, ref.sha256)
  }
  const { authoritativeText: oldText, ...oldSource } = oldSpec.source
  const { authoritativeText: newText, ...newSource } = spec.source
  assert.deepEqual(oldSource, newSource)
  assert.deepEqual({ ...oldSpec, source: oldSource }, { ...spec, source: newSource })
  assert.notDeepEqual(oldText, newText)
  assert.deepEqual(oldText.filter(b => b.lesson.endsWith(':zh')), newText.filter(b => b.lesson.endsWith(':zh')))
  assert.ok(fs.readFileSync(`${author}/fig-195.svg`).equals(fs.readFileSync(`${author}/d732.fig-195.svg`)))
  assert.equal(display.specSha256, hash(`${author}/d732.fig-195.spec.json`))
  assert.equal(display.svgSha256, hash(`${author}/fig-195.svg`))
  assert.equal(display.screenshot.sha256, hash(report.candidate.actual640Image.path))
})
check('source-points-edges-and-inventory-relations', () => {
  assert.deepEqual([...points.keys()].sort(), ['M', 'N', 'A', 'B', 'C', 'D', 'A1', 'A2', 'B1', 'B2'].sort())
  assert.equal(objects.size, spec.objects.length)
  assert.equal(assertions.size, spec.assertions.length)
  for (const group of spec.source.inventory) {
    for (const id of group.objects) assert.ok(objects.has(id))
    for (const id of group.assertions) assert.ok(assertions.has(id))
    if (!group.requires?.includes('pointRelationships')) continue
    const namedPoints = group.objects.filter(id => points.has(id))
    for (const id of namedPoints) {
      assert.ok(group.assertions.some(aid => {
        const a = assertions.get(aid)
        const refs = ['a', 'b', 'c', 'd', 'from', 'to', 'point', 'center']
          .map(key => a[key]).filter(value => typeof value === 'string' && points.has(value))
        return a.type !== 'objectCount' && refs.includes(id) &&
          new Set(refs).size > 1 && refs.every(ref => group.objects.includes(ref))
      }), `${group.id} missing ${id} relationship`)
    }
  }
  for (const o of spec.objects.filter(o => ['segment', 'arrow'].includes(o.type))) {
    const a = assertions.get(`${o.id}-connects`)
    assert.equal(a.type, 'connects')
    assert.equal(a.arrow, o.id)
    assert.deepEqual(a.from, o.from)
    assert.deepEqual(a.to, o.to)
  }
  for (const id of ['M', 'A', 'B', 'N']) near(p(id)[1], 0)
  assert.ok(p('M')[0] < A[0] && A[0] < B[0] && B[0] < p('N')[0])
  for (const id of ['A1', 'B1', 'C']) assert.ok(p(id)[1] > 0)
  for (const id of ['A2', 'B2', 'D']) assert.ok(p(id)[1] < 0)
  for (const [start, middle, end] of [['B1', 'C', 'B'], ['A', 'D', 'A2']]) {
    const ray = v(p(start), p(end)), offset = v(p(start), p(middle))
    near(cross(ray, offset), 0)
    const t = dot(offset, ray) / dot(ray, ray)
    assert.ok(t > 0 && t < 1)
  }
  const rayPairs = [['A1', 'A'], ['B1', 'B'], ['A', 'A2'], ['B', 'B2']]
  const arrows = spec.objects.filter(o => o.type === 'arrow')
  assert.equal(arrows.length, 4)
  for (const [index, o] of arrows.entries()) {
    const [from, to] = rayPairs[index], ray = v(p(from), p(to))
    for (const endpoint of [o.from, o.to]) {
      const offset = v(p(from), p(endpoint))
      near(cross(ray, offset), 0)
      const t = dot(offset, ray) / dot(ray, ray)
      assert.ok(t >= 0 && t <= 1)
    }
    assert.ok(dot(ray, v(p(o.from), p(o.to))) > 0)
  }
  return { sourcePoints: 10, sourceWavelets: 3, normalAngleLabels: 2, directedRayArrows: 4 }
})
check('huygens-first-arrival-right-triangles-normal-angles-and-speeds', () => {
  const normal = objects.get('normal-A')
  near(p(normal.from)[0], A[0])
  near(p(normal.to)[0], A[0])
  near(dot(v(p(normal.from), p(normal.to)), v(A, B)), 0)
  const incident = v(p('A1'), A), transmitted = v(A, p('A2'))
  near(cross(incident, v(p('B1'), B)), 0)
  near(cross(transmitted, v(B, p('B2'))), 0)
  near(dot(v(A, C), incident), 0)
  near(dot(v(A, C), v(C, B)), 0)
  near(dot(v(A, D), v(D, B)), 0)
  near(dot(v(D, B), v(B, p('B2'))), 0)
  const alpha = angle([0, 1], v(A, p('A1')))
  const beta = angle([0, -1], v(A, p('A2')))
  near(alpha, angle(v(A, C), v(A, B)))
  near(beta, angle(v(B, A), v(B, D)))
  for (const [id, expected] of [['angle-alpha', alpha], ['angle-beta', beta]]) {
    const o = objects.get(id)
    assert.deepEqual(p(o.center), A)
    near(angle(v(A, p(o.start)), v(A, p(o.end))), expected)
  }
  const AB = len(v(A, B)), CB = len(v(C, B)), AD = len(v(A, D))
  near(CB / AB, Math.sin(alpha))
  near(AD / AB, Math.sin(beta))
  assert.ok(CB > 0 && AD > 0 && AD < CB && beta < alpha)
  // Normalize v1 to one; the scale is diagnostic, not an invented source datum.
  const deltaT = CB, v2 = AD / deltaT
  near(AD, v2 * deltaT)
  near(Math.sin(alpha) / Math.sin(beta), 1 / v2)
  const unitTransmitted = transmitted.map(x => x / len(transmitted))
  const wavelets = []
  for (const id of ['wavelet-A', 'wavelet-secondary-1', 'wavelet-secondary-2']) {
    const o = objects.get(id), center = p(o.center)
    const radius = len(v(center, p(o.start)))
    near(center[1], 0)
    near(p(o.start)[1], 0)
    near(p(o.end)[1], 0)
    assert.ok(p(o.start)[0] < center[0] && center[0] < p(o.end)[0])
    near(len(v(center, p(o.end))), radius)
    const remainingTime = (B[0] - center[0]) * CB / AB
    near(radius, v2 * remainingTime)
    const contact = center.map((x, i) => x + radius * unitTransmitted[i])
    assert.ok(contact[1] < 0)
    near(cross(v(D, B), v(D, contact)), 0)
    near(dot(v(center, contact), v(D, B)), 0)
    near(len(v(center, contact)), radius)
    const a = assertions.get(`${id}-contact-incidence`)
    near(a.radius, radius)
    near(p(a.point)[0], contact[0])
    near(p(a.point)[1], contact[1])
    if (id === 'wavelet-A') {
      near(radius, AD)
      near(contact[0], D[0])
      near(contact[1], D[1])
    }
    wavelets.push({ id, radius, normalizedRemainingTime: remainingTime })
  }
  near((B[0] - B[0]) * CB / AB, 0)
  return { AB, CB, AD, alphaDegrees: alpha * 180 / Math.PI, betaDegrees: beta * 180 / Math.PI,
    impliedV2OverV1: v2, impliedRelativeIndex: 1 / v2, wavelets,
    interpretation: 'Diagnostic schematic lengths only. Same elapsed time and fixed-frequency phase speeds; A starts first, B starts at the final instant.' }
})
check('actual640-media-and-label-size-bound-without-full-card-inference', () => {
  assert.equal(spec.display.purpose, 'instructional')
  assert.equal(spec.display.layout, 'scroll')
  assert.deepEqual(spec.display.widths, [640])
  assert.equal(spec.canvas.width, 640)
  assert.equal(spec.canvas.height, 600)
  const svg = fs.readFileSync(`${author}/fig-195.svg`, 'utf8')
  const textTags = [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)]
  assert.equal(textTags.length, 12)
  for (const [, attrs] of textTags) assert.match(attrs, /font-size="24"/)
  assert.equal(render.displayChecks[0].measuredMinPx, 24)
  assert.equal(render.displayChecks[0].status, 'pass')
  for (const obs of display.observations) {
    assert.equal(obs.mediaWidth, 640)
    assert.equal(obs.mediaHeight, 600)
    assert.equal(obs.minTextPx, 24)
    for (const label of obs.labels) assert.ok(label.px >= 16)
    assert.equal(obs.scrollEnd, obs.expectedScrollEnd)
  }
  assert.equal(display.screenshot.width, 640)
  assert.equal(display.screenshot.height, 600)
  const labels = spec.objects.flatMap(o => [o.label, o.text].filter(Boolean))
  assert.deepEqual(labels.sort(), ['A', 'B', 'C', 'D', 'M', 'N', 'A1', 'A2', 'B1', 'B2', '\u03b1', '\u03b2'].sort())
  assert.ok(labels.every(label => !/[\u0400-\u04ff\u3400-\u9fff]/.test(label)))
  return { mediaWidthPx: 640, mediaHeightPx: 600, minTextPx: 24,
    directPixelInspection: 'Independent view of supplied actual-640 PNG; no label touches or clipping observed.',
    savedAuthorDisplayMeasurements: 'Reused and bound through identical SVG; not independent full-card display acceptance.',
    fullCardDisplayPass: false }
})

console.log(JSON.stringify({ schema: 'd759/read-only-binding-and-geometry-checks@1',
  status: 'PASS', checkout: repo, nativeValidatorCalls: 0, nativeRendererCalls: 0,
  writesByThisScript: 0, checks, bindings }, null, 2))
