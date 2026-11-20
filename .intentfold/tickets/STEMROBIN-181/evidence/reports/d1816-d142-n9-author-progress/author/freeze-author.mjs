import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const sidecar = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d142-n9-text-author'
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (filename) => JSON.parse(fs.readFileSync(path.resolve(root, filename), 'utf8'))
const bind = (filename) => {
  const bytes = fs.readFileSync(path.resolve(root, filename))
  return { path: filename, bytes: bytes.length, sha256: hash(bytes) }
}
const write = (filename, value, frozen = false) => {
  fs.writeFileSync(path.resolve(root, filename), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  if (frozen) fs.chmodSync(path.resolve(root, filename), 0o444)
  return bind(filename)
}
const validationPath = `${sidecar}/focused-validation.json`
assert.equal(fs.existsSync(validationPath), false, 'Focused validation is single-use, not replayed')
assert.equal(fs.existsSync(`${sidecar}/frozen`), false, 'Do not replace an existing freeze')
const validationCommand = [process.execPath, `${sidecar}/focused-check.mjs`]
const result = spawnSync(validationCommand[0], validationCommand.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
})
fs.writeFileSync(validationPath, result.stdout || `${JSON.stringify({
  status: 'FOCUSED_CHECK_EXECUTION_FAILED', stderr: result.stderr, exit_code: result.status,
}, null, 2)}\n`, { flag: 'wx' })
assert.equal(result.status, 0, result.stderr || `Focused check failed; see ${validationPath}`)
const validation = read(validationPath)
assert.equal(validation.status, 'AUTHOR_FOCUSED_TEXT_CHECK_PASS_NOT_INDEPENDENT_APPROVAL')
const initialBindings = read(`${sidecar}/input-bindings.json`)
const prepared = read(`${sidecar}/prepared.json`)
const rationale = read(`${sidecar}/qualification-rationale.json`)
const frozenTemplates = []
for (const entry of validation.editions) {
  const destination = `${sidecar}/frozen/${entry.edition}`
  fs.mkdirSync(destination, { recursive: true })
  for (const record of entry.outputs) {
    assert.deepEqual(bind(record.path), record, 'Operative template changed after focused check')
    const frozenPath = `${destination}/${path.basename(record.path)}`
    fs.copyFileSync(path.resolve(root, record.path), path.resolve(root, frozenPath), fs.constants.COPYFILE_EXCL)
    fs.chmodSync(path.resolve(root, frozenPath), 0o444)
    const frozen = bind(frozenPath)
    assert.equal(frozen.sha256, record.sha256)
    assert.ok(fs.readFileSync(path.resolve(root, frozenPath)).equals(fs.readFileSync(path.resolve(root, record.path))))
    frozenTemplates.push({ edition: entry.edition, operative: record, frozen,
      exact_bytes: true, mode: '0444' })
  }
}
assert.equal(frozenTemplates.length, 6)
const addInputPaths = [
  `${sidecar}/input-bindings.json`, `${sidecar}/qualification-rationale.json`,
  `${sidecar}/format-author-text.mjs`, `${sidecar}/focused-check.mjs`, `${sidecar}/freeze-author.mjs`,
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '/Users/yong/.agents/skills/intentfold/references/capability-3-develop/dev.md',
  validation.katex.implementation.path,
  ...validation.editions.flatMap((entry) => [
    `${sidecar}/prose-flow-authoring/${entry.edition}.txt`,
    `${sidecar}/prose-flow-authoring/${entry.edition}.boundaries.json`,
  ]),
]
const allInputs = [...initialBindings.records,
  ...addInputPaths.map((filename) => ({ ...bind(filename), role: 'author-contract-tool-or-flow-input' }))]
const coverage = validation.editions[0].blocks.map((block, index) => {
  const qualification = rationale.qualifications.find((item) =>
    item.source_refs.some((ref) => block.source_refs.includes(ref)))
  const retained = rationale.untouched_or_translation_only_prose.find((item) =>
    item.source_refs.some((ref) => block.source_refs.includes(ref)))
  return {
    source_block_position: index + 1,
    source_refs: block.source_refs, kind: block.kind, id: block.id, label: block.label,
    source_text_sha256: block.source_text_sha256,
    source_identity_and_order: 'UNCHANGED',
    formula_tokens_exact_and_ordered: block.math_tokens,
    disposition: block.kind === 'fig' ? 'PENDING_UNTOUCHED_FIGURE_PLACEHOLDER'
      : block.kind === 'cap' ? 'CAPTION_RETAINED_ZH_TRANSLATED_EN_IDENTITY_UNCHANGED'
        : qualification ? 'BILINGUAL_SOURCE_BOUND_PROSE_QUALIFICATION' : 'RETAINED_ZH_TRANSLATED_EN',
    topic: qualification?.topic ?? retained?.role ?? 'Source figure/caption identity retained',
    rationale: qualification?.rationale ?? retained?.role ?? 'No figure production or source reinterpretation.',
    retained_source_content: qualification?.retained ?? 'All original source text and references remain in immutable fields.',
    unresolved: qualification?.unresolved ?? (block.kind === 'fig'
      ? 'Modern figure production and review remain pending; no visual inspection or approval.' : null),
    editions: validation.editions.map((entry) => ({
      edition: entry.edition, text_sha256: entry.blocks[index].text_sha256,
      changes: entry.blocks[index].changes, numeric_changes: entry.blocks[index].numeric_changes,
      historical_entities: entry.blocks[index].historical_entities,
    })),
  }
})
assert.equal(coverage.length, 35)
const holds = [
  { code: 'SCI_INDEPENDENT_REVIEW_PENDING', approval: false,
    reason: 'Author qualifications are not an independent scientific/historical verdict.' },
  { code: 'ZHEN_INDEPENDENT_REVIEW_PENDING', approval: false,
    reason: 'Bilingual authoring and mechanical script checks are not independent language approval.' },
  { code: 'TEN_FIGURES_PENDING', ids: prepared.modernFiguresPending,
    reason: 'All figure templates/source identities remain untouched drafts; no specs, pixels, reviews or renders produced.' },
  { code: 'FRENKEL_PORTRAIT_NOT_AUTHORIZED', authorized: false,
    reason: 'Historical identity remains in text; no portrait generation or paid calls.' },
  { code: 'SOURCE_SCIENTIFIC_AND_HISTORICAL_LIMITS_RETAINED',
    reason: 'Undefined volume convention, model-dependent liquid times, priority claims and pending figure semantics remain unresolved; see each coverage entry.' },
  { code: 'NO_FINALIZATION_RENDER_OR_PROMOTION',
    reason: 'This delivery is a text-author freeze only, not native finalization, rendering, promotion, publication, product acceptance or formal handoff.' },
]
const counters = {
  source_blocks_per_edition: 35, bilingual_covered_source_blocks: 35, editions: 2,
  prose_blocks_per_edition: 16, figure_placeholders_per_edition: 10, caption_blocks_per_edition: 9,
  first_author_text_batches: 1, first_author_lesson_candidates: 2,
  independent_review_rounds: 0, independent_science_approvals: 0, independent_zhen_approvals: 0,
  source_review_replays: 0, source_counting_runs: 0, native_checker_replays: 0,
  original_tasks: 0, new_tasks: 0, tasks: 0, choices: 0, answers: 0, images: 0,
  image_opens: 0, image_decodes: 0, generated_figures: 0, generated_portraits: 0, paid_calls: 0,
  numeric_replacements: 0, math_corrections: 0,
  scientific_qualification_blocks_per_edition: validation.editions[0].blocks
    .filter((block) => block.changes.includes('scientific-qualification')).length,
  historical_qualification_blocks_per_edition: validation.editions[0].blocks
    .filter((block) => block.changes.includes('historical-qualification')).length,
  author_prose_flow_previews: 4, pure_text_formatter_runs: 1, focused_validation_runs: 1,
  katex_token_checks: validation.editions.reduce((sum, entry) => sum + entry.mathematical_tokens, 0),
  native_finalizations: 0, offline_renders: 0, browser_renders: 0, promotions: 0,
  canonical_writes: 0, complete_courses_added: 0, database_writes: 0, publisher_calls: 0, deploys: 0,
  git_commands: 0, subagent_calls: 0, model_overrides: 0, supervisor_messages: 0, peer_messages: 0,
  whole_project_checks: 0, frozen_template_copies: 6, operative_templates_changed: 2,
  operative_templates_retained_exact: 4,
}
const authorArtifacts = [...addInputPaths.filter((filename) => filename.startsWith(sidecar)).map(bind),
  bind(`${sidecar}/authoring-intent.json`), bind(`${sidecar}/capture-inputs.mjs`),
  bind(validationPath)]
const outputs = [
  ...validation.editions.flatMap((entry) => entry.outputs),
  ...frozenTemplates.map((record) => record.frozen), ...authorArtifacts,
]
const reportPath = `${sidecar}/report.json`
const reportRecord = write(reportPath, {
  schema: 'stemrobin181/n9-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D142', book: '9p', lesson: 'phy9-c1-s1-n9',
  workspace: root, finish: 'review', grill: 'self', same_invocation: true,
  status: 'AUTHOR_TEXT_COMPLETE_FROZEN_PENDING_SCI_ZHEN_AND_ALL_FIGURES',
  verdict: 'AUTHOR_ONLY_NOT_INDEPENDENT_SCI_OR_ZHEN_APPROVAL',
  prepared: bind(`${sidecar}/prepared.json`),
  setup_freshness_grill: 'Previously fulfilled same invocation; not redone.',
  source_review: {
    replayed: false,
    reports: prepared.reused.slice(0, 2),
    pages26_27: 'Correction approvals combined with unaffected original source review; no source re-review.',
    pages28_30: 'Existing pass results reused; no source counting or checker replay.',
    source_mathematical_identity_binding: 'UNCHANGED',
    source_files_changed: false,
  },
  ownership: {
    writes: ['This author sidecar', 'Two operative N9 lesson.template.json files'],
    retained_exact: 'Four operative N9 exercises/figures.template.json files.',
    parent_meter_index_carriers: 'Not read, updated or owned by this author.',
    n8_fig05: 'Not read, updated or owned by this author.',
    other_work: 'No edits or messages to peer/supervisor work.',
  },
  inputs: allInputs, outputs, frozen_templates: frozenTemplates,
  block_coverage: coverage,
  pending_figure_ids: prepared.modernFiguresPending,
  historical_identity: {
    english: 'Yakov I. Frenkel', chinese: '雅科夫·伊·弗兰克尔',
    source_term: 'Я. И. 弗连克利', dates_math_token: '$1894\\sim1952$',
    source_identity_dates_and_attribution_retained: true,
    unsupported_priority_claims: 'Explicitly scoped to source historical attribution, not universal verified conclusions.',
    portrait_authorized: false,
  },
  section_breaks: validation.editions.map((entry) => ({
    edition: entry.edition,
    provenance: bind(`${sidecar}/prose-flow-authoring/${entry.edition}.boundaries.json`),
    tool_resolved_boundaries: entry.prose_flow.resolved_boundaries,
    author_used_integer_indices: false,
  })),
  visible_english_title: 'Contract-supported locale=en title localization only; printed/source identity and all placeholder labels remain unchanged.',
  focused_validation: { receipt: bind(validationPath), command: validationCommand,
    cwd: root, runs: 1, status: validation.status, read_only: true,
    excluded: validation.excluded, independent_approval: false },
  counters, holds,
  finalized: false, rendered: false, promoted: false, published: false,
  product_acceptance: false, formal_handoff: false,
}, true)
const freezePath = `${sidecar}/author-freeze.json`
const freezeRecord = write(freezePath, {
  schema: 'stemrobin181/n9-text-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D142', lesson: 'phy9-c1-s1-n9',
  workspace: root,
  status: 'AUTHOR_ONLY_EXACT_TEXT_FREEZE_PENDING_INDEPENDENT_SCI_ZHEN_AND_FIGURES',
  source_preparation: bind(`${sidecar}/prepared.json`),
  report: reportRecord, focused_validation: bind(validationPath),
  inputs: allInputs, outputs: [...outputs, reportRecord], frozen_templates: frozenTemplates,
  counters, holds,
  frozen_copy_count: 6, frozen_copy_mode: '0444', copies_match_operative_bytes: true,
  independent_science_approval: false, independent_zhen_approval: false,
  source_review_replayed: false,
  finalization: false, render: false, promotion: false, publication: false,
  product_acceptance: false, formal_handoff: false,
  self_hash_policy: 'This manifest binds all inputs and outputs other than itself; its actual SHA-256 is returned separately.',
}, true)
console.log(JSON.stringify({
  report: reportRecord, author_freeze: freezeRecord, focused_validation: bind(validationPath),
  frozen_template_copies: frozenTemplates.length, source_blocks: coverage.length,
  pending_figures: prepared.modernFiguresPending,
  status: 'AUTHOR_ONLY_COMPLETE_NO_FINALIZATION_RENDER_OR_PROMOTION',
}, null, 2))
