import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const root = path.dirname(new URL(import.meta.url).pathname);
const tmp = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp');
const manifestPath = path.join(tmp, 'd475-n73-first-source-preparation/manifest.json');
const expectedManifest = 'fb3453b5804f0d8b063d6843848a11d5c8765d3f6747d6e968a29d91c287f982';
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const resolve = file => path.isAbsolute(file) ? file : path.resolve(workspace, file);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const create = (name, data) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const update = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const freeze = file => fs.chmodSync(file, 0o444);
const candidate = (language, name) => path.join(root, 'candidate', language, name);
const math = text => Array.from(text.matchAll(/\$([^$]+)\$/g), item => item[1]).sort();
const stage = process.argv[2];

function sentences(text) {
  const result = [];
  let start = 0;
  let inMath = false;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '$' && text[i - 1] !== '\\') inMath = !inMath;
    if (inMath || !['.', '。'].includes(text[i])) continue;
    if (text[i] === '.' && /\d/.test(text[i - 1] ?? '') && /\d/.test(text[i + 1] ?? '')) continue;
    let end = i + 1;
    while (text.slice(end, end + 2) === '**') end += 2;
    result.push({ start, end, text: text.slice(start, end) });
    start = end;
    i = end - 1;
  }
  if (text.slice(start).trim()) result.push({ start, end: text.length, text: text.slice(start) });
  return result;
}

function manifest() {
  assert.equal(sha(manifestPath), expectedManifest);
  const data = read(manifestPath);
  assert.equal(data.proseBlocks, 17);
  assert.equal(data.sourceQuestions, 0);
  assert.deepEqual(data.figures, ['fig-156', 'fig-157', 'fig-158', 'fig-159']);
  for (const file of [data.rawRoot, data.work, data.templateDirectory, data.sourceLesson.path, data.sourceExercises.path]) {
    assert.equal(resolve(file).startsWith(path.join(tmp, 'd475-n73-first-source-preparation') + '/'), true);
  }
  return data;
}

function inheritedEvidence() {
  const d450 = path.join(tmp, 'd450-source193-raw156157-first-independent-review/report.json');
  const d463 = path.join(tmp, 'd463-source158159-first-independent-figure-review/report.json');
  assert.equal(sha(d450), 'd1a88578fd29c4f7c4f06b94e5542f2337d13c0aec6220e534900c56a266c1bf');
  assert.equal(sha(d463), '4dc531a57d5c023a9109a2779791961f0baf9b9f5674e3a8f693198337f3b832');
  const first = read(d450);
  const second = read(d463);
  const figures = first.figures.map(figure => ({
    id: figure.id,
    RAW: { status: figure.RAW.status, sha256: figure.RAW.sha256 },
    SVG: { status: figure.SVG.status, sha256: figure.SVG.sha256 },
    report: bind(d450),
  }));
  for (const number of [158, 159]) figures.push({
    id: `fig-${number}`,
    RAW: { status: second[`RAW${number}`].status, sha256: second[`RAW${number}`].sha256 },
    SVG: { status: second[`SVG${number}`].status, sha256: second[`SVG${number}`].sha256 },
    report: bind(d463),
  });
  return figures;
}

function copyInputs(data) {
  const sourceFiles = [data.sourceLesson, data.sourceExercises].map(item => {
    const actual = bind(resolve(item.path));
    assert.equal(actual.sha256, item.sha256);
    return actual;
  });
  const templates = names.map(name => bind(path.join(resolve(data.templateDirectory), name)));
  const copies = [];
  for (const language of ['zh', 'en']) {
    fs.mkdirSync(path.join(root, 'candidate', language), { recursive: true });
    for (const name of names) {
      const from = path.join(resolve(data.templateDirectory), name);
      const to = candidate(language, name);
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      copies.push({ language, copied_from: from, ...bind(to) });
    }
  }
  create('inputs-before.json', {
    schema: 'n73-first-bilingual-text-author/inputs-before@1',
    manifest: bind(manifestPath),
    resolved_paths: {
      rawRoot: resolve(data.rawRoot), work: resolve(data.work), templateDirectory: resolve(data.templateDirectory),
      sourceLesson: resolve(data.sourceLesson.path), sourceExercises: resolve(data.sourceExercises.path),
      fullSource: data.projections.map(item => ({ ...item.fullSource, path: resolve(item.fullSource.path) })),
    },
    source_files: sourceFiles,
    templates,
    initial_byte_identical_candidate_copies: copies,
    copy_policy: 'Each of three existing d475 templates is copied once for each language; no assemble/adapt-prepare/native replay.',
    inherited_text_evidence_bindings_only: data.inputs.filter(item => /\/report\.json$/.test(item.path)).map(item => ({ ...item, path: resolve(item.path) })),
    inherited_body_status: data.scopedBodySource,
    inherited_whole_source_statuses: { SOURCE193: data.SOURCE193, SOURCE194: data.SOURCE194, SOURCE195: data.SOURCE195 },
    inherited_faithful_figure_evidence: inheritedEvidence(),
    figure_evidence_policy: 'Only frozen verdict/hash metadata inherited; no original/candidate image or SVG bytes are opened in this author batch.',
    primary_science_reference: {
      url: 'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection',
      access: 'cloak-fetch rendered text with bounded critical-angle/fiber excerpts; no image payload',
      purpose: 'Separate modern domain clarifications; not source replacements or an independent SCI verdict.',
    },
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false },
    historical_FAIL_HOLD_preserved: true,
    mode: '0444',
  });
  freeze(path.join(root, 'inputs-before.json'));
  console.log(JSON.stringify({ inputs_before: bind(path.join(root, 'inputs-before.json')), copies: 6, images: 0 }, null, 2));
}

function compose(data) {
  const ledger = read(path.join(root, 'inputs-before.json'));
  assert.equal(fs.statSync(path.join(root, 'inputs-before.json')).mode & 0o777, 0o444);
  const manuscript = read(path.join(root, 'author-manuscript.json'));
  const original = read(path.join(resolve(data.templateDirectory), 'lesson.template.json'));
  assert.equal(manuscript.blocks.length, 9);
  const mappings = [];
  for (const language of ['zh', 'en']) {
    const lesson = read(candidate(language, names[0]));
    lesson.language = language;
    lesson.title = manuscript.titles[language];
    lesson.section_breaks = [];
    lesson.authoring_status = 'FIRST-AUTHOR-ONLY-SCI-ZHEN-FIG-DISPLAY-PENDING';
    lesson.modern_clarifications = manuscript.clarifications.map(item => ({ ...item, text: item[language] }));
    lesson.prose.forEach((block, index) => {
      const source = original.source.data.prose[index];
      if (block.kind === 'p') {
        const authored = manuscript.blocks.find(item => item.index === index);
        assert.ok(authored);
        const units = sentences(source.text);
        assert.equal(units.length, authored.units.length, `Source-sentence count at /prose/${index}`);
        let offset = 0;
        block.text = authored.groups.map(count => {
          const group = authored.units.slice(offset, offset + count);
          offset += count;
          return group.map(item => item[language]).join('\n');
        }).join('\n\n');
        assert.equal(offset, units.length);
        block.changes = ['clarity', 'layout', ...(language === 'en' ? ['translation'] : []), ...(authored.clarifications?.length ? ['modern-clarification'] : [])];
        block.modern_clarification_refs = authored.clarifications ?? [];
        assert.deepEqual(math(block.text), math(source.text), `Unregistered source-math change at ${language}/prose/${index}`);
        for (const token of math(block.text)) assert.equal(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/u.test(token), false);
        if (language === 'zh') units.forEach((unit, position) => mappings.push({
          id: `n73-b${index + 1}-s${position + 1}`,
          source_lesson_sha256: original.source.sha256,
          source_block_pointer: `/prose/${index}`,
          source_refs: source.source_refs,
          source_character_span: [unit.start, unit.end],
          source_text: unit.text,
          zh: authored.units[position].zh,
          en: authored.units[position].en,
          clarification_refs: authored.units[position].clarification_refs ?? [],
        }));
      } else if (block.kind === 'cap') {
        const number = block.label.match(/\d+/)[0];
        block.label = language === 'zh' ? `图 ${number}` : `Figure ${number}`;
        block.text = block.label;
        block.changes = block.text === block.source_text ? [] : ['layout', ...(language === 'en' ? ['translation'] : [])];
      } else if (block.kind === 'fig') {
        block.label = manuscript.figures.find(item => item.id === block.id).labels[language];
        block.changes = [];
        block.label_changes = language === 'en' ? ['translation'] : [];
      }
      assert.equal(block.source_text, source.text);
      assert.deepEqual(block.source_refs, source.source_refs);
      assert.deepEqual([block.kind, block.id, block.printed_page], [source.kind, source.id, source.printed_page]);
    });
    lesson.figures = lesson.figures.map(item => ({ ...item, label: manuscript.figures.find(figure => figure.id === item.id).labels[language] }));
    assert.deepEqual(lesson.source, original.source);
    assert.deepEqual(lesson.errata, original.errata);
    update(candidate(language, names[0]), lesson);
    const exercises = read(candidate(language, names[1]));
    exercises.language = language;
    exercises.authoring_status = 'FIRST-AUTHOR-ONLY-ZERO-ORIGINAL-QUESTIONS';
    assert.equal(exercises.count, 0);
    assert.deepEqual(exercises.exercises, []);
    update(candidate(language, names[1]), exercises);
    const figures = read(candidate(language, names[2]));
    figures.language = language;
    figures.authoring_status = 'FOUR-MODERN-FIGURES-PENDING-SOURCE-HOLDS-RETAINED';
    figures.figures.forEach(figure => {
      const brief = manuscript.figures.find(item => item.id === figure.id);
      const evidence = ledger.inherited_faithful_figure_evidence.find(item => item.id === figure.id);
      assert.equal(figure.source.png.sha256, evidence.RAW.sha256);
      assert.equal(figure.source.svg.sha256, evidence.SVG.sha256);
      figure.label = brief.labels[language];
      figure.text_brief = brief[language];
      figure.modern_figure_status = 'PENDING';
      figure.inherited_faithful_source_review = evidence;
      figure.spec_is_planned_path_only = true;
    });
    update(candidate(language, names[2]), figures);
  }
  create('source-sentence-mapping.json', {
    schema: 'n73-first-bilingual-text-author/source-sentence-mapping@1',
    source_lesson: { path: ledger.resolved_paths.sourceLesson, sha256: original.source.sha256 },
    source_sentence_count: mappings.length,
    source_sentences: mappings,
    source_ordered_objects: 17,
    source_prose_blocks: 9,
    source_objects: original.source.data.prose.flatMap((block, index) => block.kind === 'p' ? [] : [{
      source_block_pointer: `/prose/${index}`, kind: block.kind, id: block.id, source_text: block.text, source_refs: block.source_refs,
      disposition: block.kind === 'fig' ? 'Retained in source order; modern figure pending; faithful verdict inherited, not re-reviewed.' : 'Caption retained and localized.',
    }]),
    modern_clarifications: manuscript.clarifications,
    original_questions: 0,
    source_math_multisets_unchanged_per_block_per_language: true,
    CJK_punctuation_in_math: false,
    no_source_errata_registered: true,
    SCI_ZHEN_independent_review: 'pending',
  });
  console.log(JSON.stringify({ mapping: bind(path.join(root, 'source-sentence-mapping.json')), source_sentences: mappings.length, six_candidates_authored: true }, null, 2));
}

function flow() {
  const manuscript = read(path.join(root, 'author-manuscript.json'));
  const tool = path.join(workspace, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
  const require = createRequire(tool);
  const { sectionBreakIndices } = require('./htmlfrag.js');
  const records = [];
  for (const language of ['zh', 'en']) {
    const file = candidate(language, names[0]);
    const stdout = path.join(root, `prose-flow-${language}.txt`);
    assert.equal(fs.existsSync(stdout), false, 'First prose-flow only; do not rerun.');
    const input = bind(file);
    const result = spawnSync(process.execPath, [tool, file], { cwd: workspace, encoding: 'utf8' });
    fs.writeFileSync(stdout, result.stdout, { flag: 'wx' });
    const receipt = { language, invocation_count: 1, command: [process.execPath, tool, file], input, stdout: bind(stdout), exitCode: result.status, stderr: result.stderr };
    if (result.status !== 0) {
      create(`prose-flow-${language}.first-failure.json`, receipt);
      freeze(path.join(root, `prose-flow-${language}.first-failure.json`));
      throw new Error(`First ${language} prose-flow failed; receipt preserved.`);
    }
    const boundaries = result.stdout.split('\n').filter(line => line.startsWith('    break: ')).map(line => JSON.parse(line.slice(11)));
    const selected = manuscript.break_starts[language].map(start => {
      const matches = boundaries.filter(item => item.after.startsWith(start));
      assert.equal(matches.length, 1, 'Select a unique tool-derived before/after pair.');
      return matches[0];
    });
    const lesson = read(file);
    lesson.section_breaks = selected;
    const resolved = sectionBreakIndices(lesson.prose, selected);
    update(file, lesson);
    records.push({ ...receipt, selected_before_after_from_tool_output: selected, resolved_by_existing_helper: resolved, final_candidate: bind(file), only_section_breaks_changed_after_first_flow: true });
  }
  create('prose-flow-bindings.json', { schema: 'n73-first-bilingual-text-author/prose-flow-bindings@1', records, prose_flow_reruns: 0, integer_boundaries_authored: 0 });
  console.log(JSON.stringify({ first_prose_flow: records.map(item => ({ language: item.language, exitCode: item.exitCode, breaks: item.selected_before_after_from_tool_output.length })) }, null, 2));
}

function finish(data) {
  const ledger = read(path.join(root, 'inputs-before.json'));
  const mapping = read(path.join(root, 'source-sentence-mapping.json'));
  const flow = read(path.join(root, 'prose-flow-bindings.json'));
  const candidates = ['zh', 'en'].flatMap(language => names.map(name => ({ language, ...bind(candidate(language, name)) })));
  for (const item of [ledger.manifest, ...ledger.source_files, ...ledger.templates]) assert.equal(sha(item.path), item.sha256);
  assert.equal(mapping.source_sentence_count, 40);
  assert.equal(mapping.source_objects.length, 8);
  for (const receipt of flow.records) {
    assert.equal(receipt.invocation_count, 1);
    assert.equal(receipt.exitCode, 0);
    assert.equal(sha(receipt.stdout.path), receipt.stdout.sha256);
    assert.equal(sha(receipt.final_candidate.path), receipt.final_candidate.sha256);
  }
  create('actual-opens.json', {
    schema: 'n73-first-bilingual-text-author/actual-opens@1',
    batch: 'd476', same_existing_finite_helper: true,
    inherited_context_images: 23, events: [], new_images: 0, cumulative_context_images: 23, context_limit: 24, reset: false,
    ancestry: { original_inherited: 7, d447: 0, d450: 7, d464: 3, d463: 6 },
    source_image_candidate_image_SVG_native_preview_or_screenshot_opens: 0,
    text_inputs: [ledger.manifest, ...ledger.source_files, ...ledger.templates],
    inherited_faithful_figure_evidence_bindings: ledger.inherited_faithful_figure_evidence.map(item => item.report),
    text_read_scope: 'New d475 n73 source lesson, empty exercises, three templates, manuscript, candidate/flow files and frozen review verdict metadata. No source-page text re-review or image read.',
    primary_science_text_reference: ledger.primary_science_reference,
    historical_FAIL_HOLD_preserved: true,
  });
  create('report.json', {
    schema: 'n73-first-bilingual-text-author/report@1',
    ticket: 'STEMROBIN-181', batch: 'd476', lesson: 'phy10-c2-s2-n73',
    status: 'FIRST-BILINGUAL-TEXT-AUTHOR-FROZEN-SCI-ZHEN-FIG-DISPLAY-PENDING',
    first_author_only: true, independent_SCI_or_ZHEN_verdict: 'pending',
    inputs_before: bind(path.join(root, 'inputs-before.json')),
    resolved_paths_from_manifest: ledger.resolved_paths,
    source_ordered_objects: 17, source_prose_blocks: 9, source_figures: 4, source_captions: 4, original_questions: 0,
    source_sentence_mapping: bind(path.join(root, 'source-sentence-mapping.json')), source_sentence_count: 40,
    six_candidate_templates: candidates,
    source_snapshots_refs_object_order_original_math_and_SHA_retained: true,
    original_math_multiset_checks: 'Performed once during composition for each source-bound block/language; no source formula replacements.',
    original_approximate_examples_not_recomputed_or_replaced: ['water n=1.33, 48 degrees 35 minutes', 'glass n=1.5, 41 degrees 50 minutes', 'diamond n=2.4, 24 degrees 40 minutes; air is second medium'],
    modern_clarifications: mapping.modern_clarifications,
    clarification_policy: 'All explicitly not_source_quote and not_source_erratum; await independent SCI/ZHEN. Original inclusive wording at the critical boundary is separately mapped, not a silently rewritten source or registered erratum.',
    source_flow: bind(path.join(root, 'prose-flow-bindings.json')),
    prose_flow_invocations: { zh: 1, en: 1 },
    section_break_policy: 'Only exact before/after objects copied from first tool output; no authored integer indices.',
    faithful_source_figure_verdicts_inherited_not_re_reviewed: ledger.inherited_faithful_figure_evidence,
    modern_figures: data.figures.map(id => ({ id, status: 'pending', spec_created: false, display_reviewed: false })),
    scoped_body_source_inherited: ledger.inherited_body_status,
    body_text_evidence_bindings_inherited_without_source_re_review: ledger.inherited_text_evidence_bindings_only,
    whole_source_statuses_retained: ledger.inherited_whole_source_statuses,
    SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', fullcard: false, completeCard: false,
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false },
    actual_opens: bind(path.join(root, 'actual-opens.json')),
    historical_FAIL_HOLD_bytes_preserved: true,
    incomplete_n74_and_prior_n72_excluded: true,
    no_whole_SOURCE_RAW_SVG_modern_FIG_DISPLAY_or_card_PASS_claim: true,
    no_assemble_adaptprepare_native_finalize_render_publish_tests_answers_choices_paid_DB_git_index_meter_newworker_worktree: true,
    source_d475_and_canonical_writes: 0,
    outputs_only_under: root,
    freeze_mode: '0444',
  });
  const files = ['author-tools.mjs', 'author-manuscript.json', 'inputs-before.json', 'source-sentence-mapping.json', 'prose-flow-zh.txt', 'prose-flow-en.txt', 'prose-flow-bindings.json', 'actual-opens.json', 'report.json', ...candidates.map(item => path.relative(root, item.path))];
  for (const file of files) freeze(path.join(root, file));
  create('author-freeze.json', {
    schema: 'n73-first-bilingual-text-author/author-freeze@1', batch: 'd476', frozen: true, mode: '0444',
    files: files.map(file => ({ ...bind(path.join(root, file)), mode: '0444' })),
    status: 'FIRST-AUTHOR-ONLY-SCI-ZHEN-FOUR-MODERN-FIGURES-DISPLAY-PENDING',
    faithful_verdicts_inherited: ledger.inherited_faithful_figure_evidence,
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false },
    fullcard: false, historical_FAIL_HOLD_preserved: true, self_hash_excluded_to_avoid_cycle: true,
  });
  freeze(path.join(root, 'author-freeze.json'));
  for (const file of [...files, 'author-freeze.json']) assert.equal(fs.statSync(path.join(root, file)).mode & 0o777, 0o444);
  console.log(JSON.stringify({ frozen_files: [...files, 'author-freeze.json'].map(file => bind(path.join(root, file))), context_images: 23, new_images: 0 }, null, 2));
}

try {
  const data = manifest();
  if (stage === 'copy-inputs') copyInputs(data);
  else if (stage === 'compose') compose(data);
  else if (stage === 'flow') flow();
  else if (stage === 'freeze') finish(data);
  else throw new Error('Unsupported stage.');
} catch (error) {
  const file = path.join(root, `${stage}.first-failure.json`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `${JSON.stringify({ stage, message: error.message, first_failure_preserved: true, new_images: 0, context_images: 23 }, null, 2)}\n`, { flag: 'wx' });
    freeze(file);
  }
  console.error(error.message);
  process.exitCode = 1;
}
