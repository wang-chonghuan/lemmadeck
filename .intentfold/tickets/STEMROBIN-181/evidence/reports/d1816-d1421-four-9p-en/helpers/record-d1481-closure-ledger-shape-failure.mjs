import { ticket, bind, save, copy } from './n42-native.mjs';

const directory = `${ticket}/tmp/d1816-d1481-closure-ledger-shape-recovery`;
const helper = `${ticket}/tmp/d1816-recovery/record-d1421-kinetic-phase-reviewers-closed.mjs`;
copy(helper, `${directory}/helper.executed-original.mjs`);
save(`${directory}/first-failure.json`, {
  task: 'D1481',
  execution: { chunk: 'e68644', exitCode: 1, cwd: process.cwd(), argv: ['node', helper] },
  error: 'AssertionError at line27: batches contained one completed batch object with actualImageOpens8, not scalar8.',
  exactFailedHelper: bind(`${directory}/helper.executed-original.mjs`),
  failedBeforeClosureOutput: true, reviewsOrClosuresRepeated: false,
  recovery: 'Normalize numeric batches and batch objects by their actualImageOpens field, then retain the same exact count/limits.',
  newImages: 0, databaseWrites: 0, contentFailure: false,
});
console.log(JSON.stringify({ failure: bind(`${directory}/first-failure.json`) }));
