import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const source = path.join(base, 'n39-choice-author');
const output = path.join(base, 'n39-choice-affected-author');
const names = [
  'seed.json', 'draft.json', 'reviewer-views.json',
  'source-solutions-counted.json', 'method-assumptions.json',
  'source-cells.json', 'source-provenance.json',
  'task-coverage.json', 'image-observations.json',
];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const first = path.join(output, 'FIRST');
fs.mkdirSync(first, { recursive: true });
const records = names.map(name => {
  const input = path.join(source, name);
  const destination = path.join(first, name);
  const bytes = fs.readFileSync(input);
  if (fs.existsSync(destination)) {
    assert.deepEqual(fs.readFileSync(destination), bytes, `existing FIRST differs: ${name}`);
  } else {
    fs.writeFileSync(destination, bytes, { flag: 'wx', mode: 0o444 });
  }
  assert.deepEqual(fs.readFileSync(destination), bytes);
  fs.chmodSync(destination, 0o444);
  return {
    name, source: input, snapshot: destination,
    bytes: bytes.length, sha256: hash(bytes), exact_byte_equal: true,
  };
});
const receipt = {
  schema: 'n39-affected-FIRST-snapshot@1',
  stage: 'before_author_content_edits',
  inputs: records,
  independent_review_read: false,
  durable_answers_read: false,
  new_image_loads: 0,
  new_source_solves: 0,
  write_root: output,
};
fs.writeFileSync(path.join(output, 'FIRST-receipt.json'),
  JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ snapshots: records.length, records }, null, 2));
