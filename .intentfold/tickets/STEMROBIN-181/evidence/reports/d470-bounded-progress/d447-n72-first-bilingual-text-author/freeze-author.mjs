import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = path.dirname(new URL(import.meta.url).pathname);
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({
  path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size,
});
const put = (name, data) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const ledger = read(path.join(root, 'inputs-before.json'));
const mapping = read(path.join(root, 'source-sentence-mapping.json'));
const flow = read(path.join(root, 'prose-flow-bindings.json'));
const inputLesson = read(ledger.input_templates.find(item => item.path.endsWith('/lesson.template.json')).path);
const inputExercises = read(ledger.input_templates.find(item => item.path.endsWith('/exercises.template.json')).path);
const inputFigures = read(ledger.input_templates.find(item => item.path.endsWith('/figures.template.json')).path);
const candidates = [];
const checked = [];
const mathTokens = text => Array.from(text.matchAll(/\$([^$]+)\$/g), item => item[1]).sort();

try {
  assert.equal(mapping.source_sentence_count, 52);
  assert.equal(mapping.source_sentences.length, 52);
  assert.equal(mapping.source_objects.length, 11);
  assert.equal(new Set(mapping.source_sentences.map(item => item.id)).size, 52);
  for (const input of [ledger.manifest, ...ledger.source_files, ...ledger.input_templates]) {
    assert.equal(bind(input.path).sha256, input.sha256);
  }
  for (const language of ['zh', 'en']) {
    const base = path.join(root, 'candidate', language);
    const lesson = read(path.join(base, 'lesson.template.json'));
    const exercises = read(path.join(base, 'exercises.template.json'));
    const figures = read(path.join(base, 'figures.template.json'));
    assert.deepEqual(lesson.source, inputLesson.source);
    assert.deepEqual(exercises.source, inputExercises.source);
    assert.deepEqual(lesson.errata, inputLesson.errata);
    assert.equal(lesson.prose.length, 29);
    assert.equal(exercises.count, 0);
    assert.deepEqual(exercises.exercises, []);
    assert.deepEqual(lesson.figures.map(item => item.id), inputLesson.figures.map(item => item.id));
    assert.equal(figures.figures.length, 6);
    const blocks = [];
    lesson.prose.forEach((block, index) => {
      const original = inputLesson.source.data.prose[index];
      assert.equal(block.source_text, original.text);
      assert.deepEqual(block.source_refs, original.source_refs);
      assert.deepEqual([block.kind, block.id, block.printed_page], [original.kind, original.id, original.printed_page]);
      if (block.kind === 'p') {
        assert.deepEqual(mathTokens(block.text), mathTokens(original.text), `Source math tokens changed at ${language}/prose/${index}`);
        for (const token of mathTokens(block.text)) assert.equal(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/u.test(token), false);
      }
      blocks.push({ pointer: `/prose/${index}`, source_refs_unchanged: true, source_text_unchanged: true, object_identity_unchanged: true, original_math_token_multiset_unchanged: block.kind === 'p' });
    });
    figures.figures.forEach((figure, index) => {
      assert.deepEqual(figure.source, inputFigures.figures[index].source);
      assert.equal(figure.modern_figure_status, 'PENDING');
      assert.equal(fs.existsSync(path.join(root, figure.spec)), false);
    });
    const receipt = flow.records.find(item => item.language === language);
    assert.equal(receipt.invocation_count, 1);
    assert.equal(receipt.exitCode, 0);
    assert.equal(bind(receipt.stdout.path).sha256, receipt.stdout.sha256);
    assert.equal(bind(receipt.final_candidate.path).sha256, receipt.final_candidate.sha256);
    assert.deepEqual(lesson.section_breaks, receipt.selected_before_after_from_tool_output);
    assert.equal(lesson.prose[21].text.includes('1.000292'), true);
    assert.equal(lesson.prose[21].text.includes('$n=\\frac{n_2}{n_1}\\approx n_2$'), true);
    checked.push({ language, scoped_binding_checks_only: true, blocks, source_snapshot_and_SHA_retained: true, original_math_multisets_retained: true, math_contains_CJK_or_fullwidth_punctuation: false, source_figures_retained: true, empty_original_exercises_retained: true, section_breaks_from_first_tool_output: receipt.selected_before_after_from_tool_output });
    for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
      candidates.push({ language, ...bind(path.join(base, name)) });
    }
  }
  put('actual-opens.json', {
    schema: 'n72-first-bilingual-author/actual-opens@1',
    scope: 'd447 same existing finite helper; text author only',
    inherited_image_count: 7,
    image_opens: [],
    new_images: 0,
    cumulative_images: 7,
    limit: 24,
    budget_reset: false,
    retained_prior_batches: ['d429:6', 'd437:1', 'd439:0'],
    text_inputs: [ledger.manifest, ...ledger.source_files, ...ledger.input_templates],
    text_input_read_note: 'Source lesson and empty exercises were read in the earlier part of this same author batch and recovered as text after context summarization. One source-sentence mapping was authored; no source-page replay or pixel load.',
    generated_text_read: ['author-tools.mjs', 'author-manuscript.json', 'inputs-before.json', 'source-sentence-mapping.json', 'prose-flow-zh.txt', 'prose-flow-en.txt', 'prose-flow-bindings.json'].map(name => bind(path.join(root, name))),
    candidate_text_bindings: candidates,
    external_primary_text_reference: {
      url: 'https://openstax.org/books/university-physics-volume-3/pages/1-7-polarization',
      channel: 'cloak-fetch, plain rendered text only',
      status: 200,
      purpose: 'Modern polarization-dependent reflection qualification, not an input table or source-pixel substitute.',
      model_image_payloads: 0,
      note: 'Text-only access mentioned in the earlier author context was repeated after the summary; not claimed as exactly one URL access.',
    },
    no_RAW_SVG_preview_FigureSpec_reads: true,
  });
  put('report.json', {
    schema: 'n72-first-bilingual-author/report@1',
    ticket: 'STEMROBIN-181',
    batch: 'd447-n72-first-bilingual-text-author',
    lesson: 'phy10-c2-s2-n72',
    status: 'FIRST-BILINGUAL-TEXT-AUTHOR-FROZEN-INDEPENDENT-SCI-ZHEN-FIG-DISPLAY-PENDING',
    first_author_only: true,
    independent_review_performed: false,
    same_existing_finite_helper: true,
    inputs_before: bind(path.join(root, 'inputs-before.json')),
    resolved_paths_from_manifest: ledger.resolved_paths,
    source_sentence_mapping: bind(path.join(root, 'source-sentence-mapping.json')),
    source_sentence_count: 52,
    source_ordered_blocks: 29,
    source_prose_blocks: 18,
    source_figure_objects: 6,
    source_caption_objects: 5,
    source_questions: 0,
    six_candidate_templates: candidates,
    copy_policy: ledger.template_copy_policy,
    scoped_author_binding_checks: checked,
    preserved_relationships: ['6.8 sine ratio and alpha/beta definitions', '6.9 n=n2/n1', '6.10 sine ratio equals n2/n1', '6.11 sin(beta)=(1/n)sin(alpha)', 'standard-condition yellow-light air index 1.000292 and approximation, not equality', 'coin alignment and unchanged head position', 'separate top and side pencil observations, Figures 151/152', 'fluorescent aquarium, smoke/screen, and ray geometry, Figures 153/154', 'concentric semicylindrical glass/disk and angle-measurement experiment, Figure 155', 'air-to-glass/water acute-angle reasoning and normal-incidence exception', 'reflection experiment from 0 degrees toward the 90-degree limit'],
    table_values_policy: 'Table 9 material rows and every cell value are left to the separate modern figure author; no data authored or inferred by this text batch.',
    modern_clarifications: mapping.modern_clarifications,
    no_source_erratum_registered: true,
    prose_flow: bind(path.join(root, 'prose-flow-bindings.json')),
    prose_flow_invocations: { zh: 1, en: 1 },
    author_statuses: { SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending' },
    figures: inputFigures.figures.map(item => ({ id: item.id, status: 'pending', modern_figure_author_and_independent_review_required: true })),
    retained_holds: [
      { id: 'SOURCE188', status: 'HOLD', scope: 'top weight/footer; no whole-page PASS inferred from scoped n72 body evidence' },
      { id: 'SOURCE191', status: 'HOLD', scope: 'combined source page remains HOLD' },
      { id: 'RAW155', status: 'HOLD', scope: 'fine detail; no image opened or adjudicated here' },
      { id: 'SVG155', status: 'HOLD', scope: 'fine detail; no image opened or adjudicated here' },
    ],
    historical_FAIL_HOLD_bytes_preserved: true,
    excludes_incomplete_n73: true,
    source_scope_inherited_from_preparation_not_re_reviewed: true,
    whole_SOURCE_pass_claimed: false,
    RAW_SVG_pass_claimed: false,
    FIG_pass_claimed: false,
    DISPLAY_pass_claimed: false,
    full_card_pass_claimed: false,
    counts_written_or_promoted: false,
    image_budget: { before: 7, batch: 0, cumulative: 7, limit: 24, reset: false },
    forbidden_operations_performed: [],
    canonical_or_d445_writes: false,
    outputs_only_under: root,
    no_prepare_assemble_adaptprepare_native_finalize_render_publish_replay: true,
    no_answers_choices_DB_git_paidgen_new_worker_branch_worktree_index_meter: true,
    output_freeze_mode: '0444',
  });
  const files = [
    'inputs-before.json', 'author-tools.mjs', 'author-manuscript.json', 'freeze-author.mjs',
    'source-sentence-mapping.json', 'prose-flow-zh.txt', 'prose-flow-en.txt',
    'prose-flow-bindings.json', 'actual-opens.json', 'report.json',
    ...candidates.map(item => path.relative(root, item.path)),
  ];
  for (const name of files) fs.chmodSync(path.join(root, name), 0o444);
  put('author-freeze.json', {
    schema: 'n72-first-bilingual-author/author-freeze@1',
    batch: 'd447',
    status: 'FROZEN-FIRST-AUTHOR-ONLY-INDEPENDENT-REVIEW-PENDING',
    image_budget: { inherited: 7, new: 0, cumulative: 7, limit: 24 },
    files: files.map(name => ({ ...bind(path.join(root, name)), mode: '0444' })),
    self_hash_excluded_to_avoid_cycle: true,
    historical_FAIL_HOLD_preserved: true,
    review_claims: { SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', completeCard: false },
  });
  fs.chmodSync(path.join(root, 'author-freeze.json'), 0o444);
  for (const name of [...files, 'author-freeze.json']) assert.equal(fs.statSync(path.join(root, name)).mode & 0o777, 0o444);
  console.log(JSON.stringify({ status: 'FROZEN-FIRST-AUTHOR-ONLY', files: [...files, 'author-freeze.json'].map(name => bind(path.join(root, name))), cumulative_images: 7 }, null, 2));
} catch (error) {
  const file = path.join(root, 'freeze-author.first-failure.json');
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `${JSON.stringify({ stage: 'first-author-scoped-binding-and-freeze', message: error.message, preserve_first_failure: true, new_images: 0 }, null, 2)}\n`, { flag: 'wx' });
    fs.chmodSync(file, 0o444);
  }
  console.error(error.message);
  process.exitCode = 1;
}
