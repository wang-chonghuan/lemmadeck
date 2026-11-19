import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/root/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source326329-review/phase1-observation.json';
assert.equal(hash(phasePath), 'c9045ef8f92a558e1c0b8348ea84c506519235d5fbb66d1a5c54df0f29ce2706');
const phase = read(phasePath);
assert.equal(phase.image_usage.local_images_opened_total, 8);
const failures = ['d041-source326-first-finalize', 'd041-source329-first-finalize']
  .map(name => bind(`${scratch}/native/${name}/receipt.json`));
for (const file of failures) assert.equal(read(file.path).exitCode, 1);
const passes = ['d041-source327-first-finalize', 'd041-source328-first-finalize',
  'd041-source329-subscript-encoding-recovery']
  .map(name => bind(`${scratch}/native/${name}/receipt.json`));
for (const file of passes) assert.equal(read(file.path).exitCode, 0);
const current = [326, 327, 328, 329].map(page => ({
  page, pageJson: bind(`${root}/pages/${String(page).padStart(4, '0')}/page.json`),
  audit: bind(`${root}/pages/${String(page).padStart(4, '0')}/audit.json`),
}));
assert.equal(read(current[0].audit.path).lines_printed, 25);
assert.equal(read(current[0].audit.path).lines_md, 26);
for (const row of current.slice(1)) assert.deepEqual(read(row.audit.path).errors, []);
const retainedFailures = ['source0326.first-finalize-candidate.md', 'source0326.first-failed-audit.json',
  'source0329.before-subscript-encoding.md', 'source0329.first-failed-audit.json']
  .map(name => bind(`${scratch}/${name}`));
const output = `${scratch}/d041-source326329-native-state.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/source-native-recovery-state@1', batch: 'D041',
  sourcePhase: bind(phasePath), failures, passes, current, retainedFailures,
  source326: {
    native: 'FAIL', sourceCard: 'HOLD', retryPerformed: false,
    mechanicalDiagnosis: {
      method: 'Numeric layout.line_bands comparison over original versus figure-masked ink, no image-tool observation.',
      originalRegionBands: [[1258, 1308], [1309, 1359], [1360, 1410]],
      maskedRegionBands: [[1258, 1333], [1334, 1410]],
      observedObject: 'p0326#7 has three frozen printed lines.',
      conclusion: 'Counter output changes when masking modifies global band statistics. Diagnosis is not permission to delete a printed line or force the expected total.',
    },
    whitelistIssue: 'Two unencoded U+2212 minus signs remain in held formula candidates.',
    glyphHold: 'The two v-shaped glyphs remain unidentified; native encoding or a counter fix cannot approve them.',
  },
  source329: {
    firstFailure: 'U+2098 lowered m is outside the text whitelist.',
    affectedRepair: 'Only r with independently confirmed lowered m was encoded as $r_m$.',
    numericContentChanged: false, recoveredNative: 'PASS', normalizationCount: 0,
    cardApproval: false,
  },
  closedSourceAgent: '01a1f546-8d24-7760-9b09-9e4a1be0adfa',
  remainingSourceHolds: phase.holds,
  completeDeliveredCards: 122, consumedSourcePages: 519, addedDeliveredCards: 0,
  parentCumulativeImages: 24, parentNewImageOpens: 0, sourceAgentImageOpens: 8,
  paidCalls: 0, productPromotion: false, databaseWrites: false,
  next: 'Keep failed326 intact. Assemble subsequent nuclear pages from a separate page-scoped scratch input; do not rerun or rewrite n124.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ state: bind(output), nativePass: [327, 328, 329], nativeFail: [326], addedDeliveredCards: 0 }));
