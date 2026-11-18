import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.dirname(fileURLToPath(import.meta.url))
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d604-n76-fig179180-first-modern-author')
const tmp = path.dirname(own)
const output = path.join(own, 'evidence.json')
assert(!fs.existsSync(output), 'Do not overwrite an existing independent evidence run')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const absolute = file => path.resolve(repo, file)
const pin = file => {
  const p = absolute(file)
  const s = fs.statSync(p)
  return { path: p, sha256: sha(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, '0') }
}
const exactPins = [
  [path.join(author, 'report.json'), '3abfa9dae23efe6eaa0f98c2fad701e3a92ea02d25510b4a9c85d10e79ca2c31'],
  [path.join(author, 'author-freeze.json'), '7a4c2fcf243ae4764614ce160c969ba27d1ede08486bb989323e63da62fc731a'],
  [path.join(tmp, 'd598-n76-r08-first-affected-text-review/report.json'), '4a5e5bfdee7093f900968599a2363a571c6f1e66700d0fd03bac195d03e33526'],
  [path.join(own, 'independent-inventories.json'), '5aabd816f546c1a3617913c29e09dc5125f5caf8b52184dad422a14cf810c9ec']
]
for (const [file, hash] of exactPins) assert.equal(sha(file), hash, file)

// Read hash records only; no native validator, renderer, browser, or text review is run.
const manifests = [
  path.join(author, 'author-freeze.json'),
  path.join(tmp, 'd597-n76-r08-first-text-repair/author-freeze.json'),
  path.join(tmp, 'd598-n76-r08-first-affected-text-review/review-freeze.json'),
  path.join(tmp, 'd598-n76-r08-first-affected-text-review/report.json'),
  path.join(tmp, 'd607-n77-first-bilingual-text-author/author-freeze.json')
]
const checked = []
function walk(value, manifest, pointer = '') {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && /^[0-9a-f]{64}$/.test(value.sha256 ?? '')) {
    const file = absolute(value.path)
    assert(!/(^|\/)\.env($|\/)/.test(file), 'Never read secrets')
    const actual = pin(file)
    assert.equal(actual.sha256, value.sha256, `${manifest} ${pointer}: stale hash`)
    if (value.bytes !== undefined) assert.equal(actual.bytes, value.bytes, file)
    if (value.mode !== undefined) assert.equal(actual.mode, value.mode, file)
    checked.push({ manifest, pointer, ...actual })
  }
  for (const [key, child] of Object.entries(value)) walk(child, manifest, `${pointer}/${key}`)
}
for (const file of manifests) walk(load(file), file)
const comparison = load(path.join(own, 'comparison.json'))
const browserReceipt = load(path.join(author, 'native-svg-browser-check.json'))
assert.equal(browserReceipt.sourceSVGBytesUnmodified, true)
assert.equal(browserReceipt.directResvgUsed, false)
assert.equal(browserReceipt.nativeRendererRerunByBrowserCheck, false)
const figures = []
const pointFields = {
  collinear: ['a', 'b', 'c'], parallel: ['a', 'b', 'c', 'd'],
  perpendicular: ['a', 'b', 'c', 'd'], equalDistance: ['a', 'b', 'c', 'd'],
  distance: ['a', 'b'], displacement: ['from', 'to'],
  pointOnLine: ['point', 'a', 'b'], connects: ['from', 'to']
}
const near = (actual, expected) => Math.abs(actual - expected) < 1e-8
for (const item of comparison.figures) {
  const specPath = path.join(author, `${item.id}.repair1.spec.json`)
  const renderPath = path.join(author, `${item.id}.repair1.render.json`)
  const spec = load(specPath)
  const render = load(renderPath)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, sha(specPath))
  for (const record of Object.values(render.output)) assert.equal(sha(absolute(record.path)), record.sha256)
  assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  const assertions = new Map(spec.assertions.map(a => [a.id, a]))
  const p = id => objects.get(id).at
  const sourceMappings = []
  for (const mapping of item.sourceMarkMappings) {
    assert(mapping.objects.every(id => objects.has(id)), mapping.source)
    assert(mapping.assertions.every(id => assertions.has(id)), mapping.source)
    sourceMappings.push({ source: mapping.source, mappedObjects: mapping.objects, mappedAssertions: mapping.assertions, status: 'RESOLVED' })
  }
  const groups = []
  for (const group of spec.source.inventory) {
    assert(group.objects.every(id => objects.has(id)), group.id)
    assert(group.assertions.every(id => assertions.has(id)), group.id)
    const mappedPoints = group.objects.filter(id => objects.get(id).type === 'point')
    const coverage = mappedPoints.map(id => {
      const relations = group.assertions.filter(aid => {
        const a = assertions.get(aid)
        const refs = (pointFields[a.type] ?? []).map(key => a[key]).filter(v => typeof v === 'string' && objects.get(v)?.type === 'point')
        return refs.length >= 2 && refs.includes(id) && refs.every(ref => group.objects.includes(ref))
      })
      if (group.requires?.includes('pointRelationships')) assert(relations.length > 0, `${group.id}: ${id} uncovered`)
      return { point: id, whollyInsideGroupRelationships: relations }
    })
    groups.push({ id: group.id, requires: group.requires, pointCoverage: coverage, status: 'RESOLVED' })
  }
  const displays = browserReceipt.observations.filter(o => o.figure === item.id).map(o => {
    assert(o.collisions.length === 0)
    assert(o.measuredMinPx >= 16)
    assert.equal(o.sourceLabelsMatch, true)
    assert(o.strokes.every(s => !s.missing && s.stroke !== 'none' && s.px > 1))
    assert(o.strokes.every(s => s.expectedDash ? s.dash && s.dash !== 'none' : !s.dash || s.dash === 'none'))
    const result = {
      cssWidth: o.cssWidth, rect: o.rect, transformedMinFontPx: o.measuredMinPx,
      labels: o.texts, collisions: o.collisions,
      strokeStyles: o.strokes.map(s => ({ id: s.id, stroke: s.stroke, px: s.px, dash: s.dash })),
      arrowheadCount: o.arrowheads.length,
      sourceSVGBytesUnmodified: true, inspection: o.cssWidth === 331 ? 'EXISTING-MECHANICAL-NOT-IMAGE-OPENED' : 'INDEPENDENTLY-IMAGE-INSPECTED'
    }
    if (o.screenshot) {
      assert.equal(sha(o.screenshot.path), o.screenshot.sha256)
      const bytes = fs.readFileSync(o.screenshot.path)
      const dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]
      assert.equal(dimensions[0], o.cssWidth)
      result.screenshot = pin(o.screenshot.path)
      result.pngDimensions = dimensions
      result.existingPixelCheck = o.pixelCheck
    }
    return result
  })
  let geometry
  if (item.id === 'fig-179') {
    const d = -p('B')[0], f = p('B1')[0], focal = p('F-right')[0]
    const h = p('A')[1], H = -p('A1')[1]
    const ratios = [H / h, focal / (d - focal), (f - focal) / focal, f / d]
    assert(ratios.every(x => near(x, ratios[0])))
    assert(near(p('C')[1], h) && near(-p('D')[1], H))
    assert(near(1 / d + 1 / f, 1 / focal))
    assert(p('B')[0] < p('F-left')[0] && p('F-left')[0] < 0 && 0 < focal && focal < f)
    assert(spec.objects.filter(o => ['segment', 'arrow'].includes(o.type)).every(o => !o.dash))
    geometry = { kind: 'INDEPENDENT-SOURCE-DERIVED-NUMERIC-CROSSCHECK-NOT-NATIVE-REPLAY', d, f, focal, h, H, n77Ratios: ratios, thinLensResidual: 1 / d + 1 / f - 1 / focal, status: 'CONSISTENT' }
  } else {
    const S = p('S'), B = p('B'), O = p('O'), C = p('C'), F = p('F'), S1 = p('S1')
    const incidentSlope = (B[1] - S[1]) / (B[0] - S[0])
    const secondarySlope = (p('Q')[1] - p('P')[1]) / (p('Q')[0] - p('P')[0])
    const outgoingSlope = (C[1] - B[1]) / (C[0] - B[0])
    assert(near(incidentSlope, secondarySlope))
    assert(near(C[0], F[0]) && F[0] > O[0] && C[1] > F[1])
    assert(near(B[1] + outgoingSlope * (S1[0] - B[0]), 0))
    assert(S1[0] < S[0] && S[0] < O[0] && O[0] - S[0] < F[0] - O[0])
    assert.equal(objects.get('backward-BS1').dash, 2)
    assert.equal(objects.get('focal-plane').dash, 2)
    assert(!objects.get('incident-SB').dash && !objects.get('refracted-BC').dash && !objects.get('secondary-PQ').dash)
    assert(!objects.has('B-Q') && !objects.has('F-left'))
    const d = O[0] - S[0], f = S1[0] - O[0], focal = F[0] - O[0]
    assert(near(1 / d + 1 / f, 1 / focal))
    geometry = { kind: 'INDEPENDENT-SOURCE-DERIVED-NUMERIC-CROSSCHECK-NOT-NATIVE-REPLAY', incidentSlope, secondarySlope, outgoingSlope, outgoingFocalPlaneX: F[0], sharedC: C, d, signedVirtualImageDistance: f, focal, thinLensResidual: 1 / d + 1 / f - 1 / focal, status: 'CONSISTENT' }
  }
  figures.push({ figure: item.id, spec: pin(specPath), render: pin(renderPath), outputs: render.output, sourceMappings, declaredAssertionCount: spec.assertions.length, inventoryGroups: groups, geometry, displays })
}
const evidence = {
  schema: 'STEMROBIN-181/independent-review-evidence@1',
  recordedAtUTC: new Date().toISOString(),
  status: 'PASS-BYTE-BINDINGS-MAPPINGS-AND-SCOPED-DISPLAY',
  exactUserPins: exactPins.map(([file]) => pin(file)),
  manifests: manifests.map(pin), verifiedRecords: checked,
  uniqueVerifiedPaths: new Set(checked.map(r => r.path)).size,
  currentApplicationCSS: pin(path.join(repo, 'app/src/styles/app.css')),
  applicationCSSMatchesCapturedReceipt: sha(path.join(repo, 'app/src/styles/app.css')) === browserReceipt.applicationCSS.sha256,
  browserReceipt: pin(path.join(author, 'native-svg-browser-check.json')),
  nativeToolsRunByReviewer: 0, nativeRendersRunByReviewer: 0,
  textValidatorsRunByReviewer: 0, additionalRepairCount: 0,
  screenshotsCreatedByReviewer: 0, imagePayloadsReturned: 0,
  figures
}
fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ evidence: pin(output), verifiedRecords: checked.length, uniqueVerifiedPaths: evidence.uniqueVerifiedPaths, figures: figures.map(f => ({ id: f.figure, assertions: f.declaredAssertionCount, groups: f.inventoryGroups.length, geometry: f.geometry.status })), CSSCurrent: evidence.applicationCSSMatchesCapturedReceipt }))
