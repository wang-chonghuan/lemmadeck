import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const tools = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools');
const card = 'phy10-c2-s2-n78';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function write(relative, value) {
  const file = path.join(own, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return bind(file);
}
assert.deepEqual(process.argv.slice(2), ['--execute']);
assert.equal(read(path.join(own, 'native/assemble-first/receipt.json')).exitCode, 0);
assert.equal(fs.existsSync(path.join(own, 'native/adapt-prepare-first')), false);
const requirementsFreeze = read(path.join(own, 'requirements-freeze.json'));
for (const file of requirementsFreeze.files) assert.equal(sha(file.path), file.sha256);
const inputs = read(path.join(own, 'input-bindings.json'));
for (const copy of inputs.copies) {
  assert.equal(sha(copy.source.path), copy.source.sha256);
  assert.equal(sha(copy.copy.path), copy.copy.sha256);
}
const raw = path.join(own, 'root/10p/lessons', card);
const lesson = read(path.join(raw, 'lesson.json'));
const exercises = read(path.join(raw, 'exercises.json'));
assert.equal(lesson.prose.filter(item => item.kind === 'p').at(-1).source_refs.at(-1), 'p0209#3');
assert.deepEqual(exercises, { lesson: card, count: 0, exercises: [] });
assert.deepEqual(lesson.figures.map(item => item.id), ['fig-181', 'fig-182', 'fig-183']);
assert.ok(lesson.prose.every(item => !item.source_refs.includes('p0209#4')));
const command = [
  path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
  path.join(tools, 'p2c.py'), 'adapt-prepare', '--book', '10p',
  '--edition', 'modern-us-neutral', '--lesson', card,
  '--root', path.join(own, 'root'), '--work', path.join(own, 'work'),
];
const started = write('native/adapt-prepare-first/started.json', { command, cwd, attempt: 1, recordedAt: new Date().toISOString() });
const result = spawnSync(command[0], command.slice(1), {
  cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(own, 'runtime-tmp') },
});
const dir = path.join(own, 'native/adapt-prepare-first');
fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
const receipt = write('native/adapt-prepare-first/receipt.json', {
  command, cwd, attempt: 1, started, exitCode: result.status, signal: result.signal,
  error: result.error?.message ?? null,
  stdout: bind(path.join(dir, 'stdout.txt')), stderr: bind(path.join(dir, 'stderr.txt')),
  imageOpens: 0, sourceFinalizeVectorize: false,
  runtimeOnlySafety: 'Child bytecode disabled; temporary directory inside owned root; no.env file reads or edits.',
});
if (result.status !== 0) {
  write('native-first-failure.json', { status: 'HOLD-NATIVE-FIRST-FAIL-NO-RETRY', receipt });
  console.log(JSON.stringify(receipt));
  process.exit(1);
}
const templates = path.join(own, 'work/adapt/10p/modern-us-neutral/lessons', card);
const outputs = [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(path.join(raw, name))),
  ...['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(name => bind(path.join(templates, name))),
];
outputs.forEach(file => fs.chmodSync(file.path, 0o444));
const manifest = write('preparation-manifest.json', {
  schema: 'STEMROBIN-181/n78-first-scoped-preparation@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  status: 'SPARSE-ASSEMBLE-AND-FIRST-SELECTED-ADAPT-PREPARE-PASS',
  requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
  inputs: bind(path.join(own, 'input-bindings.json')),
  nativeCommands: [bind(path.join(own, 'native/assemble-first/receipt.json')), receipt],
  outputs,
  sourcePageCount: 4, originalQuestions: 0, exerciseGroups: 0,
  sourceProseObjects: lesson.prose.length, sourceFigures: lesson.figures.map(item => item.id),
  n79: { nativeMergedOpenRef: 'p0209#5', physicalTailRef: 'p0209#8', outgoingOpen: true, authored: false, approved: false },
  assembleInvocations: 1, adaptPrepareInvocations: 1,
  auxiliaryAssertionInterruption: bind(path.join(own, 'preparation-interruption.json')),
  nativeStageReruns: 0, finalizeVectorizeAdaptFinalizeRenderInvocations: 0,
  canonicalBookReassembled: false, copiedCanonicalSourceBytesUnchanged: true,
  imagesOpenedOrDecoded: 0, modernFigures: 'PENDING',
});
console.log(JSON.stringify({ preparation: manifest, outputs }, null, 2));
