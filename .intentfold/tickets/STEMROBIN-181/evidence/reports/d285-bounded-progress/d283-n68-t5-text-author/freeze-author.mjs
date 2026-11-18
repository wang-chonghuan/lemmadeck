import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const output = name => bound(path.join(out, name))
const writeNew = (name, data) => {
  const target = path.join(out, name)
  assert(!fs.existsSync(target), `Do not overwrite ${target}`)
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return bound(target)
}
for (const name of ['verification.json', 'report.json', 'author-freeze.json']) {
  assert(!fs.existsSync(path.join(out, name)), `Already frozen: ${name}`)
}
const binding = local('source-binding.json')
const texts = local('texts.json')
const register = local('change-register.json')
const pending = local('sci-pending.json')
const opens = local('actual-opens.json')
const initialCheck = local('mechanical-text-check/stdout.json')
const finalCheck = local('mechanical-text-check-repair/stdout.json')
const initialReceipt = local('mechanical-text-check/receipt.json')
const finalReceipt = local('mechanical-text-check-repair/receipt.json')
const retained = local('retained-initial-check-fail/manifest.json')
const uniqueInputs = [...new Map(
  [...binding.preservedInputs, ...binding.contracts, binding.inherited].map(item => [item.path, item]),
).values()]
for (const item of uniqueInputs) assert.equal(hash(item.path), item.sha256, item.path)
for (const item of retained.artifacts) assert.equal(hash(item.path), item.sha256, item.path)
assert.equal(binding.manifest.sha256, '3df0e50fcec210657b9a7ab7fb94cb7bc64dd36f24de0fa266acaeb1b775023f')
assert.deepEqual(opens.opens, [])
assert.deepEqual(opens.budget, {
  inheritedImages: 24, newImages: 0, cumulativeContextImages: 24,
  maximum: 24, reset: false, remaining: 0,
})
assert.equal(initialReceipt.exitCode, 1)
assert.equal(initialCheck.mechanicalStatus, 'FAIL')
assert.deepEqual(initialCheck.errors, [
  "n68/en/prose[5] 的非公式数字变化未被准确声明: want=['6.4'], got=[]",
])
assert.equal(finalReceipt.exitCode, 0)
assert.equal(finalCheck.mechanicalStatus, 'MATCH')
assert.deepEqual(finalCheck.errors, [])
assert.equal(register.localMechanicalRepair.count, 1)
assert.equal(register.localMechanicalRepair.target, 'n68/en/lesson.prose[5]')
assert.equal(register.changes.length, 74)
assert.deepEqual(pending.mandatoryUnitDecisions.map(item => item.id), ['N68-U001', 'T5-U001'])
for (const hold of pending.mandatoryUnitDecisions) {
  assert.equal(hold.candidateUnitChangeApplied, false)
  assert.equal(hold.sourceCorrectionApplied, false)
  assert.equal(hold.sourceErrataInvented, false)
  assert.equal(hold.publicationBlockedUntilDecision, true)
}

// Compare the entire native object after removing only author-owned fields.
function invariantObject(document, name) {
  const result = structuredClone(document)
  delete result.authoring
  if (name === 'lesson') delete result.section_breaks
  const items = name === 'lesson' ? result.prose : result.exercises
  for (const item of items) {
    for (const key of ['text', 'changes', 'numeric_changes', 'historical_entities', 'author_review']) {
      delete item[key]
    }
    if (name === 'exercises') delete item.lines
  }
  return result
}
const candidates = []
const cardReports = []
for (const card of binding.cards) {
  const native = Object.fromEntries(card.templates.map(item => [item.name, read(item.nativePrepared.path)]))
  assert.deepEqual(native.lesson.source.data, read(card.sourceLesson.path))
  assert.deepEqual(native.exercises.source.data, read(card.sourceExercises.path))
  const expectedCount = card.alias === 'n68' ? 4 : 7
  const languages = []
  for (const language of ['zh', 'en']) {
    const folder = path.join(out, 'frozen', card.alias, language)
    const lesson = read(path.join(folder, 'lesson.template.json'))
    const exercises = read(path.join(folder, 'exercises.template.json'))
    const figuresPath = path.join(folder, 'figures.template.json')
    assert.equal(hash(figuresPath), card.templates.find(item => item.name === 'figures').nativePrepared.sha256)
    assert.deepEqual(invariantObject(lesson, 'lesson'), invariantObject(native.lesson, 'lesson'))
    assert.deepEqual(invariantObject(exercises, 'exercises'), invariantObject(native.exercises, 'exercises'))
    assert.equal(lesson.prose.length, card.alias === 'n68' ? 26 : 0)
    assert.equal(exercises.exercises.length, expectedCount)
    assert.deepEqual(exercises.exercises.map(item => item.number),
      Array.from({ length: expectedCount }, (_, index) => String(index + 1)))
    for (const [name, items] of [['prose', lesson.prose], ['exercises', exercises.exercises]]) {
      items.forEach((item, index) => {
        assert.equal(item.text, texts[card.alias][name][index][language])
        assert.deepEqual(item.numeric_changes, [])
        assert.deepEqual(item.historical_entities, [])
        assert(!/<span\b|<strong\b|<em\b/i.test(item.text), 'No hand-wrapped text')
        if (name === 'exercises') assert.deepEqual(item.lines, item.text.split('\n'))
        const target = `${name === 'prose' ? 'lesson.prose' : 'exercises.exercises'}[${index}]`
        const change = register.changes.find(item =>
          item.alias === card.alias && item.language === language && item.target === target)
        assert(change)
        assert.equal(change.authored_text, item.text)
        assert.equal(change.source_text, item.source_text)
        assert.deepEqual(change.source_refs, name === 'prose' ? item.source_refs : item.pages)
      })
    }
    if (card.alias === 't5') {
      assert.deepEqual(exercises.exercises[2].pages, ['p0179#13', 'p0180#1'])
      assert(exercises.exercises.every(item => item.figure_refs.length === 0 && item.figures.length === 0))
      assert.equal(exercises.exercises[4].author_review.status, 'HOLD-UNIT-SCI')
      assert.equal(lesson.figures.length, 0)
    } else {
      assert.deepEqual(lesson.figures.map(item => item.id), ['fig-135', 'fig-136'])
      assert.equal(lesson.prose[25].author_review.status, 'HOLD-UNIT-SCI')
      assert.equal(lesson.prose.filter(item => item.kind === 'fig' && item.text === '').length, 2)
    }
    const flowBinding = register.proseFlowReports.find(item => item.card === card.card && item.language === language)
    assert.equal(hash(flowBinding.report.path), flowBinding.report.sha256)
    assert.equal(hash(flowBinding.receipt.path), flowBinding.receipt.sha256)
    const flowReceipt = read(flowBinding.receipt.path)
    assert.equal(flowReceipt.exitCode, 0)
    const flow = read(flowBinding.report.path)
    assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
    const candidate = {
      card: card.card, alias: card.alias, language,
      templates: ['lesson', 'exercises', 'figures'].map(name => ({
        name, ...bound(path.join(folder, `${name}.template.json`)),
      })),
      proseFlow: { report: flowBinding.report, receipt: flowBinding.receipt },
    }
    candidates.push(candidate)
    const checked = finalCheck.reports.find(item => item.card === card.card && item.language === language)
    assert(checked)
    assert.equal(checked.targets.length, lesson.prose.length + expectedCount)
    assert(checked.targets.every(item => item.errors.length === 0 &&
      item.formulaSignatureUnchanged && item.numericAndReferenceSignatureUnchanged &&
      item.sourceRefsAndIdentityUnchanged))
    languages.push({
      language, proseBlocks: lesson.prose.length, originalQuestions: expectedCount,
      finalProseFlowParagraphs: flow.paragraphs.length,
      sourceSnapshotsRefsPagesGroupsAndFormulaNumericSignatures: 'UNCHANGED',
      authoredStatus: 'FROZEN-DRAFT-INDEPENDENT-SCI-ZHEN-PENDING',
    })
  }
  cardReports.push({
    card: card.card, alias: card.alias, languages,
    unitHolds: pending.mandatoryUnitDecisions.filter(item => item.card === card.alias),
    modernFigures: card.alias === 'n68'
      ? { ids: ['fig-135', 'fig-136'], status: 'PENDING-NOT-AUTHORED-OR-OBSERVED' }
      : { ids: [], status: 'NONE-IN-BOUND-SOURCE' },
    wholeCardPASS: false, independentPASS: false,
  })
}
const verification = writeNew('verification.json', {
  schema: 'bounded-n68-t5-first-text-author-freeze-verification@1',
  scope: 'Author-side complete-object, hash, native text-signature and saved prose-flow checks only.',
  status: 'MATCH-NOT-INDEPENDENT-REVIEW',
  sourceBinding: output('source-binding.json'),
  inputHashesRechecked: uniqueInputs.length,
  allBoundSourceAndContractBytesUnchanged: true,
  retainedInitialFAILBytesUnchanged: true,
  candidateTemplates: 12, cards: cardReports,
  source_text_source_data_refs_pages_groups_and_identity_unchanged: true,
  formulaAndNumericSignatureTargetsMatched: finalCheck.reports.reduce((sum, item) => sum + item.targets.length, 0),
  emptyT5ProsePreserved: true, t5Q3CrossPageRefsClosed: true,
  nativeFigureTemplatesByteIdentical: true,
  nativeTextCheck: { report: output('mechanical-text-check-repair/stdout.json'), receipt: output('mechanical-text-check-repair/receipt.json') },
  newImages: 0, cumulativeImages: 24, independentPASS: false, wholeCardPASS: false,
})
const taskCoverage = [
  { card: 'n68', questions: ['1: light ray definition', '2: luminous flux definition', '3: luminous intensity definition', '4: factors determining point-source illuminance'] },
  { card: 't5', questions: [
    '1: beam through opposite holes; view through front hole with clean air; visibility question retained',
    '2: solar-eclipse appearance for an observer in the Moon penumbra condition retained',
    '3: closed shutters, dark room, sunlight through gap, colored wall image, rooftops/trees/drying clothes, inverted images and cause question retained',
    '4: clear foot shadow versus blurred head shadow under streetlamp retained',
    '5: height range; 1.1 meters and 50/50/10 original lumens retained; hypothetical requirement, unit HOLD',
    '6: screen position for equal illuminance on its sides; additional non-perpendicular screen question retained',
    '7: illuminance below each lamp and below their midpoint; ignore ceiling/wall reflected light condition retained',
  ] },
]
const report = writeNew('report.json', {
  schema: 'bounded-n68-t5-first-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'Same existing agent, first bilingual text author only',
  status: 'AUTHOR-FROZEN-WITH-UNIT-HOLDS-INDEPENDENT-REVIEWS-PENDING',
  sourceBinding: output('source-binding.json'), manifest: binding.manifest,
  fullFaithfulSourcePreserved: true,
  scoped180ExcludedRefs: binding.scoped180ExcludedRefs,
  targetCounts: { cards: 2, languages: ['zh', 'en'], n68SourceProseBlocks: 26, n68OriginalQuestions: 4, t5SourceProseBlocks: 0, t5OriginalQuestions: 7 },
  candidates, cards: cardReports,
  taskCoverage: { role: 'Author coverage register, not independent semantic approval', records: taskCoverage },
  sourceAndIdentityPolicy: 'Native source.data/source.sha256/source_text/source_refs/pages, formula and numeric signatures, figure refs, question numbers, groups and identity titles remain unchanged.',
  localization: {
    titles: texts.localizedTitles, titlePolicy: texts.identityTitlePolicy,
    culturalChanges: register.culturalChanges,
    noAnswersOrNewQuestions: true, d280SolutionsStandardAnswersAndOldChoiceRead: false,
  },
  unitDisposition: {
    status: 'HOLD-CORRESPONDING-PROSE-AND-QUESTION-BOTH-LANGUAGES',
    pending: output('sci-pending.json'),
    reasoningSourceRefs: ['p0176#6', 'p0176#7', 'p0179#1'],
    proposedLuxInterpretationNotApplied: true, faithfulOrCandidateUnitsOrNumbersChanged: false,
    registeredErrata: [], currentHygieneStandardClaimed: false,
  },
  evidence: {
    changeRegister: output('change-register.json'), sciPending: output('sci-pending.json'),
    actualOpens: output('actual-opens.json'), authoredTexts: output('texts.json'), verification,
    mechanicalText: {
      initial: { status: 'FAIL-RETAINED', report: output('mechanical-text-check/stdout.json'), receipt: output('mechanical-text-check/receipt.json'), errors: initialCheck.errors },
      retainedBeforeRepair: output('retained-initial-check-fail/manifest.json'),
      oneLocalCitationPunctuationRepair: register.localMechanicalRepair,
      final: { status: 'MATCH', report: output('mechanical-text-check-repair/stdout.json'), receipt: output('mechanical-text-check-repair/receipt.json'), exitCode: 0 },
      notSCIOrZHENApproval: true,
    },
  },
  proseFlow: { policy: register.proseFlowPolicy, reports: register.proseFlowReports, initialEnglishFlowIsHistoricalEvidenceOnly: true },
  modernFigureDisposition: {
    ids: ['fig-135', 'fig-136'], status: 'PENDING-MODERN-FIGURE-WORKFLOW',
    nativePlaceholderChangesModernizedIsNotEvidenceOfModernAuthoringOrPASS: true,
    sourceRAWDoesNotMeanModernPASS: true, opened: false, specsAuthored: false, rendersAuthored: false,
  },
  pendingReview: {
    SCI: 'FIRST-INDEPENDENT-REVIEW-PENDING-INCLUDING-BOTH-UNIT-HOLDS',
    ZHEN: 'FIRST-INDEPENDENT-BILINGUAL-REVIEW-PENDING',
    modernFigures: 'FIG135-FIG136-WORKFLOW-PENDING',
    answersAndChoices: 'NOT-AUTHORED',
  },
  activity: {
    newImageOpens: 0, inheritedImages: 24, cumulativeImages: 24, maximumImages: 24, reset: false,
    prepare: 0, assemble: 0, adaptPrepare: 0, sourceFinalize: 0, vectorize: 0,
    adaptFinalize: 0, render: 0, screenshots: 0, paidCalls: 0,
    source177180OrD271D274Reworked: false,
    canonicalIndexMeterStableSkillsAppDBGitChanged: false,
    agentsWorktreesOrBranchesCreated: false,
  },
  ledger: { sourceReportedByHuman: 419, deliveredReportedByHuman: 98, sourceDelta: 0, deliveredDelta: 0, sharedLedgerWritten: false },
  independentPASS: false, wholeCardPASS: false, publicationReady: false,
})
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const child = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink(), 'Freeze only owned regular files')
    return entry.isDirectory() ? files(child) : [child]
  }).sort()
}
const artifacts = files(out).map(bound)
const freeze = writeNew('author-freeze.json', {
  schema: 'bounded-n68-t5-first-bilingual-text-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'First bilingual text author only, no independent reviewer role',
  status: 'FROZEN-DRAFT-UNIT-HOLDS-SCI-ZHEN-AND-MODERN-FIGURES-PENDING',
  frozenAt: new Date().toISOString(), sourceBinding: output('source-binding.json'),
  manifest: binding.manifest, report, verification,
  changeRegister: output('change-register.json'), sciPending: output('sci-pending.json'),
  actualOpens: output('actual-opens.json'), candidates, artifacts,
  initialFAILAndPreRepairAuthorEvidencePreserved: true,
  immutability: 'Every listed owned artifact and this freeze are read-only. Future repairs require a new directory; freeze self-hash is returned externally.',
  images: { inherited: 24, new: 0, cumulative: 24, maximum: 24, reset: false },
  publicationReady: false, independentPASS: false, wholeCardPASS: false,
})
for (const item of [...artifacts, freeze]) {
  assert.equal(hash(item.path), item.sha256)
  fs.chmodSync(item.path, 0o444)
}
for (const item of uniqueInputs) assert.equal(hash(item.path), item.sha256, item.path)
console.log(JSON.stringify({
  status: 'AUTHOR-FROZEN-WITH-UNIT-HOLDS', freeze, report, verification,
  candidateTemplates: 12, cards: 2, unitHolds: ['N68-U001', 'T5-U001'],
  finalTextMechanicalExit: finalReceipt.exitCode,
  frozenOwnedFiles: artifacts.length + 1, newImages: 0, cumulativeImages: 24,
  SCI: 'PENDING', ZHEN: 'PENDING', modernFigures: 'PENDING', wholeCardPASS: false,
}, null, 2))
