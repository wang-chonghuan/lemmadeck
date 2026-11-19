import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const output = path.join(T, 'tmp/d773-n84-first-bilingual-text-author')
const preparation = path.join(T, 'tmp/d758-source227228-consume-prepare84-85')
const raw = path.join(preparation, 'root/10p/lessons/phy10-c2-s3-n84')
const templates = path.join(
  preparation, 'work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s3-n84',
)
const tools = path.join(R, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const require = createRequire(import.meta.url)
const { proseFlow, sectionBreakIndices } = require(path.join(tools, 'htmlfrag.js'))
assert.equal(process.cwd(), R)

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const fileHash = (filename) => hash(fs.readFileSync(filename))
const load = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
function write(filename, value) {
  assert.ok(path.resolve(filename).startsWith(`${output}/`))
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
function writeText(filename, value) {
  assert.ok(path.resolve(filename).startsWith(`${output}/`))
  fs.writeFileSync(filename, value, 'utf8')
}
const inputPaths = [
  path.join(preparation, 'n84-preparation.json'),
  path.join(preparation, 'n84-preauthor-source-requirements.json'),
  path.join(raw, 'lesson.json'),
  path.join(raw, 'exercises.json'),
  ...['lesson', 'exercises', 'figures'].map(
    (name) => path.join(templates, `${name}.template.json`),
  ),
  path.join(R, '.claude/skills/ld-s10y-lesson/SKILL.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
  path.join(R, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  ...['edition.py', 'prose_flow.mjs', 'htmlfrag.js'].map((name) => path.join(tools, name)),
  path.join(output, 'authored-text.json'),
  path.join(output, 'normalize-candidate.py'),
  path.join(output, 'run-author.mjs'),
]
const inputs = inputPaths.map((filename) => ({
  path: filename,
  sha256: fileHash(filename),
  bytes: fs.statSync(filename).size,
}))
assert.equal(
  fileHash(path.join(preparation, 'n84-preauthor-source-requirements.json')),
  'ca79d7ece9062d7b2a613bbe03569026b677fb32535b6fe382e3e6fd9fabd69f',
)
const prep = load(inputPaths[0])
assert.equal(fileHash(path.join(raw, 'lesson.json')), prep.rawLesson.sha256)
assert.equal(fileHash(path.join(raw, 'exercises.json')), prep.rawExercises.sha256)
const requirements = load(inputPaths[1])
const sourceLesson = load(path.join(raw, 'lesson.json'))
const sourceExercises = load(path.join(raw, 'exercises.json'))
const frozenLesson = load(path.join(templates, 'lesson.template.json'))
const frozenExercises = load(path.join(templates, 'exercises.template.json'))
const frozenFigures = load(path.join(templates, 'figures.template.json'))
const authored = load(path.join(output, 'authored-text.json'))
assert.equal(sourceExercises.count, 0)
assert.deepEqual(sourceExercises.exercises, [])
assert.equal(sourceLesson.prose.length, 12)
assert.deepEqual(frozenLesson.source.data, sourceLesson)
assert.deepEqual(frozenExercises.source.data, sourceExercises)
const usage = { images: 0, paid_calls: 0 }
const localeResults = []

function receiptCall(stage, locale, command, args, directory) {
  const before = fileHash(path.join(directory, 'lesson.template.json'))
  const result = spawnSync(command, args, {
    cwd: R,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 8 * 1024 * 1024,
  })
  const receipt = {
    stage,
    locale,
    command: [command, ...args],
    workdir: R,
    exit_code: result.status,
    status: result.status === 0 ? 'EXIT-0' : 'FAILED',
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
    lesson_input_sha256: before,
    lesson_output_sha256: fileHash(path.join(directory, 'lesson.template.json')),
  }
  write(path.join(directory, `${stage}.receipt.json`), receipt)
  assert.equal(result.status, 0, `${stage} failed; preserved its receipt`)
  return receipt
}

for (const locale of ['zh', 'en']) {
  const directory = path.join(output, 'candidates', locale)
  fs.mkdirSync(directory, { recursive: true })
  const copyRecords = []
  for (const name of ['lesson', 'exercises', 'figures']) {
    const source = path.join(templates, `${name}.template.json`)
    const destination = path.join(directory, `${name}.template.json`)
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    assert.equal(fileHash(source), fileHash(destination))
    copyRecords.push({
      source_path: source,
      destination_path: destination,
      copied_sha256: fileHash(destination),
      byte_identical_at_copy: true,
    })
  }
  write(path.join(directory, 'template-copy.receipt.json'), copyRecords)
  const lessonPath = path.join(directory, 'lesson.template.json')
  const document = load(lessonPath)
  document.locale = locale
  document.title = authored.locales[locale].title
  document.authoring_status = 'FIRST-TEXT-CANDIDATE-INDEPENDENT-REVIEW-PENDING'
  assert.equal(document.printed_title, sourceLesson.printed_title)
  assert.equal(authored.locales[locale].prose.length, document.prose.length)
  for (const figure of document.figures) {
    figure.label = authored.locales[locale].figure_labels[figure.id]
  }
  for (const [index, block] of document.prose.entries()) {
    block.text = authored.locales[locale].prose[index]
    block.changes = block.text === block.source_text
      ? []
      : locale === 'en' ? ['language', 'clarification'] : ['clarification']
    if (block.kind === 'fig') {
      block.label = authored.locales[locale].figure_labels[block.id]
      block.asset_status = 'PENDING'
      block.asset_approved = false
    }
    if (block.kind === 'cap') {
      block.label = authored.locales[locale].figure_labels['fig-198']
      block.changes = locale === 'en' ? ['language'] : []
    }
    const bindings = authored.historical_bindings.filter(
      (binding) => binding.block_index === index,
    )
    for (const binding of bindings) {
      assert.ok(block.source_text.includes(binding.source_term))
      assert.ok(block.text.includes(binding.modern_terms[locale]))
      assert.ok(binding.source_refs.every((ref) => block.source_refs.includes(ref)))
    }
    if (locale === 'zh') {
      block.historical_entities = bindings.map((binding) => ({
        term: binding.source_term,
        reason: binding.reason,
        source_refs: binding.source_refs,
      }))
    } else if (bindings.length) {
      block.historical_entity_translations = bindings.map((binding) => ({
        source_term: binding.source_term,
        term: binding.modern_terms.en,
        source_refs: binding.source_refs,
        reason: binding.reason,
      }))
    }
  }
  write(lessonPath, document)
  const exercises = load(path.join(directory, 'exercises.template.json'))
  exercises.locale = locale
  write(path.join(directory, 'exercises.template.json'), exercises)
  const figures = load(path.join(directory, 'figures.template.json'))
  figures.locale = locale
  figures.status = 'pending'
  for (const figure of figures.figures) {
    figure.label = authored.locales[locale].figure_labels[figure.id]
    figure.asset_status = 'PENDING'
    figure.generation_status = 'PENDING'
    figure.independent_review_status = 'PENDING'
    figure.approved = false
  }
  write(path.join(directory, 'figures.template.json'), figures)
  const authoredHash = fileHash(lessonPath)
  const normalizeReceipt = receiptCall(
    'normalize', locale, python,
    ['-B', path.join(output, 'normalize-candidate.py'), lessonPath],
    directory,
  )
  const normalization = JSON.parse(normalizeReceipt.stdout)
  assert.equal(normalization.calls.length, 9)
  assert.ok(normalization.calls.every((call) => call.invocations === 1))
  const normalizedHash = fileHash(lessonPath)
  const flowReceipt = receiptCall(
    'prose-flow', locale, 'node',
    [path.join(tools, 'prose_flow.mjs'), lessonPath],
    directory,
  )
  const reportedBoundaries = flowReceipt.stdout
    .split('\n')
    .filter((line) => line.startsWith('    break: '))
    .map((line) => JSON.parse(line.slice('    break: '.length)))
  const normalized = load(lessonPath)
  const chosen = authored.section_start_block_indices.map((blockIndex) => {
    const firstParagraph = normalized.prose[blockIndex].text.split(/\n{2,}/)[0]
    const matches = reportedBoundaries.filter(
      (boundary) => boundary.after === firstParagraph,
    )
    assert.equal(matches.length, 1, `No unique reported boundary for block ${blockIndex}`)
    return matches[0]
  })
  normalized.section_breaks = chosen
  write(lessonPath, normalized)
  const resolved = sectionBreakIndices(normalized.prose, chosen)
  write(path.join(directory, 'section-breaks.json'), {
    origin: 'Exact adjacent boundary objects copied from the single prose_flow.mjs stdout',
    receipt_path: path.join(directory, 'prose-flow.receipt.json'),
    section_start_block_indices: authored.section_start_block_indices,
    section_breaks: chosen,
    resolved_indices_from_shared_parser: resolved,
  })

  let lessonMd = `# ${normalized.number}. ${normalized.title}\n\n`
  for (const block of proseFlow(normalized.prose, chosen)) {
    if (block.sectionBreak) lessonMd += '---\n\n'
    if (block.kind === 'fig') {
      const role = block.id === 'tbl-p0226-01' ? 'portrait' : 'diagram'
      lessonMd += `<!-- PENDING ${role} slot: ${block.id}; label: ${block.label}; source_refs: ${block.source_refs.join(', ')}; generation/review not approved; no image payload -->\n\n`
    } else {
      lessonMd += `<!-- source_refs: ${block.source_refs.join(', ')}; kind: ${block.kind} -->\n${block.text}\n\n`
    }
  }
  writeText(path.join(directory, 'lesson.md'), lessonMd)
  writeText(
    path.join(directory, 'exercises.md'),
    `# ${locale === 'zh' ? '练习' : 'Exercises'}\n\n<!-- Source exercise count: 0. No source questions and no authored questions. -->\n`,
  )
  const pendingSlots = normalized.prose
    .filter((block) => block.kind === 'fig')
    .map((block) => ({
      id: block.id,
      role: block.id === 'tbl-p0226-01' ? 'portrait' : 'diagram',
      label: block.label,
      source_refs: block.source_refs,
      source_assets: frozenFigures.figures.find((figure) => figure.id === block.id).source,
      generation: 'PENDING',
      independent_review: 'PENDING',
      approved: false,
      image_payload_created: false,
      planned_spec_is_not_an_existing_or_approved_asset: true,
    }))
  write(path.join(directory, 'pending-slots.json'), {
    locale,
    slots: pendingSlots,
    external_plate_dependencies: [],
    note: 'The generic plate III preauthor requirement belongs to n85 only; n84 has no such source reference.',
  })

  const blockMapping = sourceLesson.prose.map((block, index) => {
    const modern = normalized.prose[index]
    assert.equal(modern.kind, block.kind)
    assert.equal(modern.id, block.id)
    assert.equal(modern.printed_page, block.printed_page)
    assert.deepEqual(modern.source_refs, block.source_refs)
    assert.equal(modern.source_text, block.text)
    const exactTokens = (text) => [...text.matchAll(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g)]
      .map((match) => match[0])
    const sourceTokens = exactTokens(block.text)
    const modernTokens = exactTokens(modern.text)
    assert.deepEqual(modernTokens, sourceTokens)
    return {
      source_block_index: index,
      candidate_json_pointer: `/prose/${index}`,
      kind: block.kind,
      id: block.id,
      source_label: block.label,
      modern_label: modern.label,
      printed_page: block.printed_page,
      source_refs: block.source_refs,
      source_text_sha256: hash(block.text),
      modern_text_sha256: hash(modern.text),
      source_math_tokens: sourceTokens,
      modern_math_tokens: modernTokens,
      math_tokens_identical_in_order: true,
      numeric_changes: modern.numeric_changes,
      historical_declarations: modern.historical_entities,
      historical_translations: modern.historical_entity_translations ?? [],
      source_snapshot_unchanged: true,
    }
  })
  assert.deepEqual(normalized.source, frozenLesson.source)
  assert.deepEqual(exercises.source, frozenExercises.source)
  assert.deepEqual(normalized.errata, frozenLesson.errata)
  assert.equal(normalized.exercise_count, 0)
  assert.equal(exercises.count, 0)
  assert.deepEqual(exercises.exercises, [])
  assert.deepEqual(normalized.figures.map((figure) => figure.id), requirements.figureIds)
  for (const [index, figure] of figures.figures.entries()) {
    assert.deepEqual(figure.source, frozenFigures.figures[index].source)
    assert.equal(figure.spec, frozenFigures.figures[index].spec)
  }
  if (locale === 'en') {
    assert.ok(!/[\u3400-\u4dbf\u4e00-\u9fff]/.test(normalized.title))
    assert.ok(normalized.prose.every(
      (block) => !/[\u3400-\u4dbf\u4e00-\u9fff]/.test(block.text),
    ))
  }
  const coveredSourceBlocks = requirements.blocks.map((block) => {
    const matches = blockMapping.filter((mapping) => mapping.source_refs.includes(block.ref))
    if (block.kind === 'h3') {
      return {
        ref: block.ref, kind: block.kind,
        disposition: 'Immutable printed_title plus localized title/number',
        candidate_json_pointers: ['/printed_title', '/title', '/number'],
        source_text_sha256: hash(block.lines.join('')),
      }
    }
    if (block.kind === 'foot') {
      return {
        ref: block.ref, kind: block.kind,
        disposition: 'Page-number metadata, not a prose footnote; retained printed_page provenance',
        printed_page: block.ref.startsWith('p0225') ? 215 : 216,
        candidate_json_pointers: matches.map((mapping) => mapping.candidate_json_pointer),
        source_text_sha256: hash(block.lines.join('')),
      }
    }
    assert.equal(matches.length, 1, `Unmapped approved source block: ${block.ref}`)
    return {
      ref: block.ref,
      kind: block.kind,
      source_text_sha256: hash(block.lines.join('')),
      candidate_json_pointers: matches.map((mapping) => mapping.candidate_json_pointer),
      disposition: block.cont || block.open
        ? 'Native assembled continuation retained in its original prose identity'
        : block.kind === 'fig' ? 'Original figure identity retained as a pending slot'
          : 'Retained in original assembled source order',
    }
  })
  write(path.join(directory, 'block-source-mapping.json'), {
    locale,
    assembled_blocks: blockMapping,
    approved_source_page_blocks: coveredSourceBlocks,
    approved_source_page_block_order: requirements.blocks.map((block) => block.ref),
    assembled_order_note: 'Native assembly joins open/cont prose across intervening figures and page numbers. Candidate block order exactly matches the approved raw lesson; it is not reassembled.',
    source_questions: 0,
    source_snapshot_unchanged: true,
  })
  localeResults.push({
    locale,
    directory,
    copied_templates: copyRecords,
    authored_before_normalization_sha256: authoredHash,
    normalized_before_section_breaks_sha256: normalizedHash,
    final_lesson_sha256: fileHash(lessonPath),
    final_exercises_sha256: fileHash(path.join(directory, 'exercises.template.json')),
    final_figures_manifest_sha256: fileHash(path.join(directory, 'figures.template.json')),
    normalized_calls: normalization.calls,
    prose_flow_cli_invocations: 1,
    section_breaks: chosen,
    source_blocks: blockMapping.length,
    approved_page_blocks: coveredSourceBlocks.length,
    source_questions: 0,
  })
}

for (const input of inputs) {
  assert.equal(fileHash(input.path), input.sha256, `An input changed: ${input.path}`)
}
write(path.join(output, 'inputs.json'), {
  inputs,
  exact_required_requirements_sha256: prep.frozenRequirements.sha256,
  approved_input_bytes_unchanged_after_authoring: true,
})
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory()
      ? walk(path.join(directory, entry.name))
      : [path.join(directory, entry.name)])
}
const candidateOutputs = walk(path.join(output, 'candidates')).sort().map((filename) => ({
  path: filename,
  sha256: fileHash(filename),
  bytes: fs.statSync(filename).size,
}))
const freeze = {
  schema: 'ld-s10y-lesson/first-bilingual-text-author-freeze@1',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s3-n84',
  purpose: 'First modern bilingual text candidates only',
  finish: 'review',
  grill: 'self',
  status: 'AUTHOR-FROZEN-INDEPENDENT-REVIEW-PENDING',
  source_status: prep.status,
  source_and_native_finals_replayed: false,
  whole_card_approved: false,
  independent_reviews: { SCI: 'PENDING', ZHEN: 'PENDING', FIG: 'PENDING', display: 'PENDING' },
  usage,
  source_questions: 0,
  retained_figure_ids: requirements.figureIds,
  portrait_generation: 'PENDING',
  external_plate_dependencies: [],
  source_requirements_sha256: prep.frozenRequirements.sha256,
  exact_inputs: inputs,
  candidate_outputs: candidateOutputs,
  locales: localeResults,
  immutable_scope_checks: {
    input_hashes_unchanged: true,
    all_original_assembled_block_identities_refs_and_order_retained: true,
    all_source_math_tokens_exact_and_in_order: true,
    printed_title_and_source_snapshots_unchanged: true,
    no_source_questions_added: true,
    no_image_payloads: true,
  },
  historical_translation_contract: {
    zh: 'Native per-block historical_entities declarations with source-bound terms and reasons.',
    en: 'Per-block historical_entity_translations maps source_term to English term with source_refs and reason. Chinese source snapshots remain immutable.',
    native_validator_limitation: 'The current native historical_entities check requires one literal term in both source and modern text; it has no cross-language alias support. No native finalization was invoked and no English alias contract approval is claimed.',
  },
  operations_performed: [
    'Read already approved source and frozen requirements/contracts',
    'Byte-identical template copies to the two assigned candidate directories',
    'Apply bilingual first-author prose while retaining source snapshots',
    'One native Python normalizer invocation per locale, once per prose block',
    'One prose_flow.mjs invocation per locale; copy exact reported adjacent boundary objects',
    'Render Markdown directly from candidate prose with pending figure-slot comments',
    'Scoped deterministic source mapping, token/identity assertions and hash freeze',
  ],
  operations_not_performed: [
    'Setup or freshness replay', 'Source/native finalization replay', 'Independent content review',
    'Image opening, generation or approval', 'External research', 'Paid calls',
    'Whole-project checks', 'Canonical writes', 'Meter/index/tool changes', 'Database writes',
    'Publication', 'Deployment', 'Git operations', 'Merge', 'Ticket closure', 'Chat messaging',
  ],
}
write(path.join(output, 'author-freeze.json'), freeze)
write(path.join(output, 'report.json'), {
  ticket: freeze.ticket,
  card: freeze.card,
  status: freeze.status,
  finish: 'review',
  grill: 'self',
  author_freeze: {
    path: path.join(output, 'author-freeze.json'),
    sha256: fileHash(path.join(output, 'author-freeze.json')),
  },
  input_hash_manifest: {
    path: path.join(output, 'inputs.json'),
    sha256: fileHash(path.join(output, 'inputs.json')),
  },
  candidates: candidateOutputs,
  source_page_blocks_mapped: requirements.blocks.length,
  assembled_blocks_per_locale: sourceLesson.prose.length,
  source_questions: 0,
  usage,
  source_and_native_finals_replayed: false,
  independent_reviews: freeze.independent_reviews,
  portrait_generation: 'PENDING',
  whole_card_approved: false,
  historical_translation_contract: freeze.historical_translation_contract,
  author_self_grill: {
    status: 'AUTHOR-CHECKS-ONLY-NOT-INDEPENDENT-REVIEW',
    causal_coverage: 'Both texts distinguish geometric distance, propagation delay and total phase including interface reflection; integer/odd-half-wave rules are explicitly conditional on the stated wave model and total-phase convention.',
    coherence: 'Fixed relative phase, same-medium wavelength/frequency, same-beam splitting, limited path difference and stable observation geometry are stated in both locales.',
    source_coverage: 'All 12 assembled blocks and all approved boundary page blocks are mapped, including both figures, caption, cross-page continuations, history and page-number provenance.',
    historical_scope: 'All named identities, both dates and source-attributed discoveries are retained. The English Mark Twain passage is translated from the supplied source, not presented as a recovered original quotation.',
    figure_scope: 'Both original slots retained; no new images and no n84 plate dependency invented.',
    handoff: 'Parent must independently review SCI and ZHEN and resolve the English alias-field contract before any finalization; images and whole-card acceptance remain pending.',
  },
})
console.log(JSON.stringify({
  status: freeze.status,
  usage,
  paths_and_hashes: [
    ...localeResults.map((result) => ({
      path: path.join(result.directory, 'lesson.template.json'),
      sha256: result.final_lesson_sha256,
    })),
    ...['author-freeze.json', 'report.json'].map((name) => ({
      path: path.join(output, name),
      sha256: fileHash(path.join(output, name)),
    })),
  ],
}, null, 2))
