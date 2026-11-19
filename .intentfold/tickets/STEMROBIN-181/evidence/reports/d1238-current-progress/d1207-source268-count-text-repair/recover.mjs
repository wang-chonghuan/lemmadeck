import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (name, data) => fs.writeFileSync(
  path.join(own, name), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' },
)
const start = read(path.join(own, 'started.json'))
const proofFile = path.join(own, 'focused-tests.json')
const proof = read(proofFile)
assert.equal(proof.status, 'PASS')
assert.equal(sha(proof.layout.path), proof.layout.sha256)
for (const item of start.retained) assert.equal(sha(item.path), item.sha256)
const root = path.join(own, 'root')
const work = path.join(own, 'work')
const page = path.join(root, '10p/pages/0268')
const workPage = path.join(work, '10p/pages/0268')
const md = path.join(page, 'page.md')
const json = path.join(page, 'page.json')
const oldMd = fs.readFileSync(start.originalMd.path, 'utf8')
const oldJsonText = fs.readFileSync(start.originalJson.path, 'utf8')
assert.equal(oldMd.split('$2000$').length, 2)
assert.equal(oldJsonText.split('$2000$').length, 2)
const correctedMd = oldMd.replace('$2000$', '$20000$')
const correctedJsonText = oldJsonText.replace('$2000$', '$20000$')
assert.equal(fs.readFileSync(md, 'utf8'), correctedMd)
assert.equal(fs.readFileSync(json, 'utf8'), correctedJsonText)
const correctedJson = JSON.parse(correctedJsonText)
assert.equal(correctedJson.meta.printed_lines, 19)
assert.equal(correctedJson.meta.counting, undefined)
assert.deepEqual(correctedJson.meta.errata, [])
assert(correctedJson.blocks.every(block => block.samerow === false))
assert.equal(correctedJson.blocks[5].lines[1], read(start.originalJson.path).blocks[5].lines[1])
const sourceCopy = path.join(workPage, 'page.png')
const cropCopy = path.join(workPage, 'figures/fig-228.png')
assert.equal(sha(sourceCopy), start.sourcePixels.sha256)
assert.equal(sha(cropCopy), start.sourceCrop.sha256)
for (const [input, name] of [[md, 'corrected-page-before-finalize.md'], [json, 'corrected-page-before-finalize.json']]) {
  const snapshot = path.join(own, name)
  fs.copyFileSync(input, snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
}
const priorNative = path.join(tmp, 'd1195-source268-first-native/finalize/receipt.json')
const priorReceipt = read(priorNative)
assert.equal(priorReceipt.exit, 1)
const args = [...priorReceipt.command]
args[args.indexOf('--root') + 1] = root
args[args.indexOf('--work') + 1] = work
assert.equal(args[args.indexOf('--page') + 1], '268')
assert.equal(args[3], 'finalize')
const native = path.join(own, 'finalize-repair')
assert.equal(fs.existsSync(native), false)
const p2c = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const p2cBefore = bind(p2c)
save('native-ready.json', {
  focusedProof: bind(proofFile), layout: bind(proof.layout.path),
  p2cSharedReadOnly: p2cBefore, priorNative: bind(priorNative),
  candidateMd: bind(md), candidateJson: bind(json),
  sourcePixels: bind(sourceCopy), sourceCrop: bind(cropCopy),
})
const result = spawnSync('node', [
  '.intentfold/tickets/STEMROBIN-181/tmp/record-offline-command.mjs', native, ...args,
], { cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
if (result.status !== 0) {
  save('finalize-failure.json', { exit: result.status, stdout: result.stdout, stderr: result.stderr })
  throw new Error('The one authorized finalize failed; its receipt and outputs are retained.')
}
const auditFile = path.join(page, 'audit.json')
const audit = read(auditFile)
assert.equal(audit.lines_printed, 19)
assert.equal(audit.lines_md, 19)
assert.deepEqual(audit.errors, [])
assert.deepEqual(audit.normalizations, [])
assert.deepEqual(audit.figures, read(path.join(path.dirname(start.originalMd.path), 'audit.json')).figures)
assert.equal(fs.readFileSync(md, 'utf8'), correctedMd)
assert.equal(fs.readFileSync(json, 'utf8'), correctedJsonText)
assert.equal(sha(sourceCopy), start.sourcePixels.sha256)
assert.equal(sha(cropCopy), start.sourceCrop.sha256)
assert.equal(sha(proof.layout.path), proof.layout.sha256)
for (const item of start.retained) assert.equal(sha(item.path), item.sha256)
const receiptFile = path.join(native, 'receipt.json')
assert.equal(read(receiptFile).exit, 0)
const usage = {
  schema: 'source268-bounded-recovery-usage-v1',
  date: '2026-11-19',
  image_usage: 0, image_opens: 0, image_payloads_returned: false,
  pixel_reads: 'Mechanical row counting only; no visual/model image opens.',
  paid_calls: 0, network_calls: 0, git_or_status_calls: 0,
  db_or_publisher_calls: 0, chat_or_delegation_calls: 0,
  dependency_changes: 0, skill_rewrites: 0,
  finalize_calls: 1, passed_native_replays: 0,
  source261265_native_calls: 0, source261265_full_counter_calls: 0,
  vectorize_calls: 0, render_calls: 0,
  source_pixel_edits: 0, crop_byte_changes: 0,
  artificial_rows: 0, counting_margin_overrides: 0, waivers: 0, samerow_changes: 0,
  durable_source_writes: 0,
  owned_write_roots: [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/layout.py'), own,
  ],
}
save('usage.json', usage)
const focusedReceipts = ['focused-FIRST', 'focused-repair-01', 'focused-repair-02', 'focused-repair-03']
  .map(name => bind(path.join(own, name, 'receipt.json')))
const original = read(start.originalJson.path).blocks[4].lines[1]
const corrected = correctedJson.blocks[4].lines[1]
const output = {
  root, work,
  pageMd: bind(md), pageJson: bind(json), audit: bind(auditFile),
  sourcePixels: bind(sourceCopy), sourceCrop: bind(cropCopy),
  copiedWorkFiles: ['layout.json', 'page.template.md', 'page.grid.png'].map(name => bind(path.join(workPage, name))),
  nativeReceipt: bind(receiptFile),
  nativeStdout: bind(path.join(native, 'stdout.txt')),
  nativeStderr: bind(path.join(native, 'stderr.txt')),
}
const report = {
  schema: 'source268-count-text-failed-stage-recovery-v1',
  ticket: 'STEMROBIN-181', date: '2026-11-19', cwd: repo,
  status: 'PASS19/19',
  scope: 'Bounded SOURCE268 text-fidelity and failed finalize recovery only; independent of D037 modern authoring.',
  independentReview: start.independentReview,
  textCorrection: {
    original, corrected,
    sourceBoundOriginal: '20000 tons', candidateBefore: '2000 tons', candidateAfter: '20000 tons',
    changedMdToken: '$2000$ -> $20000$', jsonPointer: '/blocks/4/lines/1',
    onlyThisTextChanged: true, unitsAndOtherProseUnchanged: true,
    originals: [start.originalMd, start.originalJson],
    correctedBeforeNative: [
      bind(path.join(own, 'corrected-page-before-finalize.md')),
      bind(path.join(own, 'corrected-page-before-finalize.json')),
    ],
  },
  diagnosis: {
    missingZone: 'Small three-row footnote after figure masking.',
    baselineCounts: { body: 7, figureLabel: 1, caption: 2, lowerBody: 5, footnote: 2, folio: 1, total: 18 },
    correctedCounts: { body: 7, figureLabel: 1, caption: 2, lowerBody: 5, footnote: 3, folio: 1, total: 19 },
    exactCause: 'The slanted footnote projection joins 1883..1933 and 1934..2015 at glyph merge gap 15.6. Expansion of 1883..2015 uses body height 46 and pitch 74, estimating two rows. Its strong-row merge gap 11.5 joins the true final short row (1992..2005 plus 2011..2013 core pixels) to 1942..1981, yielding only two strong cores.',
    changedHelper: '_small_prose_row_bands',
    changedCaller: 'line_bands, only at the existing tall-band expansion point.',
    repair: 'Cluster whole small glyphs by their actual vertical centres and return their ink bounds, requiring at least three aligned glyphs per row, consistent small type and no covering fraction rule/numerator. The first footnote marker extends one real pixel above the raw projection threshold; centre-based selection retains it.',
    actualFootnoteBands: proof.source268.footnoteBands,
    overlappingInkBounds: 'The last two real row glyph bounds overlap at 1985..1986 because the long row is slanted; no synthetic equal-pitch rows or margins are introduced.',
    parentHelpersUnchanged: proof.preservedParentHelpers,
    p2cSharedReadOnlyBefore: p2cBefore, p2cSharedReadOnlyAfter: bind(p2c),
    noP2cOrNormalizeEdits: true,
  },
  focusedTests: {
    report: bind(proofFile), cases: proof.focusedCases,
    receipts: focusedReceipts,
    firstFailure: bind(path.join(own, 'FIRST-failure.json')),
    otherFailedReceiptsRetained: true,
    fixtureRepairDisclosure: 'focused-repair-02 already passed SOURCE268 and source-derived fraction controls but failed an invalid positive fixture whose separately drawn covering rule had a preceding full glyph acting as a numerator. The fixture was corrected to draw prose strokes within full glyphs, with separate direct true/no-numerator controls; no implementation change followed this fixture failure.',
    fullProjectTestsOr261265NativeReplays: 0,
  },
  finalize: {
    calls: 1, failedStageOnly: true, linesPrinted: 19, linesMd: 19, errors: [],
    sameRowFlagsAllFalse: true, cropGeometryUnchanged: true, exactCropBytesUnchanged: true,
    originalCrop: start.sourceCrop, currentCrop: output.sourceCrop,
    sourcePixelBytesUnchanged: true,
  },
  preservedEvidence: {
    firstSource268Native: bind(priorNative),
    parentCounterProof: bind(path.join(tmp, 'd1192-counter-focused-proof/report.json')),
    parentSource261265Recovery: bind(path.join(tmp, 'd1193-source261265-native-repair/report.json')),
    originalAuthorAndFirstSnapshots: 'All original author root/work/evidence, FIRST freeze and source268 first native receipts remain byte-identical.',
    unchangedFiles: start.retained,
  },
  currentOutput: output,
  layoutBefore: start.layoutBefore, layoutAfter: bind(proof.layout.path),
  usage: bind(path.join(own, 'usage.json')),
  sourceBoundErratumQuestion: {
    retainedText: correctedJson.blocks[5].lines[1],
    retainedConversion: '1.60207e-10 J per eV',
    status: 'Separate source-bound scientific erratum question, not adjudicated in this fidelity/count stage.',
    action: 'Source-bound review must determine the appropriate modern-edition correction before changing this conversion; the printed exponent -10, emphasis, units and all footnote prose remain unchanged here.',
    noNewErratumRegistered: true,
  },
  laterGate: 'Affected-only SOURCE review still required for the text correction; recovery is not SOURCE/modern approval. No vectorization, render, publication or source consumption performed.',
}
save('report.json', report)
console.log(JSON.stringify({
  status: report.status, report: bind(path.join(own, 'report.json')),
  root, work, audit: output.audit, crop: output.sourceCrop, nativeCalls: 1, imageUsage: 0,
}))
