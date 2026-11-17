import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const tmp = '.intentfold/tickets/STEMROBIN-184/tmp';
const sourceRoot = `${tmp}/production-assembly10c114-heading-fixed/10c`;
const modernRoot = `${tmp}/production-modern10c114`;
const lessonId = 'ana10-c8-s2-n114';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const inputDir = path.join(root, 'inputs');
fs.mkdirSync(inputDir, { recursive: true });
const inputs = [];
const objects = {};
function read(name, relative, expected = null, snapshot = true) {
  const absolute = path.isAbsolute(relative) ? relative : path.join(cwd, relative);
  const bytes = fs.readFileSync(absolute);
  const actual = sha(bytes);
  if (expected && actual !== expected) throw new Error(`Frozen input mismatch: ${relative}`);
  const frozenPath = snapshot ? path.join(inputDir, name) : null;
  if (frozenPath) fs.writeFileSync(frozenPath, bytes, { flag: 'wx' });
  inputs.push({ path: absolute, bytes: bytes.length, sha256: actual, expected_sha256: expected, frozen_path: frozenPath });
  if (name.endsWith('.json')) objects[name] = JSON.parse(bytes.toString('utf8'));
  return bytes;
}
read('source.lesson.json', `${sourceRoot}/lessons/${lessonId}/lesson.json`, '9c730752ec15f8b8619c8a5b489d7a5a245eb3505485026f5b0f28745ed2c687');
read('source.exercises.json', `${sourceRoot}/lessons/${lessonId}/exercises.json`, '6d5d0a261fb86cc0b15fb2020c6ac520556720275a06ed3f5cc721ad164344bb');
read('author.manifest.json', `${modernRoot}/author/manifest.json`, '1f6cf9dec76a3836e14b81867ad5760045bfb6fc6514017380e88eb1e3de96ed');
read('modern.lesson.template.json', `${modernRoot}/author/lesson.template.json`, '8bd9db3b39d328216d8c9a6f8835b3bbdec60dfa49593da2f014249075cb0efc');
read('modern.exercises.template.json', `${modernRoot}/author/exercises.template.json`, '71c677dc5cdcc944b86f9aec6915100f0d732ed924d350709e9aa21fa73c0369');
read('modern.figures.template.json', `${modernRoot}/author/figures.template.json`, 'a660d637c5fbaf254fda90def2e802d9e00965328e7a0f7ebdc2ab6b80d2f9a6');
read('source.page0171.json', `${sourceRoot}/pages/0171/page.json`, 'e663915ba681f108e3de8510302b31d25a96cbaaa98aa492eaea0523ec9bf36a');
const flowText = read('first-flow.stdout.txt', `${modernRoot}/first-flow/stdout.txt`, '6d24f4e95cd50221a90fdf5571cb8ca4e737dc421061e89e5bb3fbe0837d3519').toString('utf8');
read('first-flow.command.json', `${modernRoot}/first-flow/command.json`, 'd10a42e0f52d714ccc7f8916afd4a28b7cd89e6fc464f4eaf581961afff704a2');
read('first-flow.stderr.txt', `${modernRoot}/first-flow/stderr.txt`, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
read('readme.md', '.intentfold/readme.md');
read('charter.product.md', '.intentfold/charter/product.md');
read('charter.engineering.md', '.intentfold/charter/engineering.md');
read('charter.operations.md', '.intentfold/charter/operations.md');
read('lesson.SKILL.md', '.claude/skills/ld-s10y-lesson/SKILL.md');
read('edition-text-contract.md', '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md');
read('intentfold.SKILL.md', '/Users/yong/.agents/skills/intentfold/SKILL.md');
const page = objects['source.page0171.json'];
read('source.pdf', `ssot-resources/soviet10year-textbooks/sources/soviet10years/${page.meta.source.pdf}`, page.meta.source.pdf_sha256, false);
const source = objects['source.lesson.json'];
const modern = objects['modern.lesson.template.json'];
const sourceExercises = objects['source.exercises.json'];
const modernExercises = objects['modern.exercises.template.json'];
const modernFigures = objects['modern.figures.template.json'];
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const failures = [];
function observe(name, result) {
  if (!result) failures.push(name);
  return result;
}
const original = '$\\exp_a(x)=\\exp_a(x\\cdot\\ln a)$';
const corrected = '$\\exp_a(x)=\\exp(x\\cdot\\ln a)$';
const enumMap = new Map([['\u0430)', 'a)'], ['\u0431)', 'b)'], ['\u0432)', 'c)'], ['\u0433)', 'd)']]);
const math = text => Array.from(text.matchAll(/\$[^$]*\$/gu), match => match[0]);
const noOutsideWhitespace = text => text.split(/(\$[^$]*\$)/u)
  .map(part => part.startsWith('$') ? part : part.replace(/\s+/gu, '')).join('');
function allowedSourceText(text, index) {
  let result = text;
  if (index >= 18 && index <= 21) {
    for (const [from, to] of enumMap) result = result.replaceAll(from, to);
  }
  if (index === 27) result = result.replace(original, corrected);
  return result;
}
const identityFields = Object.keys(source).filter(key => key !== 'prose');
const identity = Object.fromEntries(identityFields.map(key => [key, {
  source: source[key], modern: modern[key],
  identical: observe(`lesson.${key}`, equal(source[key], modern[key])),
}]));
observe('prose inventory remains 28', source.prose.length === 28 && modern.prose.length === 28);
observe('embedded source lesson literal', equal(modern.source.data, source));
observe('embedded source path', modern.source.path === `lessons/${lessonId}/lesson.json`);
observe('embedded source hash', modern.source.sha256 === inputs[0].sha256);
const comparisons = source.prose.map((entry, index) => {
  const target = modern.prose[index];
  const expectedText = allowedSourceText(entry.text, index);
  const invariants = Object.fromEntries(Object.keys(entry).filter(key => key !== 'text')
    .map(key => [key, observe(`prose[${index}].${key}`, equal(entry[key], target[key]))]));
  const sourceMath = math(entry.text);
  const modernMath = math(target.text);
  const expectedMath = math(expectedText);
  const sourceTextLiteral = observe(`prose[${index}].source_text`, target.source_text === entry.text);
  const mathLiteral = observe(`prose[${index}].math`, equal(expectedMath, modernMath));
  const wording = observe(`prose[${index}].wording`, noOutsideWhitespace(expectedText) === noOutsideWhitespace(target.text));
  const changesExpected = entry.text === target.text ? [] : index === 27 ? ['layout', 'math-correction'] : ['layout'];
  const annotation = observe(`prose[${index}].changes`, equal(changesExpected, target.changes)
    && equal(target.numeric_changes, []) && equal(target.historical_entities, []));
  return {
    index, target: `lesson.prose[${index}]`, source_refs: entry.source_refs,
    source: entry, modern: target,
    source_text_utf8: { bytes: Buffer.byteLength(entry.text), sha256: sha(Buffer.from(entry.text)) },
    modern_text_utf8: { bytes: Buffer.byteLength(target.text), sha256: sha(Buffer.from(target.text)) },
    source_math: sourceMath, modern_math: modernMath, expected_math: expectedMath,
    literal_source_text_preserved: sourceTextLiteral, immutable_fields: invariants,
    exact_math_after_only_registered_replacement: mathLiteral,
    wording_preserved_after_only_authorized_enum_and_outside_math_whitespace: wording,
    change_annotations_match: annotation,
  };
});
const paragraphs = [];
for (const line of flowText.split('\n')) {
  const heading = /^\[(\d+)\] (.*)$/u.exec(line);
  if (heading) {
    paragraphs.push({ reported_index: Number(heading[1]), lines: [heading[2]], boundary: null });
  } else if (line.startsWith('    break: ')) {
    paragraphs.at(-1).boundary = JSON.parse(line.slice('    break: '.length));
  } else if (line !== '' || paragraphs.at(-1)?.lines.at(-1) !== '') {
    if (paragraphs.length) paragraphs.at(-1).lines.push(line);
  }
}
for (const entry of paragraphs) {
  if (entry.lines.at(-1) === '') entry.lines.pop();
  entry.text = entry.lines.join('\n');
  delete entry.lines;
}
const boundaries = modern.section_breaks.map((boundary, index) => {
  const matches = paragraphs.map((entry, position) => ({ entry, position }))
    .filter(({ entry }) => equal(entry.boundary, boundary));
  const match = matches[0];
  const previous = match ? paragraphs[match.position - 1] : null;
  const adjacentExact = matches.length === 1 && previous?.text === boundary.before
    && match.entry.text === boundary.after;
  return {
    index, boundary, matching_boundary_objects: matches.length,
    reported_before_index: previous?.reported_index ?? null,
    reported_after_index: match?.entry.reported_index ?? null,
    adjacent_exact_in_actual_stdout: observe(`section_breaks[${index}]`, adjacentExact),
    method: 'Parsed saved stdout only; no prose-flow execution or inferred anchor counting.',
  };
});
observe('exactly two authored boundaries', boundaries.length === 2);
const sourceErratum = page.meta.errata.find(entry => entry.id === 'p0171-exp-base-definition');
const editionErrata = modern.errata ?? [];
const editionErratum = editionErrata.find(entry => entry.id === sourceErratum?.id);
const erratum = {
  source_record: sourceErratum,
  modern_records: editionErrata,
  source_block: page.blocks[4],
  target_source: source.prose[27],
  target_modern: modern.prose[27],
  actual_page_json_sha256: inputs.find(entry => entry.path.endsWith('/pages/0171/page.json')).sha256,
  actual_pdf: inputs.at(-1),
  original, corrected,
  registered_block: observe('registered page block', sourceErratum?.block === 'p0171#5'),
  faithful_original: observe('faithful BOTH exp_a', sourceErratum?.original === original
    && page.blocks[4].lines.join('').includes(original) && source.prose[27].text.includes(original)),
  single_record: observe('one modern erratum', editionErrata.length === 1 && Boolean(editionErratum)),
  exact_source_binding: observe('modern erratum source binding', editionErratum?.target === 'lesson.prose[27]'
    && editionErratum?.source.page === page.meta.page
    && editionErratum?.source.printed_page === page.meta.printed_page
    && editionErratum?.source.block === sourceErratum?.block
    && editionErratum?.source.sha256 === inputs.find(entry => entry.path.endsWith('/pages/0171/page.json')).sha256
    && editionErratum?.source.pdf_sha256 === inputs.at(-1).sha256
    && page.meta.source.pdf_page === 171),
  exact_replacement: observe('modern exact registered replacement', editionErratum?.original === original
    && editionErratum?.corrected === corrected && editionErratum?.reason === sourceErratum?.reason
    && source.prose[27].text.split(original).length === 2
    && modern.prose[27].text.split(corrected).length === 2
    && !modern.prose[27].text.includes(original)),
};
const exerciseIdentity = Object.fromEntries(Object.keys(sourceExercises).map(key => [key,
  observe(`exercises.${key}`, equal(sourceExercises[key], modernExercises[key])),
]));
observe('source zero exercises', equal(sourceExercises.exercises, []));
observe('modern zero exercises', equal(modernExercises.exercises, []));
observe('modern zero figures', equal(modernFigures.figures, []));
observe('source zero figures', equal(source.figures, []));
const observation = {
  role: 'One read-only text comparison supporting, not substituting for, the independent semantic judgment.',
  lesson_id: lessonId, inputs, identity, comparisons, boundaries, erratum,
  exerciseIdentity, sourceExercises, modernExercises, modernFigures,
  mechanical_comparison_failures: failures,
  unknowns_preserved: ['source-pixel fidelity not re-reviewed', 'independent erratum proof not repeated',
    'finalizer not run', 'rendering not observed', 'publication and DB not observed', 'historical UNKNOWNs untouched'],
  ledger: { scope: 'SessionB as human supplied', model_images_used: 0, lifetime_used: 0, lifetime_limit: 24,
    browser_calls: 0, crops: 0, view_image_calls: 0, generated_images: 0 },
};
fs.writeFileSync(path.join(root, 'inspection.json'), json(observation), { flag: 'wx' });
fs.writeFileSync(path.join(root, 'input-manifest.json'), json(inputs), { flag: 'wx' });
console.log(json({
  lesson_id: lessonId, input_receipts: inputs,
  immutable_lesson_fields: identity, exerciseIdentity, sourceExercises, modernExercises, modernFigures,
  erratum, boundaries, mechanical_comparison_failures: failures,
}));
for (const entry of comparisons) {
  console.log(`PROSE ${entry.index} ${entry.source_refs.join(',')}`);
  console.log(`SOURCE: ${entry.source.text}`);
  console.log(`MODERN: ${entry.modern.text}`);
  console.log(json({
    literal_source: entry.literal_source_text_preserved,
    exact_math: entry.exact_math_after_only_registered_replacement,
    wording: entry.wording_preserved_after_only_authorized_enum_and_outside_math_whitespace,
    immutable_fields: entry.immutable_fields, annotations: entry.change_annotations_match,
  }));
}
