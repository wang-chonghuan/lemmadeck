import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const O = path.dirname(new URL(import.meta.url).pathname)
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const read = p => JSON.parse(fs.readFileSync(path.join(O, p), 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
function write(relative, data) {
  const p = path.join(O, relative)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
  return { path: p, sha256: hash(p), bytes: fs.statSync(p).size }
}
const editionPath = path.join(R, '.claude/skills/ld-s10y-lesson/tools/edition.py')
const liveEditionSha256 = hash(editionPath)
const binding = read('input-bindings.json')
const inputPreservation = binding.ledger.map(input => {
  const afterSha256 = hash(input.path)
  const unchanged = afterSha256 === input.sha256
  assert.ok(unchanged || input.path === editionPath, `Unexpected bound-input drift: ${input.path}`)
  if (input.snapshot) assert.equal(hash(input.snapshot), input.sha256)
  return {
    ...input, afterSha256, unchanged,
    disposition: unchanged ? 'UNCHANGED' : 'AUTHORIZED-PARENT-d866-ALIAS-CONTRACT-UPDATE',
  }
})
write('input-preservation.json', { status: 'PASS', rows: inputPreservation })
const parentReport = path.join(T, 'tmp/d866-historical-alias-contract/report.json')
fs.copyFileSync(parentReport, path.join(O, 'inputs/parent-d866-report.json'), fs.constants.COPYFILE_EXCL)
const parent = JSON.parse(fs.readFileSync(parentReport))
assert.equal(parent.status, 'PASS')
assert.equal(parent.checkCount, 12)
const affected = read('affected-contract-FIRST.json')
assert.equal(affected.status, 'PASS-AFFECTED-NATIVE-CONTRACT-ONLY')
assert.equal(affected.liveEditionSha256, liveEditionSha256, 'Bind validation to current live code.')
assert.equal(read('normalization-FIRST.json').coreSha256, liveEditionSha256)
write('current-contract-bindings.json', {
  edition: { path: editionPath, sha256: liveEditionSha256 },
  originalEdition: binding.ledger.find(row => row.path === editionPath),
  parentReport: { path: parentReport, sha256: hash(parentReport), checks: parent.checkCount },
  parentChangesOwnedHere: false,
  headingAuthorization: 'Human follow-up: ordinary translation of modern bold headings is authorized; the old d837 wrapper bold-literal assertion is not a native validate_text contract.',
  historicalAuthorization: 'Human follow-up: optional exact source_term alias contract supplied by parent d866; use current native per-item validation.',
})

const req = read('inputs/n87-preauthor-source-requirements.v1.json')
const rawLesson = read('inputs/raw-lesson.json')
const rawExercises = read('inputs/raw-exercises.json')
const reference46Matches = []
const patterns = [/reference\s*46/iu, /(?<!\d)46(?!\d)/u, /四十六/u]
function inspectStrings(value, pointer, document) {
  if (typeof value === 'string') {
    if (patterns.some(pattern => pattern.test(value))) reference46Matches.push({ document, pointer, value })
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => inspectStrings(v, `${pointer}/${i}`, document))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) inspectStrings(v, `${pointer}/${k}`, document)
  }
}
inspectStrings(rawLesson, '', 'raw-lesson')
inspectStrings(rawExercises, '', 'raw-exercises')
inspectStrings(req.blocks, '/blocks', 'requirements-source-blocks')
assert.equal(reference46Matches.length, 0)
const oldRequirement = req.requirements[0]
assert.ok(oldRequirement.includes('reference46, '))
const amendedRequirement = oldRequirement.replace('reference46, ', '')
const clarification = {
  schema: 'STEMROBIN-181/n87-source-requirements-clarification@2',
  version: 2, finding: 'd847-F06', classification: 'MISTAKEN-UNSUPPORTED-REQUIREMENT',
  authority: 'Explicit d858 human instruction to remove the obligation if absent from bound raw n87.',
  original: {
    path: binding.ledger.find(row => row.snapshot?.endsWith('n87-preauthor-source-requirements.v1.json')).path,
    snapshot: path.join(O, 'inputs/n87-preauthor-source-requirements.v1.json'),
    sha256: hash(path.join(O, 'inputs/n87-preauthor-source-requirements.v1.json')),
  },
  amendment: {
    pointer: '/requirements/0', original: oldRequirement, desired: amendedRequirement,
    explicitlyRemovedObligation: 'Preserve reference46',
    reason: 'No actual reference46, standalone 46, or 四十六 occurs anywhere in the complete supplied raw lesson, six exercises, or 35 source blocks. No destination or deleted author cross-reference can be bound. Remove only this unsupported obligation; fabricate no cross-reference.',
  },
  evidence: {
    rawLessonSha256: hash(path.join(O, 'inputs/raw-lesson.json')),
    rawExercisesSha256: hash(path.join(O, 'inputs/raw-exercises.json')),
    lessonObjects: rawLesson.prose.length, sourceQuestions: rawExercises.exercises.length,
    sourceBlocks: req.blocks.length, boundary: req.boundary,
    patterns: patterns.map(p => p.source), matches: reference46Matches,
    literalSourceTextOnly: true, sourceImagesExamined: 0,
  },
  scope: 'Private, separately versioned clarification only. Original requirements, raw source, source233 receipt and shared preparation remain unchanged.',
}
const clarificationArtifact = write('requirements-clarification.v2.json', clarification)
const v2 = structuredClone(req)
v2.status = 'SOURCE-CLOSED-PREAUTHOR-CLARIFIED-v2-PRIVATE'
v2.requirements[0] = amendedRequirement
v2.clarification = {
  version: 2, originalSha256: clarification.original.sha256,
  removedUnsupportedObligation: 'Preserve reference46',
  evidence: clarificationArtifact,
}
const requirementsArtifact = write('n87-preauthor-source-requirements.v2.json', v2)

const headingMappings = [
  {
    pointer: '/prose/3/text', source_ref: 'p0230#6',
    original: '**表面加工质量的检验**', desired: '**Surface Quality Inspection**',
    exactOriginalLeadIn: '**表面加工质量的检验** Surface quality inspection',
    exactDesiredLeadIn: '**Surface Quality Inspection**',
  },
  {
    pointer: '/prose/6/text', source_refs: ['p0230#9', 'p0231#1'],
    original: '**光学增透**', desired: '**Antireflection Treatment**',
    exactOriginalLeadIn: '**光学增透** Antireflection treatment',
    exactDesiredLeadIn: '**Antireflection Treatment**',
  },
]
write('locale-mapping.json', {
  schema: 'STEMROBIN-181/d858-affected-literal-locale-mapping@1',
  mechanism: 'Approved ordinary modern-prose translation; no mapper, new display field, or core edit.',
  headingMappings,
  unchangedSourceFields: ['source.data', 'prose[*].source_text', 'printed_title'],
  exerciseGroup: {
    sourceIdentity: { group: '问题', group_id: 'g1' },
    desiredDisplayedMeaning: 'Questions', candidateMetadataUnchanged: true,
    authority: 'Human states existing offline d840 renderer already maps this group.',
    mapperReadOrChangedHere: false, rendererRunHere: false,
    displayRuntimeAcceptance: 'NOT-RUN',
  },
  historicalMappings: read('candidate/en/lesson.template.json').prose[18].historical_entities,
  semanticIdentityReview: 'PENDING-PARENT-INDEPENDENT-REVIEW; native binding is not independent historical authentication.',
})

function fieldDiff(before, after, pointer = '') {
  if (equal(before, after)) return []
  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length !== after.length) return [{ pointer, original: before, desired: after }]
    return before.flatMap((v, i) => fieldDiff(v, after[i], `${pointer}/${i}`))
  }
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(k =>
      fieldDiff(before[k], after[k], `${pointer}/${k}`))
  }
  return [{ pointer, original: before, desired: after }]
}
const candidates = []
const changed = []
const reused = []
const nativeAffected = { zh: [3, 11, 18, 20], en: [3, 6, 11, 16, 18, 20] }
const findingsByPointer = { 3: ['F02'], 6: ['F03'], 11: ['F05'], 16: ['F04'], 18: ['F01', 'F07'], 20: ['F05'] }
for (const locale of ['zh', 'en']) {
  const beforeLesson = read(`before/${locale}/lesson.template.json`)
  const afterLesson = read(`candidate/${locale}/lesson.template.json`)
  assert.equal(afterLesson.prose.length, 22)
  assert.deepEqual(beforeLesson.source, afterLesson.source)
  for (const [i, beforeBlock] of beforeLesson.prose.entries()) {
    if (!nativeAffected[locale].includes(i)) {
      assert.deepEqual(beforeBlock, afterLesson.prose[i])
      reused.push({ locale, pointer: `/prose/${i}`, receipt: `inputs/reused/native/${locale}.json` })
    }
  }
  for (const name of ['lesson', 'exercises']) {
    const relative = `${locale}/${name}.template.json`
    const beforePath = path.join(O, 'before', relative)
    const candidatePath = path.join(O, 'candidate', relative)
    const before = JSON.parse(fs.readFileSync(beforePath))
    const after = JSON.parse(fs.readFileSync(candidatePath))
    const fields = fieldDiff(before, after)
    for (const field of fields) {
      const match = /^\/prose\/(\d+)\/(.+)$/.exec(field.pointer)
      if (match) {
        const index = Number(match[1])
        assert.ok(nativeAffected[locale].includes(index))
        assert.ok(match[2] === 'text' || (index === 18 && ['historical_entities', 'changes'].includes(match[2])))
        field.findings = findingsByPointer[index].map(id => 'd847-' + id)
        if (locale === 'en' && index === 3) field.findings.push('d847-F03')
      } else {
        assert.match(field.pointer, /^\/section_breaks\/[0-4]\/(before|after)$/)
        field.findings = ['affected-flow-anchor']
      }
    }
    if (name === 'exercises') {
      assert.equal(hash(beforePath), hash(candidatePath))
      assert.equal(after.count, 6)
      for (let i = 0; i < 6; i++) reused.push({
        locale, pointer: `/exercises/${i}`, receipt: `inputs/reused/native/${locale}.json`,
      })
    }
    const result = spawnSync('diff', ['-u', '--label', beforePath, '--label', candidatePath, beforePath, candidatePath], {
      cwd: R, encoding: 'utf8',
    })
    assert.ok(result.status === 0 || result.status === 1, result.stderr)
    const diff = write(`diffs/${locale}-${name}.diff`, result.stdout)
    const sourceTokens = [...JSON.stringify(before).matchAll(/\$(?:\\.|[^$\\])*\$/g)].length
    candidates.push({
      locale, kind: name, path: candidatePath, beforePath,
      beforeSha256: hash(beforePath), sha256: hash(candidatePath),
      bytes: fs.statSync(candidatePath).size, byteIdentical: hash(beforePath) === hash(candidatePath),
      changedFields: fields.length, diff,
      diffExitCode: result.status,
      diffDisposition: result.status === 1 ? 'EXPECTED-DIFFERENCES-NOT-A-FAILURE' : 'BYTE-IDENTICAL',
    })
    changed.push({ locale, kind: name, fields })
  }
}
const changedArtifact = write('changed-fields.json', {
  schema: 'STEMROBIN-181/d858-changed-fields@1',
  totalChangedFields: changed.reduce((n, c) => n + c.fields.length, 0), candidates: changed,
})
write('reused-validations.json', {
  schema: 'STEMROBIN-181/d858-reused-validations@1',
  unchangedRowsReused: reused.length, rows: reused,
  exactBoundSourceSnapshotsPreserved: 4, exerciseFilesByteIdentical: 2,
  originalEnglishWrapperFailureRetained: 'inputs/reused/native/en.json',
  originalEnglishNumericRecoveryRetained: 'inputs/reused/native/en-numeric-technical-recovery.json',
  explanation: 'Reuse unchanged source/identity/schema/figure/subpart checks and successful native rows. d837 extra number_signature wrapper failure is preserved with its passing reference-aware numeric recovery. No old artificial bold-literal assertion is applied to the now explicitly authorized English lead-in translation.',
})

const failures = [
  {
    stage: 'read-only-contract-discovery', tool: 'exec_command', exitCode: 2,
    command: 'rg -n historical_entities|historical.*term|protected|bold|locale|group_display|display_group|math_tokens|numeric|def validate .claude/skills/ld-s10y-lesson/tools/modern.py .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs .claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    workdir: R,
    diagnostic: 'rg: .claude/skills/ld-s10y-lesson/tools/modern.py: No such file or directory (os error 2)',
    disposition: 'Retained FIRST exploration failure; actual implementation located read-only at tools/edition.py.',
  },
  {
    stage: 'FIRST-copy-edit', tool: 'apply_patch', exitCode: 1,
    diagnostic: `Failed to write file ${O}/candidate/zh/lesson.template.json`,
    disposition: 'Copy retained source mode 0444. Only own four candidate copies were given owner write access, then the same content patch applied. No source/author permission changed.',
  },
  {
    stage: 'approved-heading-patch-context', tool: 'apply_patch', exitCode: 1,
    diagnostic: `apply_patch verification failed: Failed to find expected lines in ${O}/candidate/en/lesson.template.json`,
    expectedContextPrefix: '**光学增透** Antireflection treatment addresses reflection at optical-glass surfaces.',
    incorrectExpectedContinuation: 'The source reports more than $10$ reflecting surfaces in a camera lens and as many as $40$ in a submarine periscope.',
    actualContinuation: 'The source describes camera lenses with more than $10$ reflecting surfaces and submarine periscopes with as many as $40$.',
    disposition: 'Read exact local line; reapplied only approved heading replacement. No candidate content validation failed; same one repair round.',
  },
]
const failuresArtifact = write('failures-FIRST.json', {
  newFailures: failures,
  preservedPriorFailures: [
    'inputs/FIRST-review/report.json#/failuresPreserved',
    'inputs/reused/native/en.json',
    'inputs/reused/calls/run-author-FIRST-failure.json',
  ],
  substantiveReviewHoldsPreserved: read('inputs/FIRST-review/report.json').findings.map(f => ({ id: f.id, status: f.status })),
  originalReviewOverwritten: false, candidateNativeFailures: affected.errors,
})
const perLocaleCounts = {}
for (const locale of ['zh', 'en']) {
  const old = read(`before/${locale}/lesson.template.json`)
  const exercises = read(`before/${locale}/exercises.template.json`)
  const literalCount = text => [...text.matchAll(/\$[^$]*\$/g)].length
  const flow = read(`flow/${locale}-resolved.json`)
  perLocaleCounts[locale] = {
    lessonObjects: old.prose.length, affectedTextObjects: nativeAffected[locale].length,
    originalExercises: exercises.exercises.length, historicalDeclarations: 3,
    orderedLessonMathTokensPreserved: old.prose.reduce((n, b) => n + literalCount(b.text), 0),
    orderedExerciseMathTokensPreserved: exercises.exercises.reduce((n, b) => n + literalCount(b.text), 0),
    paragraphs: flow.paragraphs.length, sectionBoundaries: flow.boundaries.length,
    resolvedBreaks: flow.resolvedBreaks,
  }
}
const findingsDisposition = [
  { id: 'd847-F01', disposition: 'APPLIED-NOT-REVIEWED', fields: ['/prose/18/text'], note: 'Exact source quotation/history retained. Integer thickness is explicitly not a usable rule in the stated model; missing wavelength/additional premise is not invented. No raw erratum. Underlying source ambiguity remains explicitly described.' },
  { id: 'd847-F02', disposition: 'APPLIED-NOT-REVIEWED', fields: ['/prose/3/text'], note: 'Exact numeric tokens retained; reported sensitivity separated from universal wavelength-to-cm conversion. Testing wavelength remains unspecified, not invented.' },
  { id: 'd847-F03', disposition: 'APPLIED-WITH-HUMAN-CLARIFICATION-NOT-REVIEWED', locale: 'en', fields: ['/prose/3/text', '/prose/6/text', 'affected section_breaks'], note: 'Two modern bold lead-ins translated exactly as authorized. Chinese source snapshot/text and stored source Questions group are unchanged. Parent reports existing d840 group projection; no renderer run here.' },
  { id: 'd847-F04', disposition: 'APPLIED-NOT-REVIEWED', locale: 'en', fields: ['/prose/16/text', 'affected section_breaks'], note: 'Complete sentences distinguish complete cancellation from near-amplitude residual reflection. Corresponding final-paragraph anchor uses native flow output.' },
  { id: 'd847-F05', disposition: 'APPLIED-NOT-REVIEWED', fields: ['/prose/11/text', '/prose/20/text', 'affected section_breaks'], note: 'Source-bound prerequisite bridge explains preserved frequency across stationary interfaces and medium-dependent wavelengths. Thin-gap/illumination/overlap conditions make coloured glints plausible, not guaranteed for all fractures. No worked exercise answer or answer key.' },
  { id: 'd847-F06', disposition: 'MISTAKEN-REQUIREMENT-REMOVED-IN-PRIVATE-v2', evidence: clarificationArtifact, note: 'No actual reference46 in supplied full raw n87/source blocks. Original requirements unchanged; private v2 removes only the unsupported obligation.' },
  { id: 'd847-F07', disposition: 'APPLIED-NATIVE-BINDING-PASS-SEMANTIC-REVIEW-PENDING', fields: ['/prose/18/historical_entities'], note: 'ZH retains existing country declaration and adds exact surnames. EN uses exact existing English names and literal source_term aliases with translation. Current parent d866 contract accepted every affected item. No new historical authentication claim.' },
]
const report = {
  schema: 'STEMROBIN-181/d858-first-affected-text-repair@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', batch: 'd858', card: rawLesson.id,
  R, T, writeRoot: O, frozenAt: new Date().toISOString(),
  status: 'FIRST-AFFECTED-REPAIR-FROZEN-NOT-REVIEWED',
  repairRounds: 1, independentReviewRounds: 0,
  candidateBase: path.join(T, 'tmp/d837-n87-first-bilingual-text-author/candidate'),
  candidates, changedFields: changedArtifact, findingsDisposition,
  requirementsV2: requirementsArtifact, clarification: clarificationArtifact,
  failures: failuresArtifact,
  affectedNative: { path: path.join(O, 'affected-contract-FIRST.json'), sha256: hash(path.join(O, 'affected-contract-FIRST.json')), status: affected.status },
  liveEditionSha256, inputBinding: { path: path.join(O, 'input-bindings.json'), sha256: hash(path.join(O, 'input-bindings.json')) },
  sourceBoundPrerequisites: [
    { candidate: '/prose/11/text', rawRefs: ['p0231#6', 'p0232#2', 'p0232#9', 'p0233#2'], model: 'Given stationary-interface frequency conservation plus source film/vacuum wavelength relation and source colour/medium questions; no new math token or exercise solution.' },
    { candidate: '/prose/20/text', rawRefs: ['p0230#6', 'p0232#4', 'p0233#1'], model: 'Transfer only the thin-layer idea to suitably lit thin air gaps in the stated observation. Do not transfer coating thickness/phase rule to an ice/air/ice gap.' },
    { candidate: '/prose/18/text', rawRefs: ['p0231#11', 'p0232#2', 'p0232#3', 'p0232#10'], model: 'Known equal reflection reversals and quarter-wave in-film rule; quoted integer rule is unusable without an additional source premise.' },
  ],
  counts: {
    candidateFiles: 4, changedCandidateFiles: 2, byteIdenticalExerciseFiles: 2,
    changedJSONFields: changed.reduce((n, c) => n + c.fields.length, 0),
    affectedTextObjects: 10, sourceLessonObjectsAcrossLocales: 44,
    originalExerciseIdentities: 6, bilingualExerciseDisplays: 12,
    sourceBlocksInspectedForReference46: 35, reference46SourceMatches: 0,
    orderedLiteralMathTokensPreservedAcrossFourFiles: Object.values(perLocaleCounts).reduce((n, c) => n + c.orderedLessonMathTokensPreserved + c.orderedExerciseMathTokensPreserved, 0),
    nativeValidateTextCalls: 10, nativeAffectedFailures: 0,
    normalizeAffectedCalls: 10, nativeFlowCliCalls: 4, nativeFlowFailures: 0,
    unchangedNativeRowsReused: reused.length, parentFocusedChecksReusedNotRerun: 12,
    historicalDeclarationsTotal: 6, newHistoricalDeclarations: 5,
    repairRounds: 1, reviewRounds: 0, technicalFailuresRetained: failures.length,
    fullNativeCalls: 0, finalizeCalls: 0, renderCalls: 0, figureCalls: 0,
    imagesOpened: 0, imagesCreated: 0, maximumImages: 0,
    additionalPaidCalls: 0, networkCalls: 0, answersOrChoicesReads: 0,
    fullTests: 0, builds: 0, gitCalls: 0, databaseCalls: 0,
    publisherCalls: 0, deployCalls: 0, promotions: 0,
    sharedMeterOrIndexWrites: 0, canonicalWrites: 0, coreWritesOwnedHere: 0,
    newChats: 0, newBranches: 0, newWorktrees: 0,
  },
  perLocaleCounts,
  unresolvedContractBlockers: [],
  pendingOutsideThisRepair: [
    'Independent review of the exact frozen repaired candidates, including F07 semantic name mapping, belongs to parent; not run here.',
    'F01 source premise and F02 testing wavelength are explicitly unresolved source context, not silently invented or corrected.',
    'Existing group projection is parent-supplied information only; no runtime, renderer, image, full-card or publication approval is inferred.',
  ],
  actualBilling: { modelTokens: null, monetaryCost: null, reason: 'Not exposed in this session; unknown is not zero.' },
  stop: {
    oneRepairRoundCompleted: true, noSecondReview: true, noFullFinalize: true,
    originalAuthorAndReviewFrozen: true, sharedInputsPreserved: true,
    candidatePromotionAuthorizedOrPerformed: false, fullCardApproved: false,
  },
}
write('report.json', report)
write('report.md', `# d858 - First Affected n87 Text Repair

Status: **FIRST-AFFECTED-REPAIR-FROZEN-NOT-REVIEWED**. One repair round; no review.

F01/F02/F04/F05 wording repair applied. F03 modern English bold headings translated under the human follow-up; stored source group remains unchanged. F06 unsupported reference46 obligation removed only in private v2. F07 now has three exact source-bound declarations per locale under parent's live d866 alias contract.

Affected native text/math: **10/10 PASS**. Flow: **4 CLI calls PASS**, five concept transitions retained per locale. **${reused.length} unchanged native rows reused**, no full native/finalize/render/test/build. All **6 original exercises**, both source snapshots and all **${report.counts.orderedLiteralMathTokensPreservedAcrossFourFiles} ordered literal math tokens** preserved.

Candidate hashes:
${candidates.map(c => `- ${c.locale}/${c.kind}: \`${c.sha256}\``).join('\n')}

Changed fields: **${report.counts.changedJSONFields}** across two lesson files; both exercise files byte-identical. Exact originals/desires: changed-fields.json. Unified diffs: diffs/. Versioned clarification: requirements-clarification.v2.json and n87-preauthor-source-requirements.v2.json.

Unresolved executable contract blockers: **none**. Independent semantic/SCI/ZHEN review is not performed or cleared. The first d847 HOLD review remains untouched. F01's missing source premise and F02's testing wavelength remain explicitly qualified, not invented.

Three FIRST technical failures are retained in failures-FIRST.json. Parent's code update is not owned here; its live hash is \`${liveEditionSha256}\`. Images/paid calls/core writes/shared writes/promotions: **0**.

Stop after this repair. No complete-card, render, publication or downstream approval.
`)
const files = []
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const p = path.join(directory, item.name)
    if (item.isDirectory()) walk(p)
    else if (item.isFile()) files.push(p)
  }
}
walk(O)
const manifest = files.sort().map(p => `${hash(p)}  ${path.relative(O, p)}`).join('\n') + '\n'
write('SHA256SUMS', manifest)
for (const p of [...files, path.join(O, 'SHA256SUMS')]) fs.chmodSync(p, 0o444)
console.log(JSON.stringify({
  status: report.status, changedFields: report.counts.changedJSONFields,
  counts: report.counts, perLocaleCounts,
  candidates: candidates.map(({ locale, kind, sha256 }) => ({ locale, kind, sha256 })),
  reportSha256: hash(path.join(O, 'report.json')),
  manifestSha256: hash(path.join(O, 'SHA256SUMS')),
  unresolvedContractBlockers: report.unresolvedContractBlockers,
}, null, 2))
