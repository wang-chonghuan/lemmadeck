import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), ROOT)
const E = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-246249-direction-recovery'
const W = '.tmp/STEMROBIN-181/d1816-d045/n116-246249-direction-recovery'
const PRIOR = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-author/author-freeze.json'
const REVIEW = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-review/report.json'
const TEXT = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-review/affected-text-report.json'
const DRAFT = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-context-repair/current-draft.json'
const R = '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs'
const V = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const OBS = `${E}/source-observations.json`
const WIDTHS = [331, 334, 358, 640]
const IDS = ['fig-246', 'fig-249']
const prior = read(PRIOR)
const draft = read(DRAFT)
const text = read(TEXT)
const observations = read(OBS)
const en = draft.en.join('\n\n')
const zh = draft.zh.join('\n\n')

function read(file) { return JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8')) }
function hash(file) { return digest(fs.readFileSync(path.resolve(ROOT, file))) }
function digest(value) { return crypto.createHash('sha256').update(value).digest('hex') }
function binding(file) { return { path: file, sha256: hash(file) } }
function save(file, data) {
  assert.ok(file.startsWith(`${W}/`) || file.startsWith(`${E}/`), `outside ownership: ${file}`)
  fs.mkdirSync(path.dirname(path.resolve(ROOT, file)), { recursive: true })
  fs.writeFileSync(path.resolve(ROOT, file), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
function original(id) { return prior.figures.find(f => f.id === id) }
function object(s, id) { const o = s.objects.find(o => o.id === id); assert.ok(o, id); return o }
function screen(s, id) { const p = object(s, id).at; return [p[0], s.canvas.height - p[1]] }
function user(s, p) { return [p[0], s.canvas.height - p[1]] }
function addPoint(s, id, p) {
  s.objects.push({ id, type: 'point', at: user(s, p), size: 1, stroke: 'ink', fill: 'ink', strokeWidth: 1 })
  return id
}
function addSegment(s, id, from, to, width = 2.8) {
  s.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: width })
  s.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
}
function displacement(s, group, id, from, to, dx, dy) {
  s.assertions.push({ id, type: 'displacement', from, to, dx, dy, tolerance: 1e-7 })
  group.assertions.push(id)
}
function expectedNeedles(id) {
  // Values below preserve source-relative directions, not inferred magnetic poles.
  return id === 'fig-246' ? [
    { id: 'needle-upper-far-left', dark: 'b', signs: [1, -1] },
    { id: 'needle-upper-middle-left', dark: 'a', signs: [1, 1] },
    { id: 'needle-lower-left', dark: 'b', signs: [1, 1] },
    { id: 'needle-central-gap', dark: 'a', signs: [1, -1] },
    { id: 'needle-lower-right', dark: 'b', signs: [1, -1] },
  ] : [
    { id: 'needle-left-outside', dark: 'b', signs: [1, -1] },
    { id: 'needle-above-coil', dark: 'a', signs: [1, -1] },
    { id: 'needle-upper-right-outside', dark: 'a', signs: [1, -1] },
    { id: 'needle-right-mouth-outside', dark: 'b', signs: [1, 1] },
  ]
}
function verifiedInputBindings() {
  assert.equal(hash(REVIEW), 'e8317a06d67b807dfa6fcd5ef131e6be35ddd19531ea20bbfe20f695d36d5601')
  assert.equal(hash(PRIOR), 'dac01e1bceb252b105af0595a6919ddcb1ebf31eecacb23a7b81926863b547b7')
  assert.equal(text.status, 'PASS')
  assert.equal(hash(DRAFT), text.currentDraft.sha256)
  assert.equal(digest(en), text.contextBindingGate.currentCompleteENSHA256)
  assert.equal(digest(zh), text.contextBindingGate.currentCompleteZHSHA256)
  for (const record of text.records) {
    assert.equal(hash(record.currentTemplate.path), record.currentTemplate.sha256)
    const template = read(record.currentTemplate.path)
    const passages = template.prose.filter(p => p.kind === 'p').map(p => p.text)
    assert.deepEqual(passages.map(t => t.replace(/\s/g, '')), draft[record.locale].map(t => t.replace(/\s/g, '')))
    assert.equal(record.SCI.status, 'PASS')
    assert.equal(record.ZHEN.status, 'PASS')
  }
  assert.equal(hash(R), prior.runtime.renderer.sha256)
  assert.equal(hash(R), hash('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
  assert.equal(hash(V), prior.runtime.validator.sha256)
  const bindings = new Map()
  function collect(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
      assert.equal(hash(value.path), value.sha256, `retained binding drift: ${value.path}`)
      bindings.set(value.path, value.sha256)
    }
    for (const child of Object.values(value)) collect(child)
  }
  collect(prior)
  collect(text)
  collect(observations.imageLedger)
  for (const file of [PRIOR, REVIEW, TEXT, DRAFT, R, V, OBS,
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n117-figure-author/technical-runtime-recovery.json',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/materialize_arrowheads.mjs',
    '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/validate_spec.py']) {
    bindings.set(file, hash(file))
  }
  return [...bindings].map(([file, sha256]) => ({ path: file, sha256 }))
}
function rotateUpperMiddle(s) {
  const id = 'needle-upper-middle-left'
  const c = object(s, `${id}-pivot`).at
  const length = 48
  const u = [.5, .85].map(x => x / Math.hypot(.5, .85))
  const a = c.map((x, i) => x - length * u[i] / 2)
  const b = c.map((x, i) => x + length * u[i] / 2)
  const q = [c[0] - 9 * u[1], c[1] + 9 * u[0]]
  const r = [c[0] + 9 * u[1], c[1] - 9 * u[0]]
  object(s, `${id}-end-a`).at = a
  object(s, `${id}-end-b`).at = b
  object(s, `${id}-half-a`).points = [a, q, c, r]
  object(s, `${id}-half-b`).points = [b, q, c, r]
}
function bindNeedleAssertions(s) {
  for (const n of expectedNeedles(s.id)) {
    const group = s.source.inventory.find(g => g.id === n.id)
    const obs = observations.figures.find(f => f.id === s.id).needles.find(o => o.id === n.id)
    group.description = `Opened source: ${obs.region}; blade axis ${obs.axis}; darker end ${obs.darkEnd}; ${obs.suspension}. No needle pole assignment. Coordinates and blade dimensions are normalized, not source measurements.`
    object(s, `${n.id}-half-a`).fill = n.dark === 'a' ? 'ink' : 'paper'
    object(s, `${n.id}-half-b`).fill = n.dark === 'b' ? 'ink' : 'paper'
    const a = object(s, `${n.id}-end-a`).at
    const b = object(s, `${n.id}-end-b`).at
    const top = object(s, `${n.id}-strand-top`).at
    const center = object(s, `${n.id}-pivot`).at
    displacement(s, group, `${n.id}-source-relative-axis`, `${n.id}-end-a`, `${n.id}-end-b`, b[0] - a[0], b[1] - a[1])
    displacement(s, group, `${n.id}-vertical-suspension`, `${n.id}-pivot`, `${n.id}-strand-top`, 0, top[1] - center[1])
    assert.ok((b[0] - a[0]) * n.signs[0] > 0 && (b[1] - a[1]) * n.signs[1] > 0)
  }
}
function addMagnetRelationships(s) {
  const g = s.source.inventory[0]
  g.description = observations.figures[0].apparatus + ' Five blade/strand pairs remain in their source-relative regions. The original has no needle pole labels or current. Apparatus projection and displaced readable S/N labels are unchanged normalizations.'
  const sp = addPoint(s, 'farther-s-face-center', [152.75, 241.75])
  const np = addPoint(s, 'nearer-n-face-center', [237.25, 327.75])
  const rp = addPoint(s, 'joined-return-anchor', [475, 110])
  g.objects.push(sp, np, rp)
  g.requires = ['pointRelationships']
  displacement(s, g, 's-to-n-face-source-relative-order', sp, np, 84.5, -86)
  displacement(s, g, 'joined-return-above-right-of-s-face', sp, rp, 322.25, 131.75)
  const aggregate = {
    id: 'five-needles-relative-to-magnet',
    description: 'Source-relative location classes and suspensions: far-left, above the farther arm, below-left, clear central gap, below the nearer arm. Normalized offsets are not source measurements.',
    objects: [sp, np, rp], assertions: [], requires: ['pointRelationships'],
  }
  const sourceRegions = [
    ['needle-upper-far-left', sp], ['needle-upper-middle-left', sp],
    ['needle-lower-left', sp], ['needle-central-gap', sp], ['needle-lower-right', np],
  ]
  for (const [needle, anchor] of sourceRegions) {
    const pivot = `${needle}-pivot`
    aggregate.objects.push(pivot)
    const a = object(s, anchor).at
    const b = object(s, pivot).at
    displacement(s, aggregate, `${needle}-apparatus-region`, anchor, pivot, b[0] - a[0], b[1] - a[1])
  }
  displacement(s, aggregate, 'return-region-bound', sp, rp, 322.25, 131.75)
  s.source.inventory.push(aggregate)
}
function pathData(points) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(5)} ${p[1].toFixed(5)}`).join(' ')
}
function repairWinding(s) {
  const project = ([x, y, z]) => [160 + .9 * x + .55 * y, 240 + .067 * x - .2 * y + 1.55 * z]
  const turns = 21
  const radialZ = (.067 * (.55 / .9) + .2) / 1.55
  const viewer = [.55 / .9, -1, -radialZ]
  const samples = turns * 100
  const runs = []
  let run = []
  const visibility = []
  for (let i = 0; i <= samples; i++) {
    const t = Math.PI / 2 + 2 * Math.PI * turns * i / samples
    const x = 300 * i / samples
    const y = 100 * Math.cos(t)
    const z = 100 * Math.sin(t)
    const radial = y + radialZ * z
    // A rear stroke is visible only if its ray exits through the open mouth
    // before reaching the opaque nearer cylindrical wall.
    const sideExit = 2 * radial / (1 + radialZ ** 2)
    const front = radial <= 0
    const throughMouth = !front && x + viewer[0] * sideExit >= 300
    const visible = front || throughMouth
    visibility.push({ sample: i, front, throughMouth, visible })
    if (visible) run.push(project([x, y, z]))
    else if (run.length) { if (run.length > 1) runs.push(run); run = [] }
  }
  if (run.length > 1) runs.push(run)
  object(s, 'continuous-solenoid-winding').d = runs.map(pathData).join(' ')
  const group = s.source.inventory.find(g => g.id === 'solenoid-winding-mouth-and-leads')
  group.description = observations.figures[1].apparatus + ' Winding path now shows only nearer-wall strokes and rear strokes actually visible through the open mouth. Hidden branches remain in the author geometry basis, not as an exposed mesh. Inherited unnumbered drawing sampling is not a measured source turn count.'
  const tangency = Math.atan2(-1, radialZ)
  const topBottom = [tangency, tangency + Math.PI]
  for (let i = 0; i < topBottom.length; i++) {
    const t = topBottom[i]
    const p = x => project([x, 100 * Math.cos(t), 100 * Math.sin(t)])
    const a = addPoint(s, `body-silhouette-${i}-back`, p(0))
    const b = addPoint(s, `body-silhouette-${i}-front`, p(300))
    addSegment(s, `body-silhouette-${i}`, a, b, 3)
    group.objects.push(a, b, `body-silhouette-${i}`)
    group.assertions.push(`body-silhouette-${i}-connects`)
    displacement(s, group, `body-silhouette-${i}-axis-offset`, a, b, 270, -20.1)
  }
  const fullInternal = 'needle-obscured-inside'
  const removed = s.objects.filter(o => o.id.startsWith(`${fullInternal}-`)).map(o => o.id)
  s.objects = s.objects.filter(o => !removed.includes(o.id))
  s.assertions = s.assertions.filter(a => !a.id.startsWith(`${fullInternal}-`))
  s.source.inventory = s.source.inventory.filter(g => g.id !== fullInternal)
  s.objects.push({
    id: 'mouth-partly-obscured-feature',
    type: 'svgPath',
    d: 'M382.5 250 L384 255 L384 263 M384.5 268 L385 276 L386.5 281',
    stroke: 'ink', strokeWidth: 2.3,
  })
  const fragment = addPoint(s, 'mouth-feature-region-anchor', [384.5, 266])
  const center = addPoint(s, 'mouth-center-anchor', [430, 260.1])
  const back = addPoint(s, 'body-back-axis-anchor', [160, 240])
  const apparatusGroup = {
    id: 'coil-axis-mouth-and-probe-regions',
    description: 'Left/back body, open right/front mouth, four separately suspended exterior needles and the narrow partly obscured mouth feature. The partial feature is not assigned a complete blade axis, suspension, current or pole. Source exact internal contour remains HOLD.',
    objects: [fragment, center, back, 'mouth-partly-obscured-feature'],
    assertions: [], requires: ['pointRelationships'],
  }
  displacement(s, apparatusGroup, 'body-to-open-mouth-axis', back, center, 270, -20.1)
  displacement(s, apparatusGroup, 'partial-feature-near-left-mouth-edge', center, fragment, -45.5, -5.9)
  for (const n of expectedNeedles(s.id)) {
    const pivot = `${n.id}-pivot`
    apparatusGroup.objects.push(pivot)
    const a = object(s, center).at
    const b = object(s, pivot).at
    displacement(s, apparatusGroup, `${n.id}-apparatus-region`, center, pivot, b[0] - a[0], b[1] - a[1])
  }
  for (const [from, to, suffix] of [
    ['winding-start', 'lead-left-free-end', 'left-lead-downward'],
    ['winding-end', 'lead-right-free-end', 'right-lead-downward'],
  ]) {
    const a = object(s, from).at
    const b = object(s, to).at
    displacement(s, group, suffix, from, to, b[0] - a[0], b[1] - a[1])
  }
  s.source.inventory.push(apparatusGroup)
  return {
    projection: 'screen=(160+0.9*x+0.55*y,240+0.067*x-0.2*y+1.55*z)',
    opaqueEnvelope: 'y^2+z^2=100^2; 0<=x<=300; x=300 is open',
    viewerDirection: viewer,
    inheritedSamplingTurns: turns,
    sourceMeasuredTurnCount: null,
    windingSamples: samples + 1,
    visibleSamples: visibility.filter(v => v.visible).length,
    hiddenSamples: visibility.filter(v => !v.visible).length,
    visibleRuns: runs.length,
    sampleVisibility: visibility,
    pathObject: 'continuous-solenoid-winding',
    fullWireTopologyRetainedInParametricBasis: true,
    renderedPathContinuity: 'Multiple visible subpaths; hidden rear intervals intentionally absent.',
    removedUnverifiedInternalObjects: removed,
    internalContour: 'HOLD',
    currentOrPolesAssigned: false,
    independentApproval: false,
  }
}
function generate() {
  const protectedBindings = verifiedInputBindings()
  save(`${E}/protected-inputs.json`, { schema: 'STEMROBIN-181/protected-inputs@1', bindings: protectedBindings })
  const changes = []
  for (const id of IDS) {
    const old = read(original(id).final.spec.path)
    const s = structuredClone(old)
    s.source.authoritativeText = [{ lesson: draft.id, text: en }]
    if (id === 'fig-246') {
      rotateUpperMiddle(s)
      addMagnetRelationships(s)
    } else {
      s.description = 'Source-relative four exterior suspended needles around a dense solenoid with two leads and an open front mouth; depth-occluded winding and a neutral partial internal feature. No invented current, poles or complete ambiguous internal needle.'
      save(`${E}/fig-249-geometry-basis.json`, repairWinding(s))
    }
    bindNeedleAssertions(s)
    const changed = s.objects.filter(o => JSON.stringify(o) !== JSON.stringify(old.objects.find(p => p.id === o.id))).map(o => o.id)
    const removed = old.objects.filter(o => !s.objects.some(p => p.id === o.id)).map(o => o.id)
    const cumulative = original(id).contentRepairRounds + 1
    save(`${W}/${id}/round-${cumulative}/spec.json`, s)
    changes.push({ id, previous: original(id).final, priorContentRepairRounds: original(id).contentRepairRounds,
      newContentRepairRounds: 1, cumulativeContentRepairRounds: cumulative, changedObjects: changed, removedObjects: removed,
      currentSpec: binding(`${W}/${id}/round-${cumulative}/spec.json`) })
  }
  save(`${E}/context.json`, {
    schema: 'STEMROBIN-181/bounded-author-recovery-context@1',
    ticket: 'STEMROBIN-181', batch: 'D045', lesson: draft.id, workdir: ROOT,
    role: 'AUTHOR ONLY, not independent reviewer', ownership: [W, E], scope: IDS,
    authorization: 'Active direct human bounded diagnosed local content repair permits the identified Figure 246/249 repairs beyond the earlier counter of one. Counts and failures remain retained; no new permission barrier is inferred.',
    priorAuthorFreeze: binding(PRIOR), originalFirstReview: binding(REVIEW),
    correctedDraft: binding(DRAFT), affectedTextReport: binding(TEXT),
    correctedTemplates: text.records.map(r => r.currentTemplate),
    completeEN: en, completeZH: zh, completeENHash: digest(en), completeZHHash: digest(zh),
    completeLocalesRead: ['en', 'zh'], textChanged: false, templateActivation: 'Parent-owned, not performed',
    sourceObservations: binding(OBS), technicalRecoveryContract: binding('.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    renderer: binding(R), validator: binding(V), rendererCanonicalHashSame: true,
    runtimeInstalledCopiedEdited: false, changes,
    independentReview: false, sourceReviewerWorkDuplicated: false, approved: false,
  })
  console.log(JSON.stringify({ specs: changes.map(c => c.currentSpec), counts: changes.map(c => [c.id, c.priorContentRepairRounds, c.cumulativeContentRepairRounds]) }))
}
function execute(command, args, file) {
  assert.ok(!fs.existsSync(path.resolve(ROOT, file)), `existing receipt: ${file}`)
  const start = new Date().toISOString()
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  save(file, { schema: 'STEMROBIN-181/figure-command-receipt@1', role: 'AUTHOR ONLY', workdir: ROOT,
    command: [command, ...args], startedAt: start, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr })
  return result
}
function run(id) {
  assert.ok(IDS.includes(id))
  const round = original(id).contentRepairRounds + (fs.existsSync(`${E}/construction-marker-repair.json`) ? 2 : 1)
  const p = `${W}/${id}/round-${round}`
  const v = execute('python3', [V, `${p}/spec.json`, '--stage', 'draft', '--json'], `${E}/receipts/${id}-round-${round}-validate.json`)
  console.log(JSON.stringify({ id, stage: 'validate', exitCode: v.status, stdout: v.stdout, stderr: v.stderr }))
  if (v.status !== 0) return
  const r = execute('node', [R, '--spec', `${p}/spec.json`, '--svg', `${p}/${id}.svg`,
    '--png', `${p}/${id}.preview.png`, '--report', `${p}/${id}.render.json`], `${E}/receipts/${id}-round-${round}-render.json`)
  console.log(JSON.stringify({ id, stage: 'render', exitCode: r.status, stdout: r.stdout, stderr: r.stderr }))
}
function geometryCheck(s) {
  const needles = []
  for (const n of expectedNeedles(s.id)) {
    const a = object(s, `${n.id}-end-a`).at
    const b = object(s, `${n.id}-end-b`).at
    const c = object(s, `${n.id}-pivot`).at
    const t = object(s, `${n.id}-strand-top`).at
    assert.ok((b[0] - a[0]) * n.signs[0] > 0)
    assert.ok((b[1] - a[1]) * n.signs[1] > 0)
    assert.equal(t[0], c[0])
    assert.ok(t[1] > c[1])
    for (const end of ['a', 'b']) {
      const half = object(s, `${n.id}-half-${end}`)
      assert.equal(half.fill, end === n.dark ? 'ink' : 'paper')
      assert.deepEqual(half.points[0], object(s, `${n.id}-end-${end}`).at)
      assert.ok(half.points.some(p => JSON.stringify(p) === JSON.stringify(c)))
    }
    needles.push({ id: n.id, darkEndpoint: n.dark, screenDarkEndpoint: screen(s, `${n.id}-end-${n.dark}`),
      axisSourceRelativeSigns: n.signs, suspendedVertically: true, twoToneTipBoundToAxisEndpoint: true })
  }
  assert.equal(s.objects.filter(o => o.id.endsWith('-strand')).length, s.id === 'fig-246' ? 5 : 4)
  assert.equal(s.objects.filter(o => o.id.endsWith('-half-a')).length, s.id === 'fig-246' ? 5 : 4)
  if (s.id === 'fig-246') {
    for (const o of read(original(s.id).final.spec.path).objects.filter(o => o.id.startsWith('magnet-'))) {
      assert.deepEqual(object(s, o.id), o, `unrelated apparatus change ${o.id}`)
    }
    assert.ok(screen(s, 'needle-upper-far-left-pivot')[0] < 143)
    assert.ok(screen(s, 'needle-upper-middle-left-pivot')[1] < 203)
    assert.ok(screen(s, 'needle-lower-left-pivot')[0] < 143 && screen(s, 'needle-lower-left-pivot')[1] > 253)
    assert.ok(screen(s, 'needle-central-gap-pivot')[1] > 253 && screen(s, 'needle-central-gap-pivot')[1] < 327.75)
    assert.ok(screen(s, 'needle-lower-right-pivot')[1] > 367)
    const faceCenter = id => {
      const vertices = object(s, id).points
      return [0, 1].map(axis => vertices.reduce((sum, p) => sum + p[axis], 0) / vertices.length)
    }
    const order = s.assertions.find(a => a.id === 's-to-n-face-source-relative-order')
    assert.deepEqual(order.from, faceCenter('magnet-s-face'))
    assert.deepEqual(order.to, faceCenter('magnet-n-face'))
    const svg = fs.readFileSync(`${W}/${s.id}/round-3/${s.id}.svg`, 'utf8')
    assert.equal((svg.match(/<text\b/g) ?? []).length, 2)
    assert.ok(object(s, 'magnet-s-mark').fontSize === 32 && object(s, 'magnet-n-mark').fontSize === 32)
  } else {
    for (const id of ['open-front-mouth', 'winding-start', 'winding-end', 'lead-left-free-end', 'lead-right-free-end', 'left-wire-lead', 'right-wire-lead']) {
      assert.deepEqual(object(s, id), object(read(original(s.id).final.spec.path), id))
    }
    assert.equal(s.objects.filter(o => o.type === 'arrow' || o.type === 'text').length, 0)
    assert.ok(!s.objects.some(o => o.id.startsWith('needle-obscured-inside-')))
    assert.ok(object(s, 'continuous-solenoid-winding').d.split('M').length > 2)
    assert.ok(screen(s, 'needle-left-outside-pivot')[0] < 105)
    assert.ok(screen(s, 'needle-above-coil-pivot')[1] < 85)
    assert.ok(screen(s, 'needle-upper-right-outside-pivot')[0] > 485)
    assert.ok(screen(s, 'needle-right-mouth-outside-pivot')[0] > 485)
    const at = s.assertions.find(a => a.id === 'partial-feature-near-left-mouth-edge').to
    const p = [at[0], s.canvas.height - at[1]]
    const y = (p[0] - 430) / .55
    const z = (p[1] - 260.1 + .2 * y) / 1.55
    assert.ok(y * y + z * z < 10000)
    const axis = s.assertions.find(a => a.id === 'body-to-open-mouth-axis')
    assert.deepEqual(axis.from, [160, 310])
    assert.deepEqual(axis.to, [430, 289.9])
  }
  return { id: s.id, status: 'PASS-AUTHOR-BOUNDED-GEOMETRY-AND-SHADING-CHECK',
    nativeAssertions: s.assertions.length, needleCount: needles.length, needles,
    sourceMeasurementsClaimed: false, absolutePoleOrCurrentInference: false,
    internalContour: s.id === 'fig-249' ? 'HOLD' : 'not-applicable', independentApproval: false }
}
function repairConstructionMarkers() {
  const context = read(`${E}/context.json`)
  const changes = []
  for (const change of context.changes) {
    const id = change.id
    const firstRound = change.cumulativeContentRepairRounds
    const p = `${W}/${id}/round-${firstRound}`
    const old = read(`${p}/spec.json`)
    const s = structuredClone(old)
    const anchors = new Map(s.objects.filter(o =>
      ['farther-s-face-center', 'nearer-n-face-center', 'joined-return-anchor',
        'mouth-feature-region-anchor', 'mouth-center-anchor', 'body-back-axis-anchor'].includes(o.id)
      || /^body-silhouette-[01]-(back|front)$/.test(o.id)).map(o => [o.id, o.at]))
    for (const o of s.objects) {
      for (const field of ['from', 'to']) if (anchors.has(o[field])) o[field] = anchors.get(o[field])
    }
    for (const a of s.assertions) {
      for (const field of ['from', 'to', 'a', 'b', 'c', 'd', 'point']) {
        if (anchors.has(a[field])) a[field] = anchors.get(a[field])
      }
    }
    s.objects = s.objects.filter(o => !anchors.has(o.id))
    for (const g of s.source.inventory) {
      g.objects = g.objects.filter(id => !anchors.has(id))
      const points = g.objects.filter(id => object(s, id).type === 'point')
      if (g.requires?.includes('pointRelationships') && points.length < 2) delete g.requires
      if (['five-needles-relative-to-magnet', 'coil-axis-mouth-and-probe-regions'].includes(g.id)) {
        for (let i = 1; i < points.length; i++) {
          const a = object(s, points[i - 1]).at
          const b = object(s, points[i]).at
          displacement(s, g, `${g.id}-probe-order-${i}`, points[i - 1], points[i], b[0] - a[0], b[1] - a[1])
        }
      }
    }
    const round = firstRound + 1
    save(`${W}/${id}/round-${round}/spec.json`, s)
    changes.push({
      ...change, newContentRepairRounds: 2, cumulativeContentRepairRounds: round,
      currentSpec: binding(`${W}/${id}/round-${round}/spec.json`),
      firstRecoveryCandidate: {
        spec: binding(`${p}/spec.json`), svg: binding(`${p}/${id}.svg`),
        render: binding(`${p}/${id}.render.json`), bitmap: binding(`${p}/${id}.preview.png`),
        nativeStatus: read(`${p}/${id}.render.json`).status,
        authorVisualStatus: 'FAIL-UNNECESSARY-VISIBLE-CONSTRUCTION-ANCHORS',
      },
      diagnosedAdditionalRepair: 'Only newly introduced visible construction anchor dots are removed. Assertions use coordinate literals bound to unchanged apparatus geometry, plus native pairwise displacements among actual probe pivots. Needle shading, axes, apparatus, winding visibility and partial internal feature are unchanged.',
      removedConstructionAnchors: [...anchors].map(([id, at]) => ({ id, at })),
    })
  }
  save(`${E}/construction-marker-repair.json`, {
    schema: 'STEMROBIN-181/diagnosed-affected-author-repair@1', workdir: ROOT,
    previousContext: binding(`${E}/context.json`), changes,
    countsReset: false, priorNativePassesRetainedButNotSourceApproval: true,
    newContentRepairRoundsById: { 'fig-246': 2, 'fig-249': 2 },
    nativeFailuresDiscarded: false, manualSvgEdits: false, approved: false,
  })
  console.log(JSON.stringify({ changes: changes.map(c => ({ id: c.id, round: c.cumulativeContentRepairRounds, spec: c.currentSpec })) }))
}
function freeze() {
  const context = read(`${E}/context.json`)
  const markerRepair = read(`${E}/construction-marker-repair.json`)
  assert.equal(context.completeENHash, digest(en))
  assert.equal(context.completeZHHash, digest(zh))
  for (const b of read(`${E}/protected-inputs.json`).bindings) assert.equal(hash(b.path), b.sha256, `protected input changed: ${b.path}`)
  const finalObs = read(`${E}/final-observations.json`)
  const ledger = [...observations.imageLedger, ...finalObs.imageLedger]
  assert.ok(ledger.length <= 8)
  for (const entry of ledger) assert.equal(hash(entry.path), entry.sha256)
  const receipts = fs.readdirSync(path.resolve(ROOT, `${E}/receipts`)).sort().map(file => {
    const p = `${E}/receipts/${file}`
    const r = read(p)
    return { ...binding(p), stage: file.endsWith('validate.json') ? 'validate' : 'render', exitCode: r.exitCode, command: r.command }
  })
  const checks = []
  const figures = markerRepair.changes.map(change => {
    const id = change.id
    const round = change.cumulativeContentRepairRounds
    const p = `${W}/${id}/round-${round}`
    const spec = read(`${p}/spec.json`)
    assert.equal(spec.source.authoritativeText[0].text, en)
    assert.deepEqual(spec.display.widths, WIDTHS)
    assert.equal(spec.display.minTextPx, 16)
    checks.push(geometryCheck(spec))
    const render = read(`${p}/${id}.render.json`)
    assert.equal(render.spec.sha256, hash(`${p}/spec.json`))
    assert.equal(render.output.svg.sha256, hash(`${p}/${id}.svg`))
    assert.ok(render.displayChecks.every(c => c.status === 'pass'))
    assert.ok(finalObs.imageLedger.some(l => l.figure === id && l.path === `${p}/${id}.preview.png`))
    return {
      id, role: 'AUTHOR ONLY', status: 'AUTHOR-ONLY-FROZEN-NOT-APPROVED',
      source: spec.source.image, previous: original(id), ...change,
      final: { spec: binding(`${p}/spec.json`), svg: binding(`${p}/${id}.svg`),
        render: binding(`${p}/${id}.render.json`), bitmap: binding(`${p}/${id}.preview.png`) },
      nativeStatus: render.status, displayChecks: render.displayChecks,
      authorBitmapInspected: true, observations: finalObs.figures.find(f => f.id === id),
      independentReviewPerformed: false, sourceFidelityApproved: false, promotable: false,
      unresolvedHolds: id === 'fig-249' ? ['HOLD-EXACT-INTERNAL-CONTOUR', 'Independent affected figure judgment still required'] : ['Independent affected figure judgment still required'],
      contextBinding: 'Complete corrected EN text now bound in this candidate; template activation remains parent-owned.',
    }
  })
  save(`${E}/author-geometry-check.json`, { schema: 'STEMROBIN-181/author-bounded-geometry-check@1', figures: checks,
    windingBasis: binding(`${E}/fig-249-geometry-basis.json`), shadingChecksAreAuthorOnly: true, approved: false })
  const usage = {
    schema: 'STEMROBIN-181/bounded-repair-usage@1', countsReset: false,
    inheritedPriorAuthorUsage: prior.actualUsage, inheritedPriorAuthorUsageReceipt: prior.usageReceipt,
    priorContentRepairRoundsById: { 'fig-246': 1, 'fig-249': 0 },
    newContentRepairRoundsById: { 'fig-246': 2, 'fig-249': 2 },
    cumulativeContentRepairRoundsById: { 'fig-246': 3, 'fig-249': 2 },
    newSpecs: 4, candidateBitmapsAuthored: 4, finalBitmapsAuthored: 2, finalBitmapsActuallyOpened: 2,
    earlierRecoveryCandidateBitmapsOpened: 2,
    sourceImageOpens: 2, sourceReopensWithinThisRepair: 0, existingRawPageOpens: 1,
    imageOpensThisBatch: ledger.length, imageOpensThisContext: ledger.length, imageLedger: ledger,
    externalValidatorAttempts: receipts.filter(r => r.stage === 'validate').length,
    externalValidatorFailures: receipts.filter(r => r.stage === 'validate' && r.exitCode !== 0).length,
    nativeRendererAttempts: receipts.filter(r => r.stage === 'render').length,
    nativeRendererFailures: receipts.filter(r => r.stage === 'render' && r.exitCode !== 0).length,
    nativeInternalDraftValidationCalls: receipts.filter(r => r.stage === 'render').length,
    historicalNativeRendererFailuresRetained: prior.actualUsage.nativeRendererFailures,
    historicalFirstReviewFailuresRetained: binding(REVIEW),
    firstRecoveryAuthorVisualFailures: 2,
    diagnosedVisibleConstructionAnchorCleanupRounds: 2,
    localEditToolFailures: 1,
    localEditToolFailureReceipt: binding(`${E}/edit-tool-failure.json`),
    newTechnicalRecoveries: 0, newTextRepairs: 0, totalExistingAuthorTextRepairRounds: 2,
    textReviewReruns: 0, sourceReviewReruns: 0, independentReviews: 0, approvedFigures: 0,
    paidCalls: 0, modelCalls: 0, spend: 0, cloudOperations: 0, databaseAccess: 0,
    gitOperations: 0, dependencyInstallsOrCopies: 0, runtimeEdits: 0, otherChatOperations: 0,
    childrenCreated: 0, sourceWrites: 0, earlierEvidenceWrites: 0, durableProductWrites: 0,
    indexWrites: 0, meterWrites: 0, templateActivationWrites: 0, manualSvgEdits: 0,
    recordReviewCalls: 0, promotionCalls: 0, passedUnaffectedStagesReplayed: false,
  }
  save(`${E}/author-usage.json`, usage)
  save(`${E}/author-report.json`, {
    schema: 'STEMROBIN-181/bounded-author-recovery-report@1',
    ticket: 'STEMROBIN-181', batch: 'D045', lesson: draft.id, role: 'AUTHOR ONLY',
    status: 'AUTHOR-ONLY-NATIVE-PASS-WITH-INTERNAL-CONTOUR-HOLD-NOT-APPROVED',
    scope: IDS, originalFirstReview: binding(REVIEW), priorAuthorFreeze: binding(PRIOR),
    figures: figures.map(f => ({ id: f.id, nativeStatus: f.nativeStatus, final: f.final,
      geometryAndShading: f.observations, cumulativeContentRepairRounds: f.cumulativeContentRepairRounds,
      unresolvedHolds: f.unresolvedHolds, sourceFidelityApproved: false, promotable: false })),
    authorGeometryCheck: binding(`${E}/author-geometry-check.json`),
    sourceObservations: binding(OBS), finalObservations: binding(`${E}/final-observations.json`),
    correctedENTextSHA256: digest(en), correctedZHTextSHA256: digest(zh),
    unchangedCorrectedTemplates: text.records.map(r => r.currentTemplate),
    usage: binding(`${E}/author-usage.json`), imageOpens: ledger.length,
    internalSourceContourUnresolved: true, independentReviewPerformed: false,
    sourceReviewerWorkDuplicated: false, recordReviewCalls: 0, promotionCalls: 0,
  })
  save(`${E}/author-freeze.json`, {
    schema: 'STEMROBIN-181/figure-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D045',
    book: '9p', lesson: draft.id, frozenAt: new Date().toISOString(), workdir: ROOT,
    role: 'BOUNDED REPAIR AUTHOR ONLY, not independent reviewer',
    status: 'AUTHOR-ONLY-FROZEN-NOT-APPROVED-WITH-INTERNAL-CONTOUR-HOLD',
    scope: IDS, ownership: [W, E], authorBatchComplete: true, approvalComplete: false,
    originalFirstReview: binding(REVIEW), priorAuthorFreeze: binding(PRIOR),
    priorFailuresAndCountsPreserved: true, protectedInputs: binding(`${E}/protected-inputs.json`),
    context: binding(`${E}/context.json`), inventory: binding(OBS),
    observations: binding(`${E}/final-observations.json`), authorGeometryCheck: binding(`${E}/author-geometry-check.json`),
    report: binding(`${E}/author-report.json`), constructionMarkerRepair: binding(`${E}/construction-marker-repair.json`),
    authoritativeText: { draft: binding(DRAFT), affectedTextReport: binding(TEXT),
      correctedTemplates: text.records.map(r => r.currentTemplate),
      completeENHash: digest(en), completeZHHash: digest(zh), completeCorrectedENInEverySpec: true,
      completeZHRead: true, textChanged: false, effectiveSCI: 'PASS-existing-bound-text-only',
      effectiveZHEN: 'PASS-existing-bound-text-only', textReviewReruns: 0, parentTemplateActivationPerformed: false },
    runtime: { renderer: binding(R), validator: binding(V), rendererCanonical: binding('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
      canonicalHashSame: true, installed: false, copied: false, edited: false },
    figures, receipts, actualUsage: usage, usageReceipt: binding(`${E}/author-usage.json`),
    sourceEvidence: observations.imageLedger, geometryBasis: binding(`${E}/fig-249-geometry-basis.json`),
    authorScript: binding(`${E}/author.mjs`),
    allOwnedEvidence: fs.readdirSync(path.resolve(ROOT, E)).filter(f => f.endsWith('.json')).map(f => binding(`${E}/${f}`)),
    independentReview: { performed: false, recordReviewCalled: false, approvalGranted: false, promotionPerformed: false },
    internalSourceContourUnresolved: true, sourceReviewerWorkDuplicated: false,
  })
  console.log(JSON.stringify({ freeze: binding(`${E}/author-freeze.json`),
    figures: figures.map(f => ({ id: f.id, final: f.final, nativeStatus: f.nativeStatus, contentRepairRounds: f.cumulativeContentRepairRounds })),
    imageOpens: ledger.length, internalContourUnresolved: true, approved: false }, null, 2))
}

const [operation, id] = process.argv.slice(2)
if (operation === 'generate') generate()
else if (operation === 'run') run(id)
else if (operation === 'repair-construction-markers') repairConstructionMarkers()
else if (operation === 'freeze') freeze()
else throw new Error('Use generate | run fig-246 | run fig-249 | repair-construction-markers | freeze')
