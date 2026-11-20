import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
if (process.cwd() !== cwd) throw new Error('D292 requires the exact authorized cwd')
const owner = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d292-n19-text-review')
const recovery = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d287-n19-text-recovery')
const sourceRoot = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d287/source-root')
const work = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d287/work')
const canonicalRoot = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const lessonId = 'phy10-c1-s3-n19'
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const records = new Map()
const checks = []
const findings = []

function input(filename, inspection = 'digest-only dependency binding') {
  const absolute = path.resolve(cwd, filename)
  if (!/\.(json|md|txt|mjs|js|py)$/.test(absolute)) {
    throw new Error(`Non-text input forbidden: ${absolute}`)
  }
  if (!records.has(absolute)) {
    const bytes = fs.readFileSync(absolute)
    records.set(absolute, {
      bytes,
      binding: { path: absolute, sha256: sha(bytes), bytes: bytes.length, inspection },
    })
  } else if (inspection !== 'digest-only dependency binding') {
    records.get(absolute).binding.inspection = inspection
  }
  return records.get(absolute)
}

function json(filename) {
  return JSON.parse(input(filename, 'structured text/receipt inspected').bytes.toString('utf8'))
}

function text(filename) {
  return input(filename, 'prose or contract text inspected').bytes.toString('utf8')
}

function check(id, condition, detail) {
  checks.push({ id, result: condition ? 'pass' : 'fail', detail })
  if (!condition) findings.push({
    id: `D292-BINDING-${id}`,
    priority: 1,
    category: 'input-integrity-or-text-contract',
    title: `Verification failed: ${id}`,
    detail,
  })
}

const d287 = json(path.join(recovery, 'd287-report.json'))
const freeze = json(path.join(recovery, 'd287-text-freeze.json'))
const inputBindings = json(path.join(recovery, 'd287-input-bindings.json'))
let declaredReferenceCount = 0
function verifyDeclared(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const record = input(value.path)
    declaredReferenceCount += 1
    check(`declared-reference-${declaredReferenceCount}`,
      record.binding.sha256 === value.sha256
        && (value.bytes === undefined || record.binding.bytes === value.bytes),
      { path: record.binding.path, expectedSha256: value.sha256, actualSha256: record.binding.sha256 })
    return
  }
  for (const child of Object.values(value)) verifyDeclared(child)
}
verifyDeclared(d287)
verifyDeclared(inputBindings)
const withoutFreeze = { ...d287 }
delete withoutFreeze.freeze
check('report-freeze-equivalence', isDeepStrictEqual(withoutFreeze, freeze),
  'D287 report and freeze agree after removing only report.freeze.')

const contracts = [
  'AGENTS.md',
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
]
for (const filename of contracts) text(filename)
const require = createRequire(import.meta.url)
const { proseOutline, sectionBreakIndices } = require(path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const source = json(path.join(canonicalRoot, 'lessons', lessonId, 'lesson.json'))
const sourceExercises = json(path.join(canonicalRoot, 'lessons', lessonId, 'exercises.json'))
const isolatedSource = json(path.join(sourceRoot, '10p/lessons', lessonId, 'lesson.json'))
const sourceBook = json(path.join(sourceRoot, '10p/book.json'))
const oldFreeze = json(inputBindings.retainedFreeze.path)
const oldSCI = json(inputBindings.retainedSci.path)
const equivalence = json(path.join(recovery, 'receipts/d287-recovery-equivalence.json'))
const notation = json(d287.notation.path)
const display = json(d287.englishDisplayMetadata.path)
const author = json(path.join(recovery, 'english-paragraphs.json'))
const drift = json(d287.ChineseNormalizerDrift.path)
const nativeReceipts = d287.nativeReceipts.map((binding) => ({
  binding: input(binding.path).binding,
  receipt: json(binding.path),
}))
const languages = {}
const flows = {}

for (const lang of ['zh', 'en']) {
  const bindings = d287.languages[lang]
  const templates = {}
  for (const [kind, snapshots] of Object.entries(bindings.snapshots)) {
    templates[kind] = json(snapshots.operative.path)
    const frozenTemplate = json(snapshots.frozen.path)
    check(`${lang}-${kind}-operative-frozen-bytes`,
      input(snapshots.operative.path).bytes.equals(input(snapshots.frozen.path).bytes),
      'Exact current file bytes match, not merely semantic JSON equality.')
    check(`${lang}-${kind}-operative-frozen-data`,
      isDeepStrictEqual(templates[kind], frozenTemplate), 'Current operative/frozen structured templates agree.')
  }
  const lesson = templates.lesson
  const paragraphs = proseOutline(lesson.prose)
  const resolvedBreaks = sectionBreakIndices(lesson.prose, lesson.section_breaks)
  const combined = paragraphs.map((p) => p.text).join('\n\n')
  const boundaries = resolvedBreaks.map((i) => ({
    index: i, before: paragraphs[i - 1].text, after: paragraphs[i].text,
  }))
  flows[lang] = { paragraphs, resolvedBreaks, boundaries }
  check(`${lang}-source-snapshot`, isDeepStrictEqual(lesson.source.data, source),
    'Entire embedded faithful source snapshot equals the canonical source JSON, including chapter and section.')
  check(`${lang}-source-hash`, lesson.source.sha256 === d287.canonicalSourceHash
    && lesson.source.sha256 === input(path.join(canonicalRoot, 'lessons', lessonId, 'lesson.json')).binding.sha256,
  'Template source hash binds the actual canonical source bytes.')
  check(`${lang}-source-path`, lesson.source.path === `lessons/${lessonId}/lesson.json`,
    'Template source path resolves beneath the authorized D287 source-root/10p.')
  const identityFields = ['id', 'card_id', 'chapter', 'section', 'number', 'printed_title',
    'start_page', 'start_printed', 'figures', 'exercise_count']
  check(`${lang}-lesson-identity`, identityFields.every((field) => isDeepStrictEqual(lesson[field], source[field])),
    { fields: identityFields, titleException: 'EN title is an authored translation; source title remains untouched in source.data.' })
  check(`${lang}-prose-source-identity`, lesson.prose.length === source.prose.length
    && source.prose.every((block, i) => block.text === lesson.prose[i].source_text
      && ['kind', 'id', 'label', 'printed_page', 'source_refs'].every(
        (field) => isDeepStrictEqual(block[field], lesson.prose[i][field]))),
  'All six prose-block identities, order, exact source_text and source_refs remain unchanged.')
  check(`${lang}-combined-text`, combined === text(bindings.combinedParagraphText.path)
    && combined === bindings.combinedParagraphText.text,
  { sha256: sha(Buffer.from(combined)), method: 'Native proseOutline; two LF between paragraphs; no terminal LF.' })
  check(`${lang}-frozen-prose-flow`, isDeepStrictEqual(flows[lang], bindings.proseFlow),
    'Native parser results equal D287 freeze paragraph texts, indices, block placement and resolved boundaries.')
  check(`${lang}-full-text`, text(bindings.fullText.path) === bindings.fullText.text,
    'Frozen full-text bytes match the embedded D287 full text.')
  const expectedFullText = lang === 'en'
    ? `# ${display.metadata.printed_title.text}\n\n> ${display.metadata.chapter.text} | ${display.metadata.section.text}\n\n${combined}\n\n${display.metadata.tableLabel.text}\n`
    : `# ${lesson.printed_title}\n\n> ${lesson.chapter} | ${lesson.section}\n\n${combined}\n\n${lesson.prose[5].label}\n`
  check(`${lang}-full-text-derivation`, expectedFullText === text(bindings.fullText.path),
    'Full text contains the exact operative prose plus declared title, breadcrumb and unnumbered table label; table cells are not claimed.')
  check(`${lang}-exercise-source`, isDeepStrictEqual(templates.exercises.source.data, sourceExercises)
    && templates.exercises.source.path === `lessons/${lessonId}/exercises.json`
    && templates.exercises.source.sha256 === input(path.join(canonicalRoot, 'lessons', lessonId, 'exercises.json')).binding.sha256
    && templates.exercises.count === 0 && templates.exercises.exercises.length === 0,
  'No source exercise, example, answer or task is omitted or newly introduced.')
  check(`${lang}-notation-flags`, lesson.prose[2].changes.includes('notation')
    && lesson.prose[3].changes.includes('notation'),
  'Maximum-subscript and subfigure aliases are declared in the affected blocks; no unsupported notation_changes kind was inserted.')
  const atoms = (value) => Array.from(value.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs),
    (m) => (m[1] ?? m[2]).replaceAll('\\mathrm{\u043c}', '\\mathrm{m}'))
  check(`${lang}-math-atoms`, source.prose.every((block, i) => isDeepStrictEqual(atoms(block.text), atoms(lesson.prose[i].text))),
    { total: source.prose.reduce((n, b) => n + atoms(b.text).length, 0), permittedAlias: 'upright descriptive maximum subscript only' })
  languages[lang] = {
    edition: lesson.edition, locale: lesson.locale, snapshots: bindings.snapshots,
    fullText: input(bindings.fullText.path).binding,
    combinedParagraphText: input(bindings.combinedParagraphText.path).binding,
    paragraphCount: paragraphs.length, resolvedBreaks,
    sourceSnapshotEqualsCanonical: isDeepStrictEqual(lesson.source.data, source),
  }
}

check('isolated-source-equality', isDeepStrictEqual(source, isolatedSource),
  'Canonical and authorized isolated D287 source match.')
const sourceTargets = source.prose.map((block, i) => {
  const rawBlocks = block.source_refs.map((ref) => {
    const [page, number] = ref.slice(1).split('#')
    const document = json(path.join(sourceRoot, '10p/pages', page, 'page.json'))
    const rawBlock = document.blocks[Number(number) - 1]
    return { ref, document, rawBlock }
  })
  const rawText = rawBlocks.flatMap(({ rawBlock }) => rawBlock.lines).join('').trim()
  check(`source-target-${i}`, rawText === block.text
    && rawBlocks[0].document.meta.printed_page === block.printed_page
    && rawBlocks.every(({ rawBlock }) => rawBlock.kind === block.kind),
  { target: `lesson.prose[${i}]`, source_refs: block.source_refs, exactRawTextMatches: rawText === block.text })
  return { target: `lesson.prose[${i}]`, source_refs: block.source_refs,
    printed_page: block.printed_page, exactRawTextMatches: rawText === block.text }
})
const p52 = json(path.join(sourceRoot, '10p/pages/0052/page.json'))
const p53 = json(path.join(sourceRoot, '10p/pages/0053/page.json'))
check('cross-page-continuation', p52.blocks[5].open === true
  && p53.blocks[0].cont === true && p53.blocks[0].open === false,
  'p0052#6 continues exactly into p0053#1; no next-lesson prose is included.')
check('printed-heading', p52.blocks[4].lines.join('') === source.printed_title,
  'Canonical N19 printed heading matches its page-text record.')
const indexEntry = sourceBook.lessons.filter((item) => item.id === lessonId)
check('source-book-entry', indexEntry.length === 1 && indexEntry[0].number === source.number
  && indexEntry[0].start_printed === source.start_printed
  && indexEntry[0].prose_blocks === source.prose.length,
  'Current isolated book index identifies N19 once; no historical whole-book hash equality is claimed.')
check('old-SCI-chain', oldSCI.status === 'pass' && oldSCI.stage === 'SCI'
  && oldSCI.lesson === lessonId
  && oldSCI.bindings.lessonTemplate.sha256 === oldFreeze.bindings.lessonTemplate.sha256
  && oldSCI.bindings.freeze.sha256 === input(inputBindings.retainedFreeze.path).binding.sha256
  && oldSCI.bindings.source.sha256 === d287.canonicalSourceHash,
  'Old SCI binds the retained prose freeze and the same canonical lesson, not reconstructed template bytes.')
check('Chinese-exact-recovery', isDeepStrictEqual(flows.zh.paragraphs.map((p) => p.text),
  oldFreeze.proseFlow.paragraphs.map((p) => p.text)),
  'Ordered native paragraph-array equality for precisely the same ten approved Chinese paragraphs.')
check('Chinese-boundaries-recovered', isDeepStrictEqual(flows.zh.resolvedBreaks, oldFreeze.proseFlow.resolvedBreaks)
  && isDeepStrictEqual(flows.zh.boundaries.map(({ before, after }) => ({ before, after })),
    oldFreeze.proseFlow.boundaries.map(({ before, after }) => ({ before, after }))),
  'All three retained adjacent paragraph anchors match; this is not a new Chinese SCI.')
check('recovery-receipt', isDeepStrictEqual(equivalence.equality, d287.equality)
  && d287.equality.originalTemplateByteHashMatchClaimed === false
  && d287.equality.originalTemplateSha256 !== d287.equality.reconstructedTemplateSha256,
  'Recovery receipt truthfully distinguishes exact paragraph recovery from unavailable lost-template byte equality.')
check('Chinese-normalizer-not-applied', drift.applied === false && drift.wrapperExitCode === 1
  && drift.changedBlocks.every((b) =>
    b.retainedText === json(languages.zh.snapshots.lesson.operative.path).prose[b.blockIndex].text
    && b.proposedText !== b.retainedText),
  'Known Chinese layout incompatibility is preserved, unapplied and parent-owned; not a D292 science defect.')
check('notation-sidecar', notation.blocks.length === 3 && notation.unchangedSource === true,
  'Sidecar describes only the maximum-subscript alias and the two unchanged numbered subfigure identities.')
check('display-sidecar', isDeepStrictEqual(author.displayMetadata, display.metadata)
  && display.metadata.chapter.source === source.chapter
  && display.metadata.section.source === source.section
  && display.metadata.printed_title.source === source.printed_title
  && display.metadata.tableLabel.id === source.prose[5].id
  && display.metadata.tableLabel.source === source.prose[5].label,
  'English display text maps to the actual canonical chapter, section, printed heading and table identity.')
for (const { receipt } of nativeReceipts) {
  if (receipt.exitCode !== undefined) check(`${receipt.name}-recorded-exit`, receipt.exitCode === 0,
    'Stored native command receipt inspected, not rerun as a capability or full test.')
}
const enLesson = json(languages.en.snapshots.lesson.operative.path)
const normalizedEN = json(path.join(recovery, 'receipts/d287-normalize-en.json')).result
check('EN-normalized-prose-binding', isDeepStrictEqual(enLesson.prose, normalizedEN.prose),
  'The inspected English prose is the applied native-normalized prose; anchored section metadata was set afterwards.')
const comparisonSplit = flows.en.paragraphs[0].text.endsWith(';')
  && flows.en.paragraphs[1].text.startsWith('in electrical oscillations, they are')
if (comparisonSplit) findings.push({
  id: 'D292-EN-01',
  priority: 2,
  category: 'English-standalone-paragraph-clarity',
  title: 'Complete the opening comparison within independently displayed English paragraphs',
  locations: [
    { path: languages.en.snapshots.lesson.operative.path, field: 'prose[0].text; native paragraphs 0 and 1', line: 22 },
    { path: languages.en.fullText.path, start: 6, end: 8 },
  ],
  observed: {
    firstParagraphEnding: "its velocity component $v_x$, which gives its speed and direction along the chosen axis;",
    secondParagraphBeginning: 'in electrical oscillations, they are the charge $q$ stored in the capacitor and the current $i$ flowing in the circuit.',
  },
  reason: 'The mechanical/electrical comparison is one sentence interrupted by a blank-line boundary. Native proseOutline makes these separate learner paragraphs, leaving the first comparison unfinished and the next starting with a lowercase continuation and an antecedent-dependent "they". This conflicts with complete, independently displayed short prose for the eight-year-old self-learner. The full concatenated text is scientifically complete; the current standalone English paragraphs are not.',
  contract: {
    path: path.join(cwd, '.claude/skills/ld-s10y-lesson/SKILL.md'),
    lines: [82, 83, 371, 372],
    parser: path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    parserFunctions: ['proseParagraphs', 'proseOutline'],
  },
  affectedScope: 'Only newly authored EN prose block 0 / native paragraph boundary 0-to-1; not the passed Chinese SCI or its known unapplied normalizer drift.',
  requiredDisposition: 'Parent/author should make the mechanical and electrical descriptions complete English sentences or keep the complete comparison together in the accepted native flow, then re-freeze affected EN bytes and obtain affected-only text review. D292 made no author edits.',
})

const semanticCoverage = [
  { zh: [0], en: [0, 1], sourceTarget: 0, assessment: 'All x/v_x and capacitor-q/current-i quantities retained; physical distinction retained. Standalone boundary defect is D292-EN-01.' },
  { zh: [1], en: [1, 2], sourceTarget: 0, assessment: 'Similar time evolution, similar production conditions and restoring elastic force retained.' },
  { zh: [2, 3], en: [3, 4], sourceTarget: 0, assessment: 'Restoring force magnitude proportional to displacement magnitude, k, U=q/C and reciprocal capacitance retained.' },
  { zh: [4, 5], en: [5, 6, 7], sourceTarget: 1, assessment: 'Inertia and self-induction, no instantaneous velocity/current loss, m/L and kinetic/magnetic energy comparison retained.' },
  { zh: [6, 7], en: [8, 9], sourceTarget: 2, assessment: 'Charging/displacement analogy, initial amplitudes, spring/capacitor energy and k/1-C correspondence retained; Figure 28b reference retained as text.' },
  { zh: [8], en: [10], sourceTarget: 3, assessment: 'Current/velocity analogy, Figure 29b reference, derivative and signed transferred-charge convention retained.' },
  { zh: [9], en: [11], sourceTarget: 4, assessment: 'Summary-table introduction retained; no absent table contents manufactured.' },
]
const scienceReview = [
  { id: 'EN-SCI-restoring', result: 'pass', reasoning: 'The English specifies force magnitude versus displacement magnitude, avoiding a positive signed F_x=kx restoring-law error. U=q/C is for the selected capacitor polarity. Linear spring and ideal LC teaching model are assumed as in the source.' },
  { id: 'EN-SCI-continuity', result: 'pass', reasoning: 'Finite force/inductor voltage produce finite rates of change, so velocity/current do not jump to zero when their driving force/voltage vanishes. "Can increase" does not claim forces always increase speed. Inertia and self-induction glosses explain the existing terms.' },
  { id: 'EN-SCI-energy', result: 'pass', reasoning: 'm*v_x^2/2 corresponds to L*i^2/2 (kinetic/magnetic); k*x_m^2/2 corresponds to q_m^2/(2C) (spring/electric). Thus x corresponds to q, v_x to i, m to L and k to 1/C, not numerical or dimensional equality. No signs, powers or coefficients were changed.' },
  { id: 'EN-SCI-current-sign', result: 'pass', reasoning: 'The derivative sentence explicitly defines signed transferred charge, positive in the chosen current direction. For outward current from a discharging plate, q_transferred=Q_initial-Q_remaining and i=q_transferred_prime=-Q_remaining_prime. The earlier capacitor charge in U=q/C and its stored energy is a plate-charge quantity, not universally the transferred-charge variable in the derivative sentence. The current candidate does not assert i=+Q_remaining_prime for outward discharge. This source-context reuse of q must not be collapsed by a later table/figure binding.' },
  { id: 'EN-SCI-age-language', result: 'pass-for-semantic-explanations', reasoning: 'Spring oscillator, periodic change, velocity component, equilibrium, inertia, self-induction, capacitance, magnetic energy, potential energy and time derivative receive concrete glosses without new exercises or examples. Prior spring/capacitor/circuit study is assumed by N19. Standalone paragraph clarity fails separately at D292-EN-01; this is not blanket age-suitability approval of the delivered flow.' },
  { id: 'EN-translation-completeness', result: 'pass-for-semantic-coverage', reasoning: 'All five textual source blocks and the unchanged ten Chinese paragraph meanings are covered in twelve native English paragraphs. The battery detail omitted in already approved Chinese is likewise not reintroduced; charging itself remains. No lost source caption, exercise, example or table cell is fabricated.' },
  { id: 'metadata-text', result: 'pass', reasoning: 'Source snapshots, hashes, refs, chapter/section, page numbering and six-block identity agree with canonical N19 and raw text blocks. Cyrillic maximum m and subfigure b aliases are permitted notation localization, not new variables. EN heading/breadcrumb/Table translations are faithful sidecar authoring strings, not an implemented runtime overlay or native unnumbered-table alias approval.' },
]

const stability = [...records.values()].map(({ binding }) => ({
  path: binding.path, unchanged: sha(fs.readFileSync(binding.path)) === binding.sha256,
}))
check('inspected-inputs-stable-at-report', stability.every((item) => item.unchanged),
  { changedPaths: stability.filter((item) => !item.unchanged).map((item) => item.path) })
const report = {
  schema: 'STEMROBIN-181/independent-text-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'D292',
  lesson: lessonId,
  reviewedAt: new Date().toISOString(),
  cwd, ownerRoot: owner, sourceRoot, operativeWork: work,
  role: 'Independent N19 EN SCI/translation and reconstructed text-metadata reviewer; no lesson authoring or Chinese SCI rerun.',
  verdict: findings.length ? 'FAIL' : 'PASS_TEXT_ONLY',
  findings,
  outcomes: {
    exactChineseRecovery: 'PASS_EQUIVALENCE_ONLY',
    historicalChineseSCI: 'REUSED_ONLY_FOR_IDENTICAL_TEN_PARAGRAPHS_NOT_RERUN',
    EnglishScience: 'PASS',
    EnglishSemanticTranslationCoverage: 'PASS',
    EnglishStandaloneParagraphClarity: comparisonSplit ? 'FAIL' : 'PASS',
    reconstructedTextMetadata: 'PASS',
    figuresAndTable: 'NOT_REVIEWED_PENDING_PARENT',
    wholeLessonOrCourse: 'NOT_APPROVED',
  },
  bindings: {
    D287Report: input(path.join(recovery, 'd287-report.json')).binding,
    D287Freeze: input(path.join(recovery, 'd287-text-freeze.json')).binding,
    recoveryReceipt: input(path.join(recovery, 'receipts/d287-recovery-equivalence.json')).binding,
    retainedProseFreeze: input(inputBindings.retainedFreeze.path).binding,
    historicalSCI: input(inputBindings.retainedSci.path).binding,
    canonicalSource: input(path.join(canonicalRoot, 'lessons', lessonId, 'lesson.json')).binding,
    isolatedSource: input(path.join(sourceRoot, '10p/lessons', lessonId, 'lesson.json')).binding,
    notation: input(d287.notation.path).binding,
    EnglishDisplayMetadata: input(d287.englishDisplayMetadata.path).binding,
    ChineseNormalizerDisposition: input(d287.ChineseNormalizerDrift.path).binding,
    languages,
  },
  recovery: {
    orderedParagraphsEqual: true,
    paragraphCount: flows.zh.paragraphs.length,
    combinedSha256: sha(Buffer.from(flows.zh.paragraphs.map((p) => p.text).join('\n\n'))),
    boundaryIndices: flows.zh.resolvedBreaks,
    originalLostTemplateSha256: oldSCI.bindings.lessonTemplate.sha256,
    currentReconstructedTemplateSha256: languages.zh.snapshots.lesson.operative.sha256,
    originalTemplateByteEqualityClaimed: false,
    interpretation: 'Exact retained Chinese prose and boundaries are verified. Missing original template bytes were not searched for or recovered. Historical SCI applies only to these same ten paragraphs; it does not approve rebuilt metadata, EN, figures or table.',
  },
  sourceTargets,
  semanticCoverage,
  scienceReview,
  reuseScope: {
    allowed: [
      'Reuse the existing Chinese SCI solely for the exact hash-bound recovered ten Chinese paragraphs and their verified equality chain.',
      'Reuse D292 passing source identity/snapshot/ref/notation/display-string assessments only for the bound current text metadata.',
      'Reuse the unchanged English scientific statements and semantic coverage assessments; the present EN text package has no PASS_TEXT_ONLY approval because of D292-EN-01.',
    ],
    requiredAfterCorrection: 'Re-freeze changed EN operative/full-text snapshots, bind new hashes and review only the affected paragraph-clarity change and any actually changed semantics. Do not redo passed Chinese SCI.',
    forbiddenInferences: [
      'Original lost template byte equality.',
      'A whole-course or finalization/publication pass.',
      'Any modern fig-28/fig-29/table mathematical, geometric, pixel, style or render approval.',
      'Runtime application of English breadcrumb/Table sidecar translations.',
      'A universal positive sign for remaining plate charge in i=q_prime.',
    ],
  },
  parentBoundaries: [
    'Known D287 Chinese normalization drift is unapplied layout incompatibility, resolved independently by parent. It is not an additional D292 FAIL finding.',
    'Parent must bind the current full D287 EN/ZH texts to modern figs 28/29 and the table; D292 does not inspect or approve those assets.',
    'The current figures.template.json files were bound only as text identity/dependency records, not geometry or image review.',
    'The English sidecar faithfully translates identity labels but is not an implemented runtime overlay. Native same_figure_label still does not accept the unnumbered Table alias.',
    'Source page PDF/render hashes are metadata only; no PDF/image binary was opened, hashed, copied, generated or reviewed.',
  ],
  verification: {
    method: 'Offline file-byte SHA-256 and JSON comparisons plus pure native proseOutline/sectionBreakIndices. Existing D287 receipts inspected without rerunning their producers.',
    declaredReferenceCount,
    checks,
    inspectedInputsUnchangedAtEnd: stability.every((item) => item.unchanged),
    inspectedInputs: [...records.values()].map(({ binding }) => binding).sort((a, b) => a.path.localeCompare(b.path)),
    reviewImplementation: {
      path: fileURLToPath(import.meta.url),
      sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))),
    },
  },
  actionsNotPerformed: [
    'Capability invocation', 'backend access', 'Git commands', 'DB access',
    'publish', 'deploy', 'peer messaging', 'paid/model/image calls',
    'image/PDF viewing or hashing', 'geometry review', 'author/template edits',
    'normalization/finalization replay', 'render/browser checks', 'full tests',
    'Chinese SCI rerun', 'other worker/worktree/history search',
  ],
  writes: [path.join(owner, 'review.mjs'), path.join(owner, 'report.json')],
}
const reportPath = path.join(owner, 'report.json')
if (fs.existsSync(reportPath)) throw new Error('Refusing to overwrite an existing D292 report')
const serialized = `${JSON.stringify(report, null, 2)}\n`
fs.writeFileSync(reportPath, serialized, { flag: 'wx' })
console.log(JSON.stringify({
  path: reportPath,
  sha256: sha(Buffer.from(serialized)),
  verdict: report.verdict,
  findings: report.findings.map(({ id, title }) => ({ id, title })),
  verifiedReferences: declaredReferenceCount,
  checkedInputs: records.size,
  failedMechanicalChecks: checks.filter((item) => item.result === 'fail'),
}, null, 2))
