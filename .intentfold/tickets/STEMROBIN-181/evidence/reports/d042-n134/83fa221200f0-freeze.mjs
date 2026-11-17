import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const G = path.dirname(fileURLToPath(import.meta.url))
const OLD = path.join(path.dirname(G), 'author-freeze.json')
const R = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d042-9p-n134-text-repair`
const initial = `${G}/initial`
const frozen = `${G}/frozen`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
function writable(file) {
  assert(path.resolve(file).startsWith(`${G}/`))
  assert(!fs.existsSync(file), `Retain existing artifact: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  return file
}
function write(file, value) {
  fs.writeFileSync(writable(file), `${JSON.stringify(value, null, 2)}\n`)
}
const inputBindings = read(`${G}/context/input-bindings.json`)
assert.equal(sha(OLD), 'dbd3ac744e664cd90369852e2754767ca3fe1a7ebc8240e623013a92e1959d57')
assert.equal(sha(`${R}/repair-freeze.json`), '9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef')
assert.equal(sha(inputBindings.source.path), inputBindings.source.sha256)
for (const language of inputBindings.currentText) {
  for (const file of language.files) {
    assert.equal(sha(file.original.path), file.original.sha256)
    assert.equal(sha(file.frozen.path), file.original.sha256)
  }
}
assert.equal(sha(inputBindings.displayTitle.original.path), inputBindings.displayTitle.original.sha256)
const spec = read(`${initial}/fig-302.spec.json`)
const report = read(`${initial}/fig-302.render.json`)
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, sha(`${initial}/fig-302.spec.json`))
assert.equal(report.output.svg.sha256, sha(`${initial}/fig-302.svg`))
assert.equal(read(`${G}/receipts/geometry-coverage.json`).status, 'pass')
assert.equal(read(`${G}/receipts/actual-display-widths.json`).status, 'pass')
for (const name of ['fig-302.spec.json', 'fig-302.svg', 'fig-302.render.json']) {
  fs.copyFileSync(`${initial}/${name}`, writable(`${frozen}/${name}`))
  assert.equal(sha(`${initial}/${name}`), sha(`${frozen}/${name}`))
}
write(`${frozen}/source-inventory.json`, spec.source.inventory)
const validation = spawnSync('python3', [
  `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  'fig-302.spec.json', '--stage', 'rendered', '--json',
], { cwd: frozen, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
write(`${G}/receipts/frozen-native-validation.json`, {
  command: 'python3',
  args: [`${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
    'fig-302.spec.json', '--stage', 'rendered', '--json'],
  cwd: frozen, exitCode: validation.status, stdout: validation.stdout, stderr: validation.stderr,
})
assert.equal(validation.status, 0, validation.stdout + validation.stderr)
const screenshotFiles = [
  `${initial}/fig-302.full.png`,
  `${G}/screenshots/inline-316.png`,
  `${G}/screenshots/inline-640.png`,
]
const pixels = spawnSync(`${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, [
  '-c',
  'from PIL import Image; import sys,json; out=[]\nfor p in sys.argv[1:]:\n im=Image.open(p).convert("RGB"); n=sum(1 for r,g,b in im.getdata() if max(r,g,b)<220); out.append({"path":p,"width":im.width,"height":im.height,"darkPixels":n,"totalPixels":im.width*im.height})\nprint(json.dumps(out))',
  ...screenshotFiles,
], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
assert.equal(pixels.status, 0, pixels.stderr)
const pixelChecks = JSON.parse(pixels.stdout)
assert(pixelChecks.every(image => image.darkPixels > image.totalPixels * 0.005
  && image.darkPixels < image.totalPixels * 0.25))
write(`${G}/receipts/raster-nonblank.json`, {
  status: 'pass', images: pixelChecks,
  proves: 'Output is neither blank nor a black/broken raster; source fidelity is assessed separately.',
})
write(`${G}/author-observations.json`, {
  schema: 'ld-s10y-image/author-observations@1',
  sourceObservationReuse: bind(OLD),
  observations: [
    {
      imageOpen: 1, path: inputBindings.source.path,
      invocation: 'original blocked invocation',
      observation: 'Original independently inspected earlier: single directed hysteresis graph with I/B_0 axes, named opposing states and initial branch; no portrait. Reused unchanged source pixels observation under the user routing correction; no reopen.',
    },
    {
      imageOpen: 2, path: screenshotFiles[0],
      observation: 'Full-resolution native output visibly retains common axes, separate initial branch, closed upper/lower branches, opposing labelled states and all five process arrows. B and its lowered zero are native SVG text; primes are native mathematical glyphs. No added calibrated values, units, cultural text, portrait, clipping or stray location dots.',
    },
    {
      imageOpen: 3, path: screenshotFiles[1],
      observation: 'At actual 316px inline width, the entire graph, all state symbols, subscript zero and all arrowheads remain legible. No label overlap, cropping, black rendering or unintended horizontal scrolling. Mobile text minimum is measured as 16.7875px.',
    },
    {
      imageOpen: 4, path: screenshotFiles[2],
      observation: 'At actual 640px inline width, remanence and opposite coercive crossings remain clear and the initial branch is distinct from both loop branches. The positive/negative cycle follows the inspected source. All text is at least 34px.',
    },
  ],
  imageCount: 4, imageLimit: 8, originalImageOpens: 1, sourceReopens: 0,
  outputImageOpens: 3, sourcePageOpens: 0,
  targetedRepairsUsed: 0, targetedRepairsAllowed: 1,
  classification: 'Author observations only; not independent review or canonical approval.',
})
write(`${G}/receipts/unchanged-output-and-context-binding.json`, {
  status: 'pass',
  nativeRenderInvocations: 1, metadataOnlyRerenders: 0, specRepairs: 0,
  authoritativeTextBoundBeforeFirstRender: true,
  authoritativeTextFreeze: inputBindings.authoritativeTextFreeze,
  initialAndFrozenSpecEqual: sha(`${initial}/fig-302.spec.json`) === sha(`${frozen}/fig-302.spec.json`),
  initialAndFrozenSvgEqual: sha(`${initial}/fig-302.svg`) === sha(`${frozen}/fig-302.svg`),
  initialAndFrozenRenderEqual: sha(`${initial}/fig-302.render.json`) === sha(`${frozen}/fig-302.render.json`),
  specSha256: sha(`${frozen}/fig-302.spec.json`), svgSha256: sha(`${frozen}/fig-302.svg`),
  renderSha256: sha(`${frozen}/fig-302.render.json`),
  reportPaths: { spec: report.spec.path, svg: report.output.svg.path },
  frozenReportPathsResolve: sha(`${frozen}/${report.spec.path}`) === report.spec.sha256
    && sha(`${frozen}/${report.output.svg.path}`) === report.output.svg.sha256,
  previousBlockedFreezeVerbatim: bind(OLD),
  note: 'Current repair text was available before the first spec/render. No post-render text replacement, SVG edit or native rerender was needed; freezing only copies identical bytes and records path/context bindings.',
})
const graphFreeze = {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s7-n134', figure: 'fig-302',
  owner: G, frozenAt: new Date().toISOString(),
  status: 'AUTHOR-GRAPH-NATIVE-RENDER-PASS-CURRENT-REPAIR-TEXT-BOUND-INDEPENDENT-REVIEW-PENDING',
  routingCorrection: {
    from: 'Rejected generated portrait', to: 'deterministic instructional hysteresis graph',
    priorSpecAttempts: 0, priorRenderAttempts: 0,
    authorization: 'User corrected the routing and authorized graph-only authoring under graph/.',
    previousBlockedFreeze: bind(OLD), retainedVerbatim: true,
  },
  source: inputBindings.source,
  sourceObservationReuse: { originalImageOpens: 1, sourceReopens: 0,
    originalObservation: bind(OLD), sufficientForCorrectedGraph: true },
  authoritativeTextFreeze: inputBindings.authoritativeTextFreeze,
  originalTextFreeze: inputBindings.originalTextFreeze,
  textBindingStatus: 'current-repair-freeze-hash-bound',
  textReviewStatus: 'independent-review-pending',
  currentText: inputBindings.currentText,
  displayTitle: inputBindings.displayTitle,
  sourceAuthoritativeText: {
    completeBilingualLessonTextIncluded: true,
    boundIn: 'source.authoritativeText',
    authoritativeBlockCount: spec.source.authoritativeText.length,
    rawIdentityAndDisplaySidecarKeptSeparate: true,
    textRepairsChangedGraphGeometry: false,
    boundBeforeFirstRender: true,
  },
  mode: 'deterministic', display: spec.display,
  outputs: {
    spec: bind(`${frozen}/fig-302.spec.json`),
    svg: bind(`${frozen}/fig-302.svg`),
    render: bind(`${frozen}/fig-302.render.json`),
  },
  inventory: bind(`${frozen}/source-inventory.json`),
  geometryDefinition: bind(`${G}/context/geometry-definition.json`),
  inputBindings: bind(`${G}/context/input-bindings.json`),
  authorObservations: bind(`${G}/author-observations.json`),
  nativeValidation: { status: 'pass', receipt: bind(`${G}/receipts/frozen-native-validation.json`) },
  renderChecks: { status: report.status, collisions: report.collisions,
    objects: report.objects, labels: report.labels, displayChecks: report.displayChecks },
  geometryChecks: bind(`${G}/receipts/geometry-coverage.json`),
  actualDisplayChecks: bind(`${G}/receipts/actual-display-widths.json`),
  rasterChecks: bind(`${G}/receipts/raster-nonblank.json`),
  bytePreservation: bind(`${G}/receipts/unchanged-output-and-context-binding.json`),
  receipts: ['initial-validation', 'initial-render'].map(name => bind(`${G}/receipts/${name}.json`)),
  scripts: ['author.mjs', 'inspect.mjs', 'freeze.mjs'].map(name => bind(`${G}/${name}`)),
  imageCount: 4, imageLimit: 8, sourceImageOpens: 1, sourceReopens: 0,
  outputImageOpens: 3, sourcePageOpens: 0,
  nativeRenderInvocations: 1, metadataOnlyRerenders: 0,
  targetedRepairsUsed: 0, targetedRepairsAllowed: 1,
  svgEdited: false, independentReview: 'pending',
  recordReviewCalled: false, canonicalPromotion: false,
  offlineProductRenderPerformed: false,
  acceptanceScope: 'Native figure authoring and isolated headed 316/640px display evidence only; no app, whole-card, independent-review or publication acceptance claimed.',
  plannedDurableContract: {
    id: 'fig-302', spec: 'figures/fig-302.spec.json', svg: 'figures/fig-302.svg',
    render: 'figures/fig-302.render.json', review: 'figures/fig-302.review.json',
    reviewNotAuthored: true,
  },
}
write(`${G}/graph-freeze.json`, graphFreeze)
assert.equal(sha(OLD), 'dbd3ac744e664cd90369852e2754767ca3fe1a7ebc8240e623013a92e1959d57')
console.log(JSON.stringify({ status: graphFreeze.status,
  graphFreeze: bind(`${G}/graph-freeze.json`), totalImages: graphFreeze.imageCount }))
