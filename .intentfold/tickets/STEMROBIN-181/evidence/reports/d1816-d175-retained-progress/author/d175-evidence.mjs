import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { isDeepStrictEqual } from 'node:util'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d175-n12-local-text-repair')
const work = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d175/work')
const preparedPath = path.join(root, 'prepared.json')
const expectedPreparedHash = '48d7d21aed7b616b35cac4b59f1bdd3a503826f66d334d6738294a37e9a93b42'
const receipts = path.join(root, 'receipts')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const absolute = (file) => path.resolve(cwd, file)
const readJSON = (file) => JSON.parse(fs.readFileSync(absolute(file), 'utf8'))
function binding(file) {
  const full = absolute(file)
  assert.match(full, /\.(json|md|mjs|js|txt)$/)
  const bytes = fs.readFileSync(full)
  return { path: full, bytes: bytes.length, sha256: sha(bytes) }
}
function protectedBinding(file) {
  return { ...binding(file), mode: fs.statSync(absolute(file)).mode & 0o777 }
}
function writeNew(file, data) {
  const full = absolute(file)
  assert(full.startsWith(`${root}/`) || full.startsWith(`${work}/`))
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, data, { flag: 'wx' })
}
const writeJSON = (file, value) => writeNew(file, `${JSON.stringify(value, null, 2)}\n`)
const preparedBinding = binding(preparedPath)
assert.equal(preparedBinding.sha256, expectedPreparedHash)
const prepared = readJSON(preparedPath)
const originalReview = readJSON(prepared.originalReview.path)
const d170Root = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d170-n12-text-author')
const d170ReportPath = path.join(d170Root, 'report.json')
const d170Report = readJSON(d170ReportPath)
const sourceOnly = readJSON(prepared.sourceOnly.path)
const baselinePath = path.join(receipts, 'd175-001-input-bindings.json')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const assigned = { 'modern-us-neutral': [0], 'modern-us-neutral-en': [0, 3, 7] }
const lessonPath = (edition) => prepared.copies.find((copy) =>
  copy.workingBeforeRepair.path.includes(`/${edition}/`) &&
  copy.workingBeforeRepair.path.endsWith('/lesson.template.json')).workingBeforeRepair.path
const nativePaths = (edition) => {
  const language = edition.endsWith('-en') ? 'en' : 'zh'
  const stem = `d175-${language === 'zh' ? '002' : '003'}-prose-flow-${language}`
  return {
    receipt: path.join(receipts, `${stem}.json`),
    stdout: path.join(receipts, `${stem}.stdout.json`),
    stderr: path.join(receipts, `${stem}.stderr.txt`),
  }
}
function declaredBindings(value, result = []) {
  if (!value || typeof value !== 'object') return result
  if (typeof value.path === 'string' && Number.isInteger(value.bytes) && typeof value.sha256 === 'string') {
    result.push(value)
  }
  for (const item of Object.values(value)) declaredBindings(item, result)
  return result
}
function assertDeclared(item) {
  assert.deepEqual(binding(item.path), { path: absolute(item.path), bytes: item.bytes, sha256: item.sha256 })
}
function differences(before, after, pointer = '') {
  if (isDeepStrictEqual(before, after)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object' &&
      Array.isArray(before) === Array.isArray(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    return keys.flatMap((key) => differences(before[key], after[key], `${pointer}/${key}`))
  }
  return [pointer]
}
function copyFor(edition, filename) {
  return prepared.copies.find((copy) => copy.workingBeforeRepair.path.includes(`/${edition}/`) &&
    copy.workingBeforeRepair.path.endsWith(`/${filename}`))
}

function capture() {
  assert.equal(fs.existsSync(baselinePath), false, 'Input capture must not be replayed')
  const declared = declaredBindings(prepared)
  for (const item of declared) assertDeclared(item)
  for (const item of declaredBindings(originalReview.reusedD170MechanicalEvidence.evidence)) assertDeclared(item)
  assertDeclared(sourceOnly.originalLesson)
  assertDeclared(sourceOnly.originalExercises)
  for (const copy of prepared.copies) {
    assert(fs.readFileSync(copy.before.path).equals(fs.readFileSync(copy.workingBeforeRepair.path)))
    assert(fs.statSync(copy.workingBeforeRepair.path).mode & 0o200, 'Prepared template must be writable')
  }
  const paths = new Set([
    ...declared.map((item) => absolute(item.path)),
    ...declaredBindings(originalReview.reusedD170MechanicalEvidence.evidence).map((item) => absolute(item.path)),
    sourceOnly.originalLesson.path,
    sourceOnly.originalExercises.path,
    path.join(path.dirname(sourceOnly.originalLesson.path), 'lesson.md'),
    preparedPath,
    path.join(root, 'dispatch-record.json'),
    d170ReportPath,
    path.join(d170Root, 'author-freeze.json'),
    path.join(d170Root, 'receipts/001-discovery-failed.json'),
    path.join(d170Root, 'receipts/002-source-path-failed.json'),
    path.join(d170Root, 'receipts/003-metadata-discovery-failed.json'),
    '.intentfold/readme.md',
    '.intentfold/charter/engineering.md',
    '.intentfold/charter/operations.md',
    '.intentfold/charter/product.md',
    '.intentfold/project.json',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  ].map(absolute))
  for (const copy of prepared.copies) {
    const oldWorking = copy.workingBeforeRepair.path.replace('/d1816-d175/', '/d1816-d170/')
    paths.add(oldWorking)
  }
  const mutableLessons = new Set(editions.map(lessonPath))
  const protectedFiles = [...paths].filter((file) => !mutableLessons.has(file)).map(protectedBinding)
  writeJSON(baselinePath, {
    schema: 'stemrobin181.d175.input-bindings.v1',
    batch: 'D175',
    cwd,
    capturedAt: new Date().toISOString(),
    prepared: preparedBinding,
    templatesBefore: prepared.copies.map((copy) => protectedBinding(copy.workingBeforeRepair.path)),
    protectedFiles,
    sourcePDF: {
      sha256: readJSON(prepared.sourceBaseline.path).sourceBindings.sourcePDFIdentityFromPageMetadataOnly,
      attribution: 'Inherited page/source baseline metadata only; no PDF/image read or new hash.',
    },
    expectedTextPointers: prepared.changedTextPointers,
    imageBytesRead: 0,
    imageOpens: 0,
    setupFreshnessGrillReplays: 0,
  })
  console.log(JSON.stringify({ status: 'D175_INPUTS_BOUND_ONLY', receipt: binding(baselinePath) }))
}

function native(edition) {
  assert(editions.includes(edition))
  assert(fs.existsSync(baselinePath), 'Input capture is required')
  const files = nativePaths(edition)
  for (const file of Object.values(files)) assert.equal(fs.existsSync(file), false, 'Native stage must not be replayed')
  const input = lessonPath(edition)
  const before = readJSON(copyFor(edition, 'lesson.template.json').before.path)
  const after = readJSON(input)
  assert.deepEqual(differences(before, after).sort(), prepared.changedTextPointers[edition].slice().sort())
  assert.deepEqual(after.section_breaks, before.section_breaks)
  const command = [process.execPath, path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', input]
  const inputBinding = binding(input)
  const startedAt = new Date().toISOString()
  const start = process.hrtime.bigint()
  const result = spawnSync(command[0], command.slice(1), { cwd, encoding: null, maxBuffer: 8 * 1024 * 1024 })
  const durationMs = Number(process.hrtime.bigint() - start) / 1e6
  const endedAt = new Date().toISOString()
  writeNew(files.stdout, result.stdout ?? Buffer.alloc(0))
  writeNew(files.stderr, result.stderr ?? Buffer.alloc(0))
  writeJSON(files.receipt, {
    schema: 'stemrobin181.d175.native-prose-receipt.v1',
    batch: 'D175',
    edition,
    cwd,
    command,
    commandText: command.map((arg) => `'${arg.replaceAll("'", "'\\''")}'`).join(' '),
    startedAt,
    endedAt,
    durationMs,
    exitCode: result.status,
    signal: result.signal,
    executionError: result.error ? String(result.error) : null,
    inputBefore: inputBinding,
    inputAfter: binding(input),
    tool: binding(command[1]),
    sharedParser: binding('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    executable: process.execPath,
    nodeVersion: process.version,
    stdout: binding(files.stdout),
    stderr: binding(files.stderr),
    success: result.status === 0 && !result.error,
    classification: result.status === 0 && !result.error ? 'native_mechanics_only' : 'technical_execution_failure_not_science',
    nativeCallsForThisLanguage: 1,
    historicalParserReplayed: false,
    candidateMode: 'Assigned text changed; all existing anchors untouched and outside changed blocks.',
  })
  console.log(JSON.stringify({ receipt: binding(files.receipt), exitCode: result.status, stdout: binding(files.stdout) }))
  if (result.status !== 0 || result.error) process.exitCode = 2
}

function finish() {
  const startedAt = new Date().toISOString()
  const baseline = readJSON(baselinePath)
  const checks = []
  const check = (name, condition) => {
    assert(condition, name)
    checks.push({ name, passed: true })
  }
  for (const old of baseline.protectedFiles) {
    assert.deepEqual(protectedBinding(old.path), old, `Protected bytes/mode changed: ${old.path}`)
  }
  check('Every bound protected source/history/evidence/template file retains exact bytes, SHA and permissions.', true)
  const source = readJSON(sourceOnly.originalLesson.path)
  const affectedTexts = []
  const templateChecks = []
  const outlineEvidence = []
  for (const edition of editions) {
    const copy = copyFor(edition, 'lesson.template.json')
    const oldBytes = fs.readFileSync(copy.before.path)
    const currentBytes = fs.readFileSync(copy.workingBeforeRepair.path)
    const before = JSON.parse(oldBytes)
    const after = JSON.parse(currentBytes)
    const changedPointers = differences(before, after)
    assert.deepEqual(changedPointers.sort(), prepared.changedTextPointers[edition].slice().sort())
    let expectedBytes = oldBytes.toString('utf8')
    for (const index of assigned[edition]) {
      const oldText = before.prose[index].text
      const newText = after.prose[index].text
      const oldJSON = JSON.stringify(oldText)
      check(`${edition}: assigned text ${index} has exactly one byte-level replacement target`, expectedBytes.split(oldJSON).length === 2)
      expectedBytes = expectedBytes.replace(oldJSON, JSON.stringify(newText))
      const math = (text) => [...text.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g)].map((m) => m[0])
      const numbers = (text) => text.match(/[0-9]+(?:\.[0-9]+)*/g) ?? []
      assert.deepEqual(math(newText), math(oldText))
      assert.deepEqual(numbers(newText), numbers(oldText))
      affectedTexts.push({
        edition,
        pointer: `/prose/${index}/text`,
        sourceRefs: before.prose[index].source_refs,
        beforeText: oldText,
        afterText: newText,
        beforeUtf8: { bytes: Buffer.byteLength(oldText), sha256: sha(Buffer.from(oldText)) },
        afterUtf8: { bytes: Buffer.byteLength(newText), sha256: sha(Buffer.from(newText)) },
        mathTokensBefore: math(oldText),
        mathTokensAfter: math(newText),
        numberTokensBefore: numbers(oldText),
        numberTokensAfter: numbers(newText),
      })
    }
    check(`${edition}: exact file bytes differ only by assigned JSON text string replacements`, Buffer.from(expectedBytes).equals(currentBytes))
    assert.deepEqual(after.source, before.source)
    assert.deepEqual(after.source.data, source)
    assert.deepEqual(after.section_breaks, before.section_breaks)
    assert.deepEqual(after.errata, before.errata)
    check(`${edition}: source snapshot, anchors and empty errata unchanged`, true)
    check(`${edition}: block count/order/metadata/declarations/formulas/numbers and every unassigned field unchanged`, true)
    const files = nativePaths(edition)
    const receipt = readJSON(files.receipt)
    check(`${edition}: exactly one new native outline succeeded`, receipt.success && receipt.exitCode === 0 && receipt.nativeCallsForThisLanguage === 1)
    assert.deepEqual(receipt.inputBefore, binding(copy.workingBeforeRepair.path))
    assert.deepEqual(receipt.inputAfter, receipt.inputBefore)
    assertDeclared(receipt.stdout)
    assertDeclared(receipt.stderr)
    const outline = readJSON(files.stdout)
    const actualPairs = outline.boundaries.map(({ before: preceding, after: following }) => ({ before: preceding, after: following }))
    assert.deepEqual(actualPairs, after.section_breaks)
    check(`${edition}: unchanged concept anchors resolve to the ACTUAL native-reported boundary pairs`, true)
    outlineEvidence.push({
      edition,
      input: binding(copy.workingBeforeRepair.path),
      changedOutline: binding(files.stdout),
      commandReceipt: binding(files.receipt),
      stderr: binding(files.stderr),
      actualToolBoundaries: outline.boundaries,
      paragraphCountReportedByTool: outline.paragraphs.length,
      sectionAnchorsChanged: 0,
      parserCalls: 1,
    })
    templateChecks.push({
      edition,
      before: binding(copy.before.path),
      candidate: binding(copy.workingBeforeRepair.path),
      changedTextPointers: changedPointers,
      sectionAnchorsChanged: 0,
      unaffectedBlockCount: before.prose.length - assigned[edition].length,
      exactOtherBytesPreserved: true,
    })
  }
  for (const copy of prepared.copies.filter((item) => !item.workingBeforeRepair.path.endsWith('/lesson.template.json'))) {
    check(`Protected exercise/figure template exact equality: ${copy.workingBeforeRepair.path}`,
      fs.readFileSync(copy.before.path).equals(fs.readFileSync(copy.workingBeforeRepair.path)))
    assertDeclared(copy.workingBeforeRepair)
  }
  const en = readJSON(lessonPath('modern-us-neutral-en'))
  const zh = readJSON(lessonPath('modern-us-neutral'))
  const oldEn = readJSON(copyFor('modern-us-neutral-en', 'lesson.template.json').before.path)
  const oldZh = readJSON(copyFor('modern-us-neutral', 'lesson.template.json').before.path)
  check('ZH thermometry reference and following variable sentence exactly retained',
    zh.prose[0].text.split('\n\n')[1] === oldZh.prose[0].text.split('\n\n')[1])
  check('EN thermometry reference and following variable sentence exactly retained',
    en.prose[0].text.split('\n\n')[1] === oldEn.prose[0].text.split('\n\n')[1])
  check('EN entire source-attributed heat-reservoir paragraph exactly retained',
    en.prose[3].text.split('\n\n')[1] === oldEn.prose[3].text.split('\n\n')[1])
  check('EN Mariotte attribution and fixed-mass/model qualification paragraphs exactly retained',
    en.prose[7].text.split('\n\n').slice(0, 2).join('\n\n') === oldEn.prose[7].text.split('\n\n').slice(0, 2).join('\n\n'))
  check('ZH fixed amount and at-least-one adjustment/optional constant wording present',
    zh.prose[0].text.includes('一定量的同一份气体') && zh.prose[0].text.includes('至少有另一个参量随之调整') &&
    zh.prose[0].text.includes('不一定全部改变') && zh.prose[0].text.includes('另一个参量也可以保持不变'))
  check('EN fixed amount and at-least-one adjustment/optional constant wording present',
    en.prose[0].text.includes('fixed amount of the same gas') && en.prose[0].text.includes('at least one other variable must adjust') &&
    en.prose[0].text.includes('do not all have to change') && en.prose[0].text.includes('another variable may be held constant'))
  check('EN thermodynamic-state/phase/process distinction is explicitly named in assigned block',
    en.prose[3].text.includes('thermodynamic state') && en.prose[3].text.includes('not a change of physical phase') &&
    en.prose[3].text.includes('pressure and volume change') && en.prose[3].text.includes('remains a gas') &&
    en.prose[3].text.includes('temperature stays constant') && en.prose[3].text.includes('isothermal process'))
  check('EN ratio states explicitly have same temperature and gas amount, without isothermal-states phrase',
    en.prose[7].text.includes('two states of the same fixed amount of gas at the same temperature') &&
    !en.prose[7].text.includes('two isothermal states'))
  const frozenTemplates = []
  for (const copy of prepared.copies) {
    const edition = editions.find((item) => copy.workingBeforeRepair.path.includes(`/${item}/`))
    const destination = path.join(root, 'frozen', edition, path.basename(copy.workingBeforeRepair.path))
    assert.equal(fs.existsSync(destination), false, 'Never overwrite a frozen snapshot')
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(copy.workingBeforeRepair.path, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o444)
    check(`New frozen snapshot equals current template: ${destination}`,
      fs.readFileSync(destination).equals(fs.readFileSync(copy.workingBeforeRepair.path)))
    frozenTemplates.push({
      edition,
      filename: path.basename(destination),
      before: copy.before,
      candidate: binding(copy.workingBeforeRepair.path),
      frozen: binding(destination),
      snapshotMode: fs.statSync(destination).mode & 0o777,
    })
  }
  for (const old of baseline.protectedFiles) assert.deepEqual(protectedBinding(old.path), old)
  const counts = {
    inheritedLocalTextRepairs: 0,
    contentRepairAttempts: 1,
    contentRepairTotal: 1,
    changedTextFields: 4,
    newNativeCalls: 2,
    nativeProseFlow: 2,
    changedOutlines: 2,
    maximumChangedOutlines: 2,
    newNativeCallsPerLanguage: { zh: 1, en: 1 },
    nativeProseFlowFailures: 0,
    nativePrepare: 0,
    nativeChecker: 0,
    nativeFinalize: 0,
    nativeRender: 0,
    historicalPrepareReused: 2,
    historicalProseFlowReused: 2,
    historicalNativeCheckerReused: 1,
    focusedExactDiffRuns: 1,
    frozenTemplates: 6,
    sectionAnchorsChanged: 0,
    images: 0,
    imageOpens: 0,
    imageBytesRead: 0,
    browserCalls: 0,
    screenshots: 0,
    paidCalls: 0,
    modelAPICalls: 0,
    databaseCalls: 0,
    publisherCalls: 0,
    gitCommands: 0,
    commits: 0,
    pushes: 0,
    deployCalls: 0,
    mergeCalls: 0,
    closureCalls: 0,
    peerMessages: 0,
    setupReplays: 0,
    freshnessReplays: 0,
    grillReplays: 0,
    passedStageReplays: 0,
    sourceReviewReplays: 0,
    unaffectedSemanticRereviews: 0,
    independentApprovals: 0,
    canonicalPromotions: 0,
    completeCoursesAdded: 0,
    courseApprovals: 0,
  }
  const evidencePath = path.join(receipts, 'd175-004-focused-exact-diff-and-freeze.json')
  writeJSON(evidencePath, {
    schema: 'stemrobin181.d175.focused-exact-diff.v1',
    batch: 'D175',
    cwd,
    command: [process.execPath, path.join(root, 'd175-evidence.mjs'), 'finish'],
    startedAt,
    endedAt: new Date().toISOString(),
    exitCode: 0,
    result: 'FOCUSED_EXACT_DIFF_AND_NATIVE_OUTLINE_ONLY',
    baseline: binding(baselinePath),
    checks,
    affectedTexts,
    templates: templateChecks,
    protectedFiles: baseline.protectedFiles,
    protectedBytesAndModesUnchanged: true,
    changedOutlineEvidence: outlineEvidence,
    frozenTemplates,
    counts,
    independentScienceOrLanguageApproval: false,
  })
  const reportPath = path.join(root, 'report.json')
  const freezePath = path.join(root, 'author-freeze.json')
  const approvals = {
    independentScienceApproval: false,
    independentZhApproval: false,
    independentEnApproval: false,
    textApproval: false,
    figureApproval: false,
    figureScientificApproval: false,
    figureVisualApproval: false,
    courseApproval: false,
    wholeCourseApproved: false,
    productAcceptance: false,
    formalHandoff: false,
    promoted: false,
    closed: false,
  }
  const findings = [
    {
      id: 'F1',
      authorAction: 'Fixed-amount qualification and at-least-one coupled-variable adjustment; not all variables must change, and another may be constant according to process.',
      affectedPointers: { 'modern-us-neutral': ['/prose/0/text'], 'modern-us-neutral-en': ['/prose/0/text'] },
      independentVerdict: 'pending_parent_affected_only_review',
    },
    {
      id: 'F2',
      authorAction: 'Thermodynamic state explicitly described by pressure/volume/temperature and distinguished from physical phase; constant-temperature pressure/volume process while remaining gas; ratio connects two same-temperature states of the same fixed gas amount.',
      affectedPointers: { 'modern-us-neutral-en': ['/prose/3/text', '/prose/7/text'] },
      independentVerdict: 'pending_parent_affected_only_review',
    },
  ]
  const reused = {
    historicalNativeEvidence: originalReview.reusedD170MechanicalEvidence,
    historicalAuthorMechanicalEvidence: d170Report.authorMechanicalEvidence,
    unchangedObservations: prepared.unaffectedReviewBlocks,
    observationsSource: binding(prepared.originalReview.path),
    semanticRereviewOfUnaffectedBlocks: false,
    freshIndependentApprovals: 0,
  }
  const report = {
    schema: 'stemrobin181.d175.local-text-repair-author.v1',
    ticket: 'STEMROBIN-181',
    batch: 'D175',
    role: 'FIRST_LOCAL_TEXT_REPAIR_AUTHOR',
    cwd,
    date: new Date().toISOString(),
    book: '9p',
    lesson: prepared.lesson,
    status: 'authorready',
    statusScope: 'One local text repair frozen for parent collection and affected-only review; no independent approval, promotion or closure.',
    authorization: 'Direct human D175 instruction; same invocation setup/freshness/grill already satisfied and not repeated.',
    prepared: preparedBinding,
    dispatch: binding(path.join(root, 'dispatch-record.json')),
    inputBindings: binding(baselinePath),
    originalFail: binding(prepared.originalReview.path),
    originalReviewFreeze: binding(prepared.originalReviewFreeze.path),
    sourceOnly: binding(prepared.sourceOnly.path),
    sourceBaseline: binding(prepared.sourceBaseline.path),
    sourceLesson: binding(sourceOnly.originalLesson.path),
    sourceExercises: binding(sourceOnly.originalExercises.path),
    sourcePassComposition: prepared.sourcePassComposition,
    sourcePDF: baseline.sourcePDF,
    requiredFindingRepairs: findings,
    affectedTexts,
    changedTextPointers: prepared.changedTextPointers,
    sectionAnchorsChanged: 0,
    changedOutlineEvidence: outlineEvidence,
    authorMechanicalEvidence: binding(evidencePath),
    frozenTemplates,
    protectedFiles: baseline.protectedFiles,
    protectedBytesAndModesUnchanged: true,
    originalD171FailPreserved: true,
    originalD170FrozenSnapshotsPreserved: true,
    sourceAttributedNonblockingLimits: prepared.sourceAttributedNonblockingLimits,
    nonTextHolds: [
      { id: 'fig18-tiny-gauge-and-ruler-numeric-interpretation', status: 'HOLD', unchanged: true },
      { id: 'fig17-18-19-unapproved', status: 'HOLD', unchanged: true },
    ],
    preservation: {
      sourceSnapshotsRefsDeclarationsHistory: 'Exact unchanged fields and file bytes outside assigned string replacements.',
      formulasVariablesNumbers: 'Every existing assigned-block math token and digit token preserved in sequence; all other bytes unchanged.',
      heatReservoirAttribution: 'Entire EN block 4 source-model paragraph exactly retained.',
      thermometryReference: 'Both block 1 second paragraphs exactly retained, including section 11.',
      boyle1660: 'Unchanged, source-attributed, no alternative date or erratum.',
      page36Footnotes: 'Both complete source/modern footnote blocks and N12 identities unchanged.',
      mercury: 'Unchanged historical-only account and hazard warning; no operating procedure.',
      exercisesAndFigureTemplates: 'All four protected current templates and D170 originals byte-identical.',
      figurePixels: 'Not opened, rendered, read or newly hashed.',
      n5Fig02Fig03: 'Outside scope; no path touched or inspected.',
    },
    reused,
    counts,
    ...approvals,
    executionFailures: [],
    onlyWritableRoots: [root, work],
    authorFreezePath: freezePath,
    next: 'Await parent collection, affected-only independent review and parent-controlled closure. Do not self-promote or message peers.',
  }
  writeJSON(reportPath, report)
  const evidenceFiles = [
    path.join(root, 'd175-evidence.mjs'),
    baselinePath,
    ...editions.flatMap((edition) => Object.values(nativePaths(edition))),
    evidencePath,
  ]
  writeJSON(freezePath, {
    schema: 'stemrobin181.d175.author-freeze.v1',
    ticket: 'STEMROBIN-181',
    batch: 'D175',
    role: 'FIRST_LOCAL_TEXT_REPAIR_AUTHOR',
    book: '9p',
    lesson: prepared.lesson,
    cwd,
    frozenAt: new Date().toISOString(),
    status: 'authorready_awaiting_parent_collection',
    report: binding(reportPath),
    prepared: preparedBinding,
    inputBindings: binding(baselinePath),
    originalFail: binding(prepared.originalReview.path),
    originalReviewFreeze: binding(prepared.originalReviewFreeze.path),
    sourceOnly: binding(prepared.sourceOnly.path),
    sourceBaseline: binding(prepared.sourceBaseline.path),
    sourceLesson: binding(sourceOnly.originalLesson.path),
    sourceExercises: binding(sourceOnly.originalExercises.path),
    sourcePassComposition: prepared.sourcePassComposition,
    sourcePDF: baseline.sourcePDF,
    candidatesAndFrozenTemplates: frozenTemplates,
    changedOutlineEvidence: outlineEvidence,
    protectedFiles: baseline.protectedFiles,
    evidence: evidenceFiles.map(binding),
    requiredFindingIdsRepairedByAuthor: ['F1', 'F2'],
    requiredFindingsIndependentVerdict: 'pending_parent_affected_only_review',
    reused,
    counts,
    ...approvals,
    nonTextHolds: report.nonTextHolds,
    protectedBytesAndModesUnchanged: true,
    snapshotChmodScope: 'Exactly six newly created D175/frozen/<edition>/* templates only, mode 0444.',
    bindingPolicy: 'Absolute path + exact byte length + SHA256 of current files. Report bound by freeze; no circular report/freeze self-hash. No pixel/PDF bytes read. Native stdout/stderr preserved exactly.',
    next: report.next,
  })
  console.log(JSON.stringify({
    status: 'authorready',
    report: binding(reportPath),
    authorFreeze: binding(freezePath),
    templates: frozenTemplates.map(({ edition, filename, frozen }) => ({ edition, filename, ...frozen })),
    counts,
    inheritedHolds: report.nonTextHolds,
  }, null, 2))
}

const stage = process.argv[2]
try {
  if (stage === 'capture') capture()
  else if (stage === 'native') native(process.argv[3])
  else if (stage === 'finish') finish()
  else throw new Error('Usage: d175-evidence.mjs capture | native <edition> | finish')
} catch (error) {
  const failurePath = path.join(receipts, `d175-failure-${stage}-${Date.now()}.json`)
  writeJSON(failurePath, {
    batch: 'D175',
    cwd,
    command: [process.execPath, ...process.argv.slice(1)],
    observedAt: new Date().toISOString(),
    exitCode: 2,
    classification: 'technical_evidence_execution_failure_not_scientific_verdict',
    message: String(error),
    stack: error.stack,
    nativeStageNotReplayed: true,
  })
  console.error(JSON.stringify({ failure: binding(failurePath), error: String(error) }))
  process.exitCode = 2
}
