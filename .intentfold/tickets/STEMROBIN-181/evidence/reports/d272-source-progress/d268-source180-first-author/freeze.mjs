import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = name => read(path.join(out, name))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const bindings = local('input-bindings.json')
const inheritedBindings = [bindings.manifest, bindings.prepareReceipt, bindings.previousPage, bindings.inherited, ...bindings.sourceFiles]
for (const input of inheritedBindings) assert.equal(hash(input.path), input.sha256)
for (const input of bindings.preparedInputs) {
  assert.equal(hash(input.path), input.sha256)
  assert.equal(hash(path.join(out, input.destination)), input.sha256)
}
for (const previous of bindings.previousFreezes) {
  assert.equal(hash(previous.path), previous.sha256)
  for (const artifact of previous.artifacts) assert.equal(hash(artifact.path), artifact.sha256)
}
const opens = local('actual-opens.json')
assert.equal(opens.budget.inheritedImages, 22)
assert.equal(opens.budget.newImages, 2)
assert.equal(opens.budget.cumulativeContextImages, 24)
assert.equal(opens.opens.length, 2)
assert.deepEqual(opens.opens.map(o => o.ordinalInContext), [23, 24])
assert.equal(new Set(opens.opens.map(o => o.path)).size, 2)
for (const open of opens.opens) {
  assert.equal(hash(open.path), open.sha256)
  assert.equal(open.status, 'ACTUALLY-OBSERVED-ONCE')
}
const folder = path.join(out, 'source/10p/pages/0180')
const data = read(path.join(folder, 'page.json'))
const audit = read(path.join(folder, 'audit.json'))
const receipt = local('native/0180/receipt.json')
assert.equal(receipt.finalizeCalls, 1)
assert.equal(receipt.vectorizeCalls, 1)
assert.equal(receipt.finalizeExitCode, 0)
assert.equal(receipt.vectorizeExitCode, 0)
assert.equal(receipt.reruns, 0)
for (const command of receipt.commands) {
  assert.equal(hash(command.stdout.path), command.stdout.sha256)
  assert.equal(hash(command.stderr.path), command.stderr.sha256)
}
assert.equal(hash(receipt.authoredBeforeFinalize.path), receipt.authoredBeforeFinalize.sha256)
assert.equal(hash(receipt.authoredAfterFinalize.path), receipt.authoredAfterFinalize.sha256)
assert.equal(data.meta.printed_page, 170)
assert.equal(data.blocks.length, 10)
assert.equal(audit.lines_printed, 27)
assert.equal(audit.lines_md, 27)
assert.equal(audit.errors.length, 0)
assert.equal(audit.normalizations.length, 0)
assert.deepEqual(data.meta.figures, [])
assert.deepEqual(receipt.actualFigureFiles, [])
function parseBodies(md) {
  const end = md.indexOf('\n---', 4)
  return [...md.slice(end + 4).matchAll(/<!-- ([^>]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)]
    .map(m => ({ header: m[1], lines: m[2].trimEnd().split('\n') }))
}
const before = parseBodies(fs.readFileSync(receipt.authoredBeforeFinalize.path, 'utf8'))
const after = parseBodies(fs.readFileSync(path.join(folder, 'page.md'), 'utf8'))
assert.deepEqual(after, before)
const typography = data.meta.notes.filter(n => ['bold', 'italic', 'math-typography'].includes(n.type))
for (const note of typography) {
  const ranges = note.ranges || [{
    block: note.block, line: note.line_range[0], text: note.text,
    character_range_1based_inclusive: note.character_range_1based_inclusive,
  }]
  for (const range of ranges) {
    const block = data.blocks[Number(range.block.split('#')[1]) - 1]
    const [start, end] = range.character_range_1based_inclusive
    assert.equal(block.lines[range.line - 1].slice(start - 1, end), range.text)
  }
}
const layout = local('work/10p/pages/0180/layout.json')
assert.equal(layout.line_bands.length, 27)
let printIndex = 0
const lineLedger = data.blocks.flatMap((block, blockIndex) => block.lines.map((text, lineIndex) => {
  const line = ++printIndex
  return {
    printedLine: line, sourceRef: `p0180#${blockIndex + 1}`, lineWithinBlock: lineIndex + 1,
    kind: block.kind, label: block.label, cont: block.cont, open: block.open,
    text, preparedLineBandY: layout.line_bands[line - 1],
  }
}))
assert.equal(printIndex, 27)
const previousPage = read(bindings.previousPage.path)
assert.deepEqual(previousPage.blocks[12], bindings.previousObject.block)
assert.equal(data.blocks[0].kind, 'ex')
assert.equal(data.blocks[0].label, '3')
assert.equal(data.blocks[0].cont, true)
assert.equal(data.blocks[0].open, false)
assert(data.blocks[0].lines[0].startsWith('扇百叶窗都关着.'))
assert.deepEqual(data.blocks.slice(1, 5).map(b => b.label), ['4', '5', '6', '7'])
assert.equal(data.blocks[5].kind, 'h3')
assert.equal(data.blocks[5].lines[0], '69. 光的反射定律 平面镜成像')
assert.equal(data.blocks[8].kind, 'p')
assert.equal(data.blocks[8].open, true)
assert(data.blocks[8].lines.at(-1).endsWith('任何性质的波都是'))
assert(data.blocks[7].lines[1].includes('图 137a'))
save('typography-ledger.json', {
  schema: 'bounded-source180-first-author-typography@1',
  role: 'First author observations, not independent typography approval',
  reference: bound(path.join(folder, 'page.md')), ranges: typography,
  characterRangeConvention: '1-based inclusive positions in the faithfully transcribed body line, including LaTeX encoding characters',
  unsupportedEmphasis: {
    underCharacterDots: 'None confirmed from these two original page observations; no dots added.',
    explanatoryFootnotes: 'None observed on SOURCE180.',
    mathLetters: 'Conventional italic LaTeX variables; no extra bold math semantic annotations.',
  },
})
save('printed-lines.json', {
  schema: 'bounded-source180-first-author-printed-lines@1',
  reference: bound(path.join(folder, 'page.json')),
  preparedLayout: bound(path.join(out, 'work/10p/pages/0180/layout.json')),
  linesPrinted: 27, linesTranscribed: 27, nativeNormalizations: [],
  nativeBodyAndNonfigureHeadersUnchanged: true,
  scope: 'First-author transcription ledger in printed order plus native line count; not independent semantic review.',
  lineLedger,
})
save('boundaries.json', {
  schema: 'bounded-source180-first-author-boundaries@1',
  left: {
    previousRef: 'p0179#13', previousPage: bindings.previousPage,
    previousTail: bindings.previousObject.block.lines.at(-1),
    currentRef: 'p0180#1', currentHead: data.blocks[0].lines[0], kind: 'ex', label: '3',
    cont: true, open: false,
    actualJoin: `${bindings.previousObject.block.lines.at(-1)}${data.blocks[0].lines[0]}`,
    closureScope: 'Observed SOURCE180 completes this continued question3; no whole-lesson approval.',
  },
  actualNewTitle: {
    ref: 'p0180#6', observedPrintedNumber: 69,
    observedPrintedText: data.blocks[5].lines[0],
    previousQuestionsOnThisPage: ['4', '5', '6', '7'],
    titleIdentityBasis: 'SOURCE180 pixels, not TOC inference',
    wholeN68CardApproval: false, wholeN69CardApproval: false,
  },
  figure137: {
    citationRef: 'p0180#8', line: 2, exactCitation: '（图 137a）',
    actualPrintedFigureCountOnSource180: 0, roughBox: null, cropCreated: false,
    sourceFigure137PixelsObserved: false,
    status: 'REFERENCED-NOT-OBSERVED-NOT-AUTHORED',
    reason: 'Only the textual citation is printed on this page; do not invent a figure or infer its placement on an unobserved page.',
  },
  right: {
    currentRef: 'p0180#9', kind: 'p', open: true,
    exactObservedTail: data.blocks[8].lines.at(-1), source181Observed: false,
    status: 'HOLD-UNOBSERVED-SOURCE181',
    n69CompleteClaimed: false,
  },
})
const status = 'AUTHORED-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING'
const report = {
  schema: 'bounded-source180-first-author-report@1', ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'First source author, not independent reviewer', status,
  authorScope: 'Only SOURCE180 physical page / printed page170, using the two d266 prepared original page and grid observations',
  inputBindings: bound(path.join(out, 'input-bindings.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  page: {
    physicalPage: 180, printedPage: 170, blocks: 10, printedLines: 27, mdLines: 27,
    pageMd: bound(path.join(folder, 'page.md')), pageJson: bound(path.join(folder, 'page.json')),
    audit: bound(path.join(folder, 'audit.json')),
    nativeReceipt: bound(path.join(out, 'native/0180/receipt.json')),
    figures: [], nativeBodyAndNonfigureHeadersUnchanged: true,
  },
  outputEvidence: {
    typography: bound(path.join(out, 'typography-ledger.json')),
    printedLines: bound(path.join(out, 'printed-lines.json')),
    boundaries: bound(path.join(out, 'boundaries.json')),
    authoredBeforeFinalize: receipt.authoredBeforeFinalize,
    nativeStdoutStderr: receipt.commands.map(c => ({ stage: c.stage, exitCode: c.exitCode, stdout: c.stdout, stderr: c.stderr })),
  },
  authorObservations: [
    { scope: 'Left boundary', result: 'Actual180 first block is ex3 cont after179#13 open; no repeated source question number or opening quote added.' },
    { scope: 'Exercise prose', result: 'Continued question3 and printed questions4-7 transcribed one printed line per body line; original novel names, original numbers, units, formula variables and punctuation retained.' },
    { scope: 'Title and prose', result: 'Actual new heading69 光的反射定律 平面镜成像; definition bold term and bold paragraph prefix distinguished from surrounding regular prose; partial last paragraph is open.' },
    { scope: 'Figure137', result: 'Only textual citation（图137a）observed on this page; no printed figure, crop or vector asset authored.' },
    { scope: 'Independent review', result: 'Not performed and no independent PASS recorded by this first author.' },
  ],
  nativeCommands: {
    physicalPages: [180], finalizeCalls: 1, finalizeExitCode: 0,
    vectorizeCalls: 1, vectorizeExitCode: 0, actualFiguresProcessed: 0,
    prepareCalls: 0, assembleCalls: 0, reruns: 0, repairs: 0,
    resvgInvokedForFigures: false, figureMismatchOrExactPixelPASSClaimed: false,
    emptyVectorizeIsNotRAW137Approval: true,
  },
  imageBudget: {
    inheritedImages: 22, newImages: 2, cumulativeSameAgentContextImages: 24,
    batchMaximum: 2, contextMaximum: 24, reset: false,
    reopens: 0, cropsOpened: 0, previewsOpened: 0, screenshotsOpened: 0,
    parentImagesOpened: 0, remainingImages: 0, strictZeroImagesAfterOrdinal24: true,
    check: '22 + 2 = 24 / 24',
  },
  findingsAndPending: [
    { status: 'HOLD-NOT-REVIEWED', scope: 'Independent SOURCE180 faithful text, formula, typography and printed-line review remains required.' },
    { status: 'HOLD-NOT-OBSERVED', scope: 'RAW137 is referenced but not printed or observed here; native empty-vectorize result is not RAW137 evidence.' },
    { status: 'HOLD-UNOBSERVED-RIGHT-BOUNDARY', scope: 'SOURCE181 and n69 continuation unobserved; p0180#9 remains open, no n69 whole-card approval.' },
    { status: 'RETAINED-SOURCE-NOT-SCI-REPAIRED', scope: 'SOURCE180 q5 original50/50/10流明 and original quote names retained; SOURCE179 original150/30 and all prior author bytes unchanged.' },
    { status: 'HOLD-NOT-INDEPENDENTLY-REVIEWED', scope: 'This worker remains SOURCE177 author, not its independent reviewer; no d264 repair consumption or SOURCE177 re-review performed.' },
  ],
  preservation: {
    onlyWritesWithinD268: true,
    previousFrozenInputs: bindings.previousFreezes.map(({ artifacts, ...entry }) => ({ ...entry, artifactCount: artifacts.length, allArtifactHashesVerifiedUnchanged: true })),
    parentPrepareInputsAndOwnedCopiesVerifiedUnchanged: true,
    allHistoricalFAILHOLDAndPaidOutputsPreserved: true,
    canonicalSharedMeterIndexStableSkillEdited: false,
    dbAppGitDeploymentNewAgentsWorktreesBranchesOrExternalPaidCallsUsed: false,
    source177OrSource179ScientificOrTextRepairPerformed: false,
  },
  independentSOURCE180PASS: false, independentRAW137PASS: false,
  wholeN68CardPASS: false, wholeN69CardPASS: false, promotionOrLessonFinalizePerformed: false,
}
save('report.json', report)
const artifacts = []
function walk(folderPath) {
  for (const entry of fs.readdirSync(folderPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(folderPath, entry.name)
    assert(!entry.isSymbolicLink(), 'Do not include any write-domain escaping links')
    if (entry.isDirectory()) walk(p)
    else artifacts.push(bound(p))
  }
}
walk(out)
save('author-freeze.json', {
  schema: 'bounded-source180-first-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D033',
  role: report.role, status, frozenUtc: new Date().toISOString(),
  immutablePolicy: 'Create once and preserve all frozen bytes; any later repair belongs in another owned directory.',
  writeDomain: out, artifacts, report: bound(path.join(out, 'report.json')),
  actualOpens: report.actualOpens, page: report.page, imageBudget: report.imageBudget,
  nativeFinalizeExitCode: 0, nativeVectorizeExitCode: 0, actualFiguresProcessed: 0,
  independentSOURCE180: 'HOLD-NOT-REVIEWED', raw137: 'REFERENCED-NOT-OBSERVED-NOT-AUTHORED',
  source181: 'HOLD-UNOBSERVED', n69CompleteClaimed: false, wholeCardPASS: false,
  preservedPreviousFreezes: report.preservation.previousFrozenInputs,
})
for (const artifact of artifacts) {
  assert.equal(hash(artifact.path), artifact.sha256)
  fs.chmodSync(artifact.path, 0o444)
}
fs.chmodSync(path.join(out, 'author-freeze.json'), 0o444)
console.log(JSON.stringify({
  status, freeze: bound(path.join(out, 'author-freeze.json')),
  report: bound(path.join(out, 'report.json')), actualOpens: report.actualOpens,
  pageMd: report.page.pageMd, nativeReceipt: report.page.nativeReceipt,
  cumulativeImages: 24, remainingImages: 0, printedLines: 27, mdLines: 27,
  independentSOURCE180: 'pending', raw137: 'not observed', source181: 'not observed',
}, null, 2))
