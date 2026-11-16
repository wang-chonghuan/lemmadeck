import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ticket, read, bytes, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const freezePath = `${ticket}/tmp/d025-source244-247-correction/author-freeze.json`;
await verify(freezePath, '8cf7cd43f03465667efa8297dbd2fe84906836ebe4422edfb975b213b700613d');
const freeze = await read(freezePath);
assert.deepEqual(freeze.affectedCountPages, [244, 246]);
assert.equal(freeze.repairCalls, 1);
const out = `${ticket}/tmp/d025-source244-246-affected-native`;
assert.ok(!await exists(`${out}/started.json`));
const inputs = [];
const candidates = [];
for (const number of freeze.affectedCountPages) {
  const record = freeze.candidates.find(row => row.page === number);
  await verify(record.candidate.path, record.candidate.sha256);
  const source = record.originalInputs['page.png'];
  await verify(source.path, source.sha256);
  const saved = `${out}/inputs/${number}.page.md`;
  await immutableWrite(saved, await bytes(record.candidate.path));
  inputs.push({ originalPath: record.candidate.path, ...await bind(saved) }, await bind(source.path));
  candidates.push({ page: number, candidate: saved, source: source.path });
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const counter = `${ticket}/tmp/d025-source240-count.py`;
const command = [python, '-B', counter];
await immutableWrite(`${out}/started.json`, `${JSON.stringify({
  authorFreeze: await bind(freezePath), inputs, command,
  helper: await bind(`${ticket}/tmp/count-d025-source244-246-correction.mjs`),
  counter: await bind(counter), pages: freeze.affectedCountPages,
  retainedCounts: freeze.retainedCounts, nativeCountInvocations: 1,
  scope: 'Sole affected count for244 and246 only. No245/247/243 count replay.',
}, null, 2)}\n`);
const result = spawnSync(python, command.slice(1), {
  input: JSON.stringify({ pages: candidates }), encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${out}/stdout.json`, result.stdout ?? '');
await immutableWrite(`${out}/stderr.txt`, result.stderr ?? '');
await immutableWrite(`${out}/command.json`, `${JSON.stringify({
  command, exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  started: await bind(`${out}/started.json`),
  stdout: await bind(`${out}/stdout.json`), stderr: await bind(`${out}/stderr.txt`),
  nativeCountInvocations: 1, imageOpens: 0, sourceWrites: 0, processesFinished: true,
}, null, 2)}\n`);
assert.equal(result.status, 0);
for (const input of inputs) await verify(input.path, input.sha256);
console.log(JSON.stringify({
  receipt: await bind(`${out}/command.json`),
  pages: JSON.parse(result.stdout).pages.map(row => ({
    page: row.pdf_page, candidateRows: row.candidate_rows,
    nativeRows: row.native_masked_rows, delta: row.native_minus_candidate,
  })),
}));
