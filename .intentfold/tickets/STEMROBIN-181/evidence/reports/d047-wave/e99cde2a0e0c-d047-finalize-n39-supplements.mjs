import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, immutableWrite, exists,
} from './retain-d016-evidence.mjs';

const [execute, approvedPath, approvedSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
await verify(approvedPath, approvedSha);
const approved = await read(approvedPath);
assert.equal(approved.status, 'PASS-independent-choice-and-answer-reviews');
assert.equal(approved.card, 'phy10-c1-s5-n39');
const card = approved.card;
const folder = `${ticket}/tmp/d047-n39-supplements`;
assert.equal(await exists(`${folder}/started.json`), false);
await verify(approved.native.path, approved.native.sha256);
const native = await read(approved.native.path);
assert.equal(native.card, card);
for (const row of approved.reviews) await verify(row.path, row.sha256);
for (const row of approved.languages)
  for (const field of ['seed', 'choiceDraft', 'choiceReview', 'answerDraft'])
    await verify(row[field].path, row[field].sha256);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  approved: await bind(approvedPath), sourceNative: approved.native,
  policy: 'Consume independent semantic gates; finalize six ungraded standards once per language, no interaction generation or publisher.',
}, null, 2)}\n`);
const languages = [];
for (const row of approved.languages) {
  const source = native.languages.find(entry => entry.language === row.language);
  assert.ok(source);
  const repo = `${folder}/${row.language}/repo`;
  const localRoot = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
  const book = `${localRoot}/10p`;
  const lesson = `${book}/editions/modern-us-neutral/lessons/${card}`;
  await fs.mkdir(absolute(localRoot), { recursive: true });
  await fs.cp(absolute(`${source.nativeRoot}/10p`), absolute(book), {
    recursive: true, force: false, errorOnExist: true,
  });
  if (source.root !== source.nativeRoot) {
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      await fs.copyFile(absolute(`${source.root}/10p/editions/modern-us-neutral/lessons/${card}/${name}`),
        absolute(`${lesson}/${name}`));
    }
  }
  const keyPath = `${lesson}/answer-keys.json`;
  await immutableWrite(keyPath, await bytes(row.answerDraft.path));
  const draftKeys = await read(keyPath);
  assert.equal(draftKeys.answers.length, 6);
  assert.ok(draftKeys.answers.every(key => key.grading === 'ungraded'
    && key.source === 'derived' && key.parts.length === 0 && !key.bookRaw));
  const command = ['python3', '-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'finalize', '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', localRoot, '--work', `${folder}/${row.language}/work`];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  const receipt = `${folder}/${row.language}/answer-finalize.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const readyKeys = await read(keyPath);
  const unchanged = { ...readyKeys, status: draftKeys.status };
  if (!Object.hasOwn(draftKeys, 'count')) delete unchanged.count;
  assert.deepEqual(unchanged, draftKeys);
  assert.equal(readyKeys.status, 'ready');
  const auditPath = `${lesson}/answer-keys.audit.json`;
  const audit = await read(auditPath);
  assert.equal(audit.status, 'pass');
  assert.equal(audit.auto, 0);
  assert.equal(audit.ungraded, 6);
  const outputs = [];
  for (const [name, sourcePath] of [
    ['choice-set/seed.json', row.seed.path],
    ['choice-set/draft.json', row.choiceDraft.path],
    ['choice-set/review.json', row.choiceReview.path],
  ]) {
    const destination = `${lesson}/${name}`;
    await immutableWrite(destination, await bytes(sourcePath));
    outputs.push({ name, ...await bind(destination) });
  }
  outputs.push({ name: 'answer-keys.json', ...await bind(keyPath) },
    { name: 'answer-keys.audit.json', ...await bind(auditPath) });
  const choices = await read(`${lesson}/choice-set/draft.json`);
  const options = choices.questions.reduce((sum, q) => sum + q.view.options.length, 0);
  languages.push({
    language: row.language, root: localRoot, repo, work: `${folder}/${row.language}/work`,
    choiceDraft: await bind(`${lesson}/choice-set/draft.json`), answerKeys: await bind(keyPath),
    outputs, html: [], finalize: await bind(receipt),
    counts: { tasks: 6, choiceQuestions: choices.questions.length,
      choiceOptions: options, readOnlyStandardAnswers: 6 },
  });
}
assert.deepEqual(languages[0].counts, languages[1].counts);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'PASS-native-reviewed-supplements',
  approved: await bind(approvedPath), languages, counts: languages[0].counts,
  textExerciseNativeRendersReused: true, supplementalHtml: 'Generated from exact view/keys within the single display browser pass.',
  editableAnswerInputs: 0, interactionGeneration: false, databaseWrites: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ supplemental: await bind(`${folder}/result.json`), counts: languages[0].counts }));
