import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d472-n71-q12-first-choice-seeds`;
assert.equal(await exists(folder), false);
const priorPath = `${ticket}/tmp/d456-n71-q3-first-choice-seeds/manifest.json`;
const prior = await read(priorPath);
const textReview = `${ticket}/tmp/d433-n71-first-independent-text-review/report.json`;
await verify(textReview, 'a47fa9459298ef557f26b3e428dcc85fe127d79a388f988d9cd73d73c593e9e2');
const seeds = [];
for (const row of prior.seeds) {
  const seedPath = `${row.repo}/.tmp/q12-seed.json`;
  assert.equal(await exists(seedPath), false);
  const card = `${row.repo}/ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s2-n71`;
  const bindings = [];
  for (const name of ['lesson', 'exercises', 'figures']) bindings.push(await bind(`${card}/${name}.json`));
  const bookBinding = await bind(`${row.repo}/ssot-resources/soviet10year-textbooks/artifacts/10p/book.json`);
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
    '--repo', absolute(row.repo), '--book', '10p', '--lesson', 'phy10-c2-s2-n71',
    '--exercise', '1', '--exercise', '2', '--no-concepts', '--out', '.tmp/q12-seed.json',
  ];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${row.language}/prepare.receipt.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    reusedExactWhitelistInspection: `${ticket}/tmp/d456-n71-q3-first-choice-seeds/${row.language}/inspect.receipt.json`,
  }));
  assert.equal(result.status, 0, result.stderr);
  const seed = await read(seedPath);
  assert.deepEqual(seed.exercises.map(item => item.number), ['1', '2']);
  assert.deepEqual(seed.figures, []);
  assert.deepEqual(seed.concepts, []);
  for (const binding of [...bindings, bookBinding]) await verify(binding.path, binding.sha256);
  seeds.push({ language: row.language, repo: row.repo, seed: await bind(seedPath), bindings, bookBinding });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy10-c2-s2-n71',
  status: 'FIRST-Q1Q2-TEXT-ONLY-SEEDS-AUTHORING-PENDING',
  previousWhitelist: await bind(priorPath), passedTextReview: await bind(textReview), seeds,
  selectedSourceNumbers: ['1', '2'], notSelectedSourceNumbers: ['3'],
  noConceptReason: 'No definition of the reflection law or principal focus occurs in this lesson body; solved construction examples are not definitions. Each selected original conceptual question is standalone.',
  sourceFigureReferences: 0, newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  copiedPassedSourceBytes: 0, repeatedInspections: 0, repeatedQ3Preparations: 0,
  answerOrOldChoiceReads: 0, completeChoiceCoverage: false, completeCard: false,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), seeds }));
