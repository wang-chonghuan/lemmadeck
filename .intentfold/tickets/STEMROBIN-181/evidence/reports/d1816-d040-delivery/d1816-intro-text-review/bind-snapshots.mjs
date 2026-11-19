import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const output = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-intro-text-review');
const root = '.tmp/STEMROBIN-181/d1816/root/10p';
const lesson = 'phy10-c3-s1';
const recovery = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(fs.realpathSync(process.cwd()), fs.realpathSync(repo));

const inputs = [
  ...['lesson', 'exercises'].map(name => ({
    role: `original-${name}`,
    relative: `${root}/lessons/${lesson}/${name}.json`,
    snapshot: `snapshots/10p/lessons/${lesson}/${name}.json`,
  })),
  ...['modern-us-neutral', 'modern-us-neutral-en'].flatMap(edition =>
    ['lesson', 'exercises', 'figures'].map(name => ({
      role: `${edition}-${name}`,
      relative: `${root}/editions/${edition}/lessons/${lesson}/${name}.json`,
      snapshot: `snapshots/10p/editions/${edition}/lessons/${lesson}/${name}.json`,
    }))
  ),
  ...['d040-intro-source-pass', 'd040-intro-title-recovery'].map(name => ({
    role: name,
    relative: `${recovery}/${name}.json`,
    snapshot: `snapshots/context/${name}.json`,
  })),
].map(input => {
  const absolute = path.join(repo, input.relative);
  const bytes = fs.readFileSync(absolute);
  return { ...input, absolute, bytes, sha256: sha256(bytes), data: JSON.parse(bytes) };
});
const get = role => inputs.find(input => input.role === role);
const originalLesson = get('original-lesson');
const originalExercises = get('original-exercises');
const gate = get('d040-intro-source-pass').data;
assert.equal(gate.source, 'PASS-complete-object');
assert.equal(gate.originalLesson.path, originalLesson.relative);
assert.equal(gate.originalLesson.sha256, originalLesson.sha256);
assert.deepEqual(gate.sourceRefs, ['p0310#3', 'p0310#4', 'p0310#5']);
assert.equal(originalLesson.data.prose.length, 3);
assert.deepEqual(originalLesson.data.figures, []);
assert.equal(originalLesson.data.exercise_count, 0);
assert.equal(originalExercises.data.count, 0);
assert.deepEqual(originalExercises.data.exercises, []);

for (const [edition, locale, title] of [
  ['modern-us-neutral', 'zh', '\u5f15\u8a00'],
  ['modern-us-neutral-en', 'en', 'Introduction'],
]) {
  const modern = get(`${edition}-lesson`).data;
  const exercises = get(`${edition}-exercises`).data;
  assert.equal(modern.locale, locale);
  assert.equal(modern.title, title);
  assert.equal(modern.id, lesson);
  assert.equal(modern.number, null);
  assert.equal(modern.prose.length, 3);
  assert.deepEqual(modern.figures, []);
  assert.equal(modern.exercise_count, 0);
  assert.equal(modern.source.sha256, originalLesson.sha256);
  assert.deepEqual(modern.source.data, originalLesson.data);
  modern.prose.forEach((block, i) => {
    assert.deepEqual(block.source_refs, originalLesson.data.prose[i].source_refs);
    assert.equal(block.source_text, originalLesson.data.prose[i].text);
    assert.deepEqual(block.numeric_changes, []);
    assert.deepEqual(block.text.match(/\$[^$]+\$/g) ?? [],
      originalLesson.data.prose[i].text.match(/\$[^$]+\$/g) ?? []);
  });
  assert.equal(exercises.locale, locale);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(exercises.source.sha256, originalExercises.sha256);
  assert.deepEqual(exercises.source.data, originalExercises.data);
  assert.deepEqual(get(`${edition}-figures`).data.figures, []);
}

for (const input of inputs) {
  const target = path.join(output, input.snapshot);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, input.bytes, { flag: 'wx', mode: 0o444 });
  fs.chmodSync(target, 0o444);
  assert.equal(sha256(fs.readFileSync(target)), input.sha256);
}
for (const input of inputs) {
  assert.equal(sha256(fs.readFileSync(input.absolute)), input.sha256,
    `Input changed during binding: ${input.relative}`);
}
const binding = {
  schema: 'stemrobin-181/d040-intro-text-binding@1',
  captured_at: new Date().toISOString(),
  repo,
  lesson,
  source_gate_reused: true,
  source_observations_redone: false,
  image_opens: 0,
  native_finalize_rerun: false,
  files: inputs.map(({ role, absolute, snapshot, bytes, sha256 }) => ({
    role,
    path: absolute,
    snapshot: path.join(output, snapshot),
    sha256,
    bytes: bytes.length,
    snapshot_mode: '0444',
  })),
};
const manifest = path.join(output, 'binding.json');
fs.writeFileSync(manifest, `${JSON.stringify(binding, null, 2)}\n`,
  { flag: 'wx', mode: 0o444 });
fs.chmodSync(manifest, 0o444);
console.log(JSON.stringify({
  binding: manifest,
  sha256: sha256(fs.readFileSync(manifest)),
  ...binding,
}, null, 2));
