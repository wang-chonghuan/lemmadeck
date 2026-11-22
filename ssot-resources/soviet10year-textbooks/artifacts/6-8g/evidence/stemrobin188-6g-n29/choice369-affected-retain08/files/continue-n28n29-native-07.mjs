import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const [stage] = process.argv.slice(2)
assert.ok(['install-n29', 'finalize-n28-interactions', 'receive-finished', 'retain-n28-choice',
  'receive-n29-choice-author', 'receive-supplement370', 'receive-n28-display',
  'receive-source151152', 'receive-source153154', 'receive-source149150-review',
  'receive-source147-repair', 'receive-n29-review', 'retain-n29-choice'].includes(stage))
const own = path.join(tmp, `${stage}-07`)
fs.mkdirSync(own)
const refs = new Map()
const remember = file => refs.set(file, bind(file))
function run(name, argv) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `${name}.${kind}`)
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
    remember(file)
  }
  const receipt = path.join(own, `${name}.execution.json`)
  save(receipt, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, streams })
  remember(receipt)
  console.log(JSON.stringify({ stage: name, exitCode: result.status, receipt: bind(receipt),
    stdout: result.stdout, stderr: result.stderr }))
  assert.equal(result.status, 0)
  return bind(receipt)
}
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
let record
let relative
let priorRecords = []
if (stage === 'install-n29') {
  const lesson = 'geo68-c2-s4-n29'
  const working = path.join(tmp, 'n29-finalize-working-inputs-06')
  const book = path.join(working, 'artifacts/6-8g')
  const modern = path.join(book, 'editions/modern-us-neutral/lessons', lesson)
  const receipts = []
  for (const [name, exitCode] of [
    ['modern', 2], ['modern-recovery01', 0], ['answers', 0],
    ['interactions-prepare', 0], ['interactions-finalize', 0],
  ]) {
    const file = path.join(working, 'native', name, 'execution.json')
    const actual = read(file)
    assert.equal(actual.cwd, repo)
    assert.equal(actual.exitCode, exitCode)
    remember(file)
    for (const stream of Object.values(actual.streams)) {
      assert.equal(hash(stream.path), stream.sha256)
      remember(stream.path)
    }
    receipts.push({ name, receipt: bind(file), exitCode })
  }
  for (const name of ['adaptation.audit.FIRST-failed.json', 'lesson.template.FIRST-failed.json'])
    remember(path.join(working, 'native/modern', name))
  remember(path.join(tmp, 'run-n29-scoped-native-06.FIRST-anchors-failed.mjs'))
  remember(path.join(tmp, 'run-n29-scoped-native-06.mjs'))
  remember(path.join(working, 'staging.json'))
  assert.equal(read(path.join(modern, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(modern, 'answer-keys.audit.json')).status, 'pass')
  assert.equal(read(path.join(modern, 'interactions.json')).interactions.filter(i => i.needsAuthoring).length, 0)
  const installed = []
  for (const [from, to, names] of [
    [path.join(book, 'lessons', lesson), path.join(core6g, 'lessons', lesson),
      ['lesson.json', 'lesson.md', 'exercises.json']],
    [modern, path.join(core6g, 'editions/modern-us-neutral/lessons', lesson),
      ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
        'answer-keys.json', 'answer-keys.audit.json', 'interactions.json']],
  ]) {
    for (const name of names) assert.ok(!fs.existsSync(path.join(to, name)))
    fs.mkdirSync(to, { recursive: true })
    for (const name of names) {
      const source = path.join(from, name)
      const output = path.join(to, name)
      fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
      assert.equal(hash(source), hash(output))
      installed.push({ source: bind(source), output: bind(output) })
      remember(output)
    }
  }
  const beforeIndexes = []
  for (const [name, file] of [
    ['source-index.before.json', path.join(core6g, 'book.json')],
    ['edition-index.before.json', path.join(core6g, 'editions/modern-us-neutral/book.json')],
  ]) {
    const snapshot = path.join(own, name)
    fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(snapshot, 0o444)
    remember(snapshot)
    beforeIndexes.push({ path: file, snapshot: bind(snapshot) })
  }
  const sourceIndex = run('source-index', [python, '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '6-8g',
    '--root', path.dirname(core6g), '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json'])
  const editionIndex = run('edition-index', [python, '-B', '-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); import edition; book=Path(sys.argv[1]); rows=json.loads(Path(sys.argv[2]).read_text())["lessons"]; assert [r["id"] for r in rows]==["geo68-c2-s4-n29"]; edition.update_book_index(book,book/"editions/modern-us-neutral",Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"),rows)',
    core6g, path.join(book, 'editions/modern-us-neutral/book.json')])
  record = { status: 'N29_NATIVE_OUTPUTS_INSTALLED_CHOICES_DISPLAY_PENDING', installed,
    native: receipts, indexOnlyReconciliation: { sourceIndex, editionIndex }, beforeIndexes,
    counts: { prose: 23, exercises: 9, figures: 3, auto: 1, ungraded: 8, interactions: 9 },
    pendingInteractionAuthoring: [], anchorLayoutRepairOnly: true,
    anchorAffectedReviewPending: true, choicesPending: true, displayPending: true }
  relative = 'evidence/stemrobin188-6g-n29/scoped-native-install07'
} else if (stage === 'finalize-n28-interactions') {
  const lesson = 'geo68-c2-s4-n28'
  const working = path.join(tmp, 'n28-finalize-working-inputs-06')
  const root = path.join(working, 'artifacts')
  const base = path.join(root, '6-8g/editions/modern-us-neutral/lessons', lesson)
  const before = path.join(working, 'interactions.before-authoring-07.json')
  const candidate = path.join(base, 'interactions.json')
  const previous = read(before)
  const current = read(candidate)
  const changed = ['354', '358', '363']
  const answers = read(path.join(base, 'answer-keys.json'))
  for (const item of current.interactions) {
    const old = previous.interactions.find(i => i.exercise === item.exercise)
    if (!changed.includes(item.exercise)) assert.deepEqual(item, old)
    else {
      assert.equal(item.widget, 'math')
      assert.ok(!item.needsAuthoring)
      const key = answers.answers.find(a => a.exercise === item.exercise)
      assert.ok(key.parts.every(p => p.judge === 'numeric'))
      assert.deepEqual(item.parts, key.parts.map(p => ({ label: p.label, unit: p.unit })))
      assert.ok(item.parts.every(p => !p.expected && !p.answer && !p.displayAnswer))
    }
  }
  remember(before)
  const candidateSnapshot = path.join(own, 'interactions.authored.candidate.json')
  fs.copyFileSync(candidate, candidateSnapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(candidateSnapshot, 0o444)
  remember(candidateSnapshot)
  const receipt = run('affected-finalize', [python, '-B',
    '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', 'finalize',
    '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', lesson, '--root', root])
  const target = path.join(core6g, 'editions/modern-us-neutral/lessons', lesson, 'interactions.json')
  assert.equal(hash(target), hash(before))
  fs.copyFileSync(candidate, target)
  assert.equal(hash(candidate), hash(target))
  remember(target)
  record = { status: 'N28_THREE_INTERACTION_FORMS_AUTHORED_AND_AFFECTED_FINALIZED',
    changed, partCounts: [8, 4, 3], widget: 'math', numericJudgesUnchanged: true,
    noAnswerKeysInInteraction: true, elevenOtherInteractionsUnchanged: true,
    receipt, output: bind(target), pendingInteractionAuthoring: [], independentMappingReviewPending: true }
  relative = 'evidence/stemrobin188-6g-n28/interaction-authoring07'
} else if (stage === 'retain-n29-choice') {
  const reviewer = path.join(tmp, 'n29-choice369-affected-independent-review-08')
  const manifestFile = path.join(reviewer, 'manifest.json')
  assert.equal(hash(manifestFile), 'c03ded4a01da3e4181b4f30a0b14910946e5b5309b08a08f8349c2063c9981f5')
  const manifest = read(manifestFile)
  assert.equal(manifest.review.outcome, 'pass')
  assert.equal(manifest.validation.exit_code, 0)
  assert.equal(manifest.current_option_count, 38)
  remember(manifestFile)
  for (const item of [manifest.first, manifest.prekey, manifest.review]) {
    assert.equal(hash(item.path), item.raw_sha256)
    remember(item.path)
  }
  const receiptFile = manifest.validation.receipt_path
  assert.equal(hash(receiptFile), manifest.validation.receipt_raw_sha256)
  remember(receiptFile)
  for (const item of Object.values(manifest.validation.streams)) {
    assert.equal(hash(item.path), item.sha256)
    remember(item.path)
  }
  remember(path.join(reviewer, 'Report.md'))
  const repair = path.join(tmp, 'n29-choice369-locus-repair-08')
  for (const name of ['replacement369.json', 'repair.json', 'review-source-only.json',
    'review-post-FIRST.json', 'structural.execution.json', 'structural.stdout', 'structural.stderr'])
    remember(path.join(repair, name))
  remember(path.join(tmp, 'merge-n29-369-repair-08.mjs'))
  remember(path.join(tmp, 'validate-n29-369-repair-08.mjs'))
  const source = path.join(own, 'approved-inputs')
  fs.mkdirSync(source)
  for (const [from, name] of [
    [path.join(tmp, 'n29-choice-author-first-07/seed.json'), 'seed.json'],
    [path.join(repair, 'draft.json'), 'draft.json'],
    [manifest.review.path, 'review.json'],
  ]) {
    fs.copyFileSync(from, path.join(source, name), fs.constants.COPYFILE_EXCL)
    remember(from)
  }
  const retentionReceipt = run('native-choice-retain', [python, '-B',
    '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
    '--book', '6-8g', '--lesson', 'geo68-c2-s4-n29', '--source', source])
  record = { status: 'N29_NINE_APPROVED_CHOICES_RETAINED_DISPLAY_PENDING',
    review: bind(manifest.review.path), retentionReceipt, questions: 9, options: 38,
    freshlyReviewedQuestions: 1, reusedQuestionReviews: 8,
    originalRedundancyRevisePreserved: true, sourceNumberCoverage: 9,
    sourceWritingAndConstructionLossesDisclosed: true, displayPending: true }
  priorRecords = ['evidence/stemrobin188-6g-n29/choice-first-review07/retention.json']
  relative = 'evidence/stemrobin188-6g-n29/choice369-affected-retain08'
} else if (stage === 'retain-n28-choice') {
  const author = path.join(tmp, 'n28-choice-author-first-06')
  const reviewer = path.join(tmp, 'n28-choice-independent-review-07')
  const reviewFile = path.join(reviewer, 'review.json')
  assert.equal(hash(reviewFile), '6546eb1a11e3653369586049f6b07098fa5e98df1cdc71b8004ebd920496faba')
  assert.equal(read(reviewFile).outcome, 'pass')
  assert.equal(hash(path.join(reviewer, 'Report.md')), 'e7b84e2d9490446febd43ed295204b6a8b3ce583b350026346eb2381740fc39d')
  const receipt = read(path.join(reviewer, 'with-review.execution.json'))
  assert.equal(receipt.exit_code ?? receipt.exitCode, 0)
  const source = path.join(own, 'approved-inputs')
  fs.mkdirSync(source)
  for (const [from, name] of [
    [path.join(author, 'seed.json'), 'seed.json'],
    [path.join(author, 'draft.json'), 'draft.json'],
    [reviewFile, 'review.json'],
  ]) {
    fs.copyFileSync(from, path.join(source, name), fs.constants.COPYFILE_EXCL)
    remember(from)
  }
  for (const item of read(path.join(reviewer, 'manifest.json')).files) {
    const file = path.isAbsolute(item.path) ? item.path : path.join(reviewer, item.path)
    assert.equal(hash(file), item.sha256 ?? item.raw_sha256)
    remember(file)
  }
  remember(path.join(reviewer, 'manifest.json'))
  const retentionReceipt = run('native-choice-retain', [python, '-B',
    '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
    '--book', '6-8g', '--lesson', 'geo68-c2-s4-n28', '--source', source])
  record = { status: 'N28_APPROVED_CHOICE_SUBSET_RETAINED_DISPLAY_PENDING',
    independentReview: bind(reviewFile), retentionReceipt, questions: 18, options: 72,
    source351ExperimentsStillDeferred: true, fullSourceChoiceCoverage: false,
    n29AnchorsAffectedPass: true, n28InteractionMappingAffectedPass: true,
    semanticReviewReplays: 0 }
  relative = 'evidence/stemrobin188-6g-n28/choice-independent-retain07'
} else if (stage === 'receive-n29-choice-author') {
  const author = path.join(tmp, 'n29-choice-author-first-07')
  const reportFile = path.join(author, 'Report.json')
  const report = read(reportFile)
  assert.equal(report.status, 'AUTHOR_DRAFT_READY_WITH_LOCAL_SOURCE_HOLD')
  assert.equal(report.counts.questions, 8)
  assert.equal(report.validation.exit_code, 0)
  for (const name of ['seed', 'draft', 'FIRST', 'selection']) {
    const item = report.artifacts[name]
    assert.equal(hash(item.path), item.raw_sha256)
    remember(item.path)
  }
  remember(reportFile)
  remember(path.join(author, 'manifest.json'))
  for (const item of report.executions) {
    remember(item.receipt_path)
    for (const stream of Object.values(item.streams)) {
      assert.equal(hash(stream.path), stream.sha256)
      remember(stream.path)
    }
  }
  record = { status: 'N29_EIGHT_CHOICE_AUTHOR_UNITS_RECEIVED_NOT_APPROVED',
    report: bind(reportFile), questions: 8, options: 33,
    source370OriginalDefinitionHold: report.losses.local_hold,
    oldFIRSTAndDraftUnchanged: true, candidateReauthoringReplays: 0,
    independentSemanticReviewPending: true, noOpenOwnSessions: report.no_open_sessions }
  relative = 'evidence/stemrobin188-6g-n29/choice-author-first07'
} else if (stage === 'receive-supplement370') {
  const author = path.join(tmp, 'n29-choice370-definition-author-07')
  const reportFile = path.join(author, 'Report.json')
  const report = read(reportFile)
  assert.equal(report.status, 'AUTHOR_ONLY_READY_FOR_REVIEW')
  assert.equal(report.structural_validation.exit_code, 0)
  assert.equal(report.counters.merged_author_only_questions, 9)
  assert.ok(report.unchanged_eight.questions_deep_equal.every(item => item.deep_equal))
  assert.ok(report.unchanged_eight.coverage_deep_equal.every(item => item.deep_equal))
  for (const item of read(path.join(author, 'manifest.json')).files) {
    const file = path.resolve(repo, item.path)
    assert.equal(hash(file), item.sha256)
    remember(file)
  }
  remember(path.join(author, 'manifest.json'))
  remember(reportFile)
  const sourceOnly = path.join(own, 'source-only.json')
  save(sourceOnly, {
    status: 'N29_NINE_WRITTEN_SEEDS_PLUS_SOURCE_DEFINITIONS_ONLY',
    seed: bind(path.join(tmp, 'n29-choice-author-first-07/seed.json')),
    supplementalDefinitionLesson: bind(path.join(core6g, 'editions/modern-us-neutral/lessons/geo68-c1-s13/lesson.json')),
    supplementalDefinitionBlocks: [2, 4], sourceRefs: ['p0056#8', 'p0056#10'],
    noWholeS13Approval: true, noCandidateKeysOrAuthorSolutions: true,
    images: 0, parentImageLoads: 0,
  })
  remember(sourceOnly)
  const postFIRST = path.join(own, 'post-FIRST.json')
  save(postFIRST, { status: 'ONLY_AFTER_INDEPENDENT_FIRST_ACTUAL_CHMOD_STAT_HASH',
    draft: bind(path.resolve(repo, report.changes.merged_draft_path)),
    authorReport: bind(reportFile), priorEightNotPreviouslyReviewed: true,
    currentQuestions: 9, currentSourceRecords: 9, images: 0 })
  remember(postFIRST)
  record = { status: 'N29_NINE_CHOICES_AUTHOR_ONLY_CURRENT_REVIEW_INPUTS_PREPARED',
    sourceOnly: bind(sourceOnly), postFIRST: bind(postFIRST), authorReport: bind(reportFile),
    oldEightQuestionsAndCoverageUnchanged: true, source370DefinitionResolvedForAuthoringOnly: true,
    originalHoldPreserved: true, independentSemanticReviewPending: true,
    noNewIndependentReviewerDispatched: true, parentImageLoads: 0 }
  relative = 'evidence/stemrobin188-6g-n29/choice370-source-supplement07'
} else if (stage === 'receive-n28-display') {
  const reviewer = path.join(tmp, 'n28-display-independent-review-07')
  const file = path.join(reviewer, 'report.json')
  assert.equal(hash(file), '59680625fda3d1c8d948726ec8838519cecdef687f8e5887fea47c51569c2172')
  const report = read(file)
  assert.equal(report.status, 'PASS')
  assert.equal(report.surfaces.length, 6)
  assert.ok(report.surfaces.every(item => item.status === 'PASS'))
  assert.equal(report.chargedImageLedger.chargedTotal, 8)
  assert.equal(report.preservationAndSessionClosure.ownedSessionsRemaining, 0)
  remember(file)
  const manifestFile = path.join(reviewer, 'manifest.json')
  remember(manifestFile)
  for (const item of read(manifestFile).derivedArtifacts) {
    const artifact = path.join(reviewer, item.file)
    assert.equal(hash(artifact), item.sha256)
    remember(artifact)
  }
  const resultFile = path.join(tmp, 'offline-display-6-8g_geo68-c2-s4-n28-choices/result.json')
  remember(resultFile)
  for (const item of read(resultFile).results) {
    assert.equal(hash(item.screenshot), item.screenshotSha256)
    remember(item.screenshot)
  }
  const receiptFile = path.join(tmp, 'n28n29-missing-display07/choices-28/execution.json')
  const receipt = read(receiptFile)
  assert.equal(receipt.exitCode, 0)
  remember(receiptFile)
  for (const item of Object.values(receipt.streams)) {
    assert.equal(hash(item.path), item.sha256)
    remember(item.path)
  }
  record = { status: 'N28_SIX_SURFACES_VISUAL_PASS_WITH_351_CONVERSION_DEFERRED',
    report: bind(file), visualImages: 8, originalScreenshots: 6, nativeCrops: 2,
    figure186ApprovalReused: true, displayOrMathReplays: 0,
    fullSourceChoiceCoverage: false, source351ExperimentsStillDeferred: true,
    noWholeCourseApproval: true }
  priorRecords = [
    'evidence/stemrobin188-6g-n28n29/missing-surface-display07/retention.json',
    'evidence/stemrobin188-6g-n28/choice-independent-retain07/retention.json',
  ]
  relative = 'evidence/stemrobin188-6g-n28/display-independent07'
} else if (stage === 'receive-source147-repair') {
  const repaired = path.join(tmp, 'source147-lexical-repair-08')
  const beforeFile = path.join(tmp, 'source6g147148-author-first-06/artifacts/6-8g/pages/0147/page.json')
  const afterFile = path.join(repaired, 'artifacts/6-8g/pages/0147/page.json')
  const expected = read(beforeFile)
  assert.ok(expected.blocks[9].lines[3].includes('全同'))
  expected.blocks[9].lines[3] = expected.blocks[9].lines[3].replace('全同', '合同')
  assert.deepEqual(read(afterFile), expected)
  const receipts = []
  for (const [name, exitCode] of [['finalize', 1], ['finalize-recovery01', 0]]) {
    const file = path.join(repaired, `${name}.execution.json`)
    const receipt = read(file)
    assert.equal(receipt.cwd, repo)
    assert.equal(receipt.exitCode, exitCode)
    remember(file)
    for (const stream of Object.values(receipt.streams)) {
      assert.equal(hash(stream.path), stream.sha256)
      remember(stream.path)
    }
    receipts.push({ stage: name, receipt: bind(file), exitCode })
  }
  remember(path.join(repaired, 'staging.json'))
  remember(path.join(repaired, 'runner.FIRST-readonly-failed.mjs'))
  remember(path.join(repaired, 'page.FIRST-readonly-failed.md'))
  remember(path.join(tmp, 'repair-source147-lexical-08.mjs'))
  for (const name of ['page.md', 'page.json', 'audit.json'])
    remember(path.join(repaired, 'artifacts/6-8g/pages/0147', name))
  record = { status: 'SOURCE147_ONE_WORD_REPAIR_MECHANICAL_PASS_AFFECTED_REVIEW_PENDING',
    output: bind(afterFile), receipts, printedAndMdRows: 26, figures: 0,
    exactChangedLocation: 'blocks[9].lines[3]: 全同 -> 合同',
    sourceMetadataAndOtherBlocksDeepEqual: true,
    initialFailure: 'PermissionError: working page.json mistakenly readonly',
    recovery: 'Only working page.json/audit.json made writable; originals/evidence unchanged',
    sourcePixelChanges: 0, independentAffectedReviewPending: true,
    canonicalSourceInstalled: false }
  priorRecords = ['evidence/stemrobin188-6g-source149150/independent-source08/retention.json']
  relative = 'evidence/stemrobin188-6g-source147/lexical-repair08'
} else if (stage === 'receive-source149150-review') {
  const reviewer = path.join(tmp, 'source149150-and147-glyph-independent-review-08')
  const file = path.join(reviewer, 'report.json')
  assert.equal(hash(file), 'e9347a387b3c806629f4c2b3d5ec54cb2a7fff4e2c0f716d227410829002b8df')
  const report = read(file)
  assert.ok(report.pages.every(page => page.readableSourceFidelity === 'PASS'))
  assert.equal(report.executionAudit.sessions.persistentExecRunning, 0)
  assert.equal(report.executionAudit.sessions.browserRunning, 0)
  const manifest = path.join(reviewer, 'SHA256SUMS')
  assert.equal(hash(manifest), '1b4a40a5bc5d866df03021802e13c865ce4b9dd01a3434bfbdef6a49a5d796e6')
  remember(manifest)
  for (const line of fs.readFileSync(manifest, 'utf8').trim().split('\n')) {
    const match = /^([0-9a-f]{64})  (.+)$/.exec(line)
    assert.ok(match, line)
    const artifact = path.resolve(reviewer, match[2])
    assert.ok(artifact.startsWith(reviewer + path.sep), artifact)
    assert.equal(hash(artifact), match[1])
    remember(artifact)
  }
  assert.equal(fs.statSync(path.join(reviewer, 'FIRST.json')).mode & 0o777, 0o444)
  record = { status: 'SOURCE149150_READABLE_PASS_147_LEXICAL_CORRECTION_REQUIRED',
    report: bind(file), pages: report.pages, affected147: report.affected147,
    localizedHolds: report.localizedHolds, boundaries: report.boundaries,
    imageAudit: report.imageAudit, originalAuthorBytesUnchanged: true,
    canonicalSourceInstalled: false, affected147CorrectionPending: true }
  priorRecords = ['evidence/stemrobin188-6g-source149150/author-first06/retention.json']
  relative = 'evidence/stemrobin188-6g-source149150/independent-source08'
} else if (stage === 'receive-n29-review') {
  const reviewer = path.join(tmp, 'n29-choice-independent-review-07')
  const manifestFile = path.join(reviewer, 'manifest.json')
  assert.equal(hash(manifestFile), '789b3e006aa847957cf01996de06e40de771ee746d35605bc50355c0dfd536c7')
  const manifest = read(manifestFile)
  remember(manifestFile)
  for (const item of manifest.owned_files) {
    const file = path.join(reviewer, item.path)
    assert.equal(hash(file), item.raw_sha256)
    remember(file)
  }
  const reviewFile = path.join(reviewer, 'review.json')
  const review = read(reviewFile)
  assert.equal(review.outcome, 'revise')
  const receiptFile = path.join(reviewer, 'validation-receipt.json')
  const receipt = read(receiptFile)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exit_code, 3)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
  const rejected = path.join(tmp, 'n29-choice370-definition-author-07/merged-draft.json')
  assert.equal(hash(rejected), receipt.hashes_before.draft)
  remember(rejected)
  record = { status: 'N29_FIRST_CHOICE_REVIEW_REVISE_369_REDUNDANCY_ONLY',
    review: bind(reviewFile), receipt: bind(receiptFile), rejectedDraft: bind(rejected),
    affected: manifest.affected_units, counts: manifest.counts,
    eightUnchangedQuestionsReusable: true, nineKeysAnd37OptionsMathematicsPass: true,
    repairScope: '369 response unit and affected 368/369 package relationship only',
    originalReviewAndDraftUnchanged: true, independentAffectedReviewPending: true }
  priorRecords = ['evidence/stemrobin188-6g-n29/choice370-source-supplement07/retention.json']
  relative = 'evidence/stemrobin188-6g-n29/choice-first-review07'
} else if (stage === 'receive-source151152' || stage === 'receive-source153154') {
  const later = stage === 'receive-source153154'
  const range = later ? '153154' : '151152'
  const author = path.join(tmp, `source6g${range}-author-first-07`)
  const reportFile = path.join(author, 'Report.json')
  assert.equal(hash(reportFile), later
    ? '49358b2e357348bcdb243dbf25cd2f649c9da06381411472fecbaa37d05cc172'
    : '206fb040e827078dfe58c1e46330a6de92b936eb01ee3717b343ee2cdb9f137f')
  const report = read(reportFile)
  assert.equal(report.status, 'AUTHOR_ONLY')
  assert.deepEqual(report.pages.map(page => page.physical), later ? [153, 154] : [151, 152])
  assert.equal(later ? report.execution_summary.all_own_exec_sessions_ended
    : report.delivery.all_own_exec_calls_ended, true)
  remember(reportFile)
  const manifest = path.join(author, later ? 'owned-files.sha256' : report.evidence.owned_path_hash_manifest)
  assert.equal(hash(manifest), later
    ? '3600d8c17e4256b0ce8a9e9bf85690c9bdd3e38d60f95a2dee0f52afa08072d6'
    : '6a1a44a94c8d45bb79b546e4bd2032777d62cf109103258c725c0b78b56d046f')
  remember(manifest)
  for (const line of fs.readFileSync(manifest, 'utf8').trim().split('\n')) {
    const match = /^([0-9a-f]{64})  (.+)$/.exec(line)
    assert.ok(match, line)
    const [, sha256, file] = match
    assert.ok(file.startsWith(author + path.sep), file)
    assert.equal(hash(file), sha256, file)
    remember(file)
  }
  const receipts = []
  if (later) {
    const first = path.join(author, report.FIRST.path)
    assert.equal(hash(first), report.FIRST.sha256)
    assert.equal(fs.statSync(first).mode & 0o777, 0o444)
  }
  for (const page of report.pages) {
    assert.equal(later ? page.lines.final_printed : page.source_rows,
      later ? page.lines.final_md : page.artifact_rows)
    for (const file of later ? [page.immutable_pre_finalize] : [page.first, page.pre_finalize])
      assert.equal(fs.statSync(path.join(author, file)).mode & 0o777, 0o444)
    const receiptFile = path.join(author, page.finalize_receipt)
    const receipt = read(receiptFile)
    assert.equal(receipt.cwd ?? receipt.workdir, repo)
    assert.equal(receipt.exit_code ?? receipt.exitCode, 0)
    if (!later) assert.equal(page.finalize_calls, 1)
    for (const stream of Object.values(receipt.streams))
      assert.equal(hash(stream.path), stream.sha256)
    receipts.push({ page: page.physical, receipt: bind(receiptFile), exitCode: 0 })
  }
  record = { status: `SOURCE${range}_AUTHOR_ONLY_RECEIVED_INDEPENDENT_REVIEW_PENDING`,
    report: bind(reportFile), receipts, pages: report.pages,
    figures: later ? report.pages.flatMap(page => page.figures) : report.figures,
    totals: report.totals ?? null, counters: report.counters ?? report.image_loads,
    unknown: report.unknown ?? report.pages.map(page => page.UNKNOWN).filter(Boolean),
    preparationReused: true, completeNextLessonClaimed: false,
    independentReviewPending: true,
    preparationAuthorityCorrection: later ? {
      originalReportUnchanged: true,
      actual: 'Parent supplied the completed prepare-range153154 command result (exit0, 2157ms) from this same chat history. It was not a direct human-supplied execution receipt.',
    } : null }
  relative = `evidence/stemrobin188-6g-source${range}/author-first07`
} else {
  const choice = path.join(tmp, 'n28-choice-author-first-06')
  const source = path.join(tmp, 'source147148-independent-review-06')
  assert.equal(hash(path.join(choice, 'Report.json')), 'a9df26170e0a0f41ca5348e0e6a24ab73342bd2f6fbd50ec0fa9b7689461ca94')
  assert.equal(hash(path.join(source, 'report.json')), 'b4677ed78addfa7d0fafb74170e4b299128b454443fce6d1519d398e50f2c415')
  const author = read(path.join(choice, 'Report.json'))
  for (const name of ['seed', 'draft', 'FIRST', 'FIRST_seal']) {
    const item = author.artifacts[name]
    assert.equal(hash(item.path), item.raw_sha256)
    remember(item.path)
  }
  for (const name of ['Report.json', 'manifest.json', 'structural-validation.execution.json',
    'structural-validation.stdout.txt', 'structural-validation.stderr.txt', 'inspect.execution.json',
    'inspect.stderr.txt']) remember(path.join(choice, name))
  const reviewer = read(path.join(source, 'report.json'))
  for (const item of Object.values(reviewer.ownEvidence)) {
    const file = path.join(source, item.file)
    assert.equal(hash(file), item.sha256)
    remember(file)
  }
  remember(path.join(source, 'report.json'))
  record = { status: 'COMPLETED_N28_AUTHOR_AND_SOURCE147148_REVIEW_RECEIVED',
    n28Author: bind(path.join(choice, 'Report.json')), choiceQuestions: 18,
    choiceSemanticReviewPending: true, choice351ExperimentsDeferred: true,
    sourceReview: bind(path.join(source, 'report.json')), source147Hold: reviewer.holds[0],
    source148VisibleFidelityPass: true, verified148Tail: reviewer.verified148TailFor149150,
    sourceReviewImages: 4, newParentImages: 0, printingRoleAndRightBoundaryHoldsPreserved: true }
  relative = 'evidence/stemrobin188-6g-n28n29/completed-receipts07'
}
record = { ...record, wholeLessonApproved: false, published: false, parentImageLoads: 0,
  sourceProducerReplays: 0, figureRendererReplays: 0, wholeBookRebuilds: 0 }
const file = path.join(own, 'record.json')
save(file, record)
remember(file)
remember(path.join(tmp, 'continue-n28n29-native-07.mjs'))
const retained = retainCurrent6g(relative, [...refs.values()], priorRecords, record)
console.log(JSON.stringify({ record: bind(file), retained }))
