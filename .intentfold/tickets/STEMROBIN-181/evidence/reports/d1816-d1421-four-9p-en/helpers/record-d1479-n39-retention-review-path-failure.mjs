import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const directory = `${ticket}/tmp/d1816-d1479-n39-retention-review-path-recovery`;
const helper = `${ticket}/tmp/d1816-recovery/retain-d1000-n72-first-complete-en.mjs`;
const native = read(`${ticket}/tmp/d1816-d1476-n39-value-line-native/result.json`);
assert(!fs.existsSync(`${ticket}/evidence/reports/d1816-d1420-n39-first-complete-en`));
copy(helper, `${directory}/retainer.failed-original.mjs`);
save(`${directory}/first-failure.json`, {
  task: 'D1479', card: 'phy9-c1-s4-n39',
  execution: {
    chunk: 'b53df1', cwd: repo, exitCode: 1,
    argv: ['node', helper,
      `${ticket}/tmp/d1816-d1416-n39-first-en-review/composed-unit-pixel-review.json`,
      '3e38595cc640b5f9d60564ad104f12c82e82a738fa123475f621047d6e7fb086',
      `${ticket}/tmp/d1816-d1416-n39-first-en-review/composed-unit-image-ledger.json`,
      '0e38b89e4bcce5e8955561f375aa5abf7d770a38cc6ad4a92704ba827d56344d',
      'phy9-c1-s4-n39'],
  },
  error: 'AssertionError at retainer line638: received review directory was d1467, expected d1416.',
  exactFailedHelper: bind(`${directory}/retainer.failed-original.mjs`),
  actualNativeReview: native.review,
  diagnosis: 'Configured enReview includes ../d1467; dirname/basename assertions cannot resolve this explicit relative path.',
  failedBeforeRetentionOutputOrNativeCalls: true,
  recovery: 'Compare the complete resolved review path to the configured review path. Reuse all passed content/native/display/pixel evidence.',
  contentFailure: false, newImages: 0, databaseWrites: 0,
});
console.log(JSON.stringify({ failure: bind(`${directory}/first-failure.json`) }));
