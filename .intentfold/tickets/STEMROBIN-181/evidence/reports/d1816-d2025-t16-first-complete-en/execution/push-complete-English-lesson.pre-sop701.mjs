import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { card, book, stage, evidencePath } = config;
const edition = 'modern-us-neutral-en';
const ready = read(`${repo}/${evidencePath}/batch-ready.json`);
assert.equal(ready.card, card);
assert.equal(ready.status, 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED');
const lessonPath = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/lessons/${card}`;
const indexPath = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/book.json`;
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
assert.equal(git('diff', '--cached', '--name-only'), '', 'Preserve unrelated staged work');
const paths = [lessonPath, indexPath, evidencePath, ...(config.dependencyPaths ?? []),
  '.intentfold/tickets/STEMROBIN-181/production-meter.json'];
run(`${stage}-scoped-add`, ['git', 'add', '--', ...paths]);
assert(git('diff', '--cached', '--name-only').split('\n')
  .every(file => paths.some(allowed => file === allowed || file.startsWith(`${allowed}/`))));
run(`${stage}-scoped-check`, ['git', 'diff', '--cached', '--check']);
run(`${stage}-complete-English-commit`, ['git', 'commit', '--quiet', '-m', `content: complete reviewed ${book} ${config.title} English`]);
const commit = git('rev-parse', 'HEAD');
const receipt = run(`${stage}-ordinary-push`, ['git', 'push', 'origin', 'HEAD:codex/STEMROBIN-181-textbooks']);
save(`${repo}/${evidencePath}/actual-push.json`, {
  card, commit, branch: 'codex/STEMROBIN-181-textbooks', status: 'ordinary-push-success',
  exitCode: 0, receipt, requiredWrites: ready.requiredWrites, producerDatabaseWrites: 0,
});
const meterFile = `${ticket}/production-meter.json`, meter = read(meterFile), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.lastCommit = commit;
state.lastPush = { status: 'success', exitCode: 0, commit, result: 'HEAD -> codex/STEMROBIN-181-textbooks; ordinary push completed' };
state.retainedLesson.status = 'complete-reviewed-retained-committed-pushed-submitted';
assert(!state.publicationQueue.some(row => row.lessonId === card && row.edition === edition));
state.publicationQueue.push({
  lessonId: card, book, edition, status: 'pushed-submitted-awaiting-sole-supervisor-writer',
  commit, branch: 'codex/STEMROBIN-181-textbooks', lessonPath, evidencePath,
  requiredWrites: ready.requiredWrites, writtenExercises: ready.originalExercises,
  choiceQuestions: ready.choiceQuestions, englishMustNotOverwriteChinese: true,
  writer: 'caller-designated supervisor, sole serial DB writer',
  submissionChannel: 'existing production-meter checkpoint; no outgoing chat message',
  publishSnapshotOnly: true, producerDatabaseWrites: 0,
});
state.stage = `${config.title} complete English pushed/submitted; immediately next missing English lesson.`;
state.nextMissingStages = ['next-missing-English-lesson'];
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, commit, pushed: true, queued: true, databaseWrites: 0,
  receipt: bind(`${repo}/${evidencePath}/actual-push.json`) }));
