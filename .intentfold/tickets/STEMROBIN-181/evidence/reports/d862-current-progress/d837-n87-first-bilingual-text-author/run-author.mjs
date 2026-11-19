import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), R)
assert.equal(O, path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author'))
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare')
const card = 'phy10-c2-s3-n87'
const prepared = path.join(D, `work/adapt/10p/modern-us-neutral/lessons/${card}`)
const raw = path.join(D, `root/10p/lessons/${card}`)
const tools = path.join(R, '.claude/skills/ld-s10y-lesson/tools')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const write = (relative, value, json = true) => {
  const file = path.resolve(O, relative)
  assert(file.startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, json ? `${JSON.stringify(value, null, 2)}\n` : value, { flag: 'wx' })
  return file
}
const calls = []
const call = (id, command, args) => {
  const started = write(`calls/${id}/started.json`, {
    command: [command, ...args], cwd: R, startedAt: new Date().toISOString(),
  })
  const result = spawnSync(command, args, {
    cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const stdout = write(`calls/${id}/stdout.txt`, result.stdout ?? '', false)
  const stderr = write(`calls/${id}/stderr.txt`, result.stderr ?? '', false)
  const receipt = write(`calls/${id}/receipt.json`, {
    ...read(started), endedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, executionError: result.error?.message ?? null,
    stdout: bind(stdout), stderr: bind(stderr),
  })
  calls.push(bind(receipt))
  assert.equal(result.status, 0, `FIRST failure preserved at ${receipt}; dependent stages stopped`)
  return stdout
}

assert(!fs.existsSync(path.join(O, 'inputs-before.json')), 'FIRST build must not be repeated')
const input = read(path.join(O, 'author-input.json'))
const preparation = read(path.join(D, 'n87-preparation.json'))
const requirements = read(path.join(D, 'n87-preauthor-source-requirements.json'))
assert.equal(requirements.sourceQuestions, 6)
assert.deepEqual(requirements.boundary, { first: 'p0230#2', last: 'p0233#3', nextHeading: 'p0233#4' })
assert.equal(sha(path.join(D, 'n87-preauthor-source-requirements.json')), preparation.requirements.sha256)
assert.equal(sha(path.join(raw, 'lesson.json')), preparation.rawLesson.sha256)
assert.equal(sha(path.join(raw, 'exercises.json')), preparation.rawExercises.sha256)
const protectedFiles = [
  path.join(D, 'n87-preparation.json'), path.join(D, 'n87-preauthor-source-requirements.json'),
  path.join(raw, 'lesson.json'), path.join(raw, 'exercises.json'),
  path.join(prepared, 'lesson.template.json'), path.join(prepared, 'exercises.template.json'),
  path.join(tools, 'edition.py'), path.join(tools, 'normalize.py'),
  path.join(tools, 'prose_flow.mjs'), path.join(tools, 'htmlfrag.js'),
  path.join(tools, '../profiles/modern-us-neutral.json'),
]
write('inputs-before.json', protectedFiles.map(bind))
write('exploration-failures.json', {
  failures: [
    { command: 'rg with unmatched ssot-resources/soviet10year-textbooks/production* glob', exitCode: 1, stage: 'read-only discovery', cause: 'zsh no matches found' },
    { command: 'rg including app/src/lib/content-localization.ts', exitCode: 2, stage: 'read-only discovery', cause: 'guessed path absent; useful other matches retained' },
    { command: 'rg including app/src/lib/lesson-content.ts and ssot-resources/soviet10year-textbooks/production.json', exitCode: 2, stage: 'read-only discovery', cause: 'guessed paths absent; inspected actual paths instead' }
  ],
  contentOrNativeFailures: 0,
  expectedAbsentOwnDirectoryProbe: { command: 'test -e <authorized scratch directory>', exitCode: 1, failure: false },
})

for (const [source, target] of [
  ['n87-preparation.json', 'inputs/n87-preparation.json'],
  ['n87-preauthor-source-requirements.json', 'inputs/n87-preauthor-source-requirements.json'],
  [`root/10p/lessons/${card}/lesson.json`, 'inputs/raw-lesson.json'],
  [`root/10p/lessons/${card}/exercises.json`, 'inputs/raw-exercises.json'],
  [`work/adapt/10p/modern-us-neutral/lessons/${card}/lesson.template.json`, 'inputs/lesson.template.json'],
  [`work/adapt/10p/modern-us-neutral/lessons/${card}/exercises.template.json`, 'inputs/exercises.template.json'],
]) write(target, fs.readFileSync(path.join(D, source), 'utf8'), false)

const mapping = []
for (const locale of ['zh', 'en']) {
  const lesson = read(path.join(O, 'inputs/lesson.template.json'))
  const exercises = read(path.join(O, 'inputs/exercises.template.json'))
  lesson.locale = locale
  lesson.title = input.titles[locale]
  exercises.locale = locale
  for (const block of lesson.prose) {
    if (block.kind === 'p') {
      const key = block.source_refs.join('|')
      assert.equal(typeof input.prose[locale][key], 'string', key)
      block.text = input.prose[locale][key]
      block.changes = block.text === block.source_text ? [] : [
        ...(locale === 'en' ? ['translation'] : []), 'explanation', 'layout',
      ]
      if (key === 'p0232#10' && locale === 'zh') {
        block.changes.push('historical-entity')
        block.historical_entities = [{
          term: '苏联',
          reason: 'p0232#10 explicitly attributes an industrial coating method to named historical researchers; retain this source historical identity, not a modern institution or new historical claim.',
        }]
      }
      mapping.push({
        locale, target: `first/${locale}/lesson.template.json`,
        source_refs: block.source_refs, kind: block.kind, source_text: block.source_text,
        authoringKey: `prose.${locale}.${key}`,
      })
    } else if (locale === 'en' && ['fig', 'cap'].includes(block.kind)) {
      block.label = block.label.replace(/^图\s+/, 'Figure ')
      if (block.kind === 'cap') {
        block.text = block.source_text.replace(/^图\s+/, 'Figure ')
        block.changes = ['translation']
      }
    }
  }
  if (locale === 'en') {
    for (const figure of lesson.figures) figure.label = figure.label.replace(/^图\s+/, 'Figure ')
  }
  for (const item of exercises.exercises) {
    assert.equal(typeof input.exercises[locale][item.number], 'string')
    item.text = input.exercises[locale][item.number]
    item.lines = item.text.split('\n')
    item.changes = item.text === item.source_text ? [] : locale === 'en'
      ? ['translation', 'layout'] : ['wording', 'layout']
    mapping.push({
      locale, target: `first/${locale}/exercises.template.json`,
      number: item.number, source_number: item.source_number,
      group: item.group, group_id: item.group_id, source_refs: item.pages,
      source_text: item.source_text, authoringKey: `exercises.${locale}.${item.number}`,
    })
  }
  write(`first/${locale}/lesson.template.json`, lesson)
  write(`first/${locale}/exercises.template.json`, exercises)
}
write('source-mapping.json', {
  schema: 'STEMROBIN-181/d837-source-mapping@1', card, boundary: requirements.boundary,
  sourceQuestions: 6, sourceFigureIds: requirements.figureIds, mapping,
  footnoteLiteral: {
    source_ref: 'p0232#10', source: requirements.blocks.find(block => block.ref === 'p0232#10').lines,
    zhQuote: '实际上膜的厚度为波长的整数倍. 这样比较方便.',
    enLiteralTranslation: 'In practice, the thickness of the film is an integer multiple of the wavelength. This is more convenient.',
    noErratumOrPhysicalCorrection: true,
  },
})

const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
for (const locale of ['zh', 'en']) {
  call(`native-${locale}-FIRST`, python, ['-B', path.join(O, 'native-text-once.py'), locale])
}
for (const locale of ['zh', 'en']) {
  const file = path.join(O, `candidate/${locale}/lesson.template.json`)
  const outlineOutput = call(`flow-${locale}-anchors-FIRST`, 'node', [path.join(tools, 'prose_flow.mjs'), file])
  const boundaries = fs.readFileSync(outlineOutput, 'utf8').split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  const selected = input.sectionConceptOpenings[locale].map(opening => {
    const matches = boundaries.filter(boundary => boundary.after.startsWith(opening))
    assert.equal(matches.length, 1, `Need unique native-emitted adjacent boundary for ${opening}`)
    return matches[0]
  })
  const lesson = read(file)
  write(`normalized/${locale}/lesson.before-section-breaks.json`, lesson)
  lesson.section_breaks = selected
  fs.writeFileSync(file, `${JSON.stringify(lesson, null, 2)}\n`)
  write(`flow/${locale}-section-breaks.json`, {
    method: 'Exact before/after boundary objects copied from actual saved prose_flow output at conceptual transitions; no manually counted paragraph indices.',
    sourceOutput: bind(outlineOutput), section_breaks: selected,
  })
  const resolvedOutput = call(`flow-${locale}-resolved-FIRST`, 'node', [path.join(tools, 'prose_flow.mjs'), '--json', file])
  const flow = read(resolvedOutput)
  assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), selected)
  write(`flow/${locale}-resolved.json`, flow)
}

const after = protectedFiles.map(bind)
const before = read(path.join(O, 'inputs-before.json'))
write('inputs-after.json', after)
assert.deepEqual(after, before, 'Input changed concurrently; do not overwrite or claim preserved current input')
const native = ['zh', 'en'].map(locale => read(path.join(O, `native/${locale}.json`)))
const candidates = ['zh', 'en'].flatMap(locale => ['lesson', 'exercises'].map(kind =>
  bind(path.join(O, `candidate/${locale}/${kind}.template.json`))))
const first = ['zh', 'en'].flatMap(locale => ['lesson', 'exercises'].map(kind =>
  bind(path.join(O, `first/${locale}/${kind}.template.json`))))
const counts = {
  authorBuildExecutions: 1, firstBilingualAuthorRounds: 1, contentRevisionRounds: 0,
  nativePreflightExecutions: 2,
  normalizeProseLayoutCalls: native.reduce((sum, report) => sum + report.normalizeProseLayoutCalls, 0),
  normalizeNumberedSubpartCalls: native.reduce((sum, report) => sum + report.normalizeNumberedSubpartCalls, 0),
  validateTextCalls: native.reduce((sum, report) => sum + report.validateTextCalls, 0),
  validateLessonIdentityCalls: 2, validateSourceCalls: 4,
  validateExerciseIdentityCalls: 12, validateSubpartLayoutCalls: 12,
  proseFlowCliExecutions: 4, nativeFailures: 0, nativeRepairs: 0,
  explorationFailures: 3, sourceQuestions: 6, bilingualWrittenQuestionDisplays: 12,
  imagesOpened: 0, imagesCreated: 0, figureGenerationCalls: 0,
  adaptFinalizeCalls: 0, renderCalls: 0, fullValidatorCalls: 0,
  independentReviewCalls: 0, paidCalls: 0, canonicalWrites: 0,
  codeWritesOutsideOwnScratch: 0, indexWrites: 0, meterWrites: 0,
  gitCalls: 0, databaseCalls: 0, publisherCalls: 0, deployCalls: 0,
  branchesCreated: 0, worktreesCreated: 0, otherChatCalls: 0,
}
write('actual-calls.json', {
  cwd: R, command: ['node', path.join(O, 'run-author.mjs')],
  counts, nativeReceipts: ['zh', 'en'].map(locale => bind(path.join(O, `native/${locale}.json`))),
  childExecutionReceipts: calls, explorationFailures: bind(path.join(O, 'exploration-failures.json')),
})
write('locale-display-metadata.json', {
  fields: {
    zh: { locale: 'zh', title: input.titles.zh, printed_title: '87. 干涉的某些应用' },
    en: { locale: 'en', title: input.titles.en, printed_title: '87. 干涉的某些应用' },
  },
  figures: {
    sourceIdentity: ['fig-201', 'fig-202'],
    zh: ['图 201', '图 202'], en: ['Figure 201', 'Figure 202'],
    mechanism: 'Existing edition.locale plus edition.same_figure_label; only display labels/caption text localized.',
  },
  boldSourceIdentity: {
    retainedInBothLocales: ['**表面加工质量的检验**', '**光学增透**'],
    englishExplanatoryTextFollowingIdentity: ['Surface quality inspection', 'Antireflection treatment'],
    replacedOrRemoved: false,
  },
  exerciseGroup: {
    retainedIdentity: { group: '问题', group_id: 'g1' },
    enLabelMeaning: 'Questions', populatedEnglishDisplayField: false,
    mechanismFinding: 'No existing populated-group English mapper found in inspected native/renderer paths. Preserve identity; do not create a parallel localization field or mutate group.',
    runtimeDisplayAcceptance: 'NOT-RUN; independent ZHEN review and any parent-owned display decision remain separate.',
  },
  formulaLabels: {
    policy: 'All complete math tokens, including Chinese descriptive subscripts, identical to source in both locales.',
    vocabularyInEnglish: { 膜: 'film', 玻: 'glass', 空: 'air', 绿: 'green' },
    newNotationAliases: 0,
  },
})
const freeze = write('author-freeze.json', {
  schema: 'STEMROBIN-181/d837-author-freeze@1',
  ticket: 'STEMROBIN-181/181-3', card,
  status: 'FIRST-AUTHOR-FROZEN-PENDING-INDEPENDENT-SCI-ZHEN',
  frozenAt: new Date().toISOString(), root: R, writeRoot: O,
  candidates, firstCandidates: first,
  sourceMapping: bind(path.join(O, 'source-mapping.json')),
  flow: ['zh', 'en'].flatMap(locale => [
    bind(path.join(O, `flow/${locale}-section-breaks.json`)),
    bind(path.join(O, `flow/${locale}-resolved.json`)),
  ]),
  native: ['zh', 'en'].map(locale => bind(path.join(O, `native/${locale}.json`))),
  actualCalls: bind(path.join(O, 'actual-calls.json')),
  localeMetadata: bind(path.join(O, 'locale-display-metadata.json')),
  inputsBefore: bind(path.join(O, 'inputs-before.json')),
  inputsAfter: bind(path.join(O, 'inputs-after.json')),
  counts, acceptance: 'Native text/source/schema/token/identity/flow preflight only. No scientific, bilingual, image, runtime, full-edition, or complete-card approval.',
  pending: [
    'Separate independent SCI/ZHEN review of exactly these candidate hashes.',
    'English display of source bold identities and populated 问题 group remains an explicitly retained source/display concern; no mapper invented.',
    'Figures 201/202 are metadata only; no images read, generated, approved, finalized, or rendered.',
  ],
})
for (const file of [...candidates, ...first].map(binding => binding.path)) fs.chmodSync(file, 0o444)
console.log(JSON.stringify({ freeze: bind(freeze), candidates, counts }, null, 2))
