import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const originalPath = `${work}/build-d018-t7-prose.mjs`;
const folder = `${work}/d018-t7-helper-archival-recovery`;
const session = '/Users/yong/.codex/sessions/2026/11/15/rollout-2026-11-15T15-12-33-01a1dfc4-6a65-7840-a706-92ac8de39350.jsonl';
const recordLine = 12681;
const expected = '27cffd83b2263caddb0b9e030b779c98136a070b564de3ee94b6625d1884b96e';
const expectedInput = '167fed81b4044e394602c046ac2c69afed3efb67952a83ec2e6395a14203f5a4';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(path.join(root, file))) });
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

assert.equal(process.cwd(), root);
assert.equal(fs.existsSync(path.join(root, folder)), false, 'Never overwrite historical recovery.');
const rawRecord = fs.readFileSync(session, 'utf8').split('\n')[recordLine - 1];
const record = JSON.parse(rawRecord);
assert.equal(record.type, 'response_item');
assert.equal(record.payload.type, 'custom_tool_call');
assert.equal(record.payload.name, 'apply_patch');
assert.equal(record.payload.call_id, 'call_PLbO8nVcdm6QWhyoMiocoSER');
const input = record.payload.input;
assert.equal(hash(input), expectedInput);
const rows = input.split('\n');
assert.equal(rows[0], '*** Begin Patch');
assert.equal(rows[1], `*** Add File: ${root}/${originalPath}`);
const end = rows.indexOf('*** End Patch');
assert.ok(end > 2);
assert.ok(rows.slice(end + 1).every(row => row === ''));
const added = rows.slice(2, end);
assert.ok(added.every(row => row.startsWith('+')), 'Extract only the complete initial Add File body.');
const recovered = `${added.map(row => row.slice(1)).join('\n')}\n`;
assert.equal(hash(recovered), expected, 'No approximate reconstruction or current-SHA substitution.');
for (const declaration of [
  read(`${work}/9p-t7-before/bindings.json`).helper,
  read(`${work}/9p-t7-author-check.json`).helper,
]) {
  assert.equal(declaration.path, originalPath);
  assert.equal(declaration.sha256, expected);
}
const current = fs.readFileSync(path.join(root, originalPath));
fs.mkdirSync(path.join(root, folder));
const recoveredPath = `${folder}/build-d018-t7-prose.mjs`;
const toolInputPath = `${folder}/initial-add-file.patch`;
fs.writeFileSync(path.join(root, recoveredPath), recovered, { flag: 'wx' });
fs.writeFileSync(path.join(root, toolInputPath), input, { flag: 'wx' });
assert.equal(bind(recoveredPath).sha256, expected);
assert.deepEqual(fs.readFileSync(path.join(root, originalPath)), current);
const manifest = {
  status: 'recovered-history-only',
  role: 'Exact original author-helper bytes recovered from the initial recorded Add File; not an approval or rerun',
  files: [{
    ...bind(recoveredPath), originalPath,
    role: 'Historical helper bound by prepared-before and initial native author-check declarations',
  }],
  bindings: {
    toolInput: bind(toolInputPath),
    beforeBindings: bind(`${work}/9p-t7-before/bindings.json`),
    originalAuthorCheck: bind(`${work}/9p-t7-author-check.json`),
    currentHelperUnchanged: { path: originalPath, sha256: hash(current) },
    recoveryTool: bind(path.relative(root, fileURLToPath(import.meta.url))),
  },
  origin: {
    sessionBasename: path.basename(session), recordLine,
    timestamp: record.timestamp, callId: record.payload.call_id,
    extraction: 'Strip the leading plus from every line of the sole initial Add File body and restore its final newline',
    toolInputSha256: expectedInput,
  },
  expectedHistoricalSha256: expected,
  recoveredBytes: Buffer.byteLength(recovered),
  historicalHelperExecuted: false,
  newApprovalClaimed: false,
  currentHelperEdited: false,
};
const manifestPath = `${folder}/aliases.json`;
fs.writeFileSync(path.join(root, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(manifestPath), alias: manifest.files[0] }, null, 2));
