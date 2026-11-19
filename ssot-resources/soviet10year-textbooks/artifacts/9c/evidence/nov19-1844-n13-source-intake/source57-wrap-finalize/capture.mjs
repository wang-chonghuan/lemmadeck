import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const source = 'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0057';
const before = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-source-intake/source57-finalize-first/nativecapture';
const diagnosis = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-source-intake/source57-count-diagnosis';
const output = '.tmp/stemrobin-184-resume/n13-source57-wrap-finalize';
const target = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-source-intake/source57-wrap-finalize';
const read = file => fs.readFileSync(file);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const split = bytes => {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/u.exec(bytes.toString());
  assert(match);
  return { meta: JSON.parse(match[1]), body: match[2] };
};
const strip = text => text.replaceAll('\u21b5', '');
assert(!fs.existsSync(output) && !fs.existsSync(target), 'No affected invocation replay');
const prior = split(read(`${before}/page.md`));
const proposal = JSON.parse(read(`${diagnosis}/proposed-correction.json`));
assert.equal(hash(read(`${before}/page.md`)), proposal.sourcePageMdSha256AtMeasurement);
const candidate = split(read(`${source}/page.md`));
assert.deepEqual(candidate.meta, prior.meta);
let expected = prior.body;
for (const change of proposal.changes) {
  assert.equal(expected.split(change.original).length, 2);
  expected = expected.replace(change.original, change.proposed);
}
assert.equal(candidate.body, expected);
assert.equal(strip(candidate.body), prior.body);
assert.equal(candidate.body.split('\u21b5').length - 1, 2);
fs.mkdirSync(output);
fs.writeFileSync(`${output}/candidate.page.md`, read(`${source}/page.md`), { flag: 'wx' });
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9c', '--page', '57'];
const stdout = fs.openSync(`${output}/native.stdout`, 'wx');
const stderr = fs.openSync(`${output}/native.stderr`, 'wx');
const startedAt = new Date().toISOString();
let actual;
try {
  actual = spawnSync(command[0], command.slice(1), { cwd: process.cwd(), stdio: ['ignore', stdout, stderr] });
} finally {
  fs.closeSync(stdout);
  fs.closeSync(stderr);
}
const rows = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const bytes = read(`${source}/${name}`);
  fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' });
  rows.push({ path: `${source}/${name}`, bytes: bytes.length, sha256: hash(bytes) });
}
const after = split(read(`${source}/page.md`));
const audit = JSON.parse(read(`${source}/audit.json`));
const previousJson = JSON.parse(read(`${before}/page.json`));
const currentJson = JSON.parse(read(`${source}/page.json`));
const normalizeJson = json => {
  const copy = structuredClone(json);
  if (copy.meta) delete copy.meta.printed_lines;
  if ('printed_lines' in copy) delete copy.printed_lines;
  for (const block of copy.blocks ?? []) block.lines = block.lines.map(strip);
  return copy;
};
const metadataWithoutCount = meta => {
  const copy = structuredClone(meta);
  delete copy.printed_lines;
  return copy;
};
const invariants = {
  exactTwoProposedMarkers: after.body === expected,
  semanticBodyExactlyUnchanged: strip(after.body) === prior.body,
  metadataOnlyPrintedLines: JSON.stringify(metadataWithoutCount(after.meta)) === JSON.stringify(metadataWithoutCount(prior.meta)),
  pageJsonOnlyWrappersAndPrintedLines: JSON.stringify(normalizeJson(currentJson)) === JSON.stringify(normalizeJson(previousJson)),
};
fs.writeFileSync(`${output}/receipt.json`, JSON.stringify({
  schema: 'source57-affected-wrap-finalize@1',
  command, cwd: process.cwd(), startedAt, endedAt: new Date().toISOString(),
  actualExit: actual.status, signal: actual.signal, error: actual.error?.message ?? null,
  affectedInvocations: 1, rows, audit, invariants,
  candidateSha256: hash(read(`${output}/candidate.page.md`)),
  stdoutSha256: hash(read(`${output}/native.stdout`)),
  stderrSha256: hash(read(`${output}/native.stderr`)),
  binding: { proposal: hash(read(`${diagnosis}/proposed-correction.json`)), mapping: hash(read(`${diagnosis}/band-mapping.json`)) },
  sourceOrMathOrLessonApproval: false,
  firstFailureRetained: 'Original actualexit1/24printed22logical unchanged',
  unknowns: 'All isolated ink/glyph UNKNOWNs, literal exponent-k and page58open retained; no exclusions/counter changes.',
  images: 'Child2/4 unchanged; parent permanent24/24 zero opens/payloads.',
  next: actual.status === 0 && Object.values(invariants).every(Boolean) ? 'Affected mechanical stage retained; use existing source observations and await remaining source before scoped assembly.' : 'Stop dependent stages; preserve actual output, diagnose only real failure.',
}, null, 2) + '\n', { flag: 'wx' });
fs.mkdirSync(target);
const retained = [];
for (const name of ['candidate.page.md', 'page.md', 'page.json', 'audit.json', 'native.stdout', 'native.stderr', 'receipt.json']) {
  const bytes = read(`${output}/${name}`);
  fs.writeFileSync(`${target}/${name}`, bytes, { flag: 'wx', mode: 0o444 });
  retained.push({ path: `${target}/${name}`, bytes: bytes.length, sha256: hash(bytes) });
}
const script = '.tmp/stemrobin-184-resume/finalize-n13-source57-wraps.mjs';
fs.writeFileSync(`${target}/capture.mjs`, read(script), { flag: 'wx', mode: 0o444 });
retained.push({ path: `${target}/capture.mjs`, bytes: read(script).length, sha256: hash(read(script)) });
fs.writeFileSync(`${target}/parent-intake.json`, JSON.stringify({
  schema: 'source57-affected-wrap-finalize-parent-intake@1', recordedAt: new Date().toISOString(),
  actualExit: actual.status, printed: audit.lines_printed, logical: audit.lines_md,
  rows: retained, invariants, status: 'Mechanical count result only, not source/math/lesson approval',
  originalFailurePreserved: true, annotationRowsSourceBound: [11, 16],
  boundary: 'No measurement replay, image, exclusion, counter patch, DB, publisher, E, main, merge, deploy, handoff or closure.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ actualExit: actual.status, printed: audit.lines_printed, logical: audit.lines_md,
  invariants, retained: retained.length, bytes: retained.reduce((n, row) => n + row.bytes, 0) }));
process.exitCode = actual.status === 0 && Object.values(invariants).every(Boolean) ? 0 : 1;
