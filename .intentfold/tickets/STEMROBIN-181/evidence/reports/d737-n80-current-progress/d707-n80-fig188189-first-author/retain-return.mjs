import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d707-n80-fig188189-first-author')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const artifact = name => {
  const p = path.isAbsolute(name) ? name : path.join(own, name)
  return { path: p, sha256: hash(p) }
}
const write = (name, data) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const opened = [
  { path: path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-188.png'), kind: 'original', figure: 'fig-188' },
  { path: path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-189.png'), kind: 'original', figure: 'fig-189' },
  { path: path.join(own, 'fig-188.first.native.png'), kind: 'native-first', figure: 'fig-188' },
  { path: path.join(own, 'fig-189.first.native.png'), kind: 'native-first-failed', figure: 'fig-189' },
  { path: path.join(own, 'fig-189.repaired.native.png'), kind: 'native-sole-repair', figure: 'fig-189' },
  { path: path.join(own, 'fig-188.first.actual-640.png'), kind: 'actual-640', figure: 'fig-188' },
  { path: path.join(own, 'fig-189.repaired.actual-640.png'), kind: 'actual-640', figure: 'fig-189' },
].map(p => ({ ...p, sha256: hash(p.path), opens: 1 }))
const actualCount = opened.reduce((sum, p) => sum + p.opens, 0)
if (actualCount > 8 || actualCount > 24) throw new Error('Image budget exceeded')
write('actual-opens.json', {
  batchCount: 1, currentBatchImages: actualCount, currentContextImages: actualCount,
  maximumBatch: 8, maximumContext: 24, originals: 2, nativeImages: 3,
  actualWidthImages: 2, crops: 0, reopens: 0, opened,
})
write('author-observations.json', {
  scope: 'First-author self-observation only. Not independent record_review, figure approval, or whole-card approval.',
  figures: [
    {
      id: 'fig-188', status: 'AUTHOR-OBSERVATION-PASS',
      evidence: ['fig-188.first.native.png', 'fig-188.first.actual-640.png'].map(artifact),
      notes: 'Original inspected once before inventory. Native and actual 640 px observations show h, phi, d0, ray direction and opposite retinal interval without label overlap. Conventional d0 and small-angle qualifications are bound in the spec text; unaided eye is not labelled relaxed.',
    },
    {
      id: 'fig-189', status: 'AUTHOR-VISUAL-HOLD', contentRepairsUsed: 1,
      evidence: ['fig-189.first.native.png', 'fig-189.repaired.native.png', 'fig-189.repaired.actual-640.png'].map(artifact),
      notes: 'The sole repair fixes first-native phi1 and canvas-edge collisions and adds incident direction arrowheads. Native report passes, but at actual 640 px the F glyph top remains touching the thin dimension line. Native geometry collision detection does not settle this visual defect. No second content repair or further rendering authorized.',
      noFurtherRepair: true,
    },
  ],
  independentReview: false, promoted: false, wholeCardApproved: false,
})
const figures = [
  { id: 'fig-188', attempt: 'first', authorStatus: 'AUTHOR-OBSERVATION-PASS', contentRepairs: 0 },
  { id: 'fig-189', attempt: 'repaired', authorStatus: 'AUTHOR-VISUAL-HOLD', contentRepairs: 1 },
].map(f => {
  const stem = `${f.id}.${f.attempt}`
  const specPath = path.join(own, `${stem}.spec.json`)
  const spec = JSON.parse(fs.readFileSync(specPath))
  const report = JSON.parse(fs.readFileSync(path.join(own, `${stem}.render.json`)))
  return {
    ...f,
    nativeStatus: report.status,
    source: spec.source.image,
    spec: artifact(`${stem}.spec.json`),
    output: artifact(`${stem}.svg`),
    nativeValidation: artifact(`${stem}.validation.json`),
    nativeRender: artifact(`${stem}.render.json`),
    nativeImage: artifact(`${stem}.native.png`),
    actual640Image: artifact(`${stem}.actual-640.png`),
    sourceInventorySha256: crypto.createHash('sha256').update(JSON.stringify(spec.source.inventory)).digest('hex'),
    sourceInventoryHashEncoding: 'UTF-8 JSON.stringify(source.inventory), no trailing newline',
    inventoryGroups: spec.source.inventory.length,
    assertionCount: spec.assertions.length,
    objectCount: spec.objects.length,
    display: spec.display,
    measuredMinTextPxAt640: report.displayChecks.find(c => c.width === 640).measuredMinPx,
  }
})
write('RETURN.json', {
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n80',
  status: 'FIRST-AUTHOR-PARTIAL-HOLD',
  ownedDirectory: own,
  figures,
  rawInventory: artifact('rawinventory.json'),
  frozenSourceRequirements: artifact('preauthor-source-requirements.frozen.json'),
  inputBinding: artifact('input-binding.json'),
  authorObservations: artifact('author-observations.json'),
  actualOpens: artifact('actual-opens.json'),
  actualImageCount: actualCount,
  firstFailureRetained: [
    'fig-189.first-failure.json',
    'fig-189.first.spec.json',
    'fig-189.first.svg',
    'fig-189.first.native.png',
    'fig-189.first.render.json',
    'fig-189.first.render.receipt.json',
    'fig-189.sole-author-repair.json',
  ].map(artifact),
  boundary: {
    independentReviewRecorded: false,
    wholeCardApproved: false,
    promoted: false,
    canonicalWrites: 0,
    toolEdits: 0,
    meterEdits: 0,
    indexWrites: 0,
    gitOperations: 0,
    backendCalls: 0,
    databaseCalls: 0,
    paidCalls: 0,
    generatedImageCalls: 0,
    newAgents: 0,
    worktreeOrBranchOperations: 0,
    fullTestOrBuildRuns: 0,
    otherChatsMessaged: 0,
    passedNativeStagesReplayed: 0,
  },
})
console.log(JSON.stringify({
  return: artifact('RETURN.json'),
  figures: figures.map(f => ({
    id: f.id, nativeStatus: f.nativeStatus, authorStatus: f.authorStatus,
    spec: f.spec, output: f.output, nativeRender: f.nativeRender,
    sourceInventorySha256: f.sourceInventorySha256,
  })),
  rawInventory: artifact('rawinventory.json'), actualImageCount: actualCount,
}, null, 2))
