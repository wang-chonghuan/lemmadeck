import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const ticketTmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const manifestPath = path.join(ticketTmp, 'd488-n74-t13-first-source-preparation/manifest.json')
const expectedManifest = 'b8e95fb8de48e2055fc09ea7b1aba056fa096646b80d167465ae12afa1669c9a'
const ledgerPath = path.join(ticketTmp, 'd473-n71-q12-first-choice-author/actual-opens.json')
const expectedLedger = 'b9f1607a26ebde253b55f56ecc9c6754223bb2f2e46c5dd2ac5dcfaaf114da00'
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const describe = (filename) => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
})
const writeBytes = (filename, bytes) => {
  assert(filename.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, bytes, { flag: 'wx' })
}
const write = (filename, value) => writeBytes(filename, `${JSON.stringify(value, null, 2)}\n`)
const copy = (from, to) => writeBytes(to, fs.readFileSync(from))
const mathTokens = (text) => text.match(/\$[^$]*\$/g) ?? []
const authoring = read(path.join(root, 'authoring.json'))
assert.equal(sha(fs.readFileSync(manifestPath)), expectedManifest)
assert.equal(sha(fs.readFileSync(ledgerPath)), expectedLedger)
const manifest = read(manifestPath)
const priorLedger = read(ledgerPath)
assert.equal(priorLedger.context_cumulative_opens, 18)
assert.deepEqual(manifest.cards, Object.keys(authoring.cards))
assert(!fs.existsSync(path.join(root, 'input-bindings.json')), 'First author build already started: do not rerun')

const inputs = [describe(manifestPath), describe(ledgerPath)]
copy(manifestPath, path.join(root, 'source/manifest.json'))
copy(ledgerPath, path.join(root, 'source/prior-actual-opens.json'))
const mappings = []
const mechanical = []
const flows = []
const initial = []
const candidates = []
const templateHashes = {
  'phy10-c2-s2-n74': {
    'lesson.template.json': 'b48fc471e6cdc773e2502f161da6102ddc269603fa811c1b26317ac254bbfd2e',
    'exercises.template.json': '662b8ad235350d10cf8eca699c67a00f16c74160d2f99f8a5cb7aac74241984a',
    'figures.template.json': 'ebe64b40f884144ff3d3c405de4f7a33b2ee461e4f63c031868d93902124abf7',
  },
  'phy10-c2-s2-t13': {
    'lesson.template.json': 'a01e6424a69d88c350271e0959c5628382e0a246f4c400c6e6108383ed554e0c',
    'exercises.template.json': '39b1e1a1275458190329d8e744f5986a4e5222d0ab038024098891dabfbba35e',
    'figures.template.json': '2df708c148777843a82120acb1958eb80976ccb7b0395f36ec480541f9e4262f',
  },
}
const tagChanges = (item, text, tags) => {
  item.text = text
  item.changes = text === item.source_text ? [] : tags
  item.numeric_changes = []
}

for (const binding of manifest.lessons) {
  const card = binding.card
  const supplied = authoring.cards[card]
  const sourceLessonPath = path.join(repo, binding.sourceLesson.path)
  const sourceExercisesPath = path.join(repo, binding.sourceExercises.path)
  const lessonSource = read(sourceLessonPath)
  const exerciseSource = read(sourceExercisesPath)
  for (const [filename, record] of [
    ['lesson.json', binding.sourceLesson],
    ['exercises.json', binding.sourceExercises],
  ]) {
    const input = path.join(repo, record.path)
    assert.equal(sha(fs.readFileSync(input)), record.sha256)
    inputs.push(describe(input))
    copy(input, path.join(root, 'source', card, filename))
  }
  assert.equal(lessonSource.prose.length, card.endsWith('n74') ? 11 : 0)
  assert.equal(exerciseSource.exercises.length, card.endsWith('t13') ? 7 : 0)
  const templateDirectory = path.join(repo, binding.templateDirectory)
  const originals = {}
  for (const filename of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const input = path.join(templateDirectory, filename)
    assert.equal(sha(fs.readFileSync(input)), templateHashes[card][filename])
    inputs.push(describe(input))
    originals[filename] = read(input)
    copy(input, path.join(root, 'source/first-templates', card, filename))
  }
  for (const locale of ['zh', 'en']) {
    const directory = path.join(root, 'candidate', card, locale)
    for (const filename of Object.keys(originals)) {
      const input = path.join(templateDirectory, filename)
      const destination = path.join(directory, filename)
      copy(input, destination)
      initial.push(describe(destination))
    }
  }

  for (const entry of supplied.prose ?? []) {
    const block = lessonSource.prose[entry.index]
    assert.equal(block.kind, 'p')
    assert.equal(entry.sentences.map((sentence) => sentence.source).join(''), block.text)
    mappings.push({
      card,
      type: 'prose-sentences',
      source_index: entry.index,
      source_refs: block.source_refs,
      source_text: block.text,
      sentences: entry.sentences.map((sentence, index) => ({ source_sentence: index + 1, ...sentence })),
    })
  }
  for (const [index, block] of lessonSource.prose.entries()) {
    if (block.kind === 'p') continue
    mappings.push({
      card,
      type: block.kind === 'cap' ? 'caption' : 'figure-object',
      source_index: index,
      source_refs: block.source_refs,
      id: block.id,
      source_text: block.text,
      zh: block.text,
      en: block.kind === 'cap' ? block.text.replace(/^图 /, 'Figure ') : block.text,
      figure_semantics: 'No pixel inspection or geometry reconstruction in this batch.',
    })
  }
  for (const [index, exercise] of exerciseSource.exercises.entries()) {
    const entry = supplied.exercises[index]
    assert.equal(entry.number, exercise.source_number)
    assert.equal(entry.sentences.map((sentence) => sentence.source).join(''), exercise.text)
    mappings.push({
      card,
      type: 'exercise-sentences',
      source_index: index,
      number: exercise.number,
      source_number: exercise.source_number,
      group: exercise.group,
      group_id: exercise.group_id,
      pages: exercise.pages,
      figure_refs: exercise.figure_refs,
      source_text: exercise.text,
      sentences: entry.sentences.map((sentence, sentenceIndex) => ({
        source_sentence: sentenceIndex + 1,
        ...sentence,
      })),
      dependency: entry.dependency ?? null,
      author_hold: entry.author_hold ?? null,
    })
  }
  mappings.push({
    card,
    type: 'title',
    source_title: lessonSource.title,
    source_printed_title: lessonSource.printed_title,
    locales: supplied.titles,
    source_boundary: card.endsWith('t13')
      ? 'Derived source classification exhead -> h3 at SOURCE196; Q6/Q7 only from SOURCE197, before the retained 75 heading.'
      : 'Numbered unit 74, SOURCE195-196; standalone exercise8 is a separate card.',
  })

  for (const locale of ['zh', 'en']) {
    const directory = path.join(root, 'candidate', card, locale)
    const lesson = structuredClone(originals['lesson.template.json'])
    const exercises = structuredClone(originals['exercises.template.json'])
    const figures = structuredClone(originals['figures.template.json'])
    Object.assign(lesson, supplied.titles[locale])
    for (const entry of supplied.prose ?? []) {
      const block = lesson.prose[entry.index]
      tagChanges(block, entry.sentences.map((sentence) => sentence[locale]).join('\n'),
        ['language', 'layout', ...(entry.sentences.some((sentence) => sentence.clarification) ? ['clarification'] : [])])
    }
    if (locale === 'en') {
      for (const figure of lesson.figures) figure.label = figure.label.replace(/^图 /, 'Figure ')
      for (const block of lesson.prose) {
        if (block.kind !== 'fig' && block.kind !== 'cap') continue
        block.label = block.label.replace(/^图 /, 'Figure ')
        if (block.kind === 'cap') tagChanges(block, block.source_text.replace(/^图 /, 'Figure '), ['language'])
      }
    }
    for (const [index, exercise] of exercises.exercises.entries()) {
      const entry = supplied.exercises[index]
      tagChanges(exercise, entry.sentences.map((sentence) => sentence[locale]).join('\n'), ['language', 'layout'])
      exercise.lines = exercise.text.split('\n')
      if (locale === 'en') {
        for (const figure of exercise.figures) figure.label = figure.label.replace(/^图 /, 'Figure ')
      }
    }
    for (const figure of figures.figures) {
      const brief = supplied.figure_briefs.find((entry) => entry.id === figure.id)
      assert(brief)
      if (locale === 'en') figure.label = figure.label.replace(/^图 /, 'Figure ')
      figure.changes = ['planned']
      figure.brief = brief[locale]
      figure.brief_status = 'planned-text-only'
      figure.brief_limits = brief.limits
    }
    for (const [filename, document] of [
      ['lesson.template.json', lesson],
      ['exercises.template.json', exercises],
      ['figures.template.json', figures],
    ]) {
      const destination = path.join(directory, filename)
      fs.writeFileSync(destination, `${JSON.stringify(document, null, 2)}\n`)
      candidates.push(describe(destination))
    }

    assert.deepEqual(lesson.source, originals['lesson.template.json'].source)
    assert.deepEqual(exercises.source, originals['exercises.template.json'].source)
    assert.deepEqual(lesson.source.data, lessonSource)
    assert.deepEqual(exercises.source.data, exerciseSource)
    assert.equal(lesson.prose.length, lessonSource.prose.length)
    assert.equal(exercises.count, exerciseSource.count)
    assert.deepEqual(lesson.section_breaks, [])
    for (const [index, block] of lesson.prose.entries()) {
      const source = lessonSource.prose[index]
      for (const key of ['kind', 'id', 'printed_page', 'source_refs']) assert.deepEqual(block[key], source[key])
      assert.equal(block.source_text, source.text)
      assert.deepEqual(mathTokens(block.text), mathTokens(source.text))
      assert.deepEqual(block.numeric_changes, [])
      if (block.kind === 'fig') assert.equal(block.text, '')
    }
    for (const [index, exercise] of exercises.exercises.entries()) {
      const source = exerciseSource.exercises[index]
      for (const key of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs']) {
        assert.deepEqual(exercise[key], source[key])
      }
      assert.deepEqual(exercise.figures.map((figure) => figure.id), source.figures.map((figure) => figure.id))
      assert.equal(exercise.source_text, source.text)
      assert.deepEqual(mathTokens(exercise.text), mathTokens(source.text))
      assert.deepEqual(exercise.numeric_changes, [])
      assert(exercise.text.startsWith(`${source.number}. `))
      assert.equal(exercise.lines.join('\n'), exercise.text)
    }
    assert.deepEqual(figures.figures.map((figure) => figure.id), originals['figures.template.json'].figures.map((figure) => figure.id))
    for (const [index, figure] of figures.figures.entries()) {
      assert.deepEqual(figure.source, originals['figures.template.json'].figures[index].source)
      assert.equal(figure.brief_status, 'planned-text-only')
      assert.equal(figure.svg, undefined)
      assert.equal(figure.png, undefined)
      assert.equal(figure.render, undefined)
      assert.equal(figure.review, undefined)
    }
    mechanical.push({
      card,
      locale,
      status: 'MATCH-author-structural-invariants-only',
      source_snapshots_unchanged: true,
      source_refs_order_identity_unchanged: true,
      exact_math_token_sequence_unchanged: true,
      original_question_numbers_group_ids_and_figure_refs_unchanged: true,
      figures_text_briefs_only: true,
      semantic_or_independent_approval: false,
    })
  }
}

write(path.join(root, 'input-bindings.json'), { manifest: describe(manifestPath), inputs, first_candidate_byte_copies: initial })
write(path.join(root, 'source-sentence-mapping.json'), {
  schema: 'd489-source-sentence-mapping@1',
  status: 'first-author-mapping-independent-pending',
  prose_source_sentences: 13,
  exercise_source_sentences: 10,
  mappings: mappings.sort((left, right) => {
    const cardOrder = manifest.cards.indexOf(left.card) - manifest.cards.indexOf(right.card)
    if (cardOrder) return cardOrder
    if (left.type === 'title') return -1
    if (right.type === 'title') return 1
    return left.source_index - right.source_index
  }),
})
write(path.join(root, 'evidence/structural-invariants.json'), {
  status: 'MATCH-author-mechanical-only-not-SCI-ZHEN-FIG-DISPLAY-PASS',
  checks: mechanical,
})

// The first proseflow inspection is the only permitted native text operation.
for (const locale of ['zh', 'en']) {
  const candidate = path.join(root, 'candidate/phy10-c2-s2-n74', locale, 'lesson.template.json')
  const executable = process.execPath
  const args = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', candidate]
  const before = describe(candidate)
  const result = spawnSync(executable, args, { cwd: root, encoding: 'utf8' })
  const evidenceDirectory = path.join(root, 'evidence/proseflow', locale)
  writeBytes(path.join(evidenceDirectory, 'stdout.txt'), result.stdout ?? '')
  writeBytes(path.join(evidenceDirectory, 'stderr.txt'), result.stderr ?? '')
  const after = describe(candidate)
  assert.equal(before.sha256, after.sha256)
  let output = null
  if (result.status === 0) output = JSON.parse(result.stdout)
  const receipt = {
    operation: 'first-proseflow-read-only',
    card: 'phy10-c2-s2-n74',
    locale,
    executable,
    args,
    cwd: root,
    invocation_count: 1,
    exit_code: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    result: result.status === 0 ? 'NATIVE-proseflow-first-success-author-only' : 'HOLD-first-proseflow-failure-no-retry',
    before,
    after,
    input_unchanged: true,
    stdout: describe(path.join(evidenceDirectory, 'stdout.txt')),
    stderr: describe(path.join(evidenceDirectory, 'stderr.txt')),
    paragraph_count: output?.paragraphs.length ?? null,
    resolved_breaks: output?.resolvedBreaks ?? null,
    independent_semantic_pass: false,
  }
  write(path.join(evidenceDirectory, 'receipt.json'), receipt)
  flows.push(receipt)
}

for (const input of inputs) assert.equal(describe(input.path).sha256, input.sha256)
const ledger = {
  schema: 'd489-zero-image-batch@1',
  ticket: 'STEMROBIN-181',
  prior_record: describe(ledgerPath),
  prior_actual_opens: 18,
  batch_actual_opens: 0,
  context_cumulative_opens: 18,
  context_cumulative_limit: 24,
  no_budget_reset: true,
  entries: [],
  reopens: 0,
  source_or_candidate_images_opened: 0,
  images_returned_to_parent: 0,
  batch_complete: true,
}
write(path.join(root, 'actual-opens.json'), ledger)
const report = {
  schema: 'd489-first-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'd489-n74-t13-first-bilingual-text-author',
  status: 'FIRST-TEXT-AUTHOR-FROZEN-INDEPENDENT-PENDING-HOLDS-PRESERVED',
  input_manifest: describe(manifestPath),
  input_snapshots: path.join(root, 'source'),
  source_sentence_mapping: path.join(root, 'source-sentence-mapping.json'),
  candidate_root: path.join(root, 'candidate'),
  candidates,
  cards: [
    {
      card: 'phy10-c2-s2-n74',
      source_objects: 11,
      prose_paragraph_objects: 3,
      source_prose_sentences: 13,
      figure_objects: 4,
      captions: 4,
      original_questions: 0,
      bilingual_text: 'first-authored-complete-for-bound-source-objects-independent-pending',
      figure_briefs: 'four-text-only-planned-no-specs-or-assets-generated',
      applicability: 'Ordinary glass in air, with total-internal-reflection critical angle below 45 degrees; not all medium combinations.',
      native: { operation: 'proseflow-only', locales: flows.map((flow) => ({ locale: flow.locale, status: flow.result, invocation_count: 1 })) },
      full: false,
    },
    {
      card: 'phy10-c2-s2-t13',
      number: null,
      source_objects: 0,
      source_prose_sentences: 0,
      original_questions: 7,
      source_question_numbers: ['1', '2', '3', '4', '5', '6', '7'],
      group_ids: ['g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0'],
      bilingual_text: 'seven-original-questions-first-authored-independent-pending-Q2-HOLD',
      native: { proseflow_invocations: 0, reason: 'Source prose is empty; no empty proseflow run.' },
      cross_card_figure_refs: { question: '4', owner: 'phy10-c2-s2-n74', ids: ['fig-161', 'fig-162'], preserved: true },
      Q5_dependency: authoring.cards['phy10-c2-s2-t13'].exercises[4].dependency,
      Q2: authoring.cards['phy10-c2-s2-t13'].exercises[1].author_hold,
      source_boundary: 'Q1-Q5 SOURCE196, Q6-Q7 SOURCE197 before unit75 heading; later undecided punctuation and incomplete n75 excluded.',
      no_refractive_indices_thickness_solutions_or_choices_added: true,
      full: false,
    },
  ],
  inherited: {
    SOURCE196ProceduralHOLD: manifest.SOURCE196ProceduralHOLD,
    SOURCE197LaterPunctuationHOLDExcludedNotRepaired: manifest.SOURCE197LaterPunctuationHOLDExcludedNotRepaired,
    RAW160: manifest.RAW160, SVG160: manifest.SVG160,
    RAW161: manifest.RAW161, SVG161: manifest.SVG161,
    RAW162: manifest.RAW162, SVG162: manifest.SVG162,
    RAW163: manifest.RAW163, SVG163: manifest.SVG163,
    inherited_PASS_is_not_current_author_visual_or_modern_approval: true,
  },
  sourceText: 'Bound to prepared source snapshots; no new pixel review or source revalidation.',
  NATIVE: 'Only two first read-only proseflow operations; no lesson finalize.',
  SCI: 'pending-independent',
  ZHEN: 'pending-independent',
  FIG: 'pending-independent',
  DISPLAY: 'pending-independent',
  completeCard: false,
  historicalFAILHOLDPreserved: true,
  newImages: 0,
  actualCumulativeImages: 18,
  noImageBudgetReset: true,
  noPrepareAssembleFinalizeRenderFigureGeneration: true,
  noAnswersSolutionsChoicesReadOrAuthored: true,
  noFullProjectTests: true,
  noDBGitIndexMeterConsumePublisher: true,
  noPaidGenerationNewWorkerWorktreeBranch: true,
  d463_revoked_not_executed: true,
  all_original_inputs_byte_unchanged_at_completion: true,
  independent_approval_or_complete_card_claim: false,
  freeze_policy: 'Every output regular file sealed 0444 after author completion; not a claim of an earlier independent freeze.',
}
write(path.join(root, 'report.json'), report)
const listFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const filename = path.join(directory, entry.name)
  assert(!entry.isSymbolicLink())
  return entry.isDirectory() ? listFiles(filename) : [filename]
}).sort()
const sealedFiles = listFiles(root)
for (const filename of sealedFiles) fs.chmodSync(filename, 0o444)
write(path.join(root, 'author-freeze.json'), {
  schema: 'd489-author-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'FIRST-AUTHOR-FROZEN-INDEPENDENT-PENDING',
  files: sealedFiles.map((filename) => ({ ...describe(filename), mode: '0444' })),
  self_binding: 'This file is sealed 0444; its SHA-256 is returned in the textual receipt, not embedded recursively.',
  all_files_sha_bound_after_completion: true,
  image_ledger: ledger,
  full: false,
  historical_holds_preserved: true,
  independent_semantic_review: 'pending',
})
fs.chmodSync(path.join(root, 'author-freeze.json'), 0o444)
for (const filename of listFiles(root)) {
  assert.equal(fs.statSync(filename).mode & 0o777, 0o444)
}
for (const input of inputs) assert.equal(describe(input.path).sha256, input.sha256)
console.log(JSON.stringify({
  report: describe(path.join(root, 'report.json')),
  sentence_mapping: describe(path.join(root, 'source-sentence-mapping.json')),
  author_freeze: describe(path.join(root, 'author-freeze.json')),
  actual_opens: describe(path.join(root, 'actual-opens.json')),
  files_0444: listFiles(root).length,
  new_images: 0,
  cumulative_images: 18,
  native_proseflow: flows.map((flow) => ({ locale: flow.locale, result: flow.result, paragraph_count: flow.paragraph_count })),
}, null, 2))
