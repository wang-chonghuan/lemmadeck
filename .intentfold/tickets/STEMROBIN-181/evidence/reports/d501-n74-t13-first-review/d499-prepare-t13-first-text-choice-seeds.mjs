import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d499-t13-first-text-choice-seeds`;
const card = 'phy10-c2-s2-t13';
const author = `${base}/d489-n74-t13-first-bilingual-text-author`;
const reviewPath = `${base}/d491-n74-t13-first-independent-text-review/report.json`;
await verify(reviewPath, '959199fcf36328a9a8b8b59ba1b47087021f8639ad89859ad339a8babe54f61c');
const review = await read(reviewPath);
const selected = ['3', '6', '7'];
const t13 = review.cards.find(row => row.card === card);
assert.equal(t13.ZHEN, 'PASS');
assert.equal(t13.SCI, 'HOLD');
assert.equal(review.necessary_author_literal_repair_count, 0);
for (const number of selected) {
  const question = t13.questions.find(row => row.number === number);
  assert.equal(question.prompt_information, 'PASS');
  assert.ok(question.SCI_prompt.startsWith('PASS'));
  assert.equal(question.ZHEN, 'PASS');
}
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const inputs = [await bind(reviewPath)], seeds = [];
const bookSource = `${base}/d488-n74-t13-first-source-preparation/root/10p/book.json`;
for (const language of ['zh', 'en']) {
  const repo = `${folder}/${language}/repo`;
  const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
  const lesson = `${book}/editions/modern-us-neutral/lessons/${card}`;
  inputs.push(await bind(bookSource));
  await immutableWrite(`${book}/book.json`, await bytes(bookSource));
  for (const name of ['lesson', 'exercises', 'figures']) {
    const source = `${author}/candidate/${card}/${language}/${name}.template.json`;
    const row = freeze.files.find(item => absolute(item.path) === absolute(source));
    assert.ok(row, source);
    await verify(source, row.sha256);
    inputs.push(await bind(source));
    await immutableWrite(`${lesson}/${name}.json`, await bytes(source));
  }
  const args = ['--repo', absolute(repo), '--book', '10p', '--lesson', card];
  const prepare = [
    ...selected.flatMap(number => ['--exercise', number]),
    '--no-concepts', '--out', '.tmp/text-choice-seed.json',
  ];
  for (const [stage, extra] of [['inspect', []], ['prepare', prepare]]) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.agents/skills/ld-s10y-choice/scripts/prepare.py', stage, ...args, ...extra,
    ];
    const result = spawnSync(command[0], command.slice(1), {
      cwd: root, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    await immutableWrite(`${folder}/${language}/${stage}.receipt.json`, serialize({
      command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    }));
    assert.equal(result.status, 0, `${stage}: ${result.stderr}\n${result.stdout}`);
  }
  const seedPath = `${repo}/.tmp/text-choice-seed.json`;
  const seed = await read(seedPath);
  assert.deepEqual(seed.exercises.map(row => row.number), selected);
  assert.deepEqual(seed.figures, []);
  assert.deepEqual(seed.concepts, []);
  seeds.push({ language, repo, seed: await bind(seedPath) });
}
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-TEXT-CHOICE-SEEDS-PREPARED-NOT-AUTHORED-OR-APPROVED',
  inputs, seeds, selectedSourceNumbers: selected, notSelectedSourceNumbers: ['1', '2', '4', '5'],
  passedScope: 'Faithful bilingual prompts3/6/7 only. Existing t13 SCI HOLD and all scientific-solution gates remain separate.',
  noConceptReason: 'Standalone exercise card has no source prose definitions.',
  sourceSnapshotClone: 'Exact frozen bilingual prompt bytes, isolated scratch SSOT; not a production promotion.',
  preparationReadsNoAnswersOrOldChoices: true, independentSolutionNotSuppliedToAuthor: true,
  sourceFigureReferences: 0, choiceQuestionsAuthored: 0, choiceQuestionsApproved: 0,
  completeChoiceCoverage: false, completeCard: false, t13SCIHoldPreserved: true,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), seeds }));
