import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ticket, read, bytes, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const [startText, freezeSha] = process.argv.slice(2);
const start = Number(startText);
assert.equal(start, 244);
const folder = `${ticket}/tmp/d025-source${start}-${start + 3}-author`;
const freezePath = `${folder}/author-freeze.json`;
const out = `${ticket}/tmp/d025-source${start}-${start + 3}-native`;
assert.ok(!await exists(`${out}/started.json`));
await verify(freezePath, freezeSha);
const freeze = await read(freezePath);
const pages = Array.from({ length: 4 }, (_, index) => start + index);
const inputs = [];
const candidates = [];
for (const page of pages) {
  const record = freeze.pages.find(item => item.physicalPage === page);
  assert.ok(record);
  await verify(record.candidate.path, record.candidate.sha256);
  const candidate = record.candidate.path;
  const source = `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}/page.png`;
  await verify(source, record.files['page.png'].sha256);
  const savedCandidate = `${out}/inputs/${String(page).padStart(4, '0')}.page.md`;
  await immutableWrite(savedCandidate, await bytes(candidate));
  inputs.push({ originalPath: candidate, ...await bind(savedCandidate) }, await bind(source));
  candidates.push({ page, candidate, source });
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const counter = `${ticket}/tmp/d025-source240-count.py`;
const command = [python, '-B', counter];
await immutableWrite(`${out}/started.json`, `${JSON.stringify({
  authorFreeze: await bind(freezePath), inputs,
  helper: await bind(`${ticket}/tmp/count-d025-source244.mjs`), counter: await bind(counter),
  nativeHelpers: await Promise.all(['blocks.py', 'layout.py'].map(name =>
    bind(`.claude/skills/ld-s10y-lesson/tools/${name}`))),
  command, pages, nativeCountInvocations: 1,
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
  pages: JSON.parse(result.stdout).pages.map(item => ({
    page: item.pdf_page, candidateRows: item.candidate_rows,
    nativeRows: item.native_masked_rows, delta: item.native_minus_candidate,
  })),
}));
