import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const evidence = path.dirname(fileURLToPath(import.meta.url))
const report = path.join(path.dirname(evidence), 'source-geo68-p68-p69-author.md')
const output = path.join(path.dirname(evidence), 'source-geo68-p68-p69-author-manifest.json')
assert.equal(fs.existsSync(output), false, 'Manifest already exists')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name))
    : [path.join(directory, entry.name)])
const workRoot = path.join(cwd, '.tmp/ld-s10y-lesson/6-8g/pages')
const durableRoot = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages')
const imageLoads = [
  { sequence: 1, path: path.join(workRoot, '0068/page.grid.png'), count: 1, purpose: 'source-grid' },
  { sequence: 2, path: path.join(workRoot, '0069/page.grid.png'), count: 1, purpose: 'source-grid' },
  {
    sequence: 3,
    path: path.join(evidence, 'p0069-literal-formula.png'),
    count: 1,
    purpose: 'literal-formula-detail',
    source: path.join(workRoot, '0069/page.png'),
    sourceCropXYXY: [150, 540, 1300, 735],
  },
  { sequence: 4, path: path.join(workRoot, '0068/figures/fig-80.png'), count: 1, purpose: 'actual-first-finalize-crop' },
].map(image => ({ ...image, ...binding(image.path), detail: 'original', tool: 'functions.view_image' }))
const loaded = new Set(imageLoads.map(image => image.path))
const unviewedImages = [
  ...files(evidence).filter(file => file.endsWith('.png') && !loaded.has(file)),
  path.join(workRoot, '0068/page.png'),
  path.join(workRoot, '0069/page.png'),
].sort().map(file => ({ ...binding(file), imageLoads: 0, status: 'NOT-INDEPENDENTLY-VIEWED' }))
const adjacentUnviewed = ['0067', '0070'].flatMap(id => ['page.grid.png', 'page.png']
  .map(name => ({
    path: path.join(workRoot, id, name),
    imageLoads: 0,
    status: 'NOT-VIEWED-NOT-INSPECTED-FOR-EXISTENCE',
  })))
const pageResults = [68, 69].map(page => {
  const id = String(page).padStart(4, '0')
  const attempt = path.join(evidence, id, 'attempt-01')
  const command = read(path.join(attempt, 'command.json'))
  assert.equal(command.physicalPage, page)
  assert.equal(command.attempt, 1)
  assert.equal(command.exitCode, 0)
  assert.equal(command.p2cSha256, command.p2cSha256After)
  for (const recorded of command.files) assert.equal(sha(recorded.path), recorded.sha256)
  const audit = read(path.join(durableRoot, id, 'audit.json'))
  const pageJson = read(path.join(durableRoot, id, 'page.json'))
  assert.equal(audit.lines_printed, audit.lines_md)
  assert.deepEqual(audit.errors, [])
  assert.deepEqual(audit.normalizations, [])
  assert.deepEqual(audit.count_exclusions, [])
  assert.equal(audit.errata, 0)
  const expectedLines = page === 68 ? 15 : 26
  assert.equal(audit.lines_md, expectedLines)
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    assert.equal(sha(path.join(durableRoot, id, name)), sha(path.join(attempt, 'after/durable', name)))
  }
  const before = read(path.join(attempt, 'before/snapshot.json'))
  assert.equal(before.absent.length, 2)
  const beforeMd = fs.readFileSync(path.join(attempt, 'before/durable/page.md'), 'utf8').split('---', 3)[2]
  const afterMd = fs.readFileSync(path.join(durableRoot, id, 'page.md'), 'utf8').split('---', 3)[2]
  if (page === 69) {
    assert.equal(beforeMd, afterMd, 'p69 body changed during finalize')
  } else {
    assert.equal(beforeMd.replace('box 240,1140,945,475', 'box 250,1144,915,462'), afterMd)
  }
  return {
    physicalPage: page,
    printedPage: pageJson.meta.printed_page,
    status: command.status,
    prepareCountThisBatch: 0,
    priorPrepare: { attempts: 1, exitCode: 0, provenance: 'USER-PROVIDED-PREMISE-NOT-REPLAYED' },
    finalizeAttempts: 1,
    command: binding(path.join(attempt, 'command.json')),
    execution: {
      cwd: command.cwd,
      executable: command.executable,
      argv: command.argv,
      fullArgv: command.fullArgv,
      exitCode: command.exitCode,
      signal: command.signal,
      spawnError: command.spawnError,
      startedAt: command.startedAt,
      finishedAt: command.finishedAt,
      p2cSha256: command.p2cSha256,
      executableSha256: command.executableSha256,
      stdout: binding(path.join(attempt, 'stdout.txt')),
      stderr: binding(path.join(attempt, 'stderr.txt')),
    },
    blocks: pageJson.blocks.length,
    audit,
    proseBodyPreserved: true,
    bodyChange: page === 68 ? 'ONLY-TRUE-FIGURE-SNAPPING-BOX' : 'NONE',
    durable: ['page.md', 'page.json', 'audit.json'].map(name => binding(path.join(durableRoot, id, name))),
    snapshots: {
      beforeAuthor: path.join(evidence, 'before-author', id),
      beforeFinalize: path.join(attempt, 'before'),
      afterFinalize: path.join(attempt, 'after'),
    },
    openAndCont: pageJson.blocks.flatMap((block, index) => block.open || block.cont
      ? [{ ref: `p${id}#${index + 1}`, kind: block.kind, open: block.open, cont: block.cont, lines: block.lines }]
      : []),
  }
})
const previous = path.join(durableRoot, '0067/page.md')
assert.equal(sha(previous), sha(path.join(evidence, 'before-author/p0067-tail-source.page.md')))
const manifest = {
  schema: 'STEMROBIN-184/source-author-manifest@1',
  ticket: 'STEMROBIN-184',
  book: '6-8g',
  physicalPages: [68, 69],
  cwd,
  generatedAt: new Date().toISOString(),
  status: 'AUTHOR-ONLY-FIRST-FINALIZE-COMMAND-SUCCESS-AWAITING-PARENT',
  independentPassGranted: false,
  report: binding(report),
  pageResults,
  previousPage: { ...binding(previous), observation: 'DURABLE-PLAIN-TEXT-ONLY-EX181-CLOSED' },
  newExerciseNumbers: [],
  previousExerciseNumber: 181,
  newChapter: { id: 'geo68-c2', heading: '第二章 图形的合同和位移', physicalPage: 68, printedPage: 58 },
  newSection: { id: 'geo68-c2-s1', heading: '§1. 合同', physicalPage: 68, printedPage: 58 },
  newUnits: [{ id: 'geo68-c2-s1-n15', printedNumber: 15, title: '图形的映射', physicalPage: 68, printedPage: 58, complete: false }],
  boundaries: [
    { kind: 'chapter', before: 'geo68-c1-ex ending at p0067 ex181', after: 'p0068#1 / geo68-c2' },
    { kind: 'paragraph', from: 'p0068#8 open', to: 'p0069#1 cont', closedAt: 'p0069#1' },
    { kind: 'pending-paragraph', from: 'p0069#5 open', nextPhysicalPage: 70, nextPageViewed: false },
  ],
  figure80: {
    id: 'fig-80',
    physicalPage: 68,
    roughBox: [240, 1140, 945, 475],
    finalBox: [250, 1144, 915, 462],
    output: binding(path.join(workRoot, '0068/figures/fig-80.png')),
    actualFinalCropViews: 1,
    sourceInventory: {
      subfigureMarkers: ['а', 'б'],
      left: ['O', 'L', 'L_1', 'A', 'A_1', 'B', 'B_1', 'M', 'M_1', 'X', 'X_1', 'two concentric circles', 'original rays and solid/dashed strokes'],
      right: ['A', 'B', 'O', 'X', 'X_1', 'C', 'D', 'F', 'L', 'L_1', 'circle', 'horizontal diameter AB', 'vertical source segments'],
    },
    independentReview: 'NOT-PERFORMED-AUTHOR-ONLY',
  },
  pendingFigureReferences: [{ figure: '图 81', physicalPage: 69, pixelsViewed: false, sourcePathResolved: false }],
  literalPreservation: {
    sourceWordingPreserved: true,
    variableCorrectionApplied: false,
    confirmedErrataAdded: 0,
    formulaBreaks: [{ physicalPage: 69, ref: 'p0069#2', literal: '$L_1↵=f(L)$', printRows: 2 }],
    arcNotation: '\\smile A_1X_1=f(\\smile AX)',
  },
  images: {
    counts: { batch: 4, context: 4, unique: 4, reopens: 0, sourceGrids: 2, sourceDetailCrops: 1, actualFinalCrops: 1 },
    limits: { batch: 8, context: 24 },
    loaded: imageLoads,
    unviewed: unviewedImages,
    adjacentUnviewed,
  },
  evidenceRoot: evidence,
  evidenceFiles: files(evidence).sort().map(binding),
  forbiddenWorkNotPerformed: ['prepare', 'assemble', 'vectorize', 'adapt', 'publish', 'answer', 'choice', 'git', 'database', 'app', 'dependencies', 'shared-tool-edits', 'other-chat-or-ticket-operations', 'invocation-reinitialization'],
  parentAction: 'Independent source review; do not treat unit15 as complete; continue p70 and verify figure81 from its actual source.',
}
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({
  report: binding(report),
  manifest: binding(output),
  imageLoads: manifest.images.counts,
  unviewedImageFiles: unviewedImages.length,
  adjacentUnviewed: adjacentUnviewed.length,
  pages: pageResults.map(page => ({ physicalPage: page.physicalPage, exitCode: page.execution.exitCode, printed: page.audit.lines_printed, md: page.audit.lines_md })),
}, null, 2))
