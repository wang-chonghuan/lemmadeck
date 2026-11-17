import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const E = path.dirname(fileURLToPath(import.meta.url))
const T = path.dirname(E)
const W = path.resolve(T, '../../../..')
const G = path.join(T, 'd042-9p-fig302-author/graph')
const F = path.join(G, 'frozen')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: sha(file) })
const manifests = [
  [path.join(G, 'graph-freeze.json'), '4caec30ebf1c12297de02e324304b516c240a64ace140b3c7d78dba151e5a6b1'],
  [path.join(T, 'd042-9p-n134-text-repair/repair-freeze.json'), '9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef'],
  [path.join(T, 'd042-9p-n134-science-affected-review.json'), 'a58a7b6efcb070bb7c20d572ea6480c32cab43bd6980ec127973ca8bd3293e76'],
]
assert.equal(W, '/Users/yong/.codex/worktrees/00b1/lemmadeck')
const bindings = []
function verifyBindings(value, manifest, key = '$') {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    assert(path.isAbsolute(value.path), `Nonabsolute manifest path: ${key}`)
    assert.equal(sha(value.path), value.sha256, `Stale binding: ${value.path}`)
    bindings.push({ manifest, key, ...bind(value.path) })
  }
  for (const [name, child] of Object.entries(value)) {
    verifyBindings(child, manifest, `${key}.${name}`)
  }
}
for (const [file, expected] of manifests) {
  assert.equal(sha(file), expected)
  verifyBindings(read(file), file)
}
const freeze = read(manifests[0][0])
const repair = read(manifests[1][0])
const sci = read(manifests[2][0])
assert.equal(sci.status, 'PASS-AFFECTED-REPAIR')
assert.equal(sci.effectiveSCI, 'PASS')
assert.equal(sci.effectiveZHEN, 'PASS')
assert.equal(sci.repairFreeze.actualSha256, manifests[1][1])
assert.equal(sci.repairFreeze.expectedSha256, manifests[1][1])
assert.equal(freeze.authoritativeTextFreeze.sha256, manifests[1][1])

const specFile = path.join(F, 'fig-302.spec.json')
const renderFile = path.join(F, 'fig-302.render.json')
const svgFile = path.join(F, 'fig-302.svg')
const spec = read(specFile)
const render = read(renderFile)
assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2')
assert.equal(spec.mode, 'deterministic')
assert.equal(spec.source.image.path, path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-302.png'))
assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
assert.equal(render.schema, 'ld-s10y-image/render@2')
assert.equal(render.figure, spec.id)
assert.equal(render.status, 'pass')
assert.equal(path.resolve(F, render.spec.path), specFile)
assert.equal(render.spec.sha256, sha(specFile))
assert.equal(path.resolve(F, render.output.svg.path), svgFile)
assert.equal(render.output.svg.sha256, sha(svgFile))
assert.equal(render.collisions.length, 0)
assert.deepEqual(spec.display.widths, [316, 640])
assert.equal(spec.display.layout, 'inline')
assert.equal(spec.display.purpose, 'instructional')
assert.equal(spec.display.maxWidthPx, 640)
assert(spec.display.minTextPx >= 16)
verifyBindings(spec.source, specFile)

for (const name of ['actualDisplayChecks', 'geometryChecks', 'bytePreservation']) {
  verifyBindings(read(freeze[name].path), freeze[name].path)
}
const actualDisplay = read(freeze.actualDisplayChecks.path)
assert.equal(actualDisplay.status, 'pass')
assert.deepEqual(actualDisplay.observations.map(item => item.width), spec.display.widths)
for (const item of actualDisplay.observations) {
  assert.equal(item.observed.mediaWidth, item.width)
  assert.equal(item.observed.svgWidth, item.width)
  assert.equal(item.observed.minTextPx, item.width === 316 ? 16.7875 : 34)
  assert(item.observed.texts.every(label => label.inside && label.fontPx >= 16))
  assert(!item.observed.horizontalOverflow)
  assert(!item.observed.forbiddenText)
  assert.equal(item.pageErrors.length, 0)
  assert.equal(item.networkRequests.length, 0)
  assert.equal(render.displayChecks.find(check => check.width === item.width).status, 'pass')
}
const expectedText = ['zh', 'en'].flatMap(language => {
  const lesson = read(path.join(G, `context/${language}/lesson.template.json`))
  return [{ lesson: 'phy9-c2-s7-n134', text: lesson.printed_title },
    ...lesson.prose.filter(item => item.text?.trim())
      .map(item => ({ lesson: 'phy9-c2-s7-n134', text: item.text }))]
})
assert.deepEqual(spec.source.authoritativeText, expectedText)
assert.deepEqual(spec.source.inventory, read(freeze.inventory.path))
for (const language of repair.languages) {
  for (const record of language.templates) {
    assert.equal(sha(path.join(G, 'context', language.language, path.basename(record.path))), record.sha256)
  }
  assert.equal(sha(path.join(G, 'context', language.language, 'prose.json')), language.normalizedText.sha256)
  assert.equal(sha(path.join(G, 'context', language.language, 'prose.md')), language.markdown.sha256)
}

const objects = new Map(spec.objects.map(object => [object.id, object]))
const assertions = new Map(spec.assertions.map(item => [item.id, item]))
assert.equal(objects.size, spec.objects.length)
assert.equal(assertions.size, spec.assertions.length)
const at = id => objects.get(id).at
const named = {
  'source-o': [0, 0], 'source-a': [4.6, 3], 'source-a-prime': [-4.6, -3],
  'source-b': [0, 2.3], 'source-b-prime': [0, -2.3],
  'source-c': [-1, 0], 'source-c-prime': [1, 0],
}
for (const [id, position] of Object.entries(named)) assert.deepEqual(at(id), position)
assert.equal(spec.objects.filter(object => object.type === 'axis').length, 1)
assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 6)
assert(!spec.objects.some(object => ['svgPath', 'grid', 'image', 'measure'].includes(object.type)))
assert(spec.objects.filter(object => object.type === 'axis').every(object => !object.ticks))
const edgeRelations = spec.assertions.filter(item => item.type === 'connects')
const edges = spec.objects.filter(object => ['segment', 'arrow'].includes(object.type))
for (const edge of edges) {
  assert(edgeRelations.some(item => item.arrow === edge.id && item.from === edge.from && item.to === edge.to))
}
const branchChecks = []
const sequences = {}
for (const [prefix, start, end, sign, stateOrder, count] of [
  ['source-upper-branch-', 'source-a', 'source-a-prime', -1, ['source-a', 'source-b', 'source-c', 'source-a-prime'], 48],
  ['source-lower-branch-', 'source-a-prime', 'source-a', 1, ['source-a-prime', 'source-b-prime', 'source-c-prime', 'source-a'], 48],
  ['source-initial-branch-', 'source-o', 'source-a', 1, ['source-o', 'source-a'], 32],
]) {
  const branch = spec.objects.filter(object => object.id.startsWith(prefix))
    .sort((a, b) => Number(a.id.slice(prefix.length)) - Number(b.id.slice(prefix.length)))
  assert.equal(branch.length, count)
  assert.equal(branch[0].from, start)
  assert.equal(branch.at(-1).to, end)
  const vertices = [start]
  for (let i = 0; i < branch.length; i++) {
    const edge = branch[i]
    if (i) assert.equal(edge.from, branch[i - 1].to)
    assert(sign * (at(edge.to)[0] - at(edge.from)[0]) > 0)
    assert(sign * (at(edge.to)[1] - at(edge.from)[1]) >= 0)
    vertices.push(edge.to)
  }
  const indices = stateOrder.map(id => vertices.indexOf(id))
  assert(indices.every((index, i) => index >= 0 && (!i || index > indices[i - 1])))
  sequences[prefix] = vertices
  branchChecks.push({ prefix, segmentCount: count, start, end, stateOrder, monotonicDirectionPass: true })
}
const vertices = new Set([...sequences['source-upper-branch-'], ...sequences['source-lower-branch-']])
const symmetry = assertions.get('loop-every-defining-vertex-central-symmetry')
assert.deepEqual(new Set(symmetry.pairs.flatMap(pair => [pair.a, pair.b])), vertices)
for (const pair of symmetry.pairs) {
  assert(Math.abs(at(pair.a)[0] + at(pair.b)[0]) < 1e-8)
  assert(Math.abs(at(pair.a)[1] + at(pair.b)[1]) < 1e-8)
}
const arrows = []
for (const [id, dxSign, dySign] of [
  ['source-upper-leftward-arrow', -1, -1], ['source-left-downward-arrow', -1, -1],
  ['source-lower-rightward-arrow', 1, 1], ['source-right-upward-arrow', 1, 1],
  ['source-initial-upward-rightward-arrow', 1, 1],
]) {
  const object = objects.get(id)
  assert((at(object.to)[0] - at(object.from)[0]) * dxSign > 0)
  assert((at(object.to)[1] - at(object.from)[1]) * dySign > 0)
  arrows.push({ id, directionSigns: [dxSign, dySign], status: 'pass' })
}
const labels = spec.objects.filter(object => object.type === 'text')
assert.deepEqual(labels.map(object => object.text), ['I', 'B', '0', 'o', 'a', 'a\u2032', 'b', 'b\u2032', 'c', 'c\u2032'])

const xml = spawnSync('python3', ['-c', [
  'import json,sys,xml.etree.ElementTree as E',
  'root=E.parse(sys.argv[1]).getroot()',
  'texts=[dict(n.attrib,text="".join(n.itertext())) for n in root.iter() if n.tag.split("}")[-1]=="text"]',
  'print(json.dumps({"attributes":root.attrib,"texts":texts,"foreignObjects":sum(n.tag.split("}")[-1]=="foreignObject" for n in root.iter())}))',
].join('\n'), svgFile], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
assert.equal(xml.status, 0, xml.stderr)
const svgStructure = JSON.parse(xml.stdout)
assert.deepEqual(svgStructure.texts.map(label => label.text), labels.map(label => label.text))
assert.equal(svgStructure.foreignObjects, 0)
assert.equal(svgStructure.attributes.viewBox, '0 0 640 480')
for (const label of svgStructure.texts) {
  assert.equal(label['font-family'], 'Arial, Helvetica, sans-serif')
  assert(label.fill.startsWith('var(--ld-figure-ink,'))
  for (const width of spec.display.widths) {
    assert(Number(label['font-size']) * width / spec.canvas.width >= 16)
  }
}
const native = spawnSync('python3', [
  path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  specFile, '--stage', 'rendered',
], { cwd: F, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
assert.equal(native.status, 0, native.stderr || native.stdout)
const observations = read(path.join(E, 'visual-observations.json'))
assert.equal(observations.imageCount, 3)
assert.equal(observations.source.width, fs.readFileSync(spec.source.image.path).readUInt32BE(16))
assert.equal(observations.source.height, fs.readFileSync(spec.source.image.path).readUInt32BE(20))
for (const image of observations.imageLedger) bindings.push({ manifest: 'independent-image-ledger', key: String(image.open), ...bind(image.path) })
const output = {
  schema: 'ld-s10y-image/independent-mechanical-audit@1',
  figure: 'fig-302', status: 'pass', completedAt: new Date().toISOString(),
  inputManifests: manifests.map(([file]) => bind(file)),
  source: bind(spec.source.image.path), spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  checkedPathShaBindings: bindings.length, bindingFailures: [], bindings,
  nativeValidation: { command: native.spawnargs, cwd: F, exitCode: native.status, stdout: native.stdout, stderr: native.stderr },
  pathResolution: {
    sourceAbsolute: true, sourceEqualsExactCanonical9p: true,
    renderSpecAndOutputRelativeToFrozenDirectory: true,
    resolvedSpec: specFile, resolvedSvg: svgFile,
    nativeReviewMustNormalizeOwnedReferencesToAbsolute: true,
    authorOrCanonicalMetadataEdited: false,
  },
  completeCurrentBilingualTextExact: true, authoritativeTextBlocks: expectedText.length,
  affectedScienceReviewConsumedNotRepeated: true,
  semanticEdgeCount: edges.length, allEdgesHaveConnects: true,
  branchChecks, arrows, loopDefiningVertices: vertices.size,
  completeSymmetryPairCount: symmetry.pairs.length,
  allInventoryGroupsAndAssertionsValidatedNatively: true,
  nativeRenderObjectCount: spec.objects.length, nativeTextRunCount: labels.length,
  actualDisplayEvidence: bind(freeze.actualDisplayChecks.path),
  allDeclaredWidthsCoveredByAuthorRenderAndActualEvidence: true,
  actualDisplayMeasurements: actualDisplay.observations.map(item => ({
    width: item.width, height: item.observed.height, minTransformedFontPx: item.observed.minTextPx,
    everyGlyphBoxInside: item.observed.texts.every(label => label.inside),
    horizontalOverflow: item.observed.horizontalOverflow,
    screenshot: bind(item.screenshot.path),
  })),
  svgStructure,
  visualObservations: bind(path.join(E, 'visual-observations.json')),
  nativeGeometryRerenders: 0, browserLaunches: 0, imageOpensByScript: 0,
  wholeCardDisplay: 'pending', wholeCardApproved: false,
}
const outputFile = path.join(E, 'mechanical-audit.json')
assert(!fs.existsSync(outputFile), `Retain prior evidence: ${outputFile}`)
fs.writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: 'pass', evidence: bind(outputFile), checkedPathShaBindings: bindings.length }))
