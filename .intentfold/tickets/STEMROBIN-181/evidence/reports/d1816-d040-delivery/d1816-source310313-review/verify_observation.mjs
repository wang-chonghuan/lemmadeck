import { createHash } from 'node:crypto';
import { readFileSync, statSync, writeFileSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const out = dirname(fileURLToPath(import.meta.url));
const reportPath = resolve(out, 'phase1-observation.json');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const phase = readJson(reportPath);
const checks = [];
let lineTotal = 0;

assert.equal(out, phase.output_directory);
assert.equal(phase.freeze_sequence.length, 4);
for (const expected of phase.freeze_sequence) {
  assert.equal(dirname(expected.path), out);
  assert.equal(hash(expected.path), expected.sha256);
  assert.equal(statSync(expected.path).mode & 0o777, 0o444);
  const freeze = readJson(expected.path);
  assert.equal(freeze.schema, 'independent-source-observation@1');
  assert.equal(freeze.physical_page, expected.physical_page);
  assert.equal(freeze.printed_page, expected.printed_page);
  assert.equal(hash(freeze.source.path), freeze.source.sha256);
  const png = readFileSync(freeze.source.path);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), freeze.source.width_px);
  assert.equal(png.readUInt32BE(20), freeze.source.height_px);

  let lines = 0;
  let shared = 0;
  for (const [index, block] of freeze.blocks.entries()) {
    assert.equal(block.id, `b${String(index + 1).padStart(2, '0')}`);
    assert.ok(['h1', 'h2', 'h3', 'p', 'exhead', 'ex', 'fig', 'cap', 'foot'].includes(block.kind));
    assert.equal(block.lines.length, block.line_count);
    assert.ok(block.lines.every(line => typeof line === 'string' && !/[\r\n]/u.test(line)));
    assert.ok(['cont', 'open', 'samerow'].every(key => typeof block.flags[key] === 'boolean'));
    for (const span of [...block.heavy_spans_certain, ...block.under_dot_spans_certain]) {
      assert.ok(span.line >= 1 && span.line <= block.line_count);
      assert.ok(block.lines[span.line - 1].includes(span.text));
      assert.ok(Number.isInteger(span.occurrence) && span.occurrence > 0);
    }
    if (block.kind === 'fig') {
      assert.ok(block.figure_id);
      assert.equal(block.coarse_box_px.length, 4);
      for (const key of ['subfigures', 'objects', 'labels', 'relationships', 'values']) {
        assert.ok(Array.isArray(block.inventory[key]));
      }
    }
    if (block.flags.samerow) {
      const preceding = freeze.blocks.find(item => item.id === block.shares_row_with?.block);
      assert.ok(preceding);
      assert.ok(block.shares_row_with.line <= preceding.line_count);
      shared += block.kind === 'cap' ? block.line_count : 1;
    }
    lines += block.line_count;
  }
  assert.equal(lines, freeze.line_accounting.block_line_sum);
  assert.equal(shared, freeze.line_accounting.samerow_deduction);
  assert.equal(lines - shared, freeze.line_accounting.unique_physical_lines);
  const summary = phase.line_accounting.pages.find(page => page.physical_page === freeze.physical_page);
  assert.deepEqual(freeze.blocks.map(block => block.line_count), summary.block_counts);
  assert.equal(lines - shared, summary.unique_physical_lines);
  lineTotal += lines - shared;
  checks.push({ physical_page: freeze.physical_page, freeze_sha256: hash(expected.path), source_sha256: hash(freeze.source.path), unique_physical_lines: lines - shared });
}

assert.equal(lineTotal, phase.line_accounting.unique_physical_lines_total);
assert.equal(phase.image_open_ledger.length, 8);
assert.deepEqual(phase.image_open_ledger.map(item => item.order), [1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(new Set(phase.image_open_ledger.map(item => item.path)).size, 8);
assert.equal(phase.image_open_ledger.filter(item => item.kind === 'ungridded_full_page').length, 4);
assert.equal(phase.image_open_ledger.filter(item => item.kind === 'essential_targeted_crop').length, 4);
for (const image of phase.image_open_ledger) {
  assert.equal(image.opens, 1);
  assert.equal(hash(image.path), image.sha256);
  if (image.kind === 'essential_targeted_crop') {
    assert.equal(dirname(image.path), out);
    const png = readFileSync(image.path);
    assert.equal(png.readUInt32BE(16), image.box_px[2]);
    assert.equal(png.readUInt32BE(20), image.box_px[3]);
    const source = phase.image_open_ledger.find(item => item.kind === 'ungridded_full_page' && item.physical_page === image.physical_page);
    assert.equal(image.source_sha256, source.sha256);
    assert.ok(image.box_px[0] >= 0 && image.box_px[1] >= 0);
    assert.ok(image.box_px[0] + image.box_px[2] <= source.box_px[2]);
    assert.ok(image.box_px[1] + image.box_px[3] <= source.box_px[3]);
  }
}

for (const evidence of [...phase.source_conventions, ...phase.focus_evidence, phase.read_only_toc_match]) {
  assert.equal(hash(evidence.path), evidence.sha256);
}
const focus = readJson(resolve(out, 'focus-results.json'));
for (const result of focus.results) {
  assert.equal(hash(result.crop_path), result.crop_sha256);
  if (result.id === 'FOCUS313-EMPHASIS') {
    const freeze = readJson(phase.freeze_sequence.find(item => item.physical_page === 313).path);
    for (const span of [...result.heavy_spans_certain, ...result.under_dot_spans_certain]) {
      const block = freeze.blocks.find(item => item.id === span.block);
      assert.ok(block.lines[span.line - 1].includes(span.text));
    }
  }
}
for (const name of ['source0310.freeze.json', 'source0311.freeze.json', 'source0312.freeze.json', 'source0313.freeze.json', 'focus-results.json', 'focus-crops.generated.json', 'phase1-observation.json']) {
  assert.equal(statSync(resolve(out, name)).mode & 0o777, 0o444);
}

const result = {
  schema: 'independent-source-observation-verification@1',
  status: 'PASS_MECHANICAL_ONLY',
  phase1_path: reportPath,
  phase1_sha256: hash(reportPath),
  freeze_and_source_hash_checks: checks,
  image_ledger_hash_checks: 8,
  unique_physical_lines: lineTotal,
  readonly_freezes_and_reports: true,
  remaining_holds: phase.concrete_holds.map(hold => hold.id),
  qualification: 'Checks JSON, paths, hashes, PNG dimensions, physical-line bookkeeping and immutable modes only. Does not independently approve visual reading, resolve HOLDs, bind native/canonical candidates, or close numbered119.'
};
const target = resolve(out, 'verification.json');
writeFileSync(target, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
chmodSync(target, 0o444);
console.log(JSON.stringify({ ...result, verification_path: target, verification_sha256: hash(target) }, null, 2));
