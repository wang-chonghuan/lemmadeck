import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const source = '.tmp/stemrobin-184-resume';
const target = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-inquiry/answer-candidates';
const read = file => fs.readFileSync(file);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const first = JSON.parse(read(`${source}/n13-answer-first-candidate.json`));
const current = JSON.parse(read(`${source}/n13-answer-candidate.json`));
const expected = structuredClone(first);
expected.answers[0].displayAnswer = expected.answers[0].displayAnswer
  .replace('四分之七', '七分之四').replace('\n\n d)', '\n\nd)');
assert.deepEqual(current, expected);
assert(!fs.existsSync(target), 'No answer candidate retention replay');
const rows = [];
for (const name of ['n13-answer-first-candidate.json', 'n13-answer-candidate.json',
  'n13-answer-author-correction.json', 'retain-n13-answer-candidates.mjs']) {
  const bytes = read(path.join(source, name));
  const output = path.join(target, name);
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(output, bytes, { flag: 'wx', mode: 0o444 });
  rows.push({ input: path.join(source, name), path: output, bytes: bytes.length, sha256: hash(bytes) });
}
fs.writeFileSync(`${target}/parent-intake.json`, JSON.stringify({
  schema: 'n13-author-answer-candidates-parent-intake@1', recordedAt: new Date().toISOString(), rows,
  correction: 'One actual text revision: inverted Chinese reading of unchanged4/7 corrected; d leading whitespace removed.',
  mathAndOtherFieldsExactlyUnchanged: true, firstPreserved: true,
  status: 'Ungraded fullfourpart+reason candidate; officialprepare/Gate2/finalize pending',
  sourceFirst: 'Separate retained FIRST mathematics reused; no source/proof replay',
  parentImages: 'Permanent24/24;0newopens/payloads',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ retained: rows.length, bytes: rows.reduce((n, row) => n + row.bytes, 0),
  actualContentRevisions: 1, formalReview: false }));
