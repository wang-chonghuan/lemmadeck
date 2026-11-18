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
const save = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const bindings = local('input-bindings.json')
for (const input of [
  bindings.manifest, bindings.previousSource177Freeze, bindings.previousSource177Page,
  bindings.inherited, bindings.skill, bindings.tool,
]) assert.equal(hash(input.path), input.sha256)
for (const input of bindings.preparedInputs) {
  assert.equal(hash(input.path), input.sha256)
  assert.equal(hash(path.join(out, input.destination)), input.sha256)
}
const previous = read(bindings.previousSource177Freeze.path)
for (const artifact of previous.artifacts) assert.equal(hash(artifact.path), artifact.sha256)
const modernFreezePath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d257-n67-fig134-first-author/author-freeze.json')
assert.equal(hash(modernFreezePath), '8de86cadafc7c5ad20fd9f8cab967e077869b203661e9f7b855fa2cc36026981')
for (const artifact of read(modernFreezePath).artifacts) assert.equal(hash(artifact.path), artifact.sha256)
const opens = local('actual-opens.json')
assert.equal(opens.opens.length, 4)
assert.equal(opens.budget.cumulativeContextImages, 22)
assert.deepEqual(opens.opens.map(o => o.ordinalInContext), [19, 20, 21, 22])
for (const open of opens.opens) assert.equal(hash(open.path), open.sha256)

function parseBodies(md) {
  const end = md.indexOf('\n---', 4)
  return [...md.slice(end + 4).matchAll(/<!-- ([^>]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)]
    .filter(m => !m[1].startsWith('fig '))
    .map(m => ({ header: m[1], body: m[2].trim() }))
}
const pages = []
const typography = []
for (const number of [178, 179]) {
  const pageId = String(number).padStart(4, '0')
  const folder = path.join(out, 'source/10p/pages', pageId)
  const data = read(path.join(folder, 'page.json'))
  const audit = read(path.join(folder, 'audit.json'))
  const receipt = local(`native/${pageId}/receipt.json`)
  assert.equal(receipt.finalizeExitCode, 0)
  assert.equal(receipt.vectorizeExitCode, 0)
  assert.equal(receipt.finalizeCalls, 1)
  assert.equal(receipt.vectorizeCalls, 1)
  assert.equal(audit.lines_printed, audit.lines_md)
  assert.equal(audit.errors.length, 0)
  assert.deepEqual(
    parseBodies(fs.readFileSync(path.join(out, 'native', pageId, 'authored-before-finalize.md'), 'utf8')),
    parseBodies(fs.readFileSync(path.join(folder, 'page.md'), 'utf8')),
  )
  for (const note of data.meta.notes) {
    if (!['bold', 'italic'].includes(note.type)) continue
    const index = Number(note.block.split('#')[1]) - 1
    const block = data.blocks[index]
    const ranges = note.ranges || [{
      line: note.line_range[0], text: note.text,
      character_range_1based_inclusive: note.character_range_1based_inclusive,
    }]
    for (const range of ranges) {
      const [start, end] = range.character_range_1based_inclusive
      assert.equal(block.lines[range.line - 1].slice(start - 1, end), range.text)
    }
    typography.push({ page: number, ...note })
  }
  const lines = data.blocks.map((block, i) => ({
    ref: `p${pageId}#${i + 1}`, kind: block.kind, label: block.label,
    cont: block.cont, open: block.open, samerow: block.samerow, lines: block.lines,
  }))
  pages.push({
    physicalPage: number, printedPage: data.meta.printed_page,
    status: 'AUTHORED-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING',
    pageMd: bound(path.join(folder, 'page.md')), pageJson: bound(path.join(folder, 'page.json')),
    audit: bound(path.join(folder, 'audit.json')), native: bound(path.join(out, 'native', pageId, 'receipt.json')),
    printedLines: audit.lines_printed, mdLines: audit.lines_md, blocks: data.blocks.length,
    actualFigures: data.meta.figures,
    finalizeExitCode: 0, vectorizeExitCode: 0,
    bodyTextAndNonfigureHeadersPreservedAcrossFinalize: true,
    lineLedger: lines,
  })
}
const p178 = local('source/10p/pages/0178/page.json')
const p179 = local('source/10p/pages/0179/page.json')
const first178Text = p178.blocks.find(b => b.kind === 'p')
assert.equal(first178Text.cont, true)
assert(first178Text.lines[0].startsWith('\u7b2c\u4e00\u4e2a\u9762'))
const tail179 = p179.blocks[12]
assert.equal(tail179.kind, 'ex')
assert.equal(tail179.label, '3')
assert.equal(tail179.open, true)
assert(tail179.lines.at(-1).endsWith('\u56e0\u4e3a\u51e0'))
save('typography-ledger.json', {
  schema: 'bounded-source178179-author-typography@1',
  scope: 'First-author observations tied to exact transcription line/character ranges, not independent typography review',
  ranges: typography, mathTypographyInPageNotesAndLatex: true,
  underCharacterEmphasisDots: 'None confirmed in either actually opened page; no invented dots.',
})
save('boundaries.json', {
  schema: 'bounded-source178179-author-boundaries@1',
  left: {
    previousRef: 'p0177#11', currentFirstTextRef: 'p0178#3', cont: true,
    actualLeadingFiguresAndCaption: ['p0178#1', 'p0178#2'],
    reason: 'Keep physical figure/caption order; they are transparent to the continuation. The first prose block is cont.',
    previousTail: bindings.previousTail,
  },
  betweenPages: {
    previousRef: 'p0178#9', previousTextEndsWithSentencePoint: true,
    currentRef: 'p0179#1', cont: false,
    reason: 'The next printed page begins a new bold general-law paragraph; no unfinished word or formula across this boundary.',
  },
  right: {
    currentRef: 'p0179#13', kind: 'ex', label: '3', exerciseHeading: '\u7ec3 \u4e60 6',
    open: true, exactObservedTail: tail179.lines.at(-1),
    source180Observed: false, status: 'HOLD-UNOBSERVED-RIGHT-BOUNDARY',
    source137Claimed: false, n68CompleteClaimed: false,
  },
})
const report = {
  schema: 'bounded-source178179-first-author-report@1', ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'First source author, not independent reviewer',
  status: 'AUTHORED-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING',
  pages, inputBindings: bound(path.join(out, 'input-bindings.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  typography: bound(path.join(out, 'typography-ledger.json')), boundaries: bound(path.join(out, 'boundaries.json')),
  nativeCommands: {
    pages: [178, 179], finalizeCallsPerPage: 1, vectorizeCallsPerPage: 1,
    prepareCalls: 0, assembleCalls: 0, reruns: 0, repairs: 0,
    nativeFigure136MismatchPrinted: '0.000%',
    source179ActualFigureCount: 0,
    source179EmptyVectorizeIsNotRAW137Approval: true,
  },
  imageBudget: {
    inheritedImages: 18, newImages: 4, cumulativeSameAgentContextImages: 22,
    batchMaximum: 4, contextMaximum: 24, reset: false, reopens: 0, parentImagesOpened: 0,
    check: '18 + 4 = 22 <= 24',
  },
  findingsAndPending: [
    { status: 'HOLD-NOT-REVIEWED', scope: 'Independent SOURCE178/SOURCE179 review' },
    { status: 'HOLD-NOT-REVIEWED', scope: 'Independent RAW136 crop/vector review; native success is not independent approval' },
    { status: 'HOLD-UNOBSERVED', scope: 'SOURCE180 and exercise6 question3 right boundary; no fig137 observed or authored' },
    { status: 'RETAINED-SOURCE-TEXT', scope: 'Printed 150 and 30 with original unit wording retained, not repaired or SCI-reviewed here' },
  ],
  preservation: {
    source177FreezeAndArtifactsUnchanged: true, d257FreezeAndAllArtifactsUnchanged: true,
    parentPreparedInputsAndTheirCopiesUnchanged: true,
    allHistoricalFAILHOLDAndPaidOutputsPreserved: true,
    writesOnlyD260: true, canonicalSharedMeterIndexStableSkillEdited: false,
    independentPASSRecorded: false, source137Or180Claimed: false,
    dbAppGitDeploymentNewAgentsWorktreesOrBranchesUsed: false,
    source177ReviewedIndependentlyByThisAuthor: false,
  },
  wholeCardPASS: false, lessonBoundaryClosureClaim: false,
}
save('report.json', report)
const artifacts = []
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(folder, entry.name)
    if (entry.isDirectory()) walk(p)
    else artifacts.push(bound(p))
  }
}
walk(out)
save('author-freeze.json', {
  schema: 'bounded-source178179-first-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D033',
  role: report.role, status: report.status, frozenUtc: new Date().toISOString(),
  immutablePolicy: 'Create once; do not update author outputs after freezing.',
  artifacts, report: bound(path.join(out, 'report.json')), actualOpens: report.actualOpens,
  pages: pages.map(({ lineLedger, ...page }) => page),
  imageBudget: report.imageBudget, independentSOURCE: 'HOLD-NOT-REVIEWED',
  independentRAW136: 'HOLD-NOT-REVIEWED', source137: 'NOT-OBSERVED-NOT-AUTHORED',
  rightBoundary: 'HOLD-UNOBSERVED-SOURCE180', wholeCardPASS: false,
  previousD257Freeze: bound(modernFreezePath), previousD242Freeze: bindings.previousSource177Freeze,
})
fs.chmodSync(path.join(out, 'author-freeze.json'), 0o444)
console.log(JSON.stringify({
  status: report.status, freeze: bound(path.join(out, 'author-freeze.json')),
  report: bound(path.join(out, 'report.json')), actualOpens: report.actualOpens,
  lines: pages.map(p => ({ page: p.physicalPage, printed: p.printedLines, md: p.mdLines })),
  cumulativeImages: 22, independentReview: 'pending', source137: 'not observed',
}, null, 2))
