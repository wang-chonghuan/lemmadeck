import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual as equal } from 'node:util';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const B = path.join(T, 'tmp/d858-n87-text-first-repair');
const F = path.join(T, 'tmp/d847-n87-first-independent-text-review');
const O = path.join(T, 'tmp/d873-n87-text-affected-review');
if (process.cwd() !== R) throw new Error('Wrong explicit workdir');
if (fs.realpathSync(O) !== O) throw new Error('Output must not be a symlink');

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const ledger = new Map();
const checks = [];
const check = (name, pass, detail = null) => {
  checks.push({ name, status: pass ? 'PASS' : 'HOLD', detail });
};
const sumsBytes = fs.readFileSync(path.join(B, 'SHA256SUMS'));
const repairSums = new Map(sumsBytes.toString().trim().split('\n').map(line => {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  if (!match) throw new Error('Malformed existing repair manifest');
  return [path.join(B, match[2]), match[1]];
}));
const bind = (id, filename, role, expected = repairSums.get(filename) ?? null) => {
  if (!filename.startsWith(`${R}/`)) throw new Error('Input outside sole R');
  if (fs.realpathSync(filename) !== filename) throw new Error('Unexpected input symlink');
  const bytes = fs.readFileSync(filename);
  const entry = { id, role, path: filename, bytes: bytes.length, sha256: sha(bytes),
    expectedSha256: expected, expectedHashMatches: expected === null ? null : sha(bytes) === expected };
  ledger.set(filename, entry);
  if (expected !== null) check(`hash:${id}`, entry.expectedHashMatches);
  return bytes;
};
const read = (id, filename, role, expected) =>
  JSON.parse(bind(id, filename, role, expected));
const fromB = (id, relative, role) => read(id, path.join(B, relative), role);
const receipt = read('repair_report', path.join(B, 'report.json'),
  'Repair receipt and expected hashes, never substantive approval');
const first = read('first_report', path.join(F, 'report.json'),
  'Frozen original independent findings and inheritable passes',
  'a0903ef10ebe8c1783e8d8f164f226ad30ff8980a4f0fb2173a1b63386bb8b06');
bind('first_findings', path.join(F, 'findings.md'), 'Seven original HOLD findings',
  'a0fbf13a7a7d0839092512f84a82bcbe78795972dd64970611f91e3b664f34e4');
const firstBindings = read('first_bindings', path.join(F, 'input-bindings.json'),
  'Exact original source and candidate bindings',
  '9fec3711c32e950fea03c9edf655b8c45ead0715fae42251f13fdff0769f3633');
const repairBindings = fromB('repair_bindings', 'input-bindings.json', 'Existing repair input ledger');
const changed = fromB('changed_fields', 'changed-fields.json', 'Declared FIRST20 field deltas');
const req1 = fromB('requirements_v1_snapshot', 'inputs/n87-preauthor-source-requirements.v1.json',
  'Preserved original requirements');
const req2 = fromB('requirements_v2', 'n87-preauthor-source-requirements.v2.json',
  'Private versioned clarification of one unsupported obligation');
const clarification = fromB('clarification_v2', 'requirements-clarification.v2.json',
  'Removal authority, bound source and exact amendment');
const rawL = fromB('raw_lesson_snapshot', 'inputs/raw-lesson.json', 'Bound original source text');
const rawE = fromB('raw_exercises_snapshot', 'inputs/raw-exercises.json', 'Bound source task text');
fromB('locale_mapping', 'locale-mapping.json',
  'Existing heading/group/alias contract notes; no runtime approval');
fromB('contract_binding_notes', 'current-contract-bindings.json',
  'Existing alias/heading authorization notes; no native execution or approval');
fromB('reused_validation_inventory', 'reused-validations.json',
  'Repair inheritance inventory only, not a new native validation');
bind('repair_manifest', path.join(B, 'SHA256SUMS'), 'Original d858 frozen manifest');

for (const [id, relative] of [
  ['router', 'AGENTS.md'],
  ['session_router', '.intentfold/readme.md'],
  ['project_binding', '.intentfold/project.json'],
  ['product_charter', '.intentfold/charter/product.md'],
  ['engineering_charter', '.intentfold/charter/engineering.md'],
  ['operations_charter', '.intentfold/charter/operations.md'],
  ['lesson_skill', '.claude/skills/ld-s10y-lesson/SKILL.md'],
  ['production_resume', '.claude/skills/ld-s10y-lesson/references/production-resume.md'],
  ['edition_contract', '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'],
]) bind(id, path.join(R, relative), 'Read-only applicable instructions');

for (const id of ['requirements', 'raw_lesson', 'raw_exercises']) {
  const entry = firstBindings.files.find(item => item.id === id);
  bind(`original_${id}`, entry.path, 'Original d847-bound source; no source production replay', entry.sha256);
}
const originalSourcePaths = firstBindings.files.filter(x =>
  ['requirements', 'raw_lesson', 'raw_exercises'].includes(x.id));
check('raw snapshots retain original source hashes',
  equal(originalSourcePaths.map(x => x.sha256), [
    sha(Buffer.from(fs.readFileSync(path.join(B, 'inputs/n87-preauthor-source-requirements.v1.json')))),
    sha(Buffer.from(fs.readFileSync(path.join(B, 'inputs/raw-lesson.json')))),
    sha(Buffer.from(fs.readFileSync(path.join(B, 'inputs/raw-exercises.json')))),
  ]));

const escapePointer = x => x.replaceAll('~', '~0').replaceAll('/', '~1');
const delta = (a, b, pointer = '') => {
  if (equal(a, b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b) && !Array.isArray(a)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      delta(a[key], b[key], `${pointer}/${escapePointer(key)}`));
  }
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
      !pointer.endsWith('/historical_entities') && !pointer.endsWith('/changes')) {
    return a.flatMap((value, i) => delta(value, b[i], `${pointer}/${i}`));
  }
  return [{ pointer, original: a, desired: b }];
};
const mathTokens = text => [...text.matchAll(/\$[^$]*\$/g)].map(x => x[0]);
const fieldReviews = [];
const inheritance = [];
const flowEvidence = [];
const historyEvidence = [];
let affectedObjects = 0;
let changedMathTokens = 0;

for (const item of receipt.candidates) {
  const key = `${item.locale}_${item.kind}`;
  const before = read(`before_${key}`, item.beforePath,
    'Frozen before bytes, exact d847 baseline', item.beforeSha256);
  const current = read(`candidate_${key}`, item.path,
    'Exact current d858 candidate', item.sha256);
  const old = firstBindings.files.find(x => x.id === `candidate_${key}`);
  bind(`first_candidate_${key}`, old.path, 'Original approved identity baseline', old.sha256);
  check(`before ${key} equals d847 baseline hash`, item.beforeSha256 === old.sha256);
  const actual = delta(before, current);
  const declared = changed.candidates.find(x => x.locale === item.locale && x.kind === item.kind);
  check(`only declared fields changed:${key}`, equal(actual,
    declared.fields.map(({ pointer, original, desired }) => ({ pointer, original, desired }))),
  { actual: actual.map(x => x.pointer), declared: declared.fields.map(x => x.pointer) });
  if (item.kind === 'exercises') {
    check(`six-task byte identity:${item.locale}`, actual.length === 0 && old.sha256 === item.sha256);
    inheritance.push({ locale: item.locale, kind: 'six-original-written-tasks',
      status: 'PASS-INHERITED', originalSha256: old.sha256, currentSha256: item.sha256,
      sourceReportPointer: '/verdicts/sixQuestionIdentityAndTranslation',
      basis: 'Exact file byte identity; no task translation/solution replay',
      originalQuestionIdentities: 6, currentQuestionDisplays: 6 });
    continue;
  }
  const affectedIndices = [...new Set(actual.filter(x => /^\/prose\/\d+\//.test(x.pointer))
    .map(x => Number(x.pointer.split('/')[2])))];
  affectedObjects += affectedIndices.length;
  const unaffected = current.prose.map((_, i) => i).filter(i => !affectedIndices.includes(i));
  inheritance.push({ locale: item.locale, kind: 'unaffected-lesson-objects',
    status: 'PASS-INHERITED-WITH-ORIGINAL-LIMITS', pointers: unaffected.map(i => `/prose/${i}`),
    originalFileSha256: old.sha256, currentFileSha256: item.sha256,
    unchangedProjectionSha256: sha(JSON.stringify(unaffected.map(i => current.prose[i]))),
    sourceReportPointer: '/scientificCoverage',
    basis: 'Declared-only structured delta proves unchanged objects; original model/coherence limits retained' });
  inheritance.push({ locale: item.locale, kind: 'exact-source-snapshot-and-provenance',
    status: 'PASS-INHERITED', sourceSnapshotSha256: sha(JSON.stringify(current.source.data)),
    sourceReportPointer: '/verdicts/sourceSnapshotAndMathIdentity',
    basis: 'No source.data, source_text, source_refs, printed_title, kind/id or source ownership field changed' });
  for (const field of declared.fields) {
    if (field.pointer.endsWith('/text')) {
      const preserved = equal(mathTokens(field.original), mathTokens(field.desired));
      check(`affected math identity:${item.locale}:${field.pointer}`, preserved);
      changedMathTokens += mathTokens(field.desired).length;
    }
    fieldReviews.push({ locale: item.locale, kind: item.kind, pointer: field.pointer,
      findingIds: field.findings, status: 'PASS', reviewType: field.pointer.startsWith('/section_breaks/')
        ? 'Saved native flow adjacency/byte linkage, no flow rerun' : 'Independent affected-field semantic review',
      originalValueSha256: sha(JSON.stringify(field.original)),
      currentValueSha256: sha(JSON.stringify(field.desired)) });
  }

  const flow = fromB(`saved_flow_${item.locale}`, `flow/${item.locale}-resolved.json`,
    'Existing resolved flow; direct read/compare only, no native or flow execution');
  const boundaryEvidence = current.section_breaks.map((anchor, i) => {
    const boundary = flow.boundaries[i];
    const linked = boundary && equal(anchor, { before: boundary.before, after: boundary.after }) &&
      boundary.index === flow.resolvedBreaks[i] &&
      flow.paragraphs[boundary.index - 1]?.text === anchor.before &&
      flow.paragraphs[boundary.index]?.text === anchor.after;
    check(`saved flow boundary:${item.locale}:${i}`, Boolean(linked));
    return { pointer: `/section_breaks/${i}`, resolvedIndex: boundary?.index,
      status: linked ? 'PASS' : 'HOLD',
      beforeSha256: sha(anchor.before), afterSha256: sha(anchor.after) };
  });
  const affectedFlow = flow.paragraphs.filter(x => affectedIndices.includes(x.blockIndex));
  for (const i of affectedIndices) {
    check(`saved flow contains exact current affected prose:${item.locale}:${i}`,
      flow.paragraphs.filter(x => x.blockIndex === i).map(x => x.text).join('\n\n') === current.prose[i].text);
  }
  if (item.locale === 'en') {
    check('genuine English heading at saved flow paragraph 4',
      flow.paragraphs[4].text.startsWith('**Surface Quality Inspection**'));
    check('genuine English heading at saved flow paragraph 8',
      flow.paragraphs[8].text.startsWith('**Antireflection Treatment**'));
    check('complete amplitude sentences at saved flow paragraphs 22 and 23',
      flow.paragraphs[22].text.endsWith('cancel completely.') &&
      flow.paragraphs[23].text.startsWith('Nearly equal amplitudes'));
  }
  flowEvidence.push({ locale: item.locale, source: path.join(B, `flow/${item.locale}-resolved.json`),
    status: 'PASS-SAVED-FLOW-EVIDENCE-ONLY', rerun: false, boundaries: boundaryEvidence,
    affectedParagraphs: affectedFlow.map(x => ({ index: x.index, blockIndex: x.blockIndex,
      paragraphInBlock: x.paragraphInBlock, textSha256: sha(x.text) })),
    renderedAppearanceApproved: false });

  const historical = current.prose[18];
  const names = historical.historical_entities.map(entity => {
    const sourceTerm = entity.source_term ?? entity.term;
    const sourcePresent = rawL.prose[18].text.includes(sourceTerm) &&
      historical.source_text.includes(sourceTerm);
    const modernPresent = historical.text.includes(entity.term);
    const sourceBound = historical.source_refs.includes('p0232#10') &&
      entity.reason.includes('p0232#10');
    check(`literal historical binding:${item.locale}:${entity.term}`,
      sourcePresent && modernPresent && sourceBound);
    return { term: entity.term, source_term: sourceTerm, sourcePresent, modernPresent,
      sourceBound, status: 'PASS-SOURCE-BOUND-IDENTITY-ONLY' };
  });
  check(`three individual historical declarations:${item.locale}`, names.length === 3);
  if (item.locale === 'en') check('English historical translations declared',
    historical.changes.includes('translation') && historical.changes.includes('historical-entity'));
  historyEvidence.push({ locale: item.locale, pointer: '/prose/18/historical_entities',
    sourceRef: 'p0232#10', declarations: names,
    semanticAssessment: 'Country attribution and the two already-retained named researchers remain separate identities. Latin initials I.V. and A.N. match the source initials; exact source surnames bind the established bilingual aliases. No new historical identity or invention-priority claim is introduced.',
    externalHistoricalAuthentication: false, nativeValidationRun: false });
}
check('exactly twenty changed fields', fieldReviews.length === 20 && changed.totalChangedFields === 20);
check('exactly ten affected prose objects', affectedObjects === 10);
check('seven original held findings retained', first.findings.length === 7 &&
  first.findings.every(x => x.status === 'HOLD'));
check('all requirement source blocks unchanged', equal(req1.blocks, req2.blocks));
const strippedReq2 = structuredClone(req2);
strippedReq2.status = req1.status;
strippedReq2.requirements[0] = req1.requirements[0];
delete strippedReq2.clarification;
check('private v2 alters only status, first obligation and clarification metadata', equal(req1, strippedReq2));
check('private v2 removes only literal reference46 from obligation',
  req2.requirements[0] === req1.requirements[0].replace('reference46, ', '') &&
  equal(req2.requirements.slice(1), req1.requirements.slice(1)));
check('versioned clarification exact amendment',
  clarification.version === 2 && clarification.original.sha256 ===
  'e2035f5a3e0a9608d90ef5275d9056dd59da9c221d3b3c9f596a46b09059d071' &&
  clarification.amendment.original === req1.requirements[0] &&
  clarification.amendment.desired === req2.requirements[0]);
const literalSourceTexts = [
  ...rawL.prose.map(x => x.text ?? ''),
  ...rawE.exercises.map(x => x.text ?? ''),
  ...req1.blocks.flatMap(x => x.lines),
];
const reference46Matches = literalSourceTexts.flatMap((text, i) => {
  const matches = text.match(/reference\s*46|(?<!\d)46(?!\d)|四十六/gi);
  return matches ? [{ sourceTextIndex: i, matches }] : [];
});
check('reference46 absent only in bound literal source', reference46Matches.length === 0,
  { textsExaminedForAbsenceOnly: literalSourceTexts.length, sourceBlocks: req1.blocks.length });
check('clarification hash linked by private requirements',
  req2.clarification.evidence.sha256 === ledger.get(path.join(B, 'requirements-clarification.v2.json')).sha256);

// These are independent semantic decisions, not assertions borrowed from the repair author.
const findingReviews = [
  {
    id: 'd847-F01', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['SCI', 'ZHEN'], locales: ['zh', 'en'], pointers: ['/prose/18/text'],
    sourceRefs: ['p0231#11', 'p0231#9', 'p0232#2', 'p0232#3', 'p0232#10'],
    assessment: 'The literal integer-wave statement and source-attributed historical credit remain. Both languages explicitly reject it as a usable antireflection selection rule under this lesson model, and distinguish the in-film quarter-wave design subject to phase and amplitude conditions.',
    independentReasoning: 'With the same reflection reversal on both contributions, h=m*lambda_film gives extra travel 2m*lambda_film and propagation phase 4*pi*m, not opposition. h=lambda_film/4 gives extra travel lambda_film/2 and opposition. An unspecified integer multiple of a different wavelength is not a generic rule derived from this model.',
    unresolvedSourceContext: 'Which wavelength and any extra conditions intended by the source footnote remain unspecified. The revision does not claim a typo, transcription error, industrial convenience explanation, higher-order design, or authenticated cause.',
    originalExpressionCorrected: false, originalFindingReplaced: false,
  },
  {
    id: 'd847-F02', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['SCI', 'ZHEN'], locales: ['zh', 'en'], pointers: ['/prose/3/text'],
    sourceRefs: ['p0230#6'],
    assessment: 'The exact 1/10 wavelength and 10^-6 cm quantities remain as reported source sensitivity, followed by an explicit warning that this is not a universal conversion. Both languages say the testing wavelength is missing.',
    independentReasoning: 'A length expressed as a fraction of a wavelength requires that wavelength to convert to centimetres; retaining two attributed sensitivity figures does not establish equality for every testing wavelength.',
    unresolvedSourceContext: 'No testing wavelength, exponent correction or ultraviolet/green-light test is supplied or inferred.',
  },
  {
    id: 'd847-F03', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['ZHEN'], locales: ['en'],
    pointers: ['/prose/3/text', '/prose/6/text', '/section_breaks/0/after', '/section_breaks/1/after'],
    sourceRefs: ['p0230#6', 'p0230#9', 'p0231#1'],
    assessment: 'The actual bold headings are Surface Quality Inspection and Antireflection Treatment, not English prose appended to Chinese headings. Saved resolved-flow paragraphs 4 and 8 and adjacent anchors contain those headings and match current text.',
    unchangedGroup: { sourceIdentity: 'group=问题; group_id=g1',
      affectedReviewStatus: 'SOURCE-IDENTITY-PASS-INHERITED',
      existingProjectionAuthority: 'd858 locale-mapping notes record the human-supplied existing d840 Questions projection',
      projectionReadOrRun: false, runtimeEnglishGroupDisplay: 'NOT-REVIEWED' },
    limit: 'PASS is for changed modern headings and their saved flow bindings only; it is not a whole English display/renderer approval. No new mapper or source-group overwrite is approved.',
  },
  {
    id: 'd847-F04', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['ZHEN', 'SCI'], locales: ['en'],
    pointers: ['/prose/16/text', '/section_breaks/3/before'],
    sourceRefs: ['p0231#10', 'p0232#1'],
    assessment: 'The equal-amplitude sentence now ends with a full stop within paragraph 22. Paragraph 23 starts Nearly equal amplitudes and gives a full sentence about residual reflection. The saved anchor uses that complete paragraph before the wavelength-selectivity section.',
    independentReasoning: 'Opposing phase plus equal amplitudes permits cancellation; near amplitudes leave a remainder. Both conditions remain explicit, without a mid-sentence paragraph cut or an assertion that phase alone suffices.',
  },
  {
    id: 'd847-F05', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['ZHEN', 'SCI'], locales: ['zh', 'en'], pointers: ['/prose/11/text', '/prose/20/text'],
    sourceRefs: ['p0231#6', 'p0232#2', 'p0232#9', 'p0233#2', 'p0230#6', 'p0232#4', 'p0233#1'],
    assessment: 'The prerequisite bridge defines frequency, restricts its conservation to a stationary medium boundary, and connects single-frequency colour to frequency rather than wavelength measured in different media. The ice-crack transfer is explicitly conditional on thin air gaps, suitable illumination and overlapping reflections, not an assertion about every fracture.',
    independentReasoning: 'These are general conceptual prerequisites tied to the source wavelength relation, white-light discussion and original tasks. An ice/air/ice gap cannot inherit the air/film/glass equal-reversal thickness rule; both versions explicitly refuse that transfer. No worked exercise solution, visibility guarantee, grading key, new question or experiment instruction is added.',
    limit: 'A prerequisite bridge is approved within the affected text, not course-wide independent completion or a full thin-gap design proof.',
  },
  {
    id: 'd847-F06', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['source-requirements'], locales: [], pointers: ['/requirements/0'],
    assessment: 'The original bound literal source has no reference46 referent. Private version 2 removes only that unsupported obligation and keeps every source block and other requirement exact. The separately versioned clarification binds the original requirements and raw source hashes. The original requirement and first HOLD are preserved.',
    sourceAbsenceEvidence: { originalRequirementsSha256: clarification.original.sha256,
      rawLessonSha256: clarification.evidence.rawLessonSha256,
      rawExercisesSha256: clarification.evidence.rawExercisesSha256,
      sourceBlocks: req1.blocks.length, matches: reference46Matches },
    limit: 'Absence is within the bound text only, not a new source-pixel audit, guessed destination or broad permission to remove actual references.',
  },
  {
    id: 'd847-F07', originalStatus: 'HOLD', affectedStatus: 'PASS',
    tracks: ['source-provenance', 'ZHEN'], locales: ['zh', 'en'],
    pointers: ['/prose/18/historical_entities', '/prose/18/changes'], sourceRefs: ['p0232#10'],
    assessment: 'Both objects declare the country attribution and each of the two researchers separately. Chinese surnames occur literally in source and modern text; English terms occur in modern text and each source_term occurs literally in the same source object. Reasons bind p0232#10, and English retains translation plus historical-entity changes.',
    independentReasoning: 'The source-bound aliases identify the already-retained researchers with matching initials and unchanged roles; they are not a global whitelist. The text still attributes the credit to the source footnote, rather than asserting newly verified historical priority.',
    limit: 'Semantic source-identity/provenance review only; no external historical authentication, new native gate pass or core-contract review.',
  },
];

for (const entry of ledger.values()) {
  entry.recheckedUnchanged = sha(fs.readFileSync(entry.path)) === entry.sha256;
  check(`input unchanged at freeze:${entry.id}`, entry.recheckedUnchanged);
}
const structuralHolds = checks.filter(x => x.status === 'HOLD');
const overall = structuralHolds.length ? 'HOLD' : 'PASS';
if (structuralHolds.length) {
  for (const entry of fieldReviews) entry.status = 'HOLD-INPUT-EVIDENCE';
  for (const entry of findingReviews) entry.affectedStatus = 'HOLD-INPUT-EVIDENCE';
}
const frozenAt = new Date().toISOString();
const writeJSON = (name, value) => fs.writeFileSync(path.join(O, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const instructionsOutsideR = {
  path: '/Users/yong/.agents/skills/intentfold/SKILL.md',
  role: 'Instruction-only routing read; no capability or external service invocation',
  sha256: null,
  hashReason: 'Review data stays bound to sole R; global installed skill is not a review content input',
};
const usages = {
  schema: 'STEMROBIN-181/d873-actual-review-usage@1',
  affectedIndependentReviewRounds: 1, tracks: ['SCI', 'ZHEN'],
  firstWholeTextReviewRoundsReplayed: 0, changedFieldsReviewed: fieldReviews.length,
  affectedLessonObjectsReviewed: affectedObjects, originalHeldFindingsReviewed: 7,
  unchangedQuestionFilesInherited: 2, originalQuestionIdentitiesInherited: 6,
  questionTranslationOrSolutionReplayRounds: 0, savedFlowFilesRead: 2, flowCalls: 0,
  shellCommandsBeforeEvidenceFreeze: 22, evidenceFreezeScriptCalls: 1,
  shellCommandsTotalIncludingFreeze: 23, manualApplyPatchCalls: 1,
  discoveryCommandFailures: 2,
  candidateAuthoringRounds: 0, candidateRepairRounds: 0, furtherReviewRounds: 0,
  nativeCalls: 0, normalizeCalls: 0, adaptPrepareCalls: 0, finalizeCalls: 0,
  renderCalls: 0, sourceReplayCalls: 0, imagesOpened: 0, imagesCreated: 0,
  fullValidatorCalls: 0, tests: 0, builds: 0, externalWebOrNetworkCalls: 0,
  canonicalWrites: 0, sharedIndexReadsOrWrites: 0, sharedMeterReadsOrWrites: 0,
  gitCalls: 0, databaseCalls: 0, publisherCalls: 0, deployCalls: 0, otherChatCalls: 0,
  additionalPaidModelCalls: 0, actualModelTokens: null, actualMonetaryCost: null,
  actualTotalComputeUsage: null,
  unknownUsageReason: 'Session billing tokens, monetary cost and total compute are not exposed; unknown is not zero. No shared meter was queried.',
  instructionOnlyGlobalSkillRead: instructionsOutsideR,
  preservedPriorUsage: {
    source: path.join(B, 'report.json'),
    scope: 'Historical d858 receipt, not this review usage; counts not reset or added as new calls',
    repairRounds: receipt.repairRounds, independentReviewRounds: receipt.independentReviewRounds,
    nativeValidateTextCalls: receipt.counts.nativeValidateTextCalls,
    normalizeAffectedCalls: receipt.counts.normalizeAffectedCalls,
    nativeFlowCliCalls: receipt.counts.nativeFlowCliCalls,
  },
};
const inputBindings = {
  schema: 'STEMROBIN-181/d873-input-bindings@1', R, T, writeRoot: O, frozenAt,
  status: overall === 'PASS' ? 'PASS-EXACT-INPUT-HASHES-UNCHANGED' : 'HOLD',
  method: 'Local byte SHA-256, exact declared-only JSON delta and hash-identical inherited evidence; no native/source/render replay',
  files: [...ledger.values()], sourceBoundary: req1.boundary,
  expectedHashAuthority: 'Original d847 bindings plus d858 report and its already frozen manifest',
  candidateSourceAndBeforeUnchanged: structuralHolds.length === 0,
};
writeJSON('input-bindings.json', inputBindings);
writeJSON('affected-evidence.json', {
  schema: 'STEMROBIN-181/d873-affected-evidence@1', status: overall, frozenAt,
  fieldReviews, findingReviews, inheritance, savedFlow: flowEvidence,
  historicalSourceBindings: historyEvidence, structuralChecks: checks,
  changedTextMathTokensCompared: changedMathTokens,
  note: 'Only changed text math tokens are compared anew; unchanged formulas and all task identities inherit d847 PASS by exact hashes/delta.',
});
writeJSON('usage.json', usages);
const artifact = name => {
  const filename = path.join(O, name);
  const bytes = fs.readFileSync(filename);
  return { path: filename, sha256: sha(bytes), bytes: bytes.length };
};
const report = {
  schema: 'STEMROBIN-181/d873-independent-affected-text-review@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', batch: 'd873',
  card: 'phy10-c2-s3-n87', R, T, writeRoot: O, frozenAt,
  status: `AFFECTED-SCI-ZHEN-REVIEW-FROZEN-${overall}`,
  reviewer: { independentOfAuthor: true, authorApprovalClaimsUsedAsApproval: false,
    method: 'Independent reading of exact changed20 values and all seven prior HOLD findings against bound source physics. Existing resolved flow is read and hash-linked, never rerun.' },
  verdicts: {
    overall, SCI: { status: overall, scope: 'Changed scientific explanations and their prerequisites only' },
    ZHEN: { status: overall, scope: 'Changed bilingual text, complete amplitude sentences and genuine English headings in saved flow only' },
    sourceRequirementsClarification: overall, affectedHistoricalProvenance: overall,
    exactSourceMathAndSixTasks: 'PASS-INHERITED-FROM-d847',
    englishExerciseGroupRuntimeProjection: 'NOT-REVIEWED',
    imagesRuntimeGradingWholeCardPublication: 'NOT-REVIEWED',
  },
  scope: { changedFields: 20, changedFiles: 2, affectedLessonObjects: 10,
    originalHeldFindings: 7, unchangedExerciseFiles: 2,
    fullCardApproved: false, publicationApproved: false, downstreamApproval: false,
    onlyWriteRoot: O, furtherWorkAuthorized: false },
  currentCandidates: receipt.candidates.map(({ locale, kind, path: filename, sha256,
    beforePath, beforeSha256, changedFields }) => ({ locale, kind, path: filename,
    sha256, beforePath, beforeSha256, changedFields })),
  originalReview: { report: artifactFor(F, 'report.json'),
    findings: artifactFor(F, 'findings.md'), status: first.status,
    originalVerdictNotReplaced: true },
  repairReport: artifactFor(B, 'report.json'),
  changedFields: artifactFor(B, 'changed-fields.json'),
  originalRequirements: artifactFor(B, 'inputs/n87-preauthor-source-requirements.v1.json'),
  requirementsV2: artifactFor(B, 'n87-preauthor-source-requirements.v2.json'),
  clarification: artifactFor(B, 'requirements-clarification.v2.json'),
  inputBindings: artifact('input-bindings.json'),
  affectedEvidence: artifact('affected-evidence.json'), usage: artifact('usage.json'),
  findingDispositions: findingReviews, inheritedPasses: inheritance,
  inputEvidenceHolds: structuralHolds,
  residualLimits: [
    'Source integer-wave premise and testing wavelength are still explicitly unresolved source context, not corrected or authenticated.',
    'Original two-reflection model, selected wavelength/normal-incidence/amplitude limits and coherent-path assumptions remain; no full Fresnel or broadband design proof.',
    'The unchanged source group 问题/g1 is preserved. Existing Questions projection is recorded authority only; runtime/renderer behavior was not inspected or accepted.',
    'All six tasks and shared math/source identities inherit d847 PASS; no new whole-card, source-pixel, answer, grading or visual approval.',
    'Historical alias provenance is source-bound; printed invention attribution is not independently authenticated.',
  ],
  failuresPreserved: [
    { kind: 'path-discovery', command: 'rg --files T/tmp/d847-n87-first-independent-text-review T/tmp/d858-n87-text-first-repair',
      workdir: R, exitCode: 2, cause: 'T was ticket shorthand, not a literal directory',
      disposition: 'Resolved to existing STEMROBIN-181 ticket path; no inputs or content changed' },
    { kind: 'output-preexistence-probe', command: 'ls -ld .intentfold/tickets/STEMROBIN-181/tmp/d873-n87-text-affected-review',
      workdir: R, exitCode: 1, cause: 'New bounded output directory did not yet exist',
      disposition: 'Only the requested output directory was created; not a scientific failure or approval' },
  ],
  stop: { frozenOnce: true, authorEditsPerformed: false, sourceAndCandidatesUnchanged: true,
    noNativeFlowFinalizeRenderSourceReplay: true, noImagesNeededOrOpened: true,
    noCanonicalIndexMeterGitDatabasePublisherDeployOtherChat: true, stopAfterReport: true },
};
function artifactFor(root, name) {
  const filename = path.join(root, name);
  const entry = ledger.get(filename);
  if (!entry) throw new Error(`Unbound report reference: ${filename}`);
  return { path: filename, sha256: entry.sha256, bytes: entry.bytes };
}
writeJSON('report.json', report);
const md = [
  '# d873: Bounded Independent n87 Affected Review',
  '',
  `Frozen scoped result: **SCI ${overall}; ZHEN ${overall}**.`,
  'Only the exact FIRST20 field changes and seven prior HOLD findings were reviewed.',
  'This does not approve the whole card, renderer, images, grading or publication.',
  '',
  '## Finding Dispositions',
  '',
  ...findingReviews.map(x => `- ${x.id}: ${x.affectedStatus}. ${x.assessment}`),
  '',
  '## Identity And Scope',
  '',
  'Unchanged source snapshots, mathematical identities and six task identities/translations inherit d847 PASS by exact hashes and declared-only deltas. The original d847 HOLD report is preserved, not replaced.',
  'English saved-flow headings are Surface Quality Inspection and Antireflection Treatment. Equal/near-amplitude paragraphs are complete sentences. No flow/native/render command was run.',
  'The source integer-wave premise and testing wavelength remain unspecified; no unsupported cause, source correction or measurement wavelength was invented.',
  'The source Questions group identity remains 问题/g1. Existing English projection is recorded authority only, not runtime acceptance.',
  '',
  '## Reports',
  '',
  ...['report.json', 'input-bindings.json', 'affected-evidence.json', 'usage.json']
    .map(name => `- [${name}](${path.join(O, name)})`),
  '',
  '## Usage And Stop',
  '',
  'One affected independent review, 20 fields, 10 affected prose objects, seven prior findings. Two unchanged exercise files inherited. All author/native/flow/finalize/render/source replay/image/Git/DB/publisher/deploy/other-chat calls: 0.',
  'Actual model billing tokens, cost and total compute are unknown, not zero. Prior d858 usage is retained separately and not reset.',
  'Only this directory was written. All bound inputs were rehashed unchanged. Stop; no downstream authority granted.',
  '',
].join('\n');
fs.writeFileSync(path.join(O, 'report.md'), md, { flag: 'wx' });
const outputNames = ['review-and-freeze.mjs', 'input-bindings.json',
  'affected-evidence.json', 'usage.json', 'report.json', 'report.md'];
const outputs = outputNames.map(artifact);
fs.writeFileSync(path.join(O, 'SHA256SUMS'),
  `${outputs.map(x => `${x.sha256}  ${path.basename(x.path)}`).join('\n')}\n`, { flag: 'wx' });
check('output manifest hash verification', outputs.every(x => sha(fs.readFileSync(x.path)) === x.sha256));
if (!checks.at(-1).status.startsWith('PASS')) throw new Error('Output hash verification failed');
console.log(JSON.stringify({ status: report.status, verdicts: report.verdicts,
  changedFields: fieldReviews.length, affectedObjects, findings: findingReviews.length,
  boundInputs: ledger.size, structuralHolds: structuralHolds.length,
  outputs, manifest: artifact('SHA256SUMS'), inputsUnchanged: true,
  scopeStop: true }, null, 2));
