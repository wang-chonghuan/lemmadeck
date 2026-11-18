import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const expectedRoot = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d528-source199-first-independent-text-raw-review';
assert.equal(root, expectedRoot);
const readJSON = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const record = (file) => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: sha(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  };
};

const report = readJSON('report.json');
const opens = readJSON('actual-opens.json');
const inventory = readJSON('inventory.json');
const findings = readJSON('findings.json');
const freezePath = path.join(root, 'review-freeze.json');
assert.equal(fs.existsSync(freezePath), false, 'Do not replace a previous freeze');
assert.equal(opens.opens.length, 5);
assert.deepEqual(opens.opens.map((item) => item.order), [1, 2, 3, 4, 5]);
assert.equal(opens.image_budget.context_prior_images, 0);
assert.equal(opens.image_budget.actual_opens, 5);
assert.equal(opens.opens.filter((item) => item.kind === 'RAW').length, 4);
assert.equal(report.SVG_signed, false);
assert.equal(report.fullcard_signed, false);
assert.equal(report.n75_complete, false);
assert.equal(findings.blocking_FAIL.length, 0);
assert.equal(findings.blocking_HOLD_for_SOURCE_text_or_RAW.length, 0);
assert.equal(inventory.necessary_faithful_data_blocked, false);

const inputBindings = Object.values(report.inputs).map((item) => {
  const current = record(item.path);
  assert.equal(current.sha256, item.sha256, `Input drift: ${item.path}`);
  return current;
});
const authorFreeze = JSON.parse(fs.readFileSync(report.inputs.author_freeze.path, 'utf8'));
const actualOpenBindings = opens.opens.map((item) => {
  const current = record(item.path);
  assert.equal(current.sha256, item.sha256, `Opened image drift: ${item.path}`);
  assert.equal(current.bytes, item.bytes);
  const bytes = fs.readFileSync(item.path);
  assert.equal(bytes.readUInt32BE(16), item.width);
  assert.equal(bytes.readUInt32BE(20), item.height);
  return current;
});
for (const item of [...inputBindings, ...actualOpenBindings]) {
  const authorRecord = authorFreeze.files.find((entry) => entry.path === item.path);
  if (authorRecord) assert.equal(item.sha256, authorRecord.sha256);
}

// This binds the typed visual inventory to the candidate; it is not another visual review.
const candidate = JSON.parse(fs.readFileSync(report.inputs.candidate_JSON.path, 'utf8'));
const mdLines = fs.readFileSync(report.inputs.candidate_MD.path, 'utf8').split('\n');
let proseRows = 0;
for (const item of inventory.prose) {
  const block = candidate.blocks[item.block];
  assert.equal(block.kind, 'p');
  assert.equal(block.cont, item.cont);
  assert.equal(block.open, item.open);
  assert.deepEqual(block.lines, item.lines);
  assert.deepEqual(item.MD_lines.map((line) => mdLines[line - 1]), item.lines);
  proseRows += item.lines.length;
}
assert.equal(proseRows, 16);
assert.equal(inventory.captions_and_row_accounting.independent_total_printed_rows, 18);
assert.deepEqual(candidate.blocks.filter((item) => item.kind === 'fig').map((item) => item.id),
  ['fig-168', 'fig-169', 'fig-170', 'fig-171']);
for (const [index, text, samerow] of [
  [1, '图 168', false], [3, '图 169', true], [5, '图 170', true], [11, '图 171', true],
]) {
  assert.equal(candidate.blocks[index].kind, 'cap');
  assert.deepEqual(candidate.blocks[index].lines, [text]);
  assert.equal(candidate.blocks[index].samerow, samerow);
}
assert.equal(candidate.blocks[14].kind, 'foot');
assert.deepEqual(candidate.blocks[14].lines, ['• 189 •']);
assert.equal(mdLines[132], '• 189 •');
assert.equal('а'.codePointAt(0), 0x0430);
assert.equal('б'.codePointAt(0), 0x0431);

const ownedNames = ['actual-opens.json', 'inventory.json', 'findings.json', 'report.json', 'freeze-review.mjs'];
assert.deepEqual(fs.readdirSync(root).sort(), [...ownedNames].sort(), 'Unexpected owned-directory contents');
for (const name of ownedNames) fs.chmodSync(path.join(root, name), 0o444);
const manifest = {
  schema: 'stemrobin181/source199-independent-text-RAW-review-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'd528-source199-first-independent-text-raw-review',
  root,
  frozen_at: new Date().toISOString(),
  status: 'READY',
  gates: report.gates,
  files: ownedNames.map((name) => record(path.join(root, name))),
  input_bindings: inputBindings,
  actual_open_bindings: actualOpenBindings,
  verification: {
    pinned_author_inputs_match: true,
    visual_opens_bound_by_hash: 5,
    visual_inventory_candidate_text_and_flags_match: true,
    source_prose_rows: 16,
    independent_printed_rows: 18,
    native_replayed: false,
    image_payload_reopened_for_verification: false,
    all_owned_files_0444: true,
    SVG_signed: false,
    fullcard_signed: false,
    history_and_other_agents_bytes_untouched: true,
  },
  self_binding: 'This manifest excludes itself; its SHA256 is emitted after chmod and returned in the text closeout.',
};
fs.writeFileSync(freezePath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
fs.chmodSync(freezePath, 0o444);
for (const item of [...manifest.files, ...manifest.input_bindings, ...manifest.actual_open_bindings]) {
  const after = record(item.path);
  assert.equal(after.sha256, item.sha256, `Post-freeze drift: ${item.path}`);
  assert.equal(after.mode, item.mode);
}
assert.equal(record(freezePath).mode, '0444');
console.log(JSON.stringify({
  status: 'READY',
  files: [...manifest.files, record(freezePath)],
  SOURCE199: report.gates.SOURCE199,
  RAW: report.gates.RAW,
  SVG: report.gates.SVG,
  FULLCARD: report.gates.FULLCARD,
  actual_opens: 5,
}, null, 2));
