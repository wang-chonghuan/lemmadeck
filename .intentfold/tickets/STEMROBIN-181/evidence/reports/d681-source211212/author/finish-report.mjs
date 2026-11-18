import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticketTmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(ticketTmp, 'd668-source211212-first-author')
const reports = path.join(own, 'reports')
const prepared = path.join(ticketTmp, 'd667-source211212-first-preparation/work/10p/pages')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => fs.writeFileSync(
  path.join(reports, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' },
)

assert.deepEqual(fs.readdirSync(path.join(own, 'root/10p/pages')).sort(), ['0211', '0212'])
const native = read(path.join(reports, 'native-summary.json'))
assert.equal(native.firstFailure, null)
assert.equal(native.receipts.length, 4)
for (const receipt of native.receipts) {
  assert.equal(receipt.exitCode, 0)
  assert.equal(hash(receipt.path), receipt.sha256)
}

const images = [
  [path.join(prepared, '0211/page.png'), 'Original physical page 211: text, emphasis and figure inventory before authoring.'],
  [path.join(prepared, '0212/page.png'), 'Original physical page 212: text, emphasis, figure inventory and source unit boundary before authoring.'],
  [path.join(own, 'work/10p/pages/0211/figures/fig-186.png'), 'Actual native crop: both panels, A, rays and labels retained; no caption or adjacent prose.'],
  [path.join(own, 'work/10p/pages/0212/figures/fig-187.png'), 'Actual native crop: all three panels, S_1, S, d, dimension and rays retained; no caption or adjacent prose.'],
].map(([file, observation], index) => ({
  ordinal: index + 1, ...bind(file), tool: 'functions.view_image',
  detail: 'original', observation, authorObservationOnly: true,
}))
write('actual-images.json', {
  actualContextImageOpens: 4, batchLimit: 8, contextLifetimeLimit: 24,
  reopens: 0, svgRasterImagesOpened: 0, childAgents: 0, images,
  note: 'Native machine image decoding is separate from images actually loaded into the author context.',
})

const expectedRows = new Map([[211, 22], [212, 25]])
const pages = []
for (const physicalPage of [211, 212]) {
  const id = String(physicalPage).padStart(4, '0')
  const sourceDir = path.join(own, 'root/10p/pages', id)
  const workDir = path.join(own, 'work/10p/pages', id)
  const source = read(path.join(sourceDir, 'page.json'))
  const audit = read(path.join(sourceDir, 'audit.json'))
  assert.equal(audit.lines_printed, expectedRows.get(physicalPage))
  assert.equal(audit.lines_md, expectedRows.get(physicalPage))
  assert.deepEqual(audit.errors, [])
  assert.deepEqual(audit.normalizations, [])
  assert.equal(hash(path.join(prepared, id, 'page.png')), source.meta.render.sha256)
  let row = 0
  const blocks = source.blocks.map((block, index) => {
    const previousRow = row
    if (block.kind !== 'fig') {
      row += block.lines.length + block.lines.reduce((n, line) => n + (line.match(/↵/g)?.length ?? 0), 0)
      if (block.samerow) row -= block.kind === 'cap' ? block.lines.length : 1
    }
    return {
      blockRef: `p${id}#${index + 1}`, kind: block.kind, label: block.label,
      firstPrintedRow: block.kind === 'fig' ? null : block.samerow ? previousRow : previousRow + 1,
      lastPrintedRow: block.kind === 'fig' ? null : row,
      cont: block.cont, open: block.open, samerow: block.samerow,
      sourcePrintedLines: block.lines, box: block.box,
    }
  })
  assert.equal(row, expectedRows.get(physicalPage))
  const figures = audit.figures.map(figure => ({
    id: figure.id, sourceUnionBox: figure.box, originalCoarseBox: figure.from,
    paddingPx: 12,
    crop: bind(path.join(workDir, 'figures', `${figure.id}.png`)),
    svg: bind(path.join(workDir, 'figures', `${figure.id}.svg`)),
    nativeMismatchPercent: physicalPage === 211 ? 0.004 : 0.009,
    mismatchPrecision: 'As printed by the actual p2c vectorize receipt, not a fabricated full-precision value.',
    nativeLimitPercent: 2,
    visualCropObservation: images.find(image => image.path.endsWith(`${figure.id}.png`)),
    svgVisualOpen: false,
    svgEvidence: 'Actual p2c vectorize self-rasterized and pixel-compared this SVG; see its stdout and receipt.',
  }))
  pages.push({
    physicalPage, printedPage: source.meta.printed_page,
    source: {
      markdown: bind(path.join(sourceDir, 'page.md')),
      json: bind(path.join(sourceDir, 'page.json')),
      audit: bind(path.join(sourceDir, 'audit.json')),
      originalPNG: bind(path.join(prepared, id, 'page.png')),
      grid: bind(path.join(prepared, id, 'page.grid.png')),
      layout: bind(path.join(prepared, id, 'layout.json')),
      template: bind(path.join(prepared, id, 'page.template.md')),
      pixelInventory: bind(path.join(reports, `source-${id}-inventory.md`)),
    },
    lineReconciliation: {
      authorObservedRows: expectedRows.get(physicalPage),
      nativePrintedRows: audit.lines_printed, nativeMarkdownRows: audit.lines_md,
      normalizationCount: audit.normalizations.length, nativeErrors: audit.errors,
      countingOverride: source.meta.counting ?? null,
    },
    originalRows: blocks, figures,
    externalOpenProseTails: [],
    internalContinuation: physicalPage === 212
      ? { from: 'p0212#2', to: 'p0212#5', closesOnPage: true, sharedCaption: 'p0212#4', sharedPrintedRow: 14 }
      : null,
  })
}

const manifestPath = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/manifest.json')
const manifest = read(manifestPath)
const pdfRecord = manifest.pdfs.find(pdf => pdf.book === '10p')
const pdfPath = path.join(repo, manifest.pdfRoot, pdfRecord.file)
assert.equal(hash(pdfPath), pdfRecord.sha256)
const report = {
  schema: 'bounded-source-first-author-report@1',
  ticket: 'STEMROBIN-181', status: 'FIRST_AUTHOR_COMPLETE_NATIVE_PASS_INDEPENDENT_REVIEW_PENDING',
  createdAt: new Date().toISOString(),
  checkout: repo, branch: 'codex/STEMROBIN-181-textbooks',
  branchIdentityEvidence: 'Direct human instruction and local ticket.json; no Git command executed.',
  ownershipRoot: own, physicalPages: [211, 212], printedPages: [201, 202],
  pathResolution: 'The supplied tmp/ batch paths are relative to .intentfold/tickets/STEMROBIN-181/, not checkout root.',
  sourcePDF: bind(pdfPath), sourceManifest: bind(manifestPath),
  officialTOC: bind(path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json')),
  pages,
  boundaries: {
    left: {
      contextOnly: path.join(ticketTmp, 'd663-source210-reconstruction/root/10p/pages/0210/page.json'),
      frozenHash: read(path.join(reports, 'input-bindings.json')).find(item => item.role === 'ending-only-boundary-not-approval').sha256,
      inspected: 'Ending only, not whole page and not image.',
      ending: '因为眼睛的调节有一个限度，叫做**调节近点**.',
      priorParagraphClosed: true, physical211BeginsNewParagraph: true,
      source210ApprovedByThisWork: false,
    },
    pageJoin: 'Physical 211 ends a closed myopia paragraph. Physical 212 starts a new hyperopia paragraph; no cross-page open/cont pair.',
    observedTopic79RightBoundary: {
      tocId: 'phy10-c2-s2-n79', officialPrintedStart: 199,
      lastProseBlock: 'p0212#5', lastProsePrintedRow: 16,
      finalSentence: '因此，明视距离就和正常眼睛一样.',
      before: 'p0212#6', beforePrintedRow: 17, beforePrintedHeading: '80. 放大镜 显微镜',
      headingYRangeFromPreparedLayout: [1446, 1494],
      independentSourceBoundaryApproval: false,
    },
    topic80: {
      tocId: 'phy10-c2-s2-n80', officialPrintedStart: 202,
      headingBlock: 'p0212#6', headingPrintedRow: 17,
      prosePrintedRowsInScope: [18, 24], finalSentenceEnds: '比值.',
      finalProseSentenceClosed: true, fullUnitClosedWithinScope: false,
      nextPhysicalPageNotOpened: true, noCompletionOrApproval: true,
    },
    externalOpenTextTails: [],
    internalOpenContPair: { physicalPage: 212, from: 'p0212#2', to: 'p0212#5', closed: true },
  },
  literalPreservation: {
    policy: 'Source text, emphasis, math and references are transcribed from pixels; no OCR-based text, modernization or source-error correction.',
    retainedExamples: ['调视远点', '调视范围', '可以象正常视力的人', '从图 185 中'],
    page211Emphasis: ['最佳视觉距离', '眼镜', '近视 (split across printed prose rows 14-15)'],
    page212Emphasis: ['远视', '放大镜 (inline; separate unit heading is also bold in print)'],
    pageMath: ['25', 'A', 'd>25'], figureLabelsAndMath: ['а', 'б', 'в', 'A', 'S_1', 'S', 'd'],
    errataRegistered: 0, modernCorrections: 0,
  },
  images: bind(path.join(reports, 'actual-images.json')),
  actualImageOpens: 4, batchImageLimit: 8, contextLifetimeImageLimit: 24,
  native: { ...native, summary: bind(path.join(reports, 'native-summary.json')) },
  inputBindings: bind(path.join(reports, 'input-bindings.json')),
  nativeDiscrepancies: [], firstNativeFailure: null,
  prohibitedStagesNotRun: [
    'prepare or PDF rerender', 'assembly or reindex', 'modernization or adaptation',
    'canonical promotion', 'Git', 'meter/index updates', 'DB/backend',
    'child agents', 'skill edits', 'dependency/package/runtime duplication',
    'approval or card completion',
  ],
  independentGates: { SOURCE_TEXT: 'PENDING', SOURCE_FIGURE: 'PENDING', RAW: 'PENDING', SVG: 'PENDING' },
  sourceApproval: false, cardCompletion: false,
}
write('report.json', report)

function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? files(file) : [file]
  })
}
write('output-manifest.json', {
  ownershipRoot: own,
  files: files(own).map(file => ({
    ...bind(file), symlinkTarget: fs.lstatSync(file).isSymbolicLink() ? fs.readlinkSync(file) : null,
  })),
  note: 'Manifest excludes itself. Prepared originals are referenced through two page.png symlinks, not duplicated.',
})
console.log(JSON.stringify({
  report: bind(path.join(reports, 'report.json')),
  outputManifest: bind(path.join(reports, 'output-manifest.json')),
  actualImageOpens: 4, sourceApproval: false, cardCompletion: false,
}, null, 2))
