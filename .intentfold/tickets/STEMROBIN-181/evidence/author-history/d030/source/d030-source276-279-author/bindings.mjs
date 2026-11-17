import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const out = path.dirname(import.meta.filename);
const root = process.cwd();
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, path.resolve(file)), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const meta = file => JSON.parse(fs.readFileSync(file, 'utf8').split('---')[1]);
const write = (file, value) => {
  assert(path.resolve(file).startsWith(`${out}${path.sep}`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const verify = (page, candidate) => {
  const source = `.tmp/ld-s10y-lesson/9p/pages/${page}/page.png`;
  const template = `.tmp/ld-s10y-lesson/9p/pages/${page}/page.template.md`;
  const actual = meta(candidate);
  const expected = meta(template);
  const errors = [];
  for (const field of ['source', 'profile']) {
    if (JSON.stringify(actual[field]) !== JSON.stringify(expected[field])) errors.push(`${field} metadata mismatch`);
  }
  for (const field of ['dpi', 'w', 'h', 'sha256']) {
    if (actual.render[field] !== expected.render[field]) errors.push(`render.${field} metadata mismatch`);
  }
  if (actual.render.sha256 !== bind(source).sha256) errors.push('render.sha256 differs from actual source bytes');
  if (actual.page !== Number(page) || actual.printed_page !== Number(page) - 9) errors.push('page identity mismatch');
  return { page: Number(page), candidate: bind(candidate), source: bind(source), template: bind(template),
    authoredRenderSha256: actual.render.sha256, actualSourceSha256: bind(source).sha256,
    status: errors.length ? 'fail' : 'pass', errors };
};
const mode = process.argv[2];
if (mode === 'initial') {
  const pages = ['0276', '0277', '0278', '0279'].map(page =>
    verify(page, path.join(out, `${page}.page.md`)));
  const receipt = path.join(out, 'bindings.initial.json');
  write(receipt, { status: pages.every(p => p.status === 'pass') ? 'pass' : 'fail',
    pages, sourceApproval: false, originalDraftsPreserved: true });
  console.log(JSON.stringify(read(receipt), null, 2));
} else if (mode === 'repair') {
  const original = path.join(out, '0279.page.md');
  const candidate = path.join(out, 'repairs/0279.page.md');
  const verified = verify('0279', candidate);
  assert.equal(verified.status, 'pass');
  const oldText = fs.readFileSync(original, 'utf8');
  const newText = fs.readFileSync(candidate, 'utf8');
  assert.equal(oldText.replace(meta(original).render.sha256, meta(candidate).render.sha256), newText);
  assert.equal(oldText.split('---')[2], newText.split('---')[2]);
  const payload = { pages: [{ page: 279, candidate: bind(candidate).path,
    source: '.tmp/ld-s10y-lesson/9p/pages/0279/page.png' }] };
  const stdin = path.join(out, 'repairs/count.stdin.json');
  write(stdin, payload);
  const helper = '.intentfold/tickets/STEMROBIN-181/tmp/d025-source240-count.py';
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', helper];
  const started = path.join(out, 'repairs/count.started.json');
  write(started, { command, stdin: bind(stdin), helper: bind(helper), candidate: bind(candidate),
    startedAt: new Date().toISOString(), affectedPageOnly: 279, repairAttempt: 1 });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, input: fs.readFileSync(stdin), timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  fs.writeFileSync(path.join(out, 'repairs/count.stdout.json'), result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(out, 'repairs/count.stderr.txt'), result.stderr ?? '', { flag: 'wx' });
  const receipt = path.join(out, 'repairs/0279.metadata-repair.json');
  const counts = result.status === 0 ? read(path.join(out, 'repairs/count.stdout.json')).pages[0] : null;
  write(receipt, {
    status: counts?.native_count_matches_candidate ? 'pass' : 'fail', page: 279,
    issue: 'Incorrect render.sha256 metadata in original draft; transcription body unchanged',
    repairAttempt: 1, original: bind(original),
    frozenInitial: bind(path.join(out, 'snapshots/candidates/0279.page.md')),
    candidate: bind(candidate), bodyByteIdentical: true, verified,
    command, started: bind(started), stdin: bind(stdin),
    stdout: bind(path.join(out, 'repairs/count.stdout.json')),
    stderr: bind(path.join(out, 'repairs/count.stderr.txt')),
    exitCode: result.status, signal: result.signal ?? null, error: result.error?.message ?? null,
    processesFinished: true, nativeCountInvocations: 1, affectedPageOnly: true,
    candidateRows: counts?.candidate_rows, nativeRows: counts?.native_masked_rows,
    sourceApproval: false, durableWrites: 0,
  });
  fs.chmodSync(candidate, 0o444);
  console.log(JSON.stringify(bind(receipt), null, 2));
} else {
  throw new Error('Use initial or repair');
}
