import { ticket, bind, save, copy } from './n42-native.mjs';

const directory = `${ticket}/tmp/d1816-d1496-n42-composition-ledger-wrapper-recovery`;
const helper = `${ticket}/tmp/d1816-recovery/compose-d1490-n42-pixels.mjs`;
copy(helper, `${directory}/helper.executed-original.mjs`);
save(`${directory}/first-failure.json`, {
  task: 'D1496', status: 'TECHNICAL_COMPOSITION_FIRST_FAILURE_PRESERVED',
  execution: {
    chunk: '7c9224', exitCode: 1,
    cwd: '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck',
    command: 'node .intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/compose-d1490-n42-pixels.mjs',
    arguments: [
      '8402aa1cc5408d2d6897580abfbcd5abbbb89ed26a325676d27000f719838be3',
      '42adca654a3859359fe637e339ff69b6048ad139be9da2b97963019863deec38',
      '50588a8f2a72ff29b45d4b049ea339d06b57e1d55987fdc59ebd29eec34dc156',
      'f630a63d2fcbcd91c302226abd56cce973334de8e8a73ffadf09a24ae38edd62',
      '128b420fceddd70017f30ec27254828b85eec7cdee578e9252a549e2a2204b82',
      'f7c2b710a47b558c4ae4f66689c36edd561fecec7d961969919d68fece5e6bd9',
    ],
    failure: 'AssertionError: undefined !== 2 at compose-d1490-n42-pixels.mjs:48:8',
  },
  helper: bind(`${directory}/helper.executed-original.mjs`),
  originalIndependentEndingLedger: bind(`${ticket}/tmp/d1816-d1495-n42-mobile-ending-review/image-ledger.json`),
  cause: 'Scratch composer expected flat actualImageOpens; valid independent ledger records counts in imageAccounting and usage.',
  recovery: 'Read the recorded imageAccounting wrapper without changing the ledger or resetting usage; reject conflicting duplicate counts.',
  composedOutputWritten: false, nativeCalls: 0, imagesOpened: 0,
  passedReviewReplayed: false, scientificOrPixelApprovalRecovered: false,
});
console.log(JSON.stringify({ failure: bind(`${directory}/first-failure.json`) }));
