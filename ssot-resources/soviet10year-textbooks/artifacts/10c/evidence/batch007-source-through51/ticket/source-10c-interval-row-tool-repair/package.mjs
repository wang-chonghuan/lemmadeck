import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.dirname(new URL(import.meta.url).pathname);
const tmp = path.dirname(out);
const report = path.join(tmp, 'source-10c-interval-row-tool-repair.md');
const manifestPath = path.join(tmp, 'source-10c-interval-row-tool-repair.manifest.json');
const read = p => fs.readFileSync(p);
const json = p => JSON.parse(read(p));
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function bind(p) {
  const data = read(p);
  return { path: path.relative(root, p), bytes: data.length, sha256: digest(data) };
}
function create(p, data) {
  assert(!fs.existsSync(p), `Do not overwrite evidence: ${p}`);
  fs.writeFileSync(p, data);
}

const before = json(path.join(out, 'counts-before.stdout.txt'));
const after = json(path.join(out, 'counts-after.stdout.txt'));
assert.equal(before.layout.sha256, bind(path.join(out, 'layout.before.py')).sha256);
assert.equal(after.layout.sha256, bind(path.join(out, 'layout.after.py')).sha256);
assert.equal(after.layout.sha256, bind(path.join(root, after.layout.path)).sha256);
const test = path.join(root, '.claude/skills/ld-s10y-lesson/tests/test_interval_fraction_rows.py');
assert.deepEqual(read(test), read(path.join(out, 'test_interval_fraction_rows.after.py')));
assert.deepEqual(before.inputs, after.inputs);
for (const input of after.inputs) assert.deepEqual(bind(path.join(root, input.path)), input);
const sourceReport = path.join(tmp, 'source-10c-p43-p46-targeted-repair-author.md');
assert.equal(bind(sourceReport).sha256,
  '4df0a4d779be588b163175b36200584cf4bb5dc4131f62b9596124a0346ac804');

const comparisons = [];
const sourceExpected = { '43/original-figure-mask': 10, '46/existing-margin-candidate': 13 };
for (let i = 0; i < before.results.length; i++) {
  const a = before.results[i], b = after.results[i];
  assert.equal(a.page, b.page);
  assert.equal(a.variant, b.variant);
  assert.equal(a.counting_input_sha256, b.counting_input_sha256);
  assert.deepEqual(a.figure_boxes, b.figure_boxes);
  assert.deepEqual(a.count_exclusions, b.count_exclusions);
  assert(a.input_mask_unchanged && b.input_mask_unchanged);
  const key = `${b.page}/${b.variant}`;
  if (Object.hasOwn(sourceExpected, key)) assert.equal(b.natural_count, sourceExpected[key]);
  comparisons.push({
    page: b.page, variant: b.variant, before: a.natural_count, after: b.natural_count,
    source_expectation: sourceExpected[key] ?? 13,
    source_count_met: Object.hasOwn(sourceExpected, key) && b.natural_count === sourceExpected[key],
    unchanged_counting_input_sha256: b.counting_input_sha256,
    before_bands: a.bands, after_bands: b.bands,
  });
}
create(path.join(out, 'comparisons.json'), JSON.stringify({
  role: 'Counter author evidence only; not independent content or metadata approval',
  source_expectation_author: bind(sourceReport),
  tool_before: before.layout, tool_after: after.layout,
  inputs_unchanged: before.inputs,
  counts: comparisons, finalize_invocations: 0,
}, null, 2) + '\n');

const layoutDiff = read(path.join(out, 'layout-diff.stdout.txt'));
const testDiff = read(path.join(out, 'test-diff.stdout.txt'));
assert(layoutDiff.toString().startsWith('--- a/.claude/skills/ld-s10y-lesson/tools/layout.py\n'));
assert(testDiff.toString().startsWith('--- /dev/null\n'));
create(path.join(out, 'exact.patch'), Buffer.concat([layoutDiff, testDiff]));

const commandFiles = fs.readdirSync(out).filter(name => name.endsWith('.command.json')).sort();
const commands = commandFiles.map(name => ({
  record: bind(path.join(out, name)),
  ...json(path.join(out, name)),
  stdout: bind(path.join(out, name.replace('.command.json', '.stdout.txt'))),
  stderr: bind(path.join(out, name.replace('.command.json', '.stderr.txt'))),
}));
const exits = Object.fromEntries(commands.map(c => [
  path.basename(c.record.path, '.command.json'), c.exit_code,
]));
assert.equal(exits['focused-test-final'], 0);
assert.equal(exits['related-tests'], 0);
assert.equal(exits['focused-test-before-tool'], 1);
assert.equal(exits['layout-diff'], 1);
assert.equal(exits['test-diff'], 1);
assert.equal(exits['counts-after'], 0);

const stripManifest = json(path.join(tmp, 'source-10c-p43-p46-targeted-repair-evidence/native-strips.json'));
const openedNames = [
  'p43-final-prose-row.png', 'p46-three-fraction-prose-rows.png',
  'p46-final-prose-row.png', 'p46-single-a-minus-one-row.png',
];
const openedImages = openedNames.map(name => {
  const entry = stripManifest.native_strips.find(item => path.basename(item.path) === name);
  assert(entry);
  const actual = bind(path.join(root, entry.path));
  assert.equal(actual.sha256, entry.sha256);
  return { ...actual, source: entry.source, source_box_xywh: entry.source_box_xywh,
    loads: 1, detail: 'original', batch: 1 };
});
const files = fs.readdirSync(out).sort().filter(name => fs.statSync(path.join(out, name)).isFile())
  .map(name => bind(path.join(out, name)));
create(manifestPath, JSON.stringify({
  schema: 'stemrobin184-interval-row-tool-repair-author@1',
  ticket: 'STEMROBIN-184', date: '2026-11-16',
  workspace: root, role: 'Author counter implementation only',
  status: 'implemented-focused-verification-complete',
  independent_content_pass: false, independent_metadata_approval: false,
  durable_pages_modified: false, prepare_invocations: 0, finalize_invocations: 0,
  product_edits: [after.layout, bind(test)],
  report: bind(report), source_author: bind(sourceReport),
  counts: comparisons, commands,
  images: { opened: openedImages, total_loads: 4, batch_limit: 8, context_limit: 24,
    whole_pages: 0, screenshots: 0, reopens: 0 },
  evidence_files: files,
  limitations: [
    'Raw page 46 still counts 21; diagnostic margin candidate counts 13 and remains unapproved metadata.',
    'Only named synthetic cases, scales 1x/2x and the existing page 43/46 masks were verified.',
    'No source gate, independent content approval, broad project check, or finalize.',
    'Existing FAIL audits and UNKNOWN content dispositions remain unchanged.',
  ],
}, null, 2) + '\n');
console.log(JSON.stringify({ report: bind(report), manifest: bind(manifestPath),
  exact_patch: bind(path.join(out, 'exact.patch')) }, null, 2));
