import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
const tools = path.join(R, '.claude/skills/ld-s10y-lesson/tools')
assert.equal(process.cwd(), R)
assert.equal(O, path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author'))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const write = (relative, data, json = true) => {
  const file = path.resolve(O, relative)
  assert(file.startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, json ? `${JSON.stringify(data, null, 2)}\n` : data, { flag: 'wx' })
  return file
}
const call = (id, executable, args) => {
  const start = write(`calls/${id}/started.json`, {
    command: [executable, ...args], cwd: R, startedAt: new Date().toISOString(),
  })
  const result = spawnSync(executable, args, {
    cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const out = write(`calls/${id}/stdout.txt`, result.stdout ?? '', false)
  const err = write(`calls/${id}/stderr.txt`, result.stderr ?? '', false)
  const receipt = write(`calls/${id}/receipt.json`, {
    ...read(start), endedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, executionError: result.error?.message ?? null,
    stdout: bind(out), stderr: bind(err),
  })
  assert.equal(result.status, 0, `Failure preserved at ${receipt}; no dependent stage continued`)
  return out
}

assert(!fs.existsSync(path.join(O, 'author-freeze.json')), 'Do not repeat frozen work')
const input = read(path.join(O, 'author-input.json'))
const natives = ['zh', 'en'].map(locale => read(path.join(O, `native/${locale}.json`)))
assert.equal(natives[0].status, 'PASS-TEXT-CONSERVATION-ONLY')
assert.deepEqual(natives[1].errors, ['en:prose[3]: exact non-math numeric sequence changed.'])
for (const native of natives) {
  for (const kind of ['lesson', 'exercises']) {
    assert.equal(sha(path.join(O, `candidate/${native.locale}/${kind}.template.json`)), native.candidateHashes[kind])
  }
}
write('calls/run-author-FIRST-failure.json', {
  command: ['node', path.join(O, 'run-author.mjs')], cwd: R, executions: 1, exitCode: 1,
  cause: 'Native English FIRST returned the preserved extra numeric-regex false negative.',
  validOutputPreserved: ['first/zh', 'first/en', 'candidate/zh', 'candidate/en', 'native/zh.json', 'native/en.json'],
  sourceOrTextEditsAfterFailure: 0,
})
call('numeric-en-technical-recovery', path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', path.join(O, 'recover-number-only.py'),
])
assert.equal(read(path.join(O, 'native/en-numeric-technical-recovery.json')).status, 'PASS-AFFECTED-NUMERIC-REFERENCE-CHECK-ONLY')

for (const locale of ['zh', 'en']) {
  const file = path.join(O, `candidate/${locale}/lesson.template.json`)
  const emitted = call(`flow-${locale}-anchors-FIRST`, 'node', [path.join(tools, 'prose_flow.mjs'), file])
  const adjacent = fs.readFileSync(emitted, 'utf8').split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  const selected = input.sectionConceptOpenings[locale].map(opening => {
    const matches = adjacent.filter(boundary => boundary.after.startsWith(opening))
    assert.equal(matches.length, 1, `Unique native-emitted adjacent boundary required: ${opening}`)
    return matches[0]
  })
  const lesson = read(file)
  write(`normalized/${locale}/lesson.before-section-breaks.json`, lesson)
  lesson.section_breaks = selected
  fs.writeFileSync(file, `${JSON.stringify(lesson, null, 2)}\n`)
  write(`flow/${locale}-section-breaks.json`, {
    method: 'Copy exact adjacent before/after objects from the actual saved native prose_flow output, selecting concept openings; no manual integer indices.',
    emittedOutput: bind(emitted), section_breaks: selected,
  })
  const resolved = call(`flow-${locale}-resolved-FIRST`, 'node', [path.join(tools, 'prose_flow.mjs'), '--json', file])
  const flow = read(resolved)
  assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), selected)
  write(`flow/${locale}-resolved.json`, flow)
}
const before = read(path.join(O, 'inputs-before.json'))
const after = before.map(binding => bind(binding.path))
write('inputs-after.json', after)
assert.deepEqual(after, before, 'Source/code input changed concurrently; do not overwrite it')
const candidates = ['zh', 'en'].flatMap(locale => ['lesson', 'exercises'].map(kind =>
  bind(path.join(O, `candidate/${locale}/${kind}.template.json`))))
const first = ['zh', 'en'].flatMap(locale => ['lesson', 'exercises'].map(kind =>
  bind(path.join(O, `first/${locale}/${kind}.template.json`))))
const count = {
  authorBuildExecutions: 1, flowAndFreezeExecutions: 1, firstBilingualAuthorRounds: 1,
  contentRevisionRounds: 0, nativeLocalePreflightExecutions: 2,
  affectedNumericTechnicalRecoveryExecutions: 1, nativePreflightExecutionsTotal: 3,
  normalizeProseLayoutCalls: natives.reduce((sum, native) => sum + native.normalizeProseLayoutCalls, 0),
  normalizeNumberedSubpartCalls: natives.reduce((sum, native) => sum + native.normalizeNumberedSubpartCalls, 0),
  validateTextCalls: natives.reduce((sum, native) => sum + native.validateTextCalls, 0),
  validateLessonIdentityCalls: 2, validateSourceCalls: 4,
  validateExerciseIdentityCalls: 12, validateSubpartLayoutCalls: 12,
  affectedProseNumberSignatureCalls: 2, affectedFigureReferenceExtractions: 2,
  proseFlowCliExecutions: 4, nativeFirstFailures: 1,
  originalAuthorHarnessAbort: 1, technicalRecoveryCalls: 1,
  sourceOrContentFailures: 0, repairsToCandidateContent: 0, explorationFailures: 3,
  sourceQuestions: 6, bilingualWrittenQuestionDisplays: 12,
  imagesOpened: 0, imagesCreated: 0, figureGenerationCalls: 0,
  adaptFinalizeCalls: 0, renderCalls: 0, fullValidatorCalls: 0,
  independentReviewCalls: 0, paidCalls: 0, canonicalWrites: 0,
  codeWritesOutsideOwnScratch: 0, indexWrites: 0, meterWrites: 0,
  gitCalls: 0, databaseCalls: 0, publisherCalls: 0, deployCalls: 0,
  branchesCreated: 0, worktreesCreated: 0, otherChatCalls: 0,
}
const ids = [
  'native-zh-FIRST', 'native-en-FIRST', 'numeric-en-technical-recovery',
  'flow-zh-anchors-FIRST', 'flow-zh-resolved-FIRST',
  'flow-en-anchors-FIRST', 'flow-en-resolved-FIRST',
]
write('actual-calls.json', {
  cwd: R, counts: count,
  executionReceipts: ids.map(id => bind(path.join(O, `calls/${id}/receipt.json`))),
  firstAuthorAbort: bind(path.join(O, 'calls/run-author-FIRST-failure.json')),
  firstFailureUnmodified: bind(path.join(O, 'native/en.json')),
  numericRecovery: bind(path.join(O, 'native/en-numeric-technical-recovery.json')),
  passedNativeChecksReusedWithoutReplay: true,
  explorationFailures: bind(path.join(O, 'exploration-failures.json')),
})
write('locale-display-metadata.json', {
  fields: {
    zh: { locale: 'zh', title: input.titles.zh, printed_title: '87. 干涉的某些应用' },
    en: { locale: 'en', title: input.titles.en, printed_title: '87. 干涉的某些应用' },
  },
  figureDisplay: {
    ids: ['fig-201', 'fig-202'], zh: ['图 201', '图 202'], en: ['Figure 201', 'Figure 202'],
    mechanism: 'Existing locale=en and edition.same_figure_label; native-permitted English figure/caption display labels only.',
  },
  boldSourceIdentity: {
    retainedInBothLocales: ['**表面加工质量的检验**', '**光学增透**'],
    englishExplanatoryTextFollowingIdentity: ['Surface quality inspection', 'Antireflection treatment'],
    identityRemovedOrReplaced: false,
  },
  exerciseGroup: {
    retainedIdentity: { group: '问题', group_id: 'g1' }, englishMeaning: 'Questions',
    populatedEnglishDisplayField: false,
    mechanismFinding: 'No existing populated-group English mapper found in the inspected native/renderer paths. Keep source group identity; no unsupported display field invented.',
    runtimeDisplayAcceptance: 'NOT-RUN; remains an independent ZHEN/parent display concern.',
  },
  exactFormulaPolicy: {
    completeTokensIdenticalToSource: true, notationAliases: 0,
    englishVocabulary: { 膜: 'film', 玻: 'glass', 空: 'air', 绿: 'green' },
  },
})
const flowBindings = ['zh', 'en'].flatMap(locale => [
  bind(path.join(O, `flow/${locale}-section-breaks.json`)),
  bind(path.join(O, `flow/${locale}-resolved.json`)),
])
const freeze = write('author-freeze.json', {
  schema: 'STEMROBIN-181/d837-author-freeze@1', ticket: 'STEMROBIN-181/181-3', card: 'phy10-c2-s3-n87',
  status: 'FIRST-AUTHOR-FROZEN-PENDING-INDEPENDENT-SCI-ZHEN',
  frozenAt: new Date().toISOString(), root: R, writeRoot: O,
  candidates, firstCandidates: first, sourceMapping: bind(path.join(O, 'source-mapping.json')),
  flow: flowBindings,
  native: ['zh', 'en'].map(locale => bind(path.join(O, `native/${locale}.json`))),
  composedEnglishNumericRecovery: bind(path.join(O, 'native/en-numeric-technical-recovery.json')),
  actualCalls: bind(path.join(O, 'actual-calls.json')),
  localeMetadata: bind(path.join(O, 'locale-display-metadata.json')),
  inputsBefore: bind(path.join(O, 'inputs-before.json')), inputsAfter: bind(path.join(O, 'inputs-after.json')),
  counts: count,
  acceptance: 'Native text/source/schema/token/identity preflight plus resolved prose flow only. English composes the unchanged successful checks with a numeric-only technical recovery; original failure retained. No SCI/ZHEN, image, runtime, full-edition or complete-card approval.',
  pending: [
    'Separate independent SCI/ZHEN review of these exact candidate hashes.',
    'Source bold headings and populated 问题 group remain source identities; English UI display concern explicit, no mapper invented.',
    'Figures 201/202 are metadata only: no source images opened, generation, figure acceptance, finalization or render.',
  ],
})
for (const file of [...candidates, ...first].map(binding => binding.path)) fs.chmodSync(file, 0o444)
console.log(JSON.stringify({ freeze: bind(freeze), candidates, flow: flowBindings, counts: count }, null, 2))
