import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bytes, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const originalPath = `${ticket}/tmp/d046-n39-native/result.json`;
await verify(originalPath, 'd8d612ad955a2dc9e2cee81b4e2c46cd78668bfc842f8037996182519cbaf611');
const native = await read(originalPath);
const folder = `${ticket}/tmp/d048-numbering-repair`;
for (const entry of native.languages) {
  const work = `${folder}/${entry.language}/work`;
  const out = `${work}/render/10p/modern-us-neutral`;
  const command = ['node', '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    `${entry.root}/10p`, '--out', out, '--edition', 'modern-us-neutral', '--lesson', native.card];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  const receipt = `${folder}/${entry.language}/native-render.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    scope: 'One affected numbering repair; no adapt-finalize or semantic gate replay.',
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr);
  const oldText = entry.html.find(row => row.path.endsWith('/text.html'));
  const newText = `${out}/${native.card}/text.html`;
  assert.deepEqual(await bytes(newText), await bytes(oldText.path));
  const oldExercise = entry.html.find(row => row.path.endsWith('/exercises.html'));
  const newExercise = `${out}/${native.card}/exercises.html`;
  let expected = (await bytes(oldExercise.path)).toString();
  const exercises = await read(`${entry.root}/10p/editions/modern-us-neutral/lessons/${native.card}/exercises.json`);
  for (const e of exercises.exercises) {
    const prefix = /^\s*(\d+)\.(?=\s|$)/.exec(e.text);
    assert.equal(prefix?.[1], String(e.source_number ?? e.number));
    const before = `<li class="ex" id="ex-${e.number}"><div class="no">${prefix[1]}.</div>`;
    assert.ok(expected.includes(before));
    expected = expected.replace(before, `<li class="ex" id="ex-${e.number}"><div class="no"></div>`);
  }
  assert.equal((await bytes(newExercise)).toString(), expected,
    'Affected render changed more than six redundant outer number labels');
  entry.originalRender = entry.render;
  entry.originalWork = entry.work;
  entry.originalHtml = entry.html;
  entry.work = work;
  entry.render = await bind(receipt);
  entry.html = await Promise.all([newText, newExercise].map(bind));
}
native.originalNative = await bind(originalPath);
native.numberingRepair = {
  scope: 'Only redundant preview number labels removed. Original source/edition content, figures, raw native outputs, and titles remain unchanged.',
  renderer: await bind('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  helper: await bind('.claude/skills/ld-s10y-lesson/tools/publish_merge.js'),
  focused: await bind(`${folder}/focused-result.json`),
  substantiveReviewReplayed: false, displayRecheckPending: true,
};
const destination = `${folder}/native-result.json`;
await immutableWrite(destination, `${JSON.stringify(native, null, 2)}\n`);
console.log(JSON.stringify({ native: await bind(destination) }));
