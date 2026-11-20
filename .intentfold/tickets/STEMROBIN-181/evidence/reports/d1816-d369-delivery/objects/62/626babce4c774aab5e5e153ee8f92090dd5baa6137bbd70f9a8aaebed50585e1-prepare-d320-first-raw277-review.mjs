import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d320-raw277-first-review`;
const V = `${T}/tmp/d1816-d317-source383-385-review`;
const root = '.tmp/STEMROBIN-181/d1816-d316';
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(O));
const originalInventory = bind(`${V}/original-inventory-0384.json`);
const originalFreeze = bind(`${V}/original-freeze.json`);
const sourceOnly = save(`${O}/source-only.json`, {
  batch: 'D320', role: 'FIRST_RAW277_CROP_SVG_FIDELITY_ONLY_FROM_INDEPENDENT_ORIGINAL_BASELINE',
  independentOriginalInventory: originalInventory, independentOriginalFreeze: originalFreeze,
  original: bind(`${root}/source-work/10p/pages/0384/page.png`),
  instructions: 'Reuse D317 independently frozen original FIG277 pixel inventory, not author rationale. Save expectations before current RAW/SVG. No full source page reopening, no resolving alphabet/script from tracing, no source text or modern approval.',
});
const afterInventory = save(`${O}/after-inventory.json`, {
  figure: {
    id: 'fig-277',
    png: bind(`${root}/source-work/10p/pages/0384/figures/fig-277.png`),
    svg: bind(`${root}/source-work/10p/pages/0384/figures/fig-277.svg`),
    preview: bind('.tmp/STEMROBIN-181/d1816-d320/raw-svg-previews/fig-277.svg-preview.png'),
    page: bind(`${root}/root/10p/pages/0384/page.json`),
    audit: bind(`${root}/root/10p/pages/0384/audit.json`),
    native: bind(`${T}/tmp/d1816-d316-source383-385-first-native/result.json`),
    previewReceipt: bind(`${T}/tmp/d1816-recovery/native/d320-fig277-first-svg-preview/receipt.json`),
  },
  firstNativeAndPreviewStagesNotToBeReplayed: true, repairsAuthorized: false,
  sourceApproval: false, modernFigureApproval: false, completeCoursesAdded: 0,
});
const input = save(`${O}/input-freeze.json`, {
  batch: 'D320', sourceOnly, afterInventory, imagesAuthorized: 2,
  maximumContextImageOpens: 24, completeCoursesAdded: 0,
  parentImageOpens: 0, paidCalls: 0, databaseWrites: false,
});
const file = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(file));
assert(!meter.currentResume1816.D320);
meter.currentResume1816.D320 = {
  status: 'FIRST_RAW277_TWO_IMAGE_REVIEW_INPUT_READY', inputFreeze: input,
  reviewer: null, reviewerClosed: false, imagesAuthorized: 2,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
Object.assign(meter.currentResume1816.D324, {
  status: 'AFFECTED_SOURCE380_382_TWO_IMAGE_REVIEW_ACTIVE',
  reviewer: '01a1fad6-176f-70f1-8a3b-b8d7d0b680c4',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: input, parentImageOpens: 0 }));
