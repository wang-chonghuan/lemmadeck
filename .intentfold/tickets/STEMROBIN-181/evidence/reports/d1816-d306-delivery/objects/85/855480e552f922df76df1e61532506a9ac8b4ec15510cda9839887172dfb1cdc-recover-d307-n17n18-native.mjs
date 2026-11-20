import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d307-n17n18-native-recovery`;
const originalFile = `${T}/tmp/d1816-d288-n17n18-native/result.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const original = read(originalFile);
assert.equal(original.status, 'native-failure');
assert.equal(original.failure.name, 'd288-n17n18-zh-first-offline-render');
assert(original.stages.find(row => row.name === 'd288-n17n18-zh-first-adapt-finalize').pass);
const { root, work, display, ids } = original;
fs.mkdirSync(O, { recursive: true });
const reused = [];
for (const id of ids)
  for (const file of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const target = `${root}/10p/editions/modern-us-neutral/lessons/${id}/${file}`;
    if (file === 'adaptation.audit.json') assert.equal(read(target).status, 'pass');
    reused.push(bind(target));
  }
const partialHTML = ['text.html', 'exercises.html'].map(file =>
  bind(`${display}/render/10p/modern-us-neutral/${ids[0]}/${file}`));
assert(partialHTML.every(row => row.bytes > 8000));
const stages = [];
let failure = null;
const call = (name, args) => {
  if (failure) return;
  try {
    execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`, name,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args],
    { cwd: repo, stdio: 'inherit' });
    stages.push({ name, status: 'pass',
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  } catch (error) {
    failure = { name, exitCode: error.status };
    stages.push({ ...failure, status: 'fail',
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  }
};
call('d307-n18-zh-failed-render-recovery',
  ['render', '--book', '10p', '--root', root, '--work', display,
    '--edition', 'modern-us-neutral', '--lesson', ids[1]]);
call('d307-n17n18-en-first-adapt-finalize',
  ['adapt-finalize', '--book', '10p', '--root', root, '--work', work,
    '--edition', 'modern-us-neutral-en', ...ids.flatMap(id => ['--lesson', id])]);
call('d307-n17n18-en-first-offline-render',
  ['render', '--book', '10p', '--root', root, '--work', display,
    '--edition', 'modern-us-neutral-en', ...ids.flatMap(id => ['--lesson', id])]);
for (const record of [...reused, ...partialHTML])
  assert.equal(bind(record.path).sha256, record.sha256);
const outputs = failure ? [] : ids.flatMap(id =>
  ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => ({
    id, edition, lesson: bind(`${root}/10p/editions/${edition}/lessons/${id}/lesson.json`),
    exercises: bind(`${root}/10p/editions/${edition}/lessons/${id}/exercises.json`),
    figures: bind(`${root}/10p/editions/${edition}/lessons/${id}/figures.json`),
    audit: bind(`${root}/10p/editions/${edition}/lessons/${id}/adaptation.audit.json`),
    html: bind(`${display}/render/10p/${edition}/${id}/text.html`),
  })));
fs.writeFileSync(`${O}/result.json`, JSON.stringify({ batch: 'D307',
  status: failure ? 'native-failure' : 'native-pass-display-pending',
  original: bind(originalFile), ids, root, work, display, stages, failure, outputs,
  reusedChineseFinalization: reused, reusedValidN17HTML: partialHTML,
  htmlfrag: bind('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  completeCoursesAdded: 0, databaseWrites: false, paidCalls: 0,
  sourceTextOrGeometryChanged: false, geometryRerenders: 0,
  originalFailuresPreserved: true, dependentStagesStoppedAtFirstFailure: true,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${O}/result.json`), failure }));
