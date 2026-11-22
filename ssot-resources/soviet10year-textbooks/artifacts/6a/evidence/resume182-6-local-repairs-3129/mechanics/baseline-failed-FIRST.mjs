import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck';
assert.equal(process.cwd(), root);
const out = '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST/before';
assert.ok(!fs.existsSync(out));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const targets = [
  ['6a', 'alg6-c2-s1-n8'],
  ['8a', 'alg8-c3-s3-n20'],
];
const records = [];
for (const [book, lesson] of targets) {
  const directory = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${lesson}`;
  for (const name of [
    'lesson.json', 'exercises.json', 'answer-keys.json', 'figures.json',
    'adaptation.audit.json', 'answer-keys.audit.json',
    'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json',
    'choice-set/retention.json', 'offline-display.json', 'offline/text.html',
  ]) {
    const filename = `${directory}/${name}`;
    if (!fs.existsSync(filename)) continue;
    const bytes = fs.readFileSync(filename);
    const snapshot = `${out}/${book}/${name}`;
    fs.mkdirSync(path.dirname(snapshot), { recursive: true });
    fs.writeFileSync(snapshot, bytes, { flag: 'wx' });
    records.push({ path: filename, snapshot, sha256: hash(bytes), bytes: bytes.length });
  }
}
const files = execFileSync('rg', ['--files', 'ssot-resources/soviet10year-textbooks/artifacts/6a',
  'ssot-resources/soviet10year-textbooks/artifacts/7a',
  'ssot-resources/soviet10year-textbooks/artifacts/8a'], { encoding: 'utf8' })
  .trim().split('\n');
const retained = files.map(filename => ({
  path: filename, sha256: hash(fs.readFileSync(filename)),
}));
const chapterTwo = files.filter(filename =>
  /artifacts\/6a\/editions\/modern-us-neutral\/lessons\/alg6-c2-[^/]+\/exercises.json$/.test(filename));
const count = chapterTwo.reduce((sum, filename) =>
  sum + JSON.parse(fs.readFileSync(filename)).exercises.length, 0);
assert.equal(count, 266);
const record = {
  createdAt: new Date().toISOString(), root,
  head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  status: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }),
  records, retained, chapterTwoExerciseCount: count,
  oldTreesTouched: false, historicalCountsReset: false,
};
fs.writeFileSync(`${out}/baseline.json`, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ baseline: `${out}/baseline.json`, snapshots: records.length,
  retainedFiles: retained.length, chapterTwoExerciseCount: count }));
