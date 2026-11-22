import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, bind, save, copy } from './n42-native.mjs';

const out = `${ticket}/tmp/d1816-d983-n97-history-gap`;
const bindingFile = `${ticket}/evidence/reports/d024-finalization-binding.json`;
const binding = read(bindingFile).cards.find(row => row.card === 'phy9-c2-s4-n97');
assert(binding);
for (const file of [binding.native, binding.science]) assert(!fs.existsSync(`${repo}/${file.path}`));
const report = `${out}/inventory-gap.json`;
save(report, {
  task: 'D983', card: 'phy9-c2-s4-n97',
  status: 'HISTORICAL_APPROVAL_BINDING_FILES_NOT_LOCATED_FIRST_EN_PREPARE_NOT_INVOKED',
  binding: bind(bindingFile), missing: [binding.native, binding.science],
  firstFailure: {
    chunk: 'de25a1', exitCode: 1,
    command: ['node', `${ticket}/tmp/d1816-recovery/prepare-d981-n97-first-missing-en.mjs`],
    helper: bind(`${ticket}/tmp/d1816-recovery/prepare-d981-n97-first-missing-en.mjs`),
    error: 'ENOENT on retained historical d024-n97-native-finalization.json alias before any native invocation.',
  },
  searches: [
    { chunk: '55d079', scope: 'Exact two historical hashes among all 192 JSON files under author-history/d024', matches: 0 },
    { chunks: ['4cfaed', '65a988'], scope: 'Git history of each missing retained alias path', matches: 0 },
    { chunk: '509b29', scope: 'Hidden-inclusive ticket file names matching the two hashes or original N97 receipt names', matches: 0 },
  ],
  existingChineseCourseNotInvalidated: true,
  semanticHold: false, sourceOrScienceReviewReplayed: false,
  replacementApprovalsInvented: false, nativePrepareInvocations: 0,
  parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
  independentN74N79ProductionContinues: true,
});
copy(`${ticket}/production-meter.json`, `${out}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${out}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
meter.currentResume1816.D981 = {
  status: 'N97_FIRST_EN_PREPARE_NOT_INVOKED_MISSING_HISTORICAL_ALIAS', receipt: bind(report),
};
meter.currentResume1816.D983 = {
  status: 'N97_TARGETED_HISTORY_GAP_RECORDED_NOT_SEMANTIC_HOLD', receipt: bind(report),
  newCompleteCourses: 0, newSourcePages: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD981/D983: N97 first missing EN preparation NOT_INVOKED. D024 finalization binding names historical native/science aliases absent from current files and Git path history; exact two hashes not found in192retained D024 JSON files or hidden-inclusive ticket-name lookup. Preflight ENOENT preserved, not a science/source/content verdict and not invalidation of the already-counted Chinese course. No approvals invented or passed review replay; N74/N79 independent work continues, totals153/581 unchanged.\n');
console.log(JSON.stringify({ inventory: bind(report), nativePrepareInvocations: 0 }));
