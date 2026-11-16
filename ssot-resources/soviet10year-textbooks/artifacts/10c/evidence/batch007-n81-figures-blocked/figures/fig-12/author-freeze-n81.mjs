import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/batch007/10c')
const reportPath = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n81-modern-figures-author.md')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const hashText = s => crypto.createHash('sha256').update(s).digest('hex')
const bind = p => ({ path: path.relative(root, p), sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const outputPath = path.join(base, 'fig-12', 'author-package-hashes.json')
if (fs.existsSync(outputPath)) throw new Error('Already frozen; do not duplicate')
if (fs.readFileSync(reportPath, 'utf8').includes('## Mechanical Freeze Appendix')) throw new Error('Report already appended')

function differences(a, b, at = '$') {
  if (Object.is(a, b)) return []
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return [{ at, initial: a, current: b }]
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(k => differences(a[k], b[k], `${at}.${k}`))
}
const figures = []
for (let number = 12; number <= 20; number++) {
  const id = `fig-${number}`
  const directory = path.join(base, id)
  const currentAttempt = [12, 13, 17].includes(number) ? 'repair' : 'initial'
  const attemptDirectory = path.join(directory, currentAttempt)
  const specPath = path.join(directory, 'spec.json')
  const spec = read(specPath)
  const initialSpec = read(path.join(directory, 'initial', 'spec.json'))
  const currentSpecSnapshot = path.join(attemptDirectory, 'spec.json')
  assert.equal(hash(specPath), hash(currentSpecSnapshot))
  const context = read(path.join(directory, 'context.json'))
  const expected = context.lessons.flatMap(l => [
    { lesson: l.lesson, text: l.title },
    ...l.prose.flatMap(p => p.nearbyText.map(text => ({ lesson: l.lesson, text }))),
    ...l.exercises.map(e => ({ lesson: l.lesson, exercise: e.exercise, text: e.text })),
  ])
  assert.deepEqual(spec.source.authoritativeText, expected)
  assert.equal(hash(path.join(root, spec.source.image.path)), spec.source.image.sha256)
  const changes = differences(initialSpec, spec)
  assert(changes.every(d => /^\$\.objects\.\d+\.at\.[01]$/.test(d.at)))
  assert.equal(changes.length, number === 12 || number === 13 ? 2 : number === 17 ? 1 : 0)
  const initialExecution = read(path.join(directory, 'initial', 'execution.json'))
  const currentExecution = read(path.join(attemptDirectory, 'execution.json'))
  const renderPath = path.join(attemptDirectory, `${id}.render.json`)
  const svgPath = path.join(attemptDirectory, `${id}.svg`)
  const render = read(renderPath)
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(svgPath))
  for (const suffix of ['svg', 'native.png', 'render.json']) {
    assert.equal(hash(path.join(directory, `${id}.${suffix}`)), hash(path.join(attemptDirectory, `${id}.${suffix}`)))
  }
  const sourceLedger = read(path.join(directory, 'author-curve-ledger.json'))
  const curves = []
  const svg = fs.readFileSync(svgPath, 'utf8')
  for (const role of ['solid', 'dashed']) {
    const object = spec.objects.find(o => o.id === `${role}-curve`)
    const l = sourceLedger.curves.find(c => c.role === role)
    assert.equal(hashText(object.d), l.pathSha256)
    assert(svg.includes(`d="${object.d}"`), `${id} ${role}: exact path absent from raw SVG`)
    const [kind, amplitude, omega, phase, lo, hi] = l.formulaTuple
    const f = x => amplitude * Math[kind](omega * x + phase)
    const samples = [...object.d.matchAll(/([ML])(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m => [
      Number(m[2]) + spec.canvas.boundingBox[0],
      spec.canvas.boundingBox[1] - Number(m[3]),
    ])
    assert.equal(samples.length, 3201)
    let maximumFormulaResidual = 0
    let maximumMidpointLinearInterpolationError = 0
    for (let i = 0; i < samples.length; i++) {
      const [x, y] = samples[i]
      maximumFormulaResidual = Math.max(maximumFormulaResidual, Math.abs(y - f(x)))
      if (i) {
        const [px, py] = samples[i - 1]
        assert(x > px)
        maximumMidpointLinearInterpolationError = Math.max(maximumMidpointLinearInterpolationError,
          Math.abs((py + y) / 2 - f((px + x) / 2)))
      }
    }
    assert(maximumFormulaResidual < 1e-7)
    assert(Math.abs(samples[0][0] - lo) < 1e-8 && Math.abs(samples.at(-1)[0] - hi) < 1e-8)
    assert.equal(object.dash || 0, role === 'dashed' ? 2 : 0)
    curves.push({ role, sampleCount: samples.length, pathSha256: hashText(object.d),
      maximumFormulaResidual, maximumMidpointLinearInterpolationError,
      roots: l.roots.length, crests: l.crests.length, troughs: l.troughs.length, finiteEndpoints: l.endpoints,
      endpointsAreAuthorDeclaredNotPixelRecovered: true, exactPathFoundInCurrentSVG: true })
  }
  const displayPath = path.join(attemptDirectory, 'author-display-evidence.json')
  const display = read(displayPath)
  assert.equal(display.bindings.spec.sha256, hash(specPath))
  const neutralEqual = [640, 240].map(width => ({
    width, identicalToOpened358Whole: hash(path.join(attemptDirectory, `${id}.neutral-${width}.whole.png`)) === hash(path.join(attemptDirectory, `${id}.neutral-358.whole.png`)),
  }))
  assert(neutralEqual.every(e => e.identicalToOpened358Whole))
  const pathCheck = {
    schema: 'STEMROBIN-184/author-path-check@1', id, role: 'author numerical check, not independent review',
    current: { spec: bind(specPath), render: bind(renderPath), svg: bind(svgPath), context: bind(path.join(directory, 'context.json')),
      source: bind(path.join(root, spec.source.image.path)), constructionLedger: bind(path.join(directory, 'author-curve-ledger.json')) },
    curves, exactInitialToCurrentSpecDifferences: changes, neutralWholeByteEquality: neutralEqual,
    fullContextExact: true, existingSVGPathFallback: true, noLibraryOrToolkitChange: true,
    limits: 'No native function assertion exists in schema. Literal witness assertions alone do not prove opaque paths; actual complete path was decoded and formula checked. Finite interpolation is explicit. No source endpoint/glyph recovery or semantic review.',
  }
  const pathCheckPath = path.join(directory, 'author-path-check.json')
  fs.writeFileSync(pathCheckPath, `${JSON.stringify(pathCheck, null, 2)}\n`, { flag: 'wx' })
  figures.push({
    id, currentAttempt, initialRender: initialExecution.renderStatus, currentRender: render.status,
    disposition: number === 13 ? 'BLOCKED_SECOND_RENDER_FAIL_EXHAUSTED' : 'AUTHOR_CANDIDATE_PENDING_DALTON',
    renderInvocations: currentAttempt === 'repair' ? 2 : 1, targetedRepairs: currentAttempt === 'repair' ? 1 : 0,
    changes, curves, initialExecution: bind(path.join(directory, 'initial', 'execution.json')),
    currentExecution: bind(path.join(attemptDirectory, 'execution.json')),
    currentSpec: bind(specPath), currentSVG: bind(svgPath), currentRenderReport: bind(renderPath),
    currentNative: bind(path.join(attemptDirectory, `${id}.native.png`)),
    currentDisplayEvidence: bind(displayPath), currentPathCheck: bind(pathCheckPath),
    context: bind(path.join(directory, 'context.json')), source: bind(path.join(root, spec.source.image.path)),
    collisions: render.collisions, display: display.captures.map(c => ({
      width: c.width, theme: c.theme, actualMediaWidth: c.metrics.mediaWidth, minTextPx: c.metrics.minTextPx, scroll: c.metrics.scroll,
      whole: c.wholeMedia, viewportStart: c.viewportStart, viewportEnd: c.viewportEnd,
    })),
    initialCommands: initialExecution.results, repairCommands: currentAttempt === 'repair' ? currentExecution.results : [],
  })
}
function list(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(e => {
    const p = path.join(directory, e.name)
    return e.isDirectory() ? list(p) : [bind(p)]
  })
}
const allRawFiles = figures.flatMap(f => list(path.join(base, f.id)))
const contracts = ['SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md',
  'assets/figure-spec.schema.json', 'scripts/render_spec.mjs', 'scripts/validate_spec.py'].map(p =>
  bind(path.join(root, '.agents/skills/ld-s10y-image', p)))
const frozen = {
  schema: 'STEMROBIN-184/author-package-hashes@1', date: '2026-11-16', role: 'author immutable handoff, not review@1',
  frozenInventory: bind(path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n81-figure-author-source-inventory.md')),
  contracts, figures, allRawFiles,
  counts: { figures: 9, initialRenders: 9, targetedRepairs: 3, totalExplicitValidates: 12, totalRendererInvocations: 12,
    currentRenderPasses: 8, currentRenderFailures: 1, unknownOriginCodepoints: 9,
    rawFilesEnumeratedExcludingThisSelfManifest: allRawFiles.length },
  exclusions: 'Only this self-hashing manifest and the subsequently appended T report excluded from allRawFiles. Original PNG/context bindings and all initial/repair/current output bytes included. No independent semantic approval.',
}
fs.writeFileSync(outputPath, `${JSON.stringify(frozen, null, 2)}\n`, { flag: 'wx' })
const lines = [
  '\n## Mechanical Freeze Appendix\n',
  `Package hash manifest: \`${path.relative(root, outputPath)}\`, SHA256 \`${hash(outputPath)}\`. Enumerated ${allRawFiles.length} raw assigned-package files, excluding only this self-manifest and this final report.`,
  '\n### Current Critical Bindings\n',
  '|Figure|File|SHA256|', '|---|---|---|',
]
for (const f of figures) {
  for (const key of ['context', 'source', 'currentSpec', 'currentSVG', 'currentRenderReport', 'currentNative', 'currentDisplayEvidence', 'currentPathCheck']) {
    const b = f[key]
    lines.push(`|${f.id}|\`${b.path}\`|\`${b.sha256}\`|`)
  }
}
lines.push('\n### Exact Initial To Current Differences\n', '```json', JSON.stringify(figures.map(f => ({ figure: f.id, differences: f.changes })), null, 2), '```')
lines.push('\n### Actual Numerical Path Checks\n', '|Figure/Role|Samples|Roots/Crests/Troughs|Max Formula Residual|Max Midpoint Linear Error|', '|---|---|---|---|---|')
for (const f of figures) for (const c of f.curves) {
  lines.push(`|${f.id}/${c.role}|${c.sampleCount}|${c.roots}/${c.crests}/${c.troughs}|${c.maximumFormulaResidual}|${c.maximumMidpointLinearInterpolationError}|`)
}
lines.push('\n### Exact Official Commands And Exits\n')
for (const f of figures) {
  lines.push(`#### ${f.id}\n`)
  for (const [name, commands] of [['initial', f.initialCommands], ['repair', f.repairCommands]]) {
    if (!commands.length) continue
    lines.push(`\`${name}\`:`, '```text')
    for (const c of commands) lines.push(c.command, `exit=${c.status}; signal=${c.signal}; error=${c.error}; start=${c.start}; end=${c.end}`)
    lines.push('```')
  }
}
lines.push('\n### All Raw Package Hashes\n', '|Path|Bytes|SHA256|', '|---|---|---|')
for (const b of allRawFiles) lines.push(`|\`${b.path}\`|${b.bytes}|\`${b.sha256}\`|`)
lines.push(`|\`${path.relative(root, outputPath)}\`|${fs.statSync(outputPath).size}|\`${hash(outputPath)}\`|`)
fs.appendFileSync(reportPath, `${lines.join('\n')}\n`)
console.log(JSON.stringify({ counts: frozen.counts, report: bind(reportPath), hashManifest: bind(outputPath),
  outcomes: figures.map(f => ({ figure: f.id, render: f.currentRender, disposition: f.disposition, repairs: f.targetedRepairs })) }, null, 2))
