import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const root = path.dirname(new URL(import.meta.url).pathname);
const manifestPath = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp/d445-n72-first-source-preparation/manifest.json');
const expectedManifest = 'b166d7eaf6e302bbe64fb1811e2ba187d07364ff18e547a2085ed37b2f7825c4';
const stage = process.argv[2];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const resolve = value => path.isAbsolute(value) ? value : path.resolve(workspace, value);
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const overwrite = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const binding = file => ({ path: file, sha256: sha(fs.readFileSync(file)), bytes: fs.statSync(file).size });
const freeze = file => fs.chmodSync(file, 0o444);
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'];
const candidatePath = (language, name) => path.join(root, 'candidate', language, name);

function loadManifest() {
  const bytes = fs.readFileSync(manifestPath);
  if (sha(bytes) !== expectedManifest) throw new Error('Manifest identity mismatch.');
  const manifest = JSON.parse(bytes);
  for (const value of [manifest.rawRoot, manifest.work, manifest.templateDirectory, manifest.sourceLesson.path, manifest.sourceExercises.path]) {
    if (!resolve(value).startsWith(`${workspace}/.intentfold/tickets/STEMROBIN-181/tmp/d445-`)) {
      throw new Error('Resolved preparation path is outside the authorized preparation.');
    }
  }
  return manifest;
}

function sourceSentences(text) {
  const units = [];
  let start = 0;
  let math = false;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '$' && text[i - 1] !== '\\') math = !math;
    if (math || !['.', '。'].includes(text[i])) continue;
    if (text[i] === '.' && /\d/.test(text[i - 1] ?? '') && /\d/.test(text[i + 1] ?? '')) continue;
    let end = i + 1;
    while (text.slice(end, end + 2) === '**') end += 2;
    units.push({ start, end, text: text.slice(start, end) });
    start = end;
    i = end - 1;
  }
  if (text.slice(start).trim()) units.push({ start, end: text.length, text: text.slice(start) });
  return units;
}

function copyInputs(manifest) {
  const directory = resolve(manifest.templateDirectory);
  const sourceFiles = [manifest.sourceLesson, manifest.sourceExercises].map(entry => {
    const actual = binding(resolve(entry.path));
    if (actual.sha256 !== entry.sha256) throw new Error('Source input identity mismatch.');
    return actual;
  });
  const templates = names.map(name => binding(path.join(directory, name)));
  const copies = [];
  for (const language of ['zh', 'en']) {
    fs.mkdirSync(path.join(root, 'candidate', language), { recursive: true });
    for (const name of names) {
      const destination = candidatePath(language, name);
      fs.copyFileSync(path.join(directory, name), destination, fs.constants.COPYFILE_EXCL);
      copies.push({ language, ...binding(destination), copied_from: path.join(directory, name) });
    }
  }
  const ledger = {
    schema: 'n72-first-bilingual-author/inputs-before@1',
    ticket: 'STEMROBIN-181',
    manifest: binding(manifestPath),
    resolved_paths: {
      rawRoot: resolve(manifest.rawRoot),
      work: resolve(manifest.work),
      templateDirectory: directory,
      sourceLesson: resolve(manifest.sourceLesson.path),
      sourceExercises: resolve(manifest.sourceExercises.path),
      fullSource: manifest.projections.map(entry => ({ ...entry.fullSource, path: resolve(entry.fullSource.path) })),
    },
    path_policy: 'Only actual manifest path fields are workspace-resolved; status strings are not paths.',
    source_files: sourceFiles,
    input_templates: templates,
    initial_byte_identical_candidate_copies: copies,
    template_copy_policy: 'Three input templates copied once for each of ZH and EN, giving six candidates; no adaptation preparation replay.',
    source_scope: { proseBlocks: manifest.proseBlocks, figures: manifest.figures, originalQuestions: manifest.sourceQuestions },
    historical_holds: { SOURCE188: 'HOLD', SOURCE191: 'HOLD', RAW155: 'HOLD', SVG155: 'HOLD' },
    image_opens_before: 7,
    new_images: 0,
    same_context: true,
    budget_reset: false,
    immutable_source_content_policy: 'Source snapshots, source_text, source_refs, source hashes and source figure bindings are retained.',
    record_freeze_mode: '0444',
  };
  const file = path.join(root, 'inputs-before.json');
  write(file, ledger);
  freeze(file);
  console.log(JSON.stringify({ inputs_before: binding(file), copied_candidates: copies.length, newImages: 0 }, null, 2));
}

function compose(manifest) {
  const ledger = read(path.join(root, 'inputs-before.json'));
  if ((fs.statSync(path.join(root, 'inputs-before.json')).mode & 0o777) !== 0o444) throw new Error('Inputs are not frozen.');
  for (const entry of ledger.input_templates) if (binding(entry.path).sha256 !== entry.sha256) throw new Error('Preparation template changed.');
  const manuscript = read(path.join(root, 'author-manuscript.json'));
  const base = read(path.join(resolve(manifest.templateDirectory), 'lesson.template.json'));
  const original = base.source.data;
  if (original.prose.length !== 29 || manuscript.blocks.length !== 18) throw new Error('Unexpected source/manuscript coverage.');
  const mapping = [];
  for (const language of ['zh', 'en']) {
    const lesson = read(candidatePath(language, 'lesson.template.json'));
    lesson.language = language;
    lesson.title = manuscript.titles[language];
    lesson.section_breaks = [];
    lesson.authoring_status = 'FIRST-AUTHOR-ONLY-SCI-ZHEN-FIG-DISPLAY-PENDING';
    lesson.modern_clarifications = manuscript.clarifications.map(item => ({ ...item, text: item[language] }));
    for (let blockIndex = 0; blockIndex < lesson.prose.length; blockIndex += 1) {
      const block = lesson.prose[blockIndex];
      const sourceBlock = original.prose[blockIndex];
      if (block.kind === 'p') {
        const authored = manuscript.blocks.find(item => item.index === blockIndex);
        if (!authored) throw new Error(`Missing prose block ${blockIndex}.`);
        const sourceUnits = sourceSentences(sourceBlock.text);
        if (sourceUnits.length !== authored.units.length) throw new Error(`Sentence coverage mismatch ${blockIndex}: source=${sourceUnits.length}, authored=${authored.units.length}.`);
        let offset = 0;
        const paragraphs = authored.groups.map(count => {
          const group = authored.units.slice(offset, offset + count);
          offset += count;
          return group.map(unit => unit[language]).join('\n');
        });
        if (offset !== authored.units.length) throw new Error(`Invalid paragraph groups for ${blockIndex}.`);
        block.text = paragraphs.join('\n\n');
        block.changes = ['clarity', 'layout', ...(language === 'en' ? ['translation'] : []), ...(authored.clarifications?.length ? ['modern-clarification'] : [])];
        block.modern_clarification_refs = authored.clarifications ?? [];
        if (language === 'zh') {
          for (let unitIndex = 0; unitIndex < sourceUnits.length; unitIndex += 1) {
            mapping.push({
              id: `n72-b${blockIndex + 1}-s${unitIndex + 1}`,
              source_lesson_sha256: base.source.sha256,
              source_block_pointer: `/prose/${blockIndex}`,
              source_refs: sourceBlock.source_refs,
              source_character_span: [sourceUnits[unitIndex].start, sourceUnits[unitIndex].end],
              source_text: sourceUnits[unitIndex].text,
              zh: authored.units[unitIndex].zh,
              en: authored.units[unitIndex].en,
              clarification_refs: authored.units[unitIndex].clarification_refs ?? [],
            });
          }
        }
      } else if (block.kind === 'cap') {
        const number = block.label.match(/\d+/)?.[0];
        block.text = language === 'zh' ? `图 ${number}` : `Figure ${number}`;
        block.label = language === 'zh' ? `图 ${number}` : `Figure ${number}`;
        block.changes = block.text === block.source_text ? [] : ['layout', ...(language === 'en' ? ['translation'] : [])];
      } else if (block.kind === 'fig') {
        const authored = manuscript.figures.find(item => item.id === block.id);
        block.label = authored.labels[language];
        block.changes = [];
        block.label_changes = language === 'en' ? ['translation'] : [];
      }
      if (block.source_text !== sourceBlock.text) throw new Error(`source_text drift ${blockIndex}.`);
      if (JSON.stringify(block.source_refs) !== JSON.stringify(sourceBlock.source_refs)) throw new Error(`source_refs drift ${blockIndex}.`);
    }
    lesson.figures = lesson.figures.map(entry => ({ ...entry, label: manuscript.figures.find(item => item.id === entry.id).labels[language] }));
    if (JSON.stringify(lesson.source) !== JSON.stringify(base.source)) throw new Error('Embedded lesson source drift.');
    overwrite(candidatePath(language, 'lesson.template.json'), lesson);
    const exercises = read(candidatePath(language, 'exercises.template.json'));
    exercises.language = language;
    exercises.authoring_status = 'FIRST-AUTHOR-ONLY-ZERO-ORIGINAL-QUESTIONS';
    if (exercises.count !== 0 || exercises.exercises.length !== 0) throw new Error('Original exercises changed.');
    overwrite(candidatePath(language, 'exercises.template.json'), exercises);
    const figures = read(candidatePath(language, 'figures.template.json'));
    figures.language = language;
    figures.authoring_status = 'SIX-FIGURES-PENDING-SEPARATE-MODERN-FIGURE-AUTHOR';
    for (const figure of figures.figures) {
      const authored = manuscript.figures.find(item => item.id === figure.id);
      figure.label = authored.labels[language];
      figure.text_brief = authored[language];
      figure.source_review = 'NOT_PERFORMED-BY-THIS-TEXT-AUTHOR';
      figure.modern_figure_status = 'PENDING';
      figure.spec_is_planned_path_only = true;
    }
    overwrite(candidatePath(language, 'figures.template.json'), figures);
  }
  const objectMapping = original.prose.flatMap((block, index) => block.kind === 'p' ? [] : [{
    source_block_pointer: `/prose/${index}`,
    kind: block.kind, id: block.id, source_refs: block.source_refs, source_text: block.text,
    disposition: block.kind === 'fig' ? 'Retained at original position; modern figure creation/review pending.' : 'Caption retained and localized without changing source snapshot.',
  }]);
  const file = path.join(root, 'source-sentence-mapping.json');
  write(file, {
    schema: 'n72-first-bilingual-author/source-sentence-mapping@1',
    source: { ...base.source, data: undefined },
    source_sentences: mapping,
    source_objects: objectMapping,
    modern_clarifications: manuscript.clarifications,
    source_sentence_count: mapping.length,
    source_prose_block_count: 29,
    source_object_count: objectMapping.length,
    original_questions: 0,
    no_source_errata_registered: true,
    author_only_SCI_ZHEN_pending: true,
  });
  console.log(JSON.stringify({ source_sentence_mapping: binding(file), source_sentences: mapping.length, original_objects: objectMapping.length, six_candidates_authored: true }, null, 2));
}

function flow() {
  const manuscript = read(path.join(root, 'author-manuscript.json'));
  const script = path.join(workspace, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
  const records = [];
  for (const language of ['zh', 'en']) {
    const file = candidatePath(language, 'lesson.template.json');
    const input = binding(file);
    const result = spawnSync(process.execPath, [script, file], { encoding: 'utf8', cwd: workspace });
    const output = path.join(root, `prose-flow-${language}.txt`);
    fs.writeFileSync(output, result.stdout, { flag: 'wx' });
    const receipt = { language, command: [process.execPath, script, file], input, stdout: binding(output), exitCode: result.status, stderr: result.stderr, invocation_count: 1 };
    if (result.status !== 0) {
      write(path.join(root, `prose-flow-${language}.first-failure.json`), receipt);
      freeze(path.join(root, `prose-flow-${language}.first-failure.json`));
      throw new Error(`First ${language} prose_flow failed; receipt retained.`);
    }
    const boundaries = result.stdout.split('\n').filter(line => line.startsWith('    break: ')).map(line => JSON.parse(line.slice('    break: '.length)));
    const selected = manuscript.break_starts[language].map(start => {
      const matches = boundaries.filter(boundary => boundary.after.startsWith(start));
      if (matches.length !== 1) throw new Error(`Nonunique tool-derived concept boundary ${language}: ${start}`);
      return matches[0];
    });
    const lesson = read(file);
    lesson.section_breaks = selected;
    const require = createRequire(path.join(workspace, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'));
    const { sectionBreakIndices } = require('./htmlfrag.js');
    const resolved = sectionBreakIndices(lesson.prose, selected);
    overwrite(file, lesson);
    records.push({ ...receipt, selected_before_after_from_tool_output: selected, resolved_by_existing_helper: resolved, final_candidate: binding(file), only_section_breaks_changed_after_first_flow: true });
  }
  write(path.join(root, 'prose-flow-bindings.json'), { schema: 'n72-first-bilingual-author/prose-flow-bindings@1', records, no_integer_boundaries_authored: true, no_prose_flow_reruns: true });
  console.log(JSON.stringify({ first_prose_flow_invocations: records.map(item => ({ language: item.language, exitCode: item.exitCode, selected_breaks: item.selected_before_after_from_tool_output.length })) }, null, 2));
}

try {
  const manifest = loadManifest();
  if (stage === 'copy-inputs') copyInputs(manifest);
  else if (stage === 'compose') compose(manifest);
  else if (stage === 'flow') flow();
  else throw new Error('Unknown stage.');
} catch (error) {
  const receipt = path.join(root, `${stage}.first-failure.json`);
  if (!fs.existsSync(receipt)) {
    write(receipt, { stage, message: error.message, historical_fail_retained: true, new_images: 0 });
    freeze(receipt);
  }
  console.error(error.message);
  process.exitCode = 1;
}
