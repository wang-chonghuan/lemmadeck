import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d156-n9-crystal-appearance-author')
const outputRoot = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d156/figures')
const runId = `D156-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
const write = (file, value) => {
  assert.ok(file.startsWith(`${evidence}/`) || file.startsWith(`${outputRoot}/fig-13/`) || file.startsWith(`${outputRoot}/fig-14/`))
  assert.ok(!fs.existsSync(file), `Preserve existing output: ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const freezePath = path.join(evidence, 'input-freeze.json')
assert.equal(hash(freezePath), 'e171d8d5193c6cd81d8db9055f7800c626c217b72b095d8115d31887465f82bb')
const input = read(freezePath)
const bound = new Map([[freezePath, binding(freezePath)]])
function verifyBindings(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    const actual = binding(value.path)
    assert.equal(actual.sha256, value.sha256, value.path)
    if (value.bytes !== undefined) assert.equal(actual.bytes, value.bytes, value.path)
    bound.set(value.path, actual)
  }
  for (const child of Object.values(value)) verifyBindings(child)
}
verifyBindings(input)
const contexts = input.contexts.map(item => read(item.path))
for (const context of contexts) {
  verifyBindings(context)
  for (const language of ['zh', 'en']) {
    const edition = read(context.languages[language].binding.path)
    const blocks = edition.prose
      .filter(block => block.kind !== 'fig')
      .map(block => block.text || block.label || '')
      .filter(Boolean)
    assert.deepEqual(edition.prose, context.languages[language].blocks, `${context.figure} ${language} complete approved blocks`)
    assert.equal(blocks.join('\n\n'), context.languages[language].fullText, `${context.figure} ${language} complete approved full text`)
  }
}
write(path.join(evidence, `${runId}.bindings-before.json`), {
  runId, status: 'pass', currentInputs: [...bound.values()],
  fullApprovedText: 'Both languages and both contexts match all non-figure prose/caption blocks in the frozen approved edition templates.'
})
const context = contexts.find(item => item.figure === 'fig-13')
const inventory = read(path.join(evidence, 'fig-13.inventory.json'))
const sourceFirst = read(path.join(evidence, 'source-first.json'))
assert.equal(sourceFirst.observedBeforeDraftOrReuse, true)
assert.equal(inventory.sourceImageSha256, context.sourceImage.sha256)
const coordinate = ([x, y]) => [x, 420 - y]
const objects = inventory.sites.map(site => ({
  id: site.id, type: 'point', at: coordinate(site.at),
  size: site.partial ? 1 : 20,
  strokeWidth: site.partial ? 1 : 2,
  stroke: 'accent', fill: 'accent'
}))
const assertions = []
const groups = []
function connection(id, from, to, dash = 0, strokeWidth = 4) {
  objects.push({ id, type: 'segment', from, to, dash, stroke: 'ink', strokeWidth })
  const assertionId = `${id}-connects`
  assertions.push({ id: assertionId, type: 'connects', arrow: id, from, to })
  return assertionId
}
for (const ring of inventory.rings) {
  const ids = [...ring.perimeter, ring.center]
  const relationships = []
  for (const [index, from] of ring.perimeter.entries()) {
    const edge = `${ring.id}-edge-${index + 1}`
    const spoke = `${ring.id}-spoke-${index + 1}`
    relationships.push(connection(edge, from, ring.perimeter[(index + 1) % 6]))
    relationships.push(connection(spoke, ring.center, from))
    ids.push(edge, spoke)
  }
  groups.push({
    id: `${ring.id}-sites-and-connections`,
    description: `Source ${ring.id} ring: six peripheral sites, one central site, all six perimeter connections and six center spokes. Sampled source projection only; no idealized regularity or physical measurement.`,
    objects: ids, assertions: relationships, requires: ['pointRelationships']
  })
}
const columns = []
for (const column of inventory.longitudinalConnections) columns.push(connection(column.id, column.from, column.to, column.dash))
groups.push({
  id: 'source-longitudinal-connections',
  description: 'All six source peripheral longitudinal connections; back-left and back-right are dashed. Projection columns remain source-sampled, not regularized.',
  objects: inventory.longitudinalConnections.map(column => column.id),
  assertions: columns
})
const sectionObjects = []
const sectionAssertions = []
const section = inventory.middleSection
for (const [index, from] of section.junctions.entries()) {
  const edge = `middle-section-edge-${index + 1}`
  const spoke = `middle-section-spoke-${index + 1}`
  sectionAssertions.push(connection(edge, coordinate(from), coordinate(section.junctions[(index + 1) % 6]), 0, 3))
  sectionAssertions.push(connection(spoke, coordinate(section.center), coordinate(from), 0, 3))
  sectionObjects.push(edge, spoke)
}
groups.push({
  id: 'source-unmarked-middle-section',
  description: section.description,
  objects: sectionObjects, assertions: sectionAssertions
})
const middleSites = inventory.sites.filter(site => site.layer === 'middle')
const middleAssertions = []
for (const [from, to] of [[middleSites[0], middleSites[1]], [middleSites[1], middleSites[2]]]) {
  const id = `${from.id}-to-${to.id}-screen-displacement`
  const a = coordinate(from.at)
  const b = coordinate(to.at)
  assertions.push({ id, type: 'displacement', from: from.id, to: to.id, dx: b[0] - a[0], dy: b[1] - a[1] })
  middleAssertions.push(id)
}
const remnant = inventory.partialSite.silhouetteConstruction
objects.push({
  id: 'middle-right-remnant-arc', type: 'arc',
  center: coordinate(remnant.center), start: coordinate(remnant.start), end: coordinate(remnant.end),
  stroke: 'accent', strokeWidth: 10
})
groups.push({
  id: 'source-three-intermediate-sites',
  description: 'Exactly three intermediate site marks, with the right site represented only by its source-visible left remnant. Its point is anchored within the visible remnant, not at an inferred hidden atom center. Native semicircular arc preserves partial visibility. Source-screen displacement assertions cover all three points; no bond is invented.',
  objects: [...middleSites.map(site => site.id), 'middle-right-remnant-arc'],
  assertions: middleAssertions, requires: ['pointRelationships']
})
assertions.push({ id: 'source-atom-count-17', type: 'objectCount', objectType: 'point', count: 17 })
groups.push({
  id: 'source-total-sites',
  description: 'Seventeen atom-site marks: top seven, intermediate three, bottom seven. Intermediate line junctions are not atom sites.',
  objects: inventory.sites.map(site => site.id), assertions: ['source-atom-count-17', ...middleAssertions, ...assertions.filter(item => item.type === 'connects' && typeof item.from === 'string').map(item => item.id)],
  requires: ['pointRelationships']
})
objects.push({ id: 'modern-magnesium-caption', type: 'text', at: [177, 15], text: 'Magnesium', fontSize: 24, fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-13', mode: 'deterministic',
  description: 'Magnesium atomic-lattice example: preserve the source projected site order, all drawn connections, intermediate unmarked section and partial occlusion. A qualitative structural illustration, with no measured physical 3D dimensions or inferred bonds.',
  source: {
    image: { path: context.durableSourceImage.path, sha256: context.durableSourceImage.sha256 },
    authoritativeText: ['zh', 'en'].map(language => ({ lesson: context.lesson, text: context.languages[language].fullText })),
    inventory: groups
  },
  canvas: { width: 708, height: 840, boundingBox: [0, 420, 354, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  objects, assertions, layout: { minLabelGap: 6 }
}
const specPath = path.join(outputRoot, 'fig-13/fig-13.spec.json')
write(specPath, spec)
write(path.join(outputRoot, 'fig-14/fig-14.mode-hold.json'), {
  batch: 'D156', figure: 'fig-14', status: 'HOLD_APPROVAL_GENERATION_NOT_AUTHORIZED',
  mode: 'generated', display: context.defaultDisplay,
  source: contexts.find(item => item.figure === 'fig-14').sourceImage,
  inventory: sourceFirst.figures['fig-14'],
  approvalRequired: 'Explicit semantic crystal-cluster artwork generation authorization; no deterministic substitute authored.',
  spec: null, selectedOutputs: [], paidCalls: 0, contentRepairs: 0
})
function native(stage, command, args) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: process.env })
  const receipt = {
    schema: 'STEMROBIN-181/D156-native-receipt@1', runId, stage,
    command: [command, ...args], cwd, exitCode: result.status,
    signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    executionError: result.error?.message || null,
    currentSpec: binding(specPath), independentReview: false
  }
  write(path.join(evidence, `${runId}.${stage}.receipt.json`), receipt)
  console.log(JSON.stringify({ runId, stage, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  return result.status === 0
}
const valid = native('validate-01', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft', '--json'])
if (valid) native('render-01', 'node', [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', specPath,
  '--svg', path.join(outputRoot, 'fig-13/fig-13.svg'),
  '--png', path.join(outputRoot, 'fig-13/fig-13.preview.png'),
  '--report', path.join(outputRoot, 'fig-13/fig-13.render.json')
])
for (const prior of bound.values()) assert.equal(hash(prior.path), prior.sha256, `Immutable input changed: ${prior.path}`)
write(path.join(evidence, `${runId}.bindings-after-native.json`), { runId, status: 'pass', currentInputs: [...bound.values()].map(item => binding(item.path)) })
