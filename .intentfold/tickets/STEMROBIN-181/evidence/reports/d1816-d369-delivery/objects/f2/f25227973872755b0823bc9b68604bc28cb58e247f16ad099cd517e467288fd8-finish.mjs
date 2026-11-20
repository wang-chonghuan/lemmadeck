import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const out = path.dirname(new URL(import.meta.url).pathname)
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: digest(bytes) }
}
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
const firstContract = path.join(out, 'text-contract.first-failure.receipt.json')
if (!fs.existsSync(firstContract) && fs.existsSync(path.join(out, 'text-contract.receipt.json'))) {
  fs.copyFileSync(path.join(out, 'text-contract.receipt.json'), firstContract)
}
const freeze = read(path.join(out, 'input-freeze.json'))
const draft = read(path.join(out, 'draft-prose.json'))
const require = createRequire(import.meta.url)
const { proseFlow, proseOutline, sectionBreakIndices } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const templates = editions.map((edition) => ({
  edition,
  ...binding(path.join(repo, '.tmp/STEMROBIN-181/d1816-d350/source-work/adapt/10p', edition, 'lessons/phy10-c4-s1/lesson.template.json')),
}))
const documents = templates.map((item) => read(item.path))
const immutableVerification = freeze.immutable.map((item) => {
  const current = binding(item.path)
  assert.equal(current.sha256, item.sha256, item.path)
  return { ...current, matchesOriginalFreeze: true }
})

const contractStart = Date.now()
const contract = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), ['-c',
  [
    'import json,sys',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import validate_text,validate_lesson_identity,normalize_prose_layout,math_signature,prose_number_signature',
    'ds=json.load(sys.stdin)',
    'profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))',
    'results=[]',
    'for d in ds:',
    ' errors=validate_lesson_identity(d["source"]["data"],d)',
    ' items=[]',
    ' for i,p in enumerate(d["prose"]):',
    '  local=validate_text(p["source_text"],p["text"],p["changes"],p["numeric_changes"],f"prose[{i}]",profile.get("forbidden_terms",[]),p["historical_entities"])',
    '  if normalize_prose_layout(p["text"])!=p["text"]: local.append("not normalization-idempotent")',
    '  if math_signature(p["source_text"])!=math_signature(p["text"]): local.append("formula drift")',
    '  if prose_number_signature(p["source_text"])!=prose_number_signature(p["text"]): local.append("numeric/reference drift")',
    '  errors.extend(local)',
    '  items.append({"entry":i,"errors":local,"formula_signature":math_signature(p["text"]),"numeric_signature":prose_number_signature(p["text"])[0]})',
    ' results.append({"edition":d["edition"],"errors":errors,"items":items})',
    'print(json.dumps(results,ensure_ascii=False))',
  ].join('\n')],
{ cwd: repo, encoding: 'utf8', input: JSON.stringify(documents), maxBuffer: 4000000 })
writeJson(path.join(out, 'text-contract.receipt.json'), {
  schema: 'STEMROBIN-181/d351-local-author-contract@1',
  cwd: repo, exitCode: contract.status, elapsedMs: Date.now() - contractStart,
  stderr: contract.stderr,
  output: contract.status === 0 ? JSON.parse(contract.stdout) : contract.stdout,
  executionScope: 'Existing pure text/identity/normalizer functions only; not adapt-finalize, native production, rendering, independent SCI or ZHEN approval.',
})
assert.equal(contract.status, 0, contract.stderr)
const textResults = JSON.parse(contract.stdout)
assert.ok(textResults.every((item) => item.items.every((entry) => entry.errors.length === 0)), JSON.stringify(textResults))
assert.deepEqual(textResults[0].errors, [])
assert.deepEqual(textResults[1].errors, ['lesson.chapter 不得改变', 'lesson.printed_title 不得改变'])
const metadataContractGap = {
  status: 'DISCLOSED_PENDING_DOWNSTREAM_CONTRACT_COMPATIBILITY_NOT_A_NATIVE_PASS',
  errors: textResults[1].errors,
  validator: 'edition.py validate_lesson_identity',
  directHumanRequirement: 'Explicit English locale/title/printed_title/chapter, with frozen source snapshots unchanged.',
  decision: 'Retain the requested English metadata. Do not rewrite source.data, remove translations, edit the existing validator or claim native acceptance.',
  sourceSnapshotModified: false,
  nativeFinalizationRun: false,
  firstFailureReceipt: binding(firstContract),
}

const flowResults = documents.map((document, i) => {
  assert.equal(document.prose.length, 26)
  assert.equal(document.id, 'phy10-c4-s1')
  assert.equal(document.number, '151')
  assert.equal(document.exercise_count, 0)
  assert.deepEqual(document.figures, [])
  assert.deepEqual(document.errata, [])
  assert.deepEqual(document.prose.map((p) => p.source_text), freeze.sourceTexts)
  assert.deepEqual(document.prose.map((p) => p.source_refs), freeze.sourceRefs)
  assert.equal(digest(JSON.stringify(document.source)), freeze.sourceObjectDigests[document.edition])
  for (const field of ['kind', 'id', 'label', 'printed_page']) {
    assert.deepEqual(document.prose.map((p) => p[field]), document.source.data.prose.map((p) => p[field]))
  }
  assert.equal(document.locale, i ? 'en' : 'zh')
  assert.equal(document.printed_title.startsWith('$151$. '), true)
  assert.equal(document.status, 'draft')
  document.prose.forEach((p) => {
    assert.ok(p.text.trim())
    assert.ok(p.changes.includes('layout'))
    assert.deepEqual(p.numeric_changes, [])
    assert.ok(!/<(?:img|span|svg|iframe)\b/i.test(p.text))
    if (i) assert.ok(p.changes.includes('translation'))
  })
  assert.ok(document.prose[3].text.includes(i ? 'absolutely solid. They' : '绝对的固态。\n'))
  assert.ok(document.prose[3].source_text.includes('绝对的固态：'))
  assert.ok(document.prose[12].source_text.includes('要复杂；'))
  assert.ok(!document.prose.some((p) => (p.source_refs ?? []).some((ref) => /^p0392#(?:[5-9]|\d{2,})$/.test(ref))))
  const command = ['node', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', templates[i].path]
  const startedAt = new Date().toISOString()
  const start = Date.now()
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', maxBuffer: 4000000 })
  assert.equal(result.status, 0, result.stderr)
  const parsed = JSON.parse(result.stdout)
  const outline = proseOutline(document.prose)
  const flow = proseFlow(document.prose, document.section_breaks)
  assert.deepEqual(parsed.paragraphs, outline)
  assert.deepEqual(parsed.resolvedBreaks, sectionBreakIndices(document.prose, document.section_breaks))
  assert.equal(parsed.boundaries.length, 6)
  assert.equal(flow.filter((item) => item.sectionBreak).length, 6)
  assert.deepEqual(parsed.resolvedBreaks.map((index) => outline[index].blockIndex), draft.sectionStarts.map((item) => item.entry))
  if (i) assert.ok(outline.every((p) => !/^[a-z]/.test(p.text)), 'English paragraph begins with a sentence fragment')
  const receiptPath = path.join(out, 'layout', `${document.edition}.prose-flow.receipt.json`)
  writeJson(receiptPath, { command, cwd: repo, startedAt, elapsedMs: Date.now() - start, exitCode: result.status,
    template: templates[i], paragraphs: parsed.paragraphs, resolvedBreaks: parsed.resolvedBreaks, boundaries: parsed.boundaries })
  return { edition: document.edition, sourceEntries: 26, finalParagraphs: outline.length, conceptBreaks: 6,
    resolvedBreaks: parsed.resolvedBreaks, boundaryEntryOwners: draft.sectionStarts.map((item) => item.entry),
    receipt: binding(receiptPath), displayApproval: false }
})

const primaryFiles = fs.readdirSync(path.join(out, 'primary-sources')).filter((name) => name.endsWith('.receipt.json'))
const primary = primaryFiles.map((name) => binding(path.join(out, 'primary-sources', name)))
const retainedFermilab = binding(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d332-n149-first-text-review/primary-sources/fermilab-beta-decay.receipt.json'))
for (const receipt of primary) {
  const item = read(receipt.path)
  if ('exitCode' in item) {
    assert.equal(item.exitCode, 0)
    assert.equal(item.httpStatus, '200')
    assert.equal(binding(item.stdout.path).sha256, item.stdout.sha256)
    assert.equal(binding(item.stderr.path).sha256, item.stderr.sha256)
  }
}
const sourceAdjudication = binding(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d349-source390391-affected-review/report.json'))
const pendingSourceOnlyDeltas = [
  { check: 'S388-R18-QUOTE-PUNCTUATION', page: 388, block: 'p0388#6', line: 4, row: 18,
    from: '绝对的固态：', to: '绝对的固态.', sourceEntry: 3,
    normalizedVisibleStop: { zh: '绝对的固态。', en: 'absolutely solid.' },
    status: 'Independently resolved source stop; parent owns faithful-page repair, contradictory-note cleanup, native propagation and exact raw/source_text rebind after this freeze.' },
  { check: 'D336-PUNCT-390-13', page: 390, block: 'p0390#4', line: 4, row: 13,
    from: '要复杂；', to: '要复杂：', sourceEntry: 12,
    status: 'Independently resolved source colon; parent owns faithful-page repair, contradictory-note cleanup, native propagation and exact raw/source_text rebind after this freeze.' },
]
const scienceObservations = {
  'cern-standard-model': { locator: 'Matter particles; Forces and carrier particles; So far so good, but...',
    use: 'Quarks/leptons, distinct interactions and carriers, Standard Model scope, gravity exclusion and unanswered questions.',
    limits: 'The page includes older Higgs-discovery language, which is not used. No claim that every paragraph is a current research update.' },
  'einstein-relativistic-mechanics': { locator: 'A question of velocities; Step by step from Newton to Einstein',
    use: 'Nonrelativistic/weak-gravity limiting domain and the need for relativistic corrections.',
    limits: 'No numerical orbital examples or discovery-timing claims are used.' },
  'feynman-electromagnetic-propagation': { locator: '28-1, retarded fields and propagation delay',
    use: 'Field changes depend on earlier source behaviour, not instantaneous electromagnetic influence.',
    limits: 'Only the established classical electromagnetic relation is used; this is not an assertion of a complete modern theory.' },
  'nuclear-forces-primary': { locator: 'Abstract plus fulltext introductory observation receipt nuclear-forces-fulltext',
    use: 'Low-energy effective nuclear-force account, useful pion exchange, and distinction from underlying QCD.',
    limits: 'Abstract alone is insufficient for pion exchange. Its evidence binding includes the separately observed author fulltext introductory passages.' },
  'nuclear-forces-fulltext': { locator: '1 Introduction and historical perspective',
    use: 'Author manuscript distinctions between meson models, pion/nucleon effective degrees of freedom, and quark/gluon QCD.',
    limits: 'Established model/domain distinction, not the latest review or every formula in the manuscript.' },
  'feynman-quantum-behaviour': { locator: '1-1 Atomic mechanics; 1-4 electron interference; 1-7 probability amplitudes',
    use: 'Quantum behaviour is not a literal classical ball-or-wave picture; outcome probabilities and microscopic domain.',
    limits: 'Historical lecture examples are used only for established quantum principles, not contemporary particle inventories.' },
  'feynman-state-evolution': { locator: '8-2; 8-4 How states change with time; 8-5 the Hamiltonian matrix; 8-6 ammonia example',
    use: 'State amplitudes evolve by an equation; an example probability reaches certainty, qualifying blanket unpredictability. A hydrogen example has a proton and an electron.',
    limits: 'The lecture has outdated discussion of unknown proton structure, which is not used; constituent correction uses CERN and Fermilab instead.' },
  'coherent-weak-scattering': { locator: 'COHERENT collaboration original experimental abstract, arXiv:1708.01294',
    use: 'Observed elastic neutrino-nucleus scattering is a Standard Model interaction without requiring particle transformation.',
    limits: 'Its weak-interaction interpretation is read together with the CERN carrier account; the learner text does not import any experimental numbers.' },
  'fermilab-beta-decay-retained': { locator: 'Retained primary-source receipt, All Things Neutrino: Neutrinos from beta decay',
    use: 'Composite proton/neutron constituents, beta-minus products and conservation conditions.',
    limits: 'Reuse is a source receipt, not an inherited N151 SCI verdict or archival source proof.' },
}
const perEntry = draft.entries.map((entry, index) => ({
  index, source_refs: entry.source_refs,
  source_text_sha256: digest(freeze.sourceTexts[index]),
  zh_text_sha256: digest(documents[0].prose[index].text),
  en_text_sha256: digest(documents[1].prose[index].text),
  tags: { zh: documents[0].prose[index].changes, en: documents[1].prose[index].changes },
  translation: 'Natural English adaptation of the same source-bound entry; formula/numeric signatures retained.',
  layout: { zhParagraphs: proseOutline([documents[0].prose[index]]).length, enParagraphs: proseOutline([documents[1].prose[index]]).length,
    normalizedBy: 'edition.py normalize_prose_layout', sectionStart: draft.sectionStarts.find((item) => item.entry === index)?.concept ?? null },
  historicalEntities: { zh: documents[0].prose[index].historical_entities, en: documents[1].prose[index].historical_entities },
  correction: entry.correction ?? null,
  evidenceIds: entry.evidence ?? [],
  evidenceMeaning: 'Primary evidence mapping prepared by author; NOT an independent SCI conclusion.',
}))
const report = {
  schema: 'STEMROBIN-181/d351-n151-bilingual-author-report@1',
  createdAt: new Date().toISOString(), ticket: 'STEMROBIN-181', role: 'AUTHOR',
  card: 'phy10-c4-s1', printedNumber: '151', physicalPages: [388, 389, 390, 391, 392],
  status: 'AUTHOR_COMPLETE_PENDING_PARENT_SOURCE_REBIND_AND_FIRST_INDEPENDENT_GATES',
  finiteAssignmentComplete: true, courseApproval: false,
  inputs: { freeze: binding(path.join(out, 'input-freeze.json')), preparation: freeze.preparation,
    raw: freeze.raw, originalExercises: freeze.exercises, initialTemplates: freeze.initialTemplates },
  outputs: templates, flowResults, perEntry,
  contentDesign: draft.content_design,
  sourceEvidence: { rawBaselineUnchanged: true, sourceTextsUnchanged: true, sourceRefsAndOrderUnchanged: true,
    sourceAdjudication, pendingSourceOnlyDeltas, originalHoldAmbiguitiesNowResolved: true,
    note: 'D349 is sole independent punctuation adjudication. Its two findings are parent-owned source corrections, not a failed N151 SCI review. Original baseline hashes remain the author-freeze binding.' },
  scienceEvidence: { newPrimaryReceipts: primary, reusedPrimaryReceipt: retainedFermilab,
    observations: scienceObservations, authorRationaleIsIndependentScienceProof: false,
    firstN151SCIReviewHasOccurred: false },
  quotationPolicy: 'Translate the source quotation as words attributed by the textbook. No archival quotation has been newly verified or invented. Galileo interval remains relative to the textbook, not to 2026. The visible Newton quotation uses the D349-resolved stop while its old source snapshot remains untouched.',
  gates: {
    sourceRebinding: 'PENDING_PARENT_TWO_FAITHFUL_PUNCTUATION_REPAIRS_AND_NATIVE_PROPAGATION',
    sourceIndependentAdjudication: 'REUSE_D349_SCOPED_RESOLVED_FINDINGS; no new source or whole-course approval by author',
    SCI: 'PENDING_FIRST_INDEPENDENT_REVIEW_OF_MERGED_FINAL_N151_CANDIDATE',
    ZHEN: 'PENDING_INDEPENDENT_REVIEW_OF_MERGED_FINAL_N151_CANDIDATE',
    display: 'PENDING_INDEPENDENT_DESKTOP_MOBILE_CHECK; no render or browser display check performed',
    nativeFinalization: 'NOT_RUN; outside finite AUTHOR assignment',
    EnglishMetadataContractCompatibility: metadataContractGap,
    publication: 'NOT_AUTHORIZED'
  },
  localVerification: { contract: binding(path.join(out, 'text-contract.receipt.json')), immutableVerification,
    passedScope: 'All twenty-six prose entries per locale pass the pure text contract; ZH identity, formulas/digits, exact source snapshots/references, normalizer idempotence and final-flow anchors pass. Full EN identity does not pass: its two requested metadata translations are rejected by the current identity contract.',
    EnglishMetadataContractGap: metadataContractGap,
    semanticApproval: false, visualApproval: false },
  usage: {
    firstBilingualAuthorRounds: 1, firstTemplateApplications: 1,
    postApplicationAuthorCopyRefinements: 1,
    copyRefinement: 'Complete sentences rather than semicolon fragments; remove redundant in-body archival-methodology sentence; do not infer that the textbook intended neutrino as a generic name.',
    preApplicationVisibleQuotePunctuationAdjustmentsFromDirectHumanD349Instruction: 1,
    technicalRecoveries: 1, technicalRecovery: binding(path.join(out, 'technical-recovery.json')),
    pureNormalizerBatchExecutionsForAuthoring: 3,
    proseFlowCLIInvocationsForAuthoringAndFinalChecks: 9,
    pureTextContractBatchExecutions: 2,
    localContractFailuresDisclosed: 1,
    newPublicScientificPageReadsViaCloakFetch: 8, reusedPrimaryReceipts: 1,
    paidCalls: 0, imageOpens: 0, imageGenerations: 0, dependencyInstalls: 0,
    webSearchRequests: 2, webSearchQueries: 7, webSearchResultBodiesReturned: 0,
    ticketBackendGETRequests: 6, ticketBackendWrites: 0,
    ticketReadClientParserFailures: 1,
    ticketRead: 'Read-only n-plane verify plus ticket-list lookup. The first list-parser command failed after successful HTTP GETs; corrected envelope parsing recovered the existing ticket without writes. Direct current human authorization narrows and resumes the existing ticket.',
    nativeProducerRuns: 0, adaptFinalizeRuns: 0, renderRuns: 0, publisherRuns: 0,
    databaseCalls: 0, gitCalls: 0, canonicalEdits: 0, meterEdits: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0, originalTasks: 0, figures: 0,
    newChatsOrAgents: 0, independentReviewsPerformed: 0,
    measuredElapsedMsSinceInputFreeze: Date.now() - Date.parse(freeze.createdAt),
    totalSessionElapsedMs: null, totalSessionElapsedReason: 'No start-of-turn wall-clock telemetry exposed.',
    model: null, reasoningEffort: null, tokenUsage: null, assistantCostUSD: null,
    unavailableTelemetryReason: 'The runtime does not expose this turn model identifier, effort, billed token counts or assistant cost. Zero paid tool calls is not a claim that assistant inference cost is zero.'
  },
  ownership: { authorizedExistingFilesEdited: templates.map((item) => item.path), authorizedNewDirectory: out,
    otherFilesEdited: false, sharedSourceOrCandidateRebindingByAuthor: false, stopAfterFreeze: true }
}
writeJson(path.join(out, 'report.json'), report)
const authorFreeze = {
  schema: 'STEMROBIN-181/d351-n151-bilingual-author-freeze@1',
  frozenAt: new Date().toISOString(), role: 'AUTHOR', ticket: 'STEMROBIN-181', card: 'phy10-c4-s1',
  status: report.status, report: binding(path.join(out, 'report.json')),
  raw: freeze.raw, originalExercises: freeze.exercises, initialTemplates: freeze.initialTemplates,
  templates, inputFreeze: binding(path.join(out, 'input-freeze.json')),
  draft: binding(path.join(out, 'draft-prose.json')),
  primaryReceipts: primary, retainedPrimaryReceipt: retainedFermilab, sourceAdjudication,
  localContractReceipt: binding(path.join(out, 'text-contract.receipt.json')),
  layoutReceipts: flowResults.map((item) => item.receipt),
  firstCandidateSnapshots: editions.map((edition) => binding(path.join(out, 'first-candidate', edition, 'lesson.template.json'))),
  authorTools: ['work.mjs', 'finish.mjs'].map((name) => binding(path.join(out, name))),
  pendingSourceOnlyDeltas, gates: report.gates, usage: report.usage,
  facts: { sourceEntries: 26, originalTasks: 0, figures: 0, sourceWordsDigitsFormulasAndOrderUnchanged: true,
    N152Authored: false, fullSourceApproval: false, firstN151SCIReviewHasOccurred: false,
    ZHENApproval: false, displayApproval: false, independentApprovalByAuthor: false },
  downstreamInstruction: 'Parent repairs only the two faithful-page punctuation marks and contradictory notes, then propagates exact new raw/source_text hashes. Preserve this old-binding freeze as evidence. The merged final candidate receives its first independent SCI/ZHEN review; no author rationale, pure parser check or earlier unrelated reviewer receipt is an N151 science approval.'
}
writeJson(path.join(out, 'author-freeze.json'), authorFreeze)
console.log(JSON.stringify({ templates, report: binding(path.join(out, 'report.json')),
  authorFreeze: binding(path.join(out, 'author-freeze.json')), flowResults }, null, 2))
