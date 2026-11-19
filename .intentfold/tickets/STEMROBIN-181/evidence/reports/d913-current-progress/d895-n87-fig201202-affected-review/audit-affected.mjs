import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp')
const D = path.join(T, 'd895-n87-fig201202-affected-review')
const A = path.join(T, 'd886-n87-fig201202-affected-repair')
const V = path.join(T, 'd877-n87-fig201202-first-independent-review')
const inputs = new Map()
const sha = data => crypto.createHash('sha256').update(data).digest('hex')
const info = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: sha(bytes), bytes: bytes.length }
}
const read = (file, expected) => {
  const data = fs.readFileSync(file)
  const binding = { path: file, sha256: sha(data), bytes: data.length }
  if (expected) assert.equal(binding.sha256, expected, file)
  inputs.set(file, binding)
  return data
}
const json = (file, expected) => JSON.parse(read(file, expected))
const write = (name, data) => {
  const file = path.join(D, name)
  assert.ok(file.startsWith(`${D}/`))
  fs.writeFileSync(file, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return info(file)
}
const first = json(path.join(V, 'report.json'), '27995205ff564553f1d0e90a1cd74ae9163285f8cd38740355ebc8562bb28844')
const author = json(path.join(A, 'report.json'), '1fc832e3890840e9b1a1cd1c8c26cc0b2b427311735d0d971ca16f32e6584806')
const selection = json(path.join(A, 'current-outputs.json'))
const firstGeometry = json(path.join(V, 'geometry-and-bindings-FIRST.json'))
const sourceInventory = json(path.join(V, 'source-inventory-FIRST.json'))
json(path.join(V, 'independent-findings-FIRST.json'))
const firstUsage = json(path.join(V, 'usage.json'))
const authorUsage = json(path.join(A, 'usage.json'))
const textBinding = json(path.join(A, 'current-authoritative-text.json'), author.authority.currentBilingualText.sha256)
for (const file of [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
]) read(path.join(R, file))
const selected = {}
for (const [id, entries] of Object.entries(selection.figures)) {
  selected[id] = {}
  for (const [kind, binding] of Object.entries(entries)) {
    const data = read(binding.path, binding.sha256)
    selected[id][kind] = kind === 'svg' ? data.toString('utf8') : JSON.parse(data)
  }
}
const s201 = selected['fig-201'].spec
const s202 = selected['fig-202'].spec
assert.ok(selection.figures['fig-202'].spec.path.includes('/targeted-label-recovery/'))
assert.ok(selection.figures['fig-202'].svg.path.includes('/targeted-label-recovery/'))
assert.ok(selection.figures['fig-202'].render.path.includes('/targeted-label-recovery/'))
const currentText = []
const usages = []
for (const entry of textBinding.candidates) {
  const data = json(entry.original.path, entry.expectedSha256)
  read(entry.copy.path, entry.expectedSha256)
  const firstBinding = first.currentCandidates.find(c => c.locale === entry.locale && c.kind === entry.kind)
  assert.equal(entry.expectedSha256, firstBinding.sha256)
  for (const block of entry.kind === 'lesson' ? data.prose : data.exercises) {
    if (!block.text?.trim()) continue
    currentText.push({
      lesson: first.card,
      ...(entry.kind === 'exercises' ? { exercise: `${entry.locale}:${block.number}` } : {}),
      text: `[${entry.locale}; ${entry.kind}; source refs ${(block.source_refs || block.pages || []).join(',')}] ${block.text}`,
    })
  }
  if (entry.kind === 'lesson') {
    for (const [i, block] of data.prose.entries()) {
      if (block.kind === 'fig' && ['fig-201', 'fig-202'].includes(block.id)) {
        usages.push({ locale: entry.locale, figure: block.id, pointer: `/prose/${i}`, owner: entry.original })
      }
    }
  }
}
assert.deepEqual(currentText, textBinding.authoritativeText)
assert.deepEqual(s201.source.authoritativeText, currentText)
assert.deepEqual(s202.source.authoritativeText, currentText)
assert.equal(usages.length, 4)
const stripText = spec => ({ ...spec, source: { ...spec.source, authoritativeText: null } })
const old201binding = firstGeometry.figures.find(f => f.figure === 'fig-201')
const old202binding = firstGeometry.figures.find(f => f.figure === 'fig-202')
const old201 = json(old201binding.spec.path, old201binding.spec.sha256)
const old202 = json(old202binding.spec.path, old202binding.spec.sha256)
assert.deepEqual(stripText(s201), stripText(old201))
assert.equal(sha(read(old201binding.svg.path, old201binding.svg.sha256)), sha(selected['fig-201'].svg))
read(old201binding.render.path, old201binding.render.sha256)
assert.equal(sha(JSON.stringify(selected['fig-201'].priorRenderExactCopy)), sha(JSON.stringify(JSON.parse(fs.readFileSync(old201binding.render.path)))))
assert.equal(first.figures.find(f => f.figure === 'fig-201').substantiveStatus, 'PASS')
for (const id of ['fig-201', 'fig-202']) {
  read(path.join(R, selected[id].spec.source.image.path), selected[id].spec.source.image.sha256)
}
const sourceChecks = sourceInventory.figures.map(f => ({
  figure: f.figure,
  originalObservation: { path: path.join(V, 'source-inventory-FIRST.json'), pointer: `/figures/${f.figure === 'fig-201' ? 0 : 1}` },
  originalImage: inputs.get(f.source),
  reopenedInThisReview: false,
  inheritedObservations: f.requirements,
  uncertainty: sourceInventory.uncertainty,
}))
const objects = new Map(s202.objects.map(o => [o.id, o]))
const assertions = new Map(s202.assertions.map(a => [a.id, a]))
const point = ref => Array.isArray(ref) ? ref : objects.get(ref).at
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]]
const near = (a, b) => assert.ok(Math.abs(a - b) <= 1e-9, `${a} != ${b}`)
const length = (a, b) => Math.hypot(...vector(a, b))
assert.equal(objects.size, s202.objects.length)
assert.equal(assertions.size, s202.assertions.length)
assert.deepEqual(s202.display.widths, [331, 342, 640])
for (const group of s202.source.inventory) {
  for (const id of group.objects) assert.ok(objects.has(id), `unmapped object ${id}`)
  for (const id of group.assertions) assert.ok(assertions.has(id), `unmapped assertion ${id}`)
}
for (const id of ['202-media-and-interfaces', '202-thickness', '202-transmission']) {
  assert.deepEqual(s202.source.inventory.find(g => g.id === id), old202.source.inventory.find(g => g.id === id))
}
const rayContract = [
  ['incident-ray', 'incident-start', 'upper-hit', 'incident-normal', -1],
  ['reflected-1', 'upper-hit', 'reflected-1-end', 'reflected-1-normal', 1],
  ['film-forward', 'upper-hit', 'lower-hit', 'film-forward-normal', -1],
  ['film-return', 'lower-hit', 'return-upper', 'film-return-normal', 1],
  ['reflected-2', 'return-upper', 'reflected-2-end', 'reflected-2-normal', 1],
  ['transmitted-ray', 'lower-hit', 'transmitted-end', 'transmission-normal', -1],
]
const rayChecks = []
for (const [id, from, to, normalId, direction] of rayContract) {
  const ray = objects.get(id)
  assert.equal(ray.from, from)
  assert.equal(ray.to, to)
  const old = old202.objects.find(o => o.id === id)
  assert.equal(old.from, from)
  assert.equal(old.to, to)
  assert.ok(s202.assertions.some(a => a.type === 'connects' && a.arrow === id && a.from === from && a.to === to))
  const a = point(from), b = point(to), delta = vector(a, b)
  near(a[0], point('upper-hit')[0])
  near(b[0], a[0])
  assert.equal(Math.sign(delta[1]), direction)
  const normal = assertions.get(normalId)
  assert.equal(normal.type, 'perpendicular')
  assert.deepEqual([normal.a, normal.b], [from, to])
  const surface = vector(point(normal.c), point(normal.d))
  assert.ok(length(point(normal.c), point(normal.d)) > 0)
  near(surface[1], 0)
  near(delta[0] * surface[0] + delta[1] * surface[1], 0)
  rayChecks.push({ id, from, to, a, b, delta, length: length(a, b), connects: true, normalAssertion: normalId, dotProduct: 0, direction: direction > 0 ? 'up' : 'down' })
}
const h = length(point('thickness-upper'), point('thickness-lower'))
assert.ok(h > 0)
near(point('upper-left')[1] - point('lower-left')[1], h)
near(point('upper-hit')[1], point('upper-left')[1])
near(point('lower-hit')[1], point('lower-left')[1])
assert.deepEqual(point('return-upper'), point('upper-hit'))
near(length(point('upper-hit'), point('lower-hit')), h)
near(length(point('lower-hit'), point('return-upper')), h)
near(rayChecks[2].length + rayChecks[3].length, 2 * h)
assert.equal(assertions.get('return-rejoins-upper-hit').type, 'displacement')
assert.deepEqual([assertions.get('return-rejoins-upper-hit').dx, assertions.get('return-rejoins-upper-hit').dy], [0, 0])
for (const id of ['film-forward-equals-thickness', 'film-return-equals-thickness']) assert.equal(assertions.get(id).type, 'equalDistance')
const changedNonRayObjects = []
const oldObjects = new Map(old202.objects.map(o => [o.id, o]))
const allowedChanges = new Set(['incident-start', 'lower-hit', 'return-upper', 'reflected-1-end', 'reflected-2-end', 'transmitted-end', 'reflected-1-label', 'reflected-2-label'])
for (const [id, old] of oldObjects) {
  assert.ok(objects.has(id), `missing old object ${id}`)
  if (JSON.stringify(old) !== JSON.stringify(objects.get(id))) {
    assert.ok(allowedChanges.has(id), `unexpected unchanged-structure edit ${id}`)
    changedNonRayObjects.push(id)
  }
}
const finalRender = selected['fig-202'].render
assert.equal(finalRender.status, 'pass')
assert.deepEqual(finalRender.collisions, [])
assert.equal(finalRender.spec.sha256, selection.figures['fig-202'].spec.sha256)
assert.equal(finalRender.output.svg.sha256, selection.figures['fig-202'].svg.sha256)
const failedFiles = author.genuineTargetedFailure.preserved.map(binding => {
  read(binding.path, binding.sha256)
  return binding
})
const failedSpec = json(failedFiles.find(f => f.path.endsWith('/spec.json')).path)
const failedRender = json(failedFiles.find(f => f.path.endsWith('/fig-202.render.json')).path)
assert.equal(failedRender.status, 'fail')
assert.ok(failedRender.collisions.some(c => c.text === '2'))
const normalizedFailed = structuredClone(failedSpec)
normalizedFailed.objects.find(o => o.id === 'reflected-2-label').at = [330, 285]
assert.deepEqual(normalizedFailed, s202)
const recovery = author.genuineTargetedFailure.recovery
read(recovery.path, recovery.sha256)
const mapping = read(author.figures[1].sourceFactsVersusModernAdditions.path, author.figures[1].sourceFactsVersusModernAdditions.sha256)
write('binding-and-geometry.json', {
  schema: 'd895/affected-independent-binding-and-geometry@1',
  status: 'PASS',
  authority: [...inputs.values()].filter(i => /report\.json$|current-outputs\.json$|current-authoritative-text\.json$/.test(i.path)),
  text: { exactBothSpecs: true, reconstructedEntries: currentText.length, candidates: textBinding.candidates, actualUsages: usages, fullTextReReview: false },
  fig201: { onlyChangedField: '/source/authoritativeText', allOtherSpecFieldsIdentical: true, svgByteIdentical: true, historicalRenderPreservedNotRebound: true, inheritedPass: '/figures/0', visualReplay: false },
  fig202: {
    endpointTopologyUnchanged: true, sourceChecks,
    unchangedInventoryGroups: ['202-media-and-interfaces', '202-thickness', '202-transmission'],
    allOtherOriginalObjectsRetained: true, changedOriginalObjects: changedNonRayObjects,
    normalLegs: rayChecks, filmThickness: h, forwardAndReturnEachEqualH: true, roundTrip: 2 * h,
    lowerReturnExactlyRejoinsUpperInteraction: true,
    assertionsProve: 'Perpendicular to nondegenerate horizontal source interfaces, correct travel directions, the original upper/lower interaction graph, coincident return, and each film journey equal to h. This is the normal-incidence and 2h model required by d858, not merely a renderer-success or object-count claim.',
    sourceGateComposition: 'Reuse d877 source-pixel facts and unchanged structure. The unmeasured source slant and side-by-side separation are deliberately not preserved as final metric geometry; the affected modern model replaces them with coincident normal paths. Source branch identity and medium/thickness ordering are retained, with visible disclosure reviewed separately.',
    additionsNotSourceMeasurements: JSON.parse(mapping),
    nativeEvidence: { render: selection.figures['fig-202'].render, boundToSelectedSpecAndSvg: true, replayed: false },
  },
  failureAndRecovery: { first: failedFiles, firstStatus: failedRender.status, firstCollisions: failedRender.collisions, recovery, soleRecoveryEdit: '/objects/reflected-2-label/at: [330,305] -> [330,285]', geometryAndAssertionsUnchangedDuringLabelRecovery: true, failedOutputSelectedOrViewed: false },
  inheritedUsage: { first: firstUsage, affectedAuthor: authorUsage, countersNotReset: true },
})

const require = createRequire(path.join(R, 'app/package.json'))
const { chromium } = require('@playwright/test')
const postcss = require('postcss')
const runtime = info(require.resolve('playwright/package.json'))
const cssFile = path.join(R, 'app/src/styles/app.css')
const css = postcss.parse(read(cssFile).toString('utf8'), { from: cssFile })
const imports = []
css.walkAtRules('import', rule => { imports.push(rule.params); rule.remove() })
const cssProjection = write('product-css.no-import.css', css.toString())
const display = {
  schema: 'd895/affected-display-observation@1',
  status: 'PASS', widths: [], screenshots: [], errors: [],
  scope: 'Selected final fig202 SVG only, using existing product media classes. No geometry renderer, whole lesson, DB, live route, theme sweep or card acceptance.',
  runtime, headed: true, externalRequestsBlocked: true,
  input: selection.figures['fig-202'], productCss: inputs.get(cssFile), cssProjection, removedImports: imports,
}
const browser = await chromium.launch({ headless: false })
try {
  for (const width of [331, 342, 640]) {
    const page = await browser.newPage({ viewport: width === 640 ? { width: 1440, height: 960 } : { width: 390, height: 844 }, deviceScaleFactor: 1 })
    page.on('pageerror', error => display.errors.push(error.message))
    await page.route('**/*', route => route.abort())
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>html,body{margin:0;background:white}.sr-read{font-size:16px}</style></head><body><main class="sr-read" style="width:${width}px;margin:20px;padding:0"><figure class="sr-read-fig" data-figure-id="fig-202" data-figure-layout="inline"><div class="sr-figure-media" style="width:640px;max-width:100%"><div class="sr-figure-vector">${selected['fig-202'].svg}</div></div></figure></main></body></html>`
    write(`fig-202.${width}.html`, html)
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    const figure = page.locator('figure[data-figure-id="fig-202"]')
    const measurement = await figure.evaluate(element => {
      const svg = element.querySelector('svg')
      const box = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const m = node.getScreenCTM(), r = node.getBoundingClientRect()
        return {
          id: node.dataset.labelId, text: node.textContent,
          actualPx: parseFloat(getComputedStyle(node).fontSize) * Math.min(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d)),
          inside: r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom,
          box: { x: r.x, y: r.y, width: r.width, height: r.height },
        }
      })
      const collisions = labels.flatMap((a, i) => labels.slice(i + 1).flatMap(b =>
        a.box.x < b.box.x + b.box.width && a.box.x + a.box.width > b.box.x &&
        a.box.y < b.box.y + b.box.height && a.box.y + a.box.height > b.box.y ? [[a.id, b.id]] : []))
      const lines = [...svg.querySelectorAll('line')].filter(n => getComputedStyle(n).display !== 'none').map(n => ({
        id: n.id, a: [+n.getAttribute('x1'), +n.getAttribute('y1')], b: [+n.getAttribute('x2'), +n.getAttribute('y2')],
        stroke: getComputedStyle(n).stroke, strokeWidth: parseFloat(getComputedStyle(n).strokeWidth),
      }))
      const geometryClipping = lines.filter(n => [...n.a, ...n.b].some(x => !Number.isFinite(x)) ||
        Math.min(n.a[0], n.b[0]) - n.strokeWidth / 2 < 0 || Math.max(n.a[0], n.b[0]) + n.strokeWidth / 2 > 640 ||
        Math.min(n.a[1], n.b[1]) - n.strokeWidth / 2 < 0 || Math.max(n.a[1], n.b[1]) + n.strokeWidth / 2 > 520)
      return { mediaWidth: element.querySelector('.sr-figure-media').getBoundingClientRect().width,
        svgWidth: box.width, svgHeight: box.height, overflow: element.scrollWidth - element.clientWidth,
        labels, collisions, lines, geometryClipping, minTextPx: Math.min(...labels.map(n => n.actualPx)) }
    })
    near(measurement.mediaWidth, width)
    near(measurement.svgWidth, width)
    assert.equal(measurement.overflow, 0)
    assert.deepEqual(measurement.collisions, [])
    assert.deepEqual(measurement.geometryClipping, [])
    assert.equal(measurement.labels.length, 9)
    assert.ok(measurement.labels.every(n => n.inside && n.actualPx >= 16))
    assert.deepEqual(measurement.labels.map(n => n.text), s202.objects.filter(o => o.type === 'text').map(o => o.text))
    for (const [id] of rayContract) {
      const line = measurement.lines.find(n => n.id === `ld-fig-202_ld-${id}`)
      assert.ok(line, `SVG missing ${id}`)
      near(line.a[0], 275)
      near(line.b[0], 275)
    }
    const screenshot = path.join(D, `fig-202.${width}.png`)
    assert.ok(!fs.existsSync(screenshot))
    await figure.screenshot({ path: screenshot, animations: 'disabled' })
    const pixels = await page.evaluate(async base64 => {
      const image = new Image()
      image.src = `data:image/png;base64,${base64}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width; canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let marks = 0, white = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0 && Math.min(data[i], data[i + 1], data[i + 2]) < 180) marks++
        if (Math.min(data[i], data[i + 1], data[i + 2]) > 240) white++
      }
      return { marks, white, total: image.width * image.height, width: image.width, height: image.height }
    }, fs.readFileSync(screenshot).toString('base64'))
    assert.ok(pixels.marks > 100)
    assert.ok(pixels.white / pixels.total > 0.7)
    display.widths.push({ width, ...measurement, pixels })
    display.screenshots.push({ width, ...info(screenshot), contextInspected: false })
    await page.close()
  }
  assert.deepEqual(display.errors, [])
} catch (error) {
  display.status = 'HOLD'
  display.errors.push(error.stack || String(error))
  process.exitCode = 2
} finally {
  await browser.close()
  write('display-measurements.json', display)
  const preservation = [...inputs.values()].map(binding => ({ ...binding, afterSha256: info(binding.path).sha256, unchanged: info(binding.path).sha256 === binding.sha256 }))
  assert.ok(preservation.every(p => p.unchanged))
  write('input-preservation.json', { status: 'PASS', checked: preservation.length, drift: 0, files: preservation })
  console.log(JSON.stringify({ status: display.status, widths: display.widths.map(w => ({ width: w.width, minTextPx: w.minTextPx, collisions: w.collisions, clipping: w.geometryClipping })), screenshots: display.screenshots, errors: display.errors }, null, 2))
}
