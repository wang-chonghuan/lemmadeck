import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const requestPath = path.join(out, 'request.json')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const request = read(requestPath)
assert.equal(path.resolve(repo, request.writeDirectory), out)
assert.equal(request.repairBudget.maximumAdditionalLocalRepairs, 1)
const resolve = p => path.resolve(repo, p)
const priorPath = resolve(request.priorAuthor)
const prior = read(priorPath)
const old = prior.figures.find(f => f.id === 'fig-124')
const source = resolve(request.source.path)
const contextPath = resolve(request.authoritativeContext)
const cropPath = resolve('.intentfold/tickets/STEMROBIN-181/tmp/d112-n62-source-geometry-review/fig-124-racks-support-crop.png')
const scripts = resolve('.agents/skills/ld-s10y-image/scripts')
const python = resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const write = (name, value) => {
  const target = path.resolve(out, name)
  assert(target.startsWith(`${out}/`), 'Output must stay in the request directory')
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(target)
}
const stem = 'fig-124.repaired'
const specPath = path.join(out, `${stem}.spec.json`)
const inventoryPath = path.join(out, `${stem}.source.inventory.json`)
const svg = path.join(out, `${stem}.svg`)
const png = path.join(out, `${stem}.preview-native-960.png`)
const preview = path.join(out, `${stem}.preview-scroll-640.png`)
const render = path.join(out, `${stem}.render.json`)
const action = process.argv[2]

if (action === 'init') {
  const files = new Map()
  const collect = value => {
    if (Array.isArray(value)) return value.forEach(collect)
    if (!value || typeof value !== 'object') return
    if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
      const p = resolve(value.path)
      assert.equal(hash(p), value.sha256, `Existing binding changed: ${p}`)
      files.set(p, bind(p))
    }
    Object.values(value).forEach(collect)
  }
  collect(prior)
  for (const p of [requestPath, priorPath, contextPath, resolve(request.priorFindings),
    resolve(request.sourceGeometryReview), cropPath,
    resolve('.agents/skills/ld-s10y-image/SKILL.md'),
    resolve('.agents/skills/ld-s10y-image/references/quality-gate.md'),
    resolve('.agents/skills/ld-s10y-image/references/figure-spec.md'),
    path.join(scripts, 'validate_spec.py'), path.join(scripts, 'render_spec.mjs')]) {
    files.set(p, bind(p))
  }
  assert.equal(hash(source), request.source.sha256)
  assert.equal(hash(cropPath), '4c98cc332c971b8cc372ee9dc79811af7cf17914a29f32db3c4a7e9edab1f6da')
  console.log(JSON.stringify(write('inputs-before.json', {
    schema: 'STEMROBIN-181/sole-repair-protected-inputs@1',
    files: [...files.values()], existingFig123AndTextReviewReplayed: false,
    scope: 'All prior-freeze file bindings and actual source/detail inputs; no Git or repository-wide snapshot',
  }), null, 2))
} else if (action === 'build') {
  const startedAt = new Date().toISOString()
  const before = read(path.join(out, 'inputs-before.json'))
  for (const f of before.files) assert.equal(hash(f.path), f.sha256, f.path)
  const spec = read(old.spec.path)
  const original = structuredClone(spec)
  const context = read(contextPath)
  assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
  const removed = new Set(spec.objects.filter(o =>
    o.id.startsWith('visible-rib-fragment-') || o.id === 'central-foreground-occlusion',
  ).map(o => o.id))
  spec.objects = spec.objects.filter(o => !removed.has(o.id))
  spec.assertions = spec.assertions.filter(a => !removed.has(a.arrow))
  spec.source.inventory = spec.source.inventory.filter(g =>
    !['source124-local-rib-fragments', 'source124-central-occlusion'].includes(g.id),
  )
  const newObjects = []
  const newAssertions = []
  const traces = []
  const at = ([x, y]) => [Number((50 + 1.55 * x).toFixed(3)), Number((720 - 1.55 * y).toFixed(3))]
  const trace = (id, points, description, strokeWidth = 2.6) => {
    const ids = []
    for (let i = 1; i < points.length; i++) {
      const objectId = `${id}-${i - 1}`
      const from = at(points[i - 1]), to = at(points[i])
      newObjects.push({ id: objectId, type: 'segment', from, to, stroke: 'ink', strokeWidth })
      newAssertions.push({ id: `${objectId}-connects`, type: 'connects', arrow: objectId, from, to })
      ids.push(objectId)
    }
    traces.push({ id, sourcePixelPolyline: points, description, objects: ids,
      assertions: ids.map(o => `${o}-connects`),
      coordinatesAreAuthorLocalizationNotPhysicalMeasurements: true,
      crossingsAreNotMechanicalJointClaims: true,
    })
  }
  // Localized visible silhouettes only; no automatic tiling or hidden continuation.
  trace('source124-upper-tip-open-diagonal', [[198, 44], [220, 46], [241, 26], [245, 15]],
    'Upper-left open end: short diagonal across the visible end lattice.')
  trace('source124-upper-open-zigzag', [[189, 65], [213, 86], [240, 62], [263, 43], [286, 66]],
    'Visible crossing directions in the clear upper open face; no completion beyond the localized stroke.')
  trace('source124-upper-open-diagonal', [[190, 85], [213, 85], [235, 66], [258, 44]],
    'Separate clear upper-left oblique stroke through open cells.')
  trace('source124-upper-inner-rail', [[193, 62], [212, 83], [236, 107], [260, 131]],
    'Visible upper inner longitudinal stroke; terminates before ambiguous pivot ink.')
  trace('source124-far-edge-upper-zigzag',
    [[261, 15], [246, 40], [282, 35], [264, 61], [305, 58], [285, 85], [327, 78], [307, 108]],
    'Short open triangular/diamond silhouettes alongside the upper far edge, localized individually.')
  trace('source124-far-edge-middle-zigzag',
    [[348, 98], [329, 127], [370, 120], [352, 148], [393, 142], [374, 170],
      [415, 164], [398, 194], [438, 185]],
    'Visible oblique crossings along the middle far edge; no full cell total.')
  trace('source124-far-edge-lower-zigzag',
    [[438, 185], [420, 213], [459, 207], [442, 236], [482, 229],
      [464, 258], [504, 250], [486, 279], [526, 270], [507, 298], [539, 280]],
    'Visible lower far-edge open bracing silhouettes; source-screen localization, not an engineering graph.')
  trace('source124-lower-inner-rail',
    [[317, 179], [339, 202], [360, 225], [382, 246], [405, 269], [429, 292],
      [451, 312], [475, 336], [497, 350]],
    'Unoccluded lower inner longitudinal stroke; no connection through the dense pivot.')
  const curves = [
    [[213, 108], [230, 113], [245, 107], [255, 93], [261, 79], [262, 67]],
    [[235, 131], [252, 137], [271, 126], [285, 110], [289, 97], [285, 83]],
    [[254, 151], [272, 157], [288, 148], [305, 132], [309, 118], [306, 106]],
    [[315, 214], [334, 223], [351, 216], [371, 197], [378, 183], [375, 167]],
    [[337, 237], [357, 245], [376, 234], [394, 215], [399, 200], [394, 189]],
    [[360, 260], [379, 267], [397, 259], [416, 239], [420, 224], [416, 211]],
    [[383, 281], [403, 291], [421, 280], [438, 261], [443, 247], [438, 234]],
    [[405, 304], [426, 311], [443, 303], [460, 283], [466, 268], [461, 256]],
    [[428, 326], [449, 334], [466, 326], [484, 307], [489, 292], [484, 279]],
  ]
  curves.forEach((points, i) => trace(`source124-visible-curve-${i}`, points,
    'Longer curved ink silhouette in one reopened-source rib neighborhood; no far-rail contact or exact rib-total claim.', 3))
  trace('source124-visible-pivot-ink', [[258, 200], [255, 218], [259, 240]],
    'Visible narrow heavy pivot-region stroke replaces no hidden plate or panel.', 9)
  trace('source124-visible-pivot-side-ink', [[269, 192], [265, 216], [267, 242]],
    'Second local heavy stroke with open space between strokes; interior mechanism remains unknown.', 6)
  const overlayAt = spec.objects.findIndex(o => o.id === 'upper-heavy-brace-0')
  assert(overlayAt >= 0)
  spec.objects.splice(overlayAt, 0, ...newObjects)
  spec.assertions.push(...newAssertions)
  spec.source.inventory.push({
    id: 'source124-reopened-visible-local-strokes',
    description: 'Reopened actual PNG and the sole existing 2x nearest-neighbor source crop: individually localized visible oblique crossings, longer curved members, split longitudinal strokes and two narrow pivot ink traces. Approximate silhouette regularization only, not an exact complete lattice, physical dimensions, hidden routing or mechanical joint graph. Dense central-front strokes remain unresolved and omitted rather than completed.',
    objects: newObjects.map(o => o.id), assertions: newAssertions.map(a => a.id),
  })
  spec.description = 'One local repair of the first failed airport radar antenna candidate: longer source-localized open curves and visible oblique strokes replace the empty inclined face; two narrow visible pivot strokes replace the fabricated opaque plate. Dense central-front visible stroke correspondence remains incomplete: AUTHOR HOLD, not a complete instructional illustration or independent approval.'
  for (const o of original.objects.filter(o => !removed.has(o.id))) {
    assert.deepEqual(spec.objects.find(n => n.id === o.id), o, `Out-of-scope object changed: ${o.id}`)
  }
  assert.deepEqual(spec.source.authoritativeText, original.source.authoritativeText)
  assert.deepEqual(spec.canvas, original.canvas)
  assert.deepEqual(spec.display, original.display)
  const inventory = {
    schema: 'STEMROBIN-181/sole-repair-visible-source-inventory@1',
    ticket: request.ticket, card: request.card, role: request.role,
    status: 'AUTHOR-HOLD-PENDING-SINGLE-RENDER',
    source: bind(source), authoritativeContext: bind(contextPath),
    priorSpec: bind(old.spec.path), sourceDetail: bind(cropPath),
    basis: 'Actual full PNG open, failed 640 preview open, one existing source-detail crop open in this fresh context.',
    sourcePixelCoordinates: 'Origin top-left, x right, y down; approximate visible silhouette localization, not new measured givens.',
    groups: spec.source.inventory, newVisibleTraces: traces,
    removedObjects: [...removed],
    retainedObjectsByteValuesUnchanged: true,
    confirmed: [
      'Single inclined open curved/trussed rack, separate lower horizontal rack, heavy braces, central support continuation and low base.',
      'The source has open oblique/curved ink; neither a blank inclined frame nor a solid foreground plate is faithful.',
      'Only the already-counted lower-front local patch has a 3x2 grid assertion.',
      'No labels, measurements, units, angle, exercise or answer are printed inside fig124.',
    ],
    unresolved: [
      'Dense central-front visible ink cannot be assigned to defensible individual complete paths by this author.',
      'Some localized crossing and curve endpoints merge into other ink; no precise contact or complete face topology is asserted.',
      'The low terminal curl and additional tiny diagonal fragments are not reliably separated; no completion is drawn.',
    ],
    notRequired: ['Hidden cells or ribs', 'Mechanical graph of every crossing', 'Invisible joints', 'Engineering dimensions', 'Exact whole-rack counts'],
    opaquePlateRemoved: true, hiddenContinuationAdded: false,
    independentPASSIssued: false, promotable: false,
  }
  const outputBindings = [write(path.basename(specPath), spec), write(path.basename(inventoryPath), inventory)]
  const receipt = write('build.receipt.json', {
    schema: 'STEMROBIN-181/native-figure-command-receipt@1',
    ticket: request.ticket, figure: 'fig-124', role: request.role,
    action: 'one-targeted-spec-repair', command: [process.execPath, fileURLToPath(import.meta.url), 'build'],
    startedAt, finishedAt: new Date().toISOString(), exitCode: 0,
    previousLocalRepairs: 0, localRepairNumber: 1, maximumAdditionalLocalRepairs: 1,
    inputsBefore: [bind(source), bind(old.spec.path), bind(contextPath), bind(cropPath)],
    outputs: outputBindings, mechanicalValidationNotYetRun: true,
  })
  console.log(JSON.stringify({ receipt, outputs: outputBindings }, null, 2))
} else if (['draft', 'render', 'preview640'].includes(action)) {
  const runtime = path.join(out, 'runtime')
  const temp = path.join(runtime, 'tmp')
  fs.mkdirSync(temp, { recursive: true })
  const command = action === 'draft' ? python : action === 'render' ? process.execPath : '/usr/bin/sips'
  const args = action === 'draft'
    ? ['-B', path.join(scripts, 'validate_spec.py'), specPath, '--stage', 'draft', '--json']
    : action === 'render'
      ? [path.join(scripts, 'render_spec.mjs'), '--spec', specPath, '--svg', svg, '--png', png, '--report', render]
      : ['--resampleWidth', '640', png, '--out', preview]
  const targets = action === 'draft' ? [] : action === 'render' ? [svg, png, render] : [preview]
  assert(!fs.existsSync(path.join(out, `${action}.receipt.json`)), 'No second native invocation')
  for (const p of targets) assert(!fs.existsSync(p), `No overwrite: ${p}`)
  const inputs = action === 'preview640' ? [png] : [specPath, source]
  const inputsBefore = inputs.map(bind)
  const environmentOverrides = { PYTHON: python, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp }
  const startedAt = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: runtime, env: { ...process.env, ...environmentOverrides },
    encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  })
  const receipt = write(`${action}.receipt.json`, {
    schema: 'STEMROBIN-181/native-figure-command-receipt@1',
    ticket: request.ticket, figure: 'fig-124', role: request.role,
    command: [command, ...args], cwd: runtime, environmentOverrides,
    startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: result.stdout, stderr: result.stderr,
    inputsBefore, inputsAfter: inputs.map(bind), outputs: targets.filter(fs.existsSync).map(bind),
    localRepairNumber: 1, nativeInvocationForThisAction: 1,
    status: result.status === 0 ? 'PASS-MECHANICAL-ONLY' : 'FAIL-MECHANICAL',
    independentModernApproval: false, imagesOpenedByAgentContext: 0,
  })
  console.log(JSON.stringify({ receipt, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2))
  process.exitCode = result.status === 0 ? 0 : 1
} else {
  throw new Error('Allowed actions: init, build, draft, render, preview640')
}
