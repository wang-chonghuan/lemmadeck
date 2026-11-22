import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const [stage] = process.argv.slice(2)
assert.ok(['install-n29', 'finalize-n28-interactions', 'receive-finished', 'retain-n28-choice',
  'receive-n29-choice-author'].includes(stage))
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
const retained = retainCurrent6g(relative, [...refs.values()], [], record)
console.log(JSON.stringify({ record: bind(file), retained }))
