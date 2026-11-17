import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticket = `${root}/.intentfold/tickets/STEMROBIN-181`;
const own = path.dirname(fileURLToPath(import.meta.url));
const output = `${own}/report.json`;
assert.equal(fs.existsSync(output), false, 'Never overwrite a historical report');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const files = new Map();
function bind(file, expectedSha256, role) {
  const absolute = path.resolve(root, file);
  assert.ok(/\.(json|mjs)$/.test(absolute), 'Only authorized text metadata');
  const bytes = fs.readFileSync(absolute);
  const sha256 = digest(bytes);
  if (expectedSha256) assert.equal(sha256, expectedSha256, absolute);
  const record = {
    role, path: absolute, sha256, expectedSha256: expectedSha256 ?? sha256,
    bytes: bytes.length, hashMatchesExpected: true,
  };
  files.set(absolute, record);
  return { record, data: absolute.endsWith('.json') ? JSON.parse(bytes) : null };
}
const author = bind(
  `${ticket}/tmp/d063-n58-text-author/author-freeze.json`,
  'b1250a4b3c5948f8e241b1f71bfa5eb4238fbcb707f095989c6c2cf23090b262',
  'author-freeze-not-independent-SCI-evidence',
);
const consumption = bind(
  `${ticket}/evidence/reports/d062-source154-155-consumed.json`,
  '53ae897ccc69f953abb5bc2346e3af681224fead7ece574957336485afb9a694',
  'inherited-complete-SOURCE-and-RAW-consumption',
);
const consumptionCopy = bind(
  author.data.inputBindings.consumption.path,
  consumption.record.sha256, 'frozen-consumption-exact-copy',
);
assert.deepEqual(consumptionCopy.data, consumption.data);
assert.equal(consumption.data.sourceCandidate.SOURCE, 'PASS-complete-range');
assert.equal(consumption.data.sourceCandidate.RAW, 'PASS-owned-fig114');
const rawLesson = bind(
  `${ticket}/tmp/d062-source154-155/root/10p/lessons/phy10-c1-s6-n58/lesson.json`,
  '46f0cb18f7e183d5d4a5e485d35da45375a71ce74a06abe56debbc7c4cf5937e',
  'actual-raw-candidate-lesson',
);
const rawExercises = bind(
  `${ticket}/tmp/d062-source154-155/root/10p/lessons/phy10-c1-s6-n58/exercises.json`,
  '3003768922a3cae97ecfd3aee139deb44bf5e8131eaeedacee548bf0bceefd11',
  'actual-raw-candidate-zero-exercises',
);
const frozenLesson = bind(
  author.data.inputBindings.rawLesson.path, rawLesson.record.sha256,
  'author-frozen-raw-lesson-copy',
);
const frozenExercises = bind(
  author.data.inputBindings.rawExercises.path, rawExercises.record.sha256,
  'author-frozen-raw-exercises-copy',
);
assert.deepEqual(frozenLesson.data, rawLesson.data);
assert.deepEqual(frozenExercises.data, rawExercises.data);
const candidates = {};
const exactTemplateBindings = [];
for (const language of ['zh', 'en']) {
  candidates[language] = {};
  for (const kind of ['lesson', 'exercises', 'figures']) {
    const frozen = author.data.textCandidates[language][kind];
    const actual = bind(frozen.path, frozen.sha256, `${language}.${kind}.frozen`);
    candidates[language][kind] = actual.data;
    exactTemplateBindings.push({
      language, kind, frozen: actual.record,
      authorFreezePointer: `/textCandidates/${language}/${kind}`,
      snapshotAlreadyFrozenAtAuthorPath: true,
      approvalScope: kind === 'figures'
        ? 'Template identity and explicit HOLD only, not figure content or pixels'
        : kind === 'exercises' ? 'Zero original tasks remain zero' : 'Actual full candidate text',
    });
  }
}
const register = bind(
  author.data.textState.changeRegister.path,
  author.data.textState.changeRegister.sha256,
  'author-change-register-not-independent-evidence',
);
const failedRegister = bind(
  author.data.nativeReceipts['author-register-attempt-1.failure.json'].path,
  author.data.nativeReceipts['author-register-attempt-1.failure.json'].sha256,
  'preserved-author-register-failure',
);
const structure = bind(
  author.data.evidence['text-evidence/structure-text-check.json'].path,
  author.data.evidence['text-evidence/structure-text-check.json'].sha256,
  'existing-author-structure-receipt-not-SCI-proof',
);
const zh = candidates.zh.lesson;
const en = candidates.en.lesson;
const raw = rawLesson.data;
assert.equal(raw.prose.length, 7);
const sourceRefs = ['p0154#2', 'p0154#3', 'p0154#4', 'p0154#5', 'p0154#6', 'p0154#7', 'p0155#1'];
for (const lesson of [zh, en]) {
  assert.equal(lesson.prose.length, 7);
  assert.deepEqual(lesson.source.data, raw);
  assert.equal(lesson.source.sha256, rawLesson.record.sha256);
  for (const key of ['id', 'card_id', 'chapter', 'section', 'number', 'title',
    'printed_title', 'start_page', 'start_printed', 'exercise_count', 'figures']) {
    assert.deepEqual(lesson[key], raw[key], key);
  }
  for (let i = 0; i < 7; i++) {
    assert.deepEqual(lesson.prose[i].source_refs, [sourceRefs[i]]);
    assert.equal(lesson.prose[i].source_text, raw.prose[i].text);
    assert.equal(lesson.prose[i].kind, raw.prose[i].kind);
    assert.equal(lesson.prose[i].printed_page, raw.prose[i].printed_page);
    assert.deepEqual(lesson.prose[i].numeric_changes, []);
  }
}
for (const language of ['zh', 'en']) {
  const exercises = candidates[language].exercises;
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.deepEqual(exercises.source.data, rawExercises.data);
  const figures = candidates[language].figures;
  assert.equal(figures.promotable, false);
  assert.equal(figures.authoring_status, 'HOLD-modernfigure-imagebudget24');
  assert.equal(figures.hold.modernFigureApproved, false);
}
assert.ok(raw.prose[0].text.includes('\u4e09\u6781\u7ba1'));
assert.equal(zh.prose.some(block => block.text.includes('\u4e09\u6781\u7ba1')), false);
assert.equal(en.prose.some(block => /\btriode\b/i.test(block.text)), false);

const findings = [{
  id: 'N58-TEXT-01',
  status: 'FAIL-confirmed-source-fact-omission',
  severity: 'moderate',
  type: 'source-apparatus-specificity-not-preserved',
  gatesBlocked: ['SCI', 'ZHEN'],
  targetPointers: { zh: '/prose/0/text', en: '/prose/0/text' },
  sourceRefs: ['p0154#2'],
  sourceEvidence: {
    binding: rawLesson.record, pointer: '/prose/0/text',
    exactSourceTerm: '\u4e09\u6781\u7ba1',
    interpretation: 'Vacuum triode in the explicit tube/anode/cathode context; not a semiconductor transistor.',
  },
  candidateEvidence: {
    zhBinding: exactTemplateBindings[0].frozen,
    enBinding: exactTemplateBindings[3].frozen,
    zhTermUsedInstead: '\u7535\u5b50\u7ba1',
    enTermUsedInstead: 'vacuum-tube',
    specificTriodeIdentityPresentAnywhereInCandidateProse: false,
    sourceSnapshotStillContainsTerm: true,
    hiddenSourceTextIsNotLearnerFacingPreservation: true,
  },
  judgment: 'Both modern texts retain the generic tube example but omit its explicitly source-specified triode type. A vacuum tube is the broader category and does not retain that apparatus fact. The source-bound register does not declare or justify removing the type. Operating-range qualifications can limit a claim without deleting this identity.',
  scientificImpact: 'No claim that the retained modulation mechanism is physically false. The SCI release is HOLD because this assignment also requires all source physical facts to survive. The absent identity cannot be recovered by approving the unread figure.',
  bilingualImpact: 'The Chinese and English candidates agree with each other, but both lose the same original apparatus detail; pairwise equivalence alone is insufficient for source-faithful ZHEN approval.',
  figureDependence: false,
  authorRepairPerformed: false,
  resolution: 'Unresolved in these exact frozen bytes. Parent-owned author disposition only; no replacement text authored here.',
}];

const judgments = [
  {
    topic: 'Tube voltage, current, energy input per period, and oscillation amplitude',
    SCI: 'HOLD', ZHEN: 'HOLD', findingIDs: ['N58-TEXT-01'],
    sourceCompleteness: 'The electrode pair, carrier oscillations, direction of change, source energy per period, and amplitude increase/decrease remain. The explicit triode type alone is missing.',
    scientificJudgment: 'The conditional voltage/current/energy/amplitude chain is acceptable as a description of the specified operating regime. Energy delivered by the supply is not described as energy created by modulation; anode-current waveform is not equated to tank-voltage waveform. The decrease sentence inherits the preceding cycle and operating context.',
    bilingualJudgment: 'Potential difference, anode/cathode, generally increasing current and energy, and corresponding amplitude changes agree. Both versions retain the non-universal caveat. Both omit the same source apparatus subtype.',
    referenceIDs: ['P01-plate'],
  },
  {
    topic: 'Slow modulation relative to carrier and approximate transfer response',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'Much lower modulation frequency and approximate proportionality of changes remain; no precise ratio is invented.',
    scientificJudgment: 'The slow-envelope condition and approximately linear amplitude-control operating range are distinct conditions. Neither text infers exact proportionality from frequency separation alone. Linear here describes the effective amplitude-control response, not a claim that the instantaneous tube-current characteristic is linear everywhere. No source equation is changed.',
    bilingualJudgment: 'Both specify much lower variation frequency, approximately proportional changes, the approximately linear operating range, and the explicit rejection of an unconditional exact law.',
    referenceIDs: ['P01-plate'],
  },
  {
    topic: 'Low-frequency series source and transformer plate-modulation example',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'Added low-frequency AC source, DC anode supply, series connection, audio-frequency primary current, secondary source, bold AM term, and fig114 reference remain in order.',
    scientificJudgment: 'The described supply modulation is confined to this example rather than asserted to be the only way to implement AM. The tank amplitude follows the low-frequency voltage changes under the inherited conditions. Neither prose claims that the carrier oscillates at the audio frequency or that the plate current must be sinusoidal. Current and voltage waveform artwork is unexamined.',
    bilingualJudgment: 'The AC/DC series topology, primary/secondary roles, audio-frequency condition, amplitude response, and Figure114 meaning match. Alternating-voltage source makes the same source quantity explicit in English without a topology change.',
    referenceIDs: ['P01-plate'],
  },
  {
    topic: 'Original figure block retained, text/reference review only',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'Empty fig text, fig-114 identity, original position, label identity, printed page144, and p0154#5 binding remain.',
    scientificJudgment: 'There is no scientific sentence inside this block to approve. PASS means only textual reference integrity; it does not approve circuit connections, waveform geometry, labels, or any pixels.',
    bilingualJudgment: 'Both locales retain the same empty figure block and binding.',
    referenceIDs: [], figureApproval: 'HOLD',
  },
  {
    topic: 'Figure caption localization and number fidelity',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'The source caption and number114 remain in Chinese; the English caption is Figure114. Native label identity and p0154#6 binding are unchanged.',
    scientificJudgment: 'No added physical interpretation or numerical change occurs in the caption. Caption-text PASS is not figure approval.',
    bilingualJudgment: 'Figure is the semantic equivalent of the Chinese caption noun; the figure number is unchanged.',
    referenceIDs: [], figureApproval: 'HOLD',
  },
  {
    topic: 'Oscilloscope voltage waveform versus time',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'Circuit voltage input, oscilloscope instrument, and observation of modulated oscillations over time remain.',
    scientificJudgment: 'Both descriptions concern observing voltage versus time with an oscilloscope; they do not substitute a direct current measurement, an audio-only trace, or a new measurement specification.',
    bilingualJudgment: 'Voltage signal, oscillatory circuit, instrument, modulated waveform, and time dependence agree. The rewrite clarifies time scan without changing the measured quantity.',
    referenceIDs: ['P02-scope'],
  },
  {
    topic: 'Complete cross-page FM tail and bounded interference advantage',
    SCI: 'PASS', ZHEN: 'PASS', findingIDs: [],
    sourceCompleteness: 'The p0155#1 tail remains as the last full block: FM in some circumstances, signal-controlled frequency variation, and an interference advantage.',
    scientificJudgment: 'FM is distinguished from equating carrier and control-signal frequencies. The conditional interference comparison does not promise universal immunity. Suitable transmission/reception conditions are a bounded possibility claim, not a claim of advantage below every receiver threshold or against all interference types. No unprinted numerical criterion or receiver design is added.',
    bilingualJudgment: 'Both include some situations, frequency following changes in the control signal, the explicit not-equal-frequency clarification, comparison with AM, suitable conditions, and the rejection of an unconditional advantage.',
    referenceIDs: ['P01-FM', 'P01-interference'],
  },
];
const blocks = judgments.map((judgment, index) => ({
  id: `N58-BLOCK-${String(index + 1).padStart(2, '0')}`,
  proseIndex: index, kind: raw.prose[index].kind, sourceRefs: [sourceRefs[index]],
  printedPage: raw.prose[index].printed_page,
  source: {
    file: rawLesson.record, pointer: `/prose/${index}`,
    text: raw.prose[index].text,
    textSha256: digest(Buffer.from(raw.prose[index].text)),
  },
  candidates: Object.fromEntries(['zh', 'en'].map(language => {
    const text = candidates[language].lesson.prose[index].text;
    return [language, {
      template: exactTemplateBindings.find(x => x.language === language && x.kind === 'lesson').frozen,
      pointer: `/prose/${index}`, text, textSha256: digest(Buffer.from(text)),
    }];
  })),
  ...judgment,
}));
const primaryTextReferences = [
  {
    id: 'P01',
    title: 'Navy Electricity and Electronics Training Series, Module12 Modulation, NAVEDTRA14184',
    publisher: 'Naval Education and Training Professional Development and Technology Center',
    edition: 'September1998',
    sourceType: 'Primary Navy training publication; public-release text transcription hosted by Internet Archive',
    url: 'https://ia600504.us.archive.org/0/items/NEETSModules/NEETS%20Module%2012%20-%20Modulation_djvu.txt',
    access: 'Text-only search/open/find. No PDF, page image, figure, browser, screenshot, or raster accessed.',
    locators: [
      {
        id: 'P01-plate', chapter: '1, Plate Modulator and Circuit Operation',
        textLines: [239, 246], printedPages: ['1-54', '1-56'],
        support: 'Transformer-coupled plate-supply modulation changes tank RF amplitude. The specified RF stage can operate nonlinearly; this is distinct from a usable amplitude-control response.',
      },
      {
        id: 'P01-FM', chapter: '2, Frequency Modulation',
        textLines: [317, 320], printedPages: ['2-8', '2-9'],
        support: 'FM varies instantaneous carrier frequency according to the modulating signal, without setting carrier frequency equal to the audio frequency.',
      },
      {
        id: 'P01-interference', chapter: '3, Foster-Seeley Discriminator',
        textLines: [569, 582], printedPages: ['3-12', '3-14'],
        support: 'Noise rejection depends on receiver limiting; weak signals below limiting level can retain unwanted amplitude variations.',
      },
    ],
    authorityLimit: 'Supports mechanism and qualifications, not the exact unread Soviet circuit drawing. The triode-omission finding follows the bound local raw text, not this external publication.',
  },
  {
    id: 'P02-scope',
    title: 'Oscilloscope Basics: Waveforms, Graph, and Measurement Reading',
    publisher: 'Tektronix',
    sourceType: 'Primary instrument-manufacturer primer',
    url: 'https://www.tek.com/en/documents/primer/oscilloscope-basics',
    access: 'Primary search-result text only; no browser or media. No full-body inspection claimed.',
    support: 'An oscilloscope graphs an electrical signal. Used only to corroborate the unchanged voltage-versus-time instrument description, not any specifications.',
  },
];
const report = {
  schema: 'STEMROBIN-181/independent-SCI-ZHEN-text-review@1',
  ticket: 'STEMROBIN-181', lesson: 'phy10-c1-s6-n58',
  reviewedAt: new Date().toISOString(),
  status: 'HOLD', SCI: 'HOLD', ZHEN: 'HOLD',
  reviewer: {
    identity: 'Feynman', runtime: 'Codex',
    role: 'Existing independent reviewer in this chat, not the n58 author',
    authoredN58SourceTextModernTextOrFigure: false,
    replacementLessonTextWritten: false,
    judgmentBasis: 'One substantive source-to-candidate and bilingual reading of the exact frozen seven blocks, with primary text-only corroboration. Author structure PASS is not a SCI judgment.',
  },
  approvalScope: 'n58 textual scientific correctness, physical qualifications, source-fact completeness, numeric/formula fidelity, and source/ZH/EN meaning only. No figure, SOURCE pixel, full-native, display, exercises behavior, or whole-card promotion.',
  preReviewByteDrift: false,
  authorFreeze: author.record,
  exactTemplateBindings,
  originalSource: {
    consumption: consumption.record, frozenConsumptionCopy: consumptionCopy.record,
    rawLesson: rawLesson.record, rawExercises: rawExercises.record,
    frozenLessonCopy: frozenLesson.record, frozenExercisesCopy: frozenExercises.record,
    sourceRange: { firstIncludingTitle: 'p0154#1', last: 'p0155#1' },
    physicalPages: [154, 155], titleSource: '58. \u8c03\u5e45',
    inheritedSOURCE: 'PASS-complete-range', inheritedRAW114: 'PASS-owned-fig114',
    inheritedApprovalsNotReissued: true,
    sourceFullpagesOrImagesRead: false,
  },
  gateAssessments: {
    SCI: {
      status: 'HOLD', blockingFindingIDs: ['N58-TEXT-01'],
      retainedPhysicalExplanationsAndQualifications: 'PASS',
      allSourcePhysicalFactsPreserved: 'FAIL',
      reason: 'The scientifically bounded explanation still drops the explicitly specified source triode apparatus type.',
    },
    ZHEN: {
      status: 'HOLD', blockingFindingIDs: ['N58-TEXT-01'],
      pairwiseChineseEnglishMeaning: 'PASS',
      sourceToBothLocaleCompleteness: 'FAIL',
      reason: 'Both locales agree but both omit the original triode identity; source-faithful bilingual approval is therefore withheld.',
    },
  },
  blocks,
  findings,
  numericAndFormulaFidelity: {
    status: 'PASS',
    sourceFormulaCount: 0, zhFormulaCount: 0, enFormulaCount: 0,
    sourceEquationsVectorsSubscriptsOrSectionReferences: [],
    numericChanges: [], formulaChanges: [], notationChanges: [],
    originalFigureReferenceAndCaptionNumber: '114',
    lessonNumber: '58', originalPrintedPages: [144, 145],
    assessment: 'No equation, numerical value, unit, sign, vector/subscript, or section reference was added, removed, or changed. Energy during one period survives as prose, not as an invented equation. Numeric signature checks cannot detect the semantic triode identity loss, which is separately recorded.',
  },
  zeroExerciseReview: {
    status: 'PASS', originalCount: 0, zhCount: 0, enCount: 0,
    inventedExercisesChoicesAnswersOrInteractions: false,
  },
  primaryTextReferences,
  histories: {
    authorStructureReceipt: structure.record,
    structureReceiptReusedNotRerunOrTreatedAsSCI: true,
    authorRegister: register.record,
    preservedAuthorRegisterFailure: failedRegister.record,
    registerCompletionChangedCandidateBytes: author.data.textState.registerCompletionChangedCandidateBytes,
    registerFailureIsNotAnIndependentScientificFinding: true,
    inheritedSourceOriginalFAIL: consumption.data.originalFAIL,
    inheritedSourceAffectedReview: consumption.data.affectedReview,
    inheritedSourceHistoryNotReinterpretedOrRepaired: true,
    thisIsFirstN58SCIAndZHENReviewByThisReviewer: true,
    priorReportsUntouched: true,
  },
  pending: {
    modernFigure114: 'HOLD',
    figureWaveformsConnectionsGeometryAndLabels: 'NOT-REVIEWED',
    fullNative: 'PENDING',
    DISPLAY: 'PENDING',
    fullCardApproval: false,
    publication: 'NOT-AUTHORIZED',
    textDisposition: 'Confirmed source apparatus omission requires parent-owned disposition; no author repair here.',
  },
  imageBudget: {
    inheritedCumulativeImageCount: 24, imagesOpened: 0, actualNewOpens: 0,
    cumulativeImageCount: 24, maximum: 24, remaining: 0,
    imageFilesRead: 0, sourceFullpageOpens: 0, cropOpens: 0, noCounterReset: true,
  },
  actions: {
    repairs: 0, nativeStageInvocations: 0, renders: 0, browserCalls: 0,
    newCaptures: 0, imageOpens: 0, newAgents: 0,
    canonicalDBGitBackendToolOrDependencyWrites: false,
    oldReviewReplays: false, writesOnlyUnder: own,
    webUse: 'Necessary primary text references only; no browser or visual access',
  },
  reportGenerator: bind(fileURLToPath(import.meta.url), null, 'owned-report-generator').record,
  textInputBindings: [...files.values()],
};
for (const lesson of [raw, zh, en]) {
  assert.equal(lesson.prose.reduce((count, block) => count + (block.text.match(/\$[^$]*\$/g) ?? []).length, 0), 0);
}
for (const record of files.values()) {
  assert.equal(digest(fs.readFileSync(record.path)), record.sha256, record.path);
  record.postReviewSha256 = record.sha256;
  record.unchangedAfterReview = true;
}
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  path: output, sha256: digest(fs.readFileSync(output)),
  status: report.status, SCI: report.SCI, ZHEN: report.ZHEN,
  findingIDs: findings.map(f => f.id), reviewedOriginalBlocks: blocks.length,
  actualNewImageOpens: 0, cumulativeImageCount: 24,
  figure114: 'HOLD', fullNative: 'PENDING', DISPLAY: 'PENDING',
}, null, 2));
