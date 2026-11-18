import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const owner = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: path.relative(root, p), sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, value) => {
  const p = path.join(owner, name)
  assert.ok(!fs.existsSync(p))
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n')
  return p
}
const list = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? list(path.join(dir, e.name)) : [path.join(dir, e.name)]).sort()
const opens = read(path.join(owner, 'actual-opens.json'))
assert.equal(opens.helperCumulativeImages, opens.batches.reduce((n, b) => n + b.count, 0))
assert.equal(opens.helperCumulativeImages, 6)
assert.equal(opens.parentCumulativeImages, 24)
assert.ok(opens.batches.every(b => b.count <= 8 && b.images.every(i => i.opens === 1)))
const inputs = read(path.join(owner, 'inputs.json'))
for (const b of [inputs.manifest, inputs.fullZH, inputs.fullEN, ...inputs.contexts.flatMap(c => [c.context, c.source]), ...inputs.tools]) {
  assert.equal(hash(path.join(root, b.path)), b.sha256)
}
const author = read(path.join(owner, 'author-observations.json'))
const source = read(path.join(owner, 'source-observations.json'))
const figures = []
for (const id of ['fig-144', 'fig-145', 'fig-146']) {
  const initial = path.join(owner, id, 'initial')
  const repair = path.join(owner, id, 'repair-1')
  const attempts = [initial, ...(fs.existsSync(repair) ? [repair] : [])].map(dir => {
    const specPath = path.join(dir, 'spec.json')
    const s = read(specPath)
    const receipts = ['validate', 'render'].map(step => ({ step, ...bind(path.join(dir, step + '.receipt.json')), exitCode: read(path.join(dir, step + '.receipt.json')).exitCode }))
    const renderPath = path.join(dir, 'render.json')
    const previewPath = path.join(dir, 'preview-evidence.json')
    const points = new Set(s.objects.filter(o => o.type === 'point').map(o => o.id))
    const coverage = s.source.inventory.map(group => {
      const mapped = new Set(group.objects)
      const mappedPoints = group.objects.filter(p => points.has(p))
      const covered = new Set()
      for (const a of s.assertions.filter(a => group.assertions.includes(a.id))) {
        const refs = Object.values(a).filter(v => typeof v === 'string' && points.has(v))
        if (new Set(refs).size >= 2 && refs.every(r => mapped.has(r))) refs.forEach(r => covered.add(r))
      }
      return { id: group.id, requires: group.requires || [], mappedPointCount: mappedPoints.length, uncoveredPoints: mappedPoints.filter(p => !covered.has(p)), unresolvedObjects: group.objects.filter(p => !s.objects.some(o => o.id === p)), unresolvedAssertions: group.assertions.filter(p => !s.assertions.some(a => a.id === p)) }
    })
    const directed = s.objects.filter(o => o.type === 'arrow')
    assert.ok(directed.every(o => s.assertions.some(a => a.type === 'connects' && a.arrow === o.id && a.from === o.from && a.to === o.to)))
    if (id !== 'fig-145') assert.ok(coverage.every(c => c.uncoveredPoints.length === 0 && c.unresolvedObjects.length === 0 && c.unresolvedAssertions.length === 0))
    return {
      attempt: path.basename(dir), spec: bind(specPath), receipts,
      sourceInventory: s.source.inventory, pointRelationshipCoverage: coverage,
      directedEdgeCount: directed.length, everyDirectedEdgeConnects: true,
      render: fs.existsSync(renderPath) ? { ...bind(renderPath), nativeStatus: read(renderPath).status } : null,
      svg: fs.existsSync(path.join(dir, id + '.svg')) ? bind(path.join(dir, id + '.svg')) : null,
      previews: fs.existsSync(previewPath) ? {
        ...bind(previewPath), nativeStatus: read(previewPath).status,
        widths: read(previewPath).previews.map(p => ({
          width: p.width, screenshot: p.screenshot, measuredMinTextPx: p.measuredMinTextPx,
          status: p.status, actualModelOpens: 1
        }))
      } : null,
      repair: fs.existsSync(path.join(dir, 'sole-repair.json')) ? bind(path.join(dir, 'sole-repair.json')) : null
    }
  })
  const observation = author.figures[id]
  assert.equal(attempts.length - 1, observation.specRepairs)
  assert.ok(observation.specRepairs <= 1)
  figures.push({
    figure: id, status: 'AUTHOR_ONLY', outcome: observation.outcome,
    FIGIndependent: 'HOLD', DISPLAY: 'HOLD', card: 'HOLD',
    source: inputs.contexts.find(c => c.figure === id).source,
    retainedContext: inputs.contexts.find(c => c.figure === id).context,
    pixelInventory: source.figures[id],
    inventoryComplete: source.figures[id].unresolved.length === 0,
    modernTranslationsAndClarifications: source.figures[id].modernClarifications,
    observation, attempts, firstFailurePreserved: true,
    standaloneDraftValidations: attempts.length,
    rendererInvocations: attempts.length,
    internalDraftRevalidations: attempts.length,
    soleRepairCounter: observation.specRepairs,
    previewCaptures: attempts.flatMap(a => a.previews?.widths || []).length,
    stagePromotion: false, selfSCI: false, selfFullFIGPass: false
  })
}
const files = list(owner).map(bind)
const report = save('report.json', {
  schema: 'd405/n70-first-modern-figure-author@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n70', book: '10p',
  status: 'AUTHOR_ONLY', outcome: 'HOLD', figures,
  frozenAt: new Date().toISOString(),
  inputs, sourceObservations: bind(path.join(owner, 'source-observations.json')),
  authorObservations: bind(path.join(owner, 'author-observations.json')),
  actualOpens: { ...bind(path.join(owner, 'actual-opens.json')), helperCumulativeImages: 6, parentCumulativeImages: 24, reopens: 0, crops: 0, noCompactionReset: true, noImagePayloadReturnedToParent: true },
  nativePreviewCommand: bind(path.join(owner, 'preview-native.receipt.json')),
  boundaries: {
    ownedDirectoryOnly: path.relative(root, owner),
    descendantsCreated: 0, permanentChatsCreated: 0, worktreesCreated: 0, branchesCreated: 0,
    gitCommands: 0, DBConnections: 0, DBWrites: 0, paidImageGeneration: 0,
    canonicalEditionWrites: 0, stagePromotion: 0, builds: 0, fullProjectTests: 0,
    nativeLessonFinalization: 0, SCIOrZHENReruns: 0, generatedSVGEdits: 0,
    CUA: 0, headedBrowser: 0, bringToFront: 0, OSInput: 0,
    allBrowserExecutionIsolatedHeadless: true,
    parentImagesRemainPermanently: 24
  },
  gates: { FIGIndependent: 'HOLD', DISPLAY: 'HOLD', card: 'HOLD', SCI: 'existing independent PASS not rerun or recertified', ZHEN: 'existing independent PASS not rerun or recertified' },
  filesChanged: {
    count: files.length + 2,
    paths: [...files.map(f => f.path), path.relative(root, path.join(owner, 'report.json')), path.relative(root, path.join(owner, 'author-freeze.json'))],
    payloadBindings: files,
    selfAndFreezeBindings: 'Report is bound by author-freeze.json; both final hashes are returned externally.'
  },
  freezeContract: { reportMode: '0444', authorFreezeMode: '0444', noPromotion: true }
})
const freeze = save('author-freeze.json', {
  schema: 'd405/author-freeze@1', status: 'AUTHOR_ONLY', outcome: 'HOLD',
  report: bind(report), files: [...files, bind(report)],
  exactFigures: ['fig-144', 'fig-145', 'fig-146'],
  outcomes: figures.map(f => ({ figure: f.figure, status: f.status, outcome: f.outcome, soleRepairCounter: f.soleRepairCounter })),
  helperCumulativeImages: 6, parentCumulativeImages: 24,
  FIGIndependent: 'HOLD', DISPLAY: 'HOLD', card: 'HOLD',
  noFurtherRepairs: true, noImagePayloadReturn: true,
  selfHash: 'external SHA256 returned as text; intentionally not self-referential',
  mode: '0444'
})
for (const p of list(owner)) fs.chmodSync(p, 0o444)
for (const b of read(freeze).files) assert.equal(hash(path.join(root, b.path)), b.sha256)
assert.equal(fs.statSync(report).mode & 0o777, 0o444)
assert.equal(fs.statSync(freeze).mode & 0o777, 0o444)
console.log(JSON.stringify({
  outcomes: figures.map(f => ({ figure: f.figure, status: f.status, outcome: f.outcome, nativeDraft: f.observation.nativeDraft, nativeRender: f.observation.nativeRender, nativePreview: f.observation.nativeActualWidthPreview, repairs: f.soleRepairCounter })),
  filesChangedCount: list(owner).length,
  ownedDirectory: owner, helperCumulativeImages: 6, parentCumulativeImages: 24,
  report: bind(report), freeze: bind(freeze),
  modes: { report: '0444', freeze: '0444' }
}, null, 2))
