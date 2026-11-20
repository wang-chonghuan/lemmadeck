import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const stage = process.argv[2];
const cfg = {
  D312: { author: 'D308', native: 'D311' },
  D314: { author: 'D310', native: 'D313' },
  D317: { author: 'D315', native: 'D316' },
  D327: { author: 'D318', native: 'D319' },
  D336: { author: 'D331', native: 'D335' },
  D346: { author: 'D341', native: 'D345' },
}[stage];
assert(cfg, 'Explicit supported stage required');
const meter = JSON.parse(fs.readFileSync(`${T}/production-meter.json`));
assert.equal(meter.currentResume1816[cfg.author].authorClosed, true);
const nativeBinding = meter.currentResume1816[cfg.native].result;
const native = JSON.parse(fs.readFileSync(nativeBinding.path));
const author = meter.currentResume1816[cfg.author];
const O = `${T}/tmp/d1816-${stage.toLowerCase()}-source${native.pages[0]}-${native.pages.at(-1)}-review`;
assert(!fs.existsSync(O));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const sourceOnly = save(`${O}/source-only.json`, {
  batch: stage, book: '10p',
  role: 'FIRST_ORIGINAL_PIXELS_BEFORE_AUTHOR_OR_NATIVE_RATIONALE',
  pages: native.pages.map(page => {
    const number = String(page).padStart(4, '0');
    return { page, printedPage: page - 10,
      original: bind(`${native.work}/10p/pages/${number}/page.png`),
      grid: bind(`${native.work}/10p/pages/${number}/page.grid.png`) };
  }),
  instructions: 'Open originals one at a time and freeze independent row/text/typography/title/task/figure inventories before reading after-inventory. No glyph inferred from physics or candidate. Up to8 images incl crops/reopens. RAW/SVG pixels are a separate review if necessary.',
});
const afterInventory = save(`${O}/after-inventory.json`, {
  native: nativeBinding, authorReport: author.report, authorFreeze: author.authorFreeze,
  candidates: native.pages.map(page => {
    const dir = `${native.root}/10p/pages/${String(page).padStart(4, '0')}`;
    return { page, files: ['page.md', 'page.json', 'audit.json'].filter(name =>
      fs.existsSync(`${dir}/${name}`)).map(name => bind(`${dir}/${name}`)) };
  }),
  firstNativeFailure: native.failure,
  nativeFailureIsNotSourceVerdict: true, rawFidelitySeparate: true,
  sourceApproval: false, modernApproval: false,
});
const input = save(`${O}/input-freeze.json`, {
  batch: stage, ticket: 'STEMROBIN-181', book: '10p',
  role: 'FIRST_SOURCE_TEXT_ROWS_BOUNDARIES_AND_ORIGINAL_FIGURE_INVENTORIES_ONLY',
  sourceOnly, afterInventory, maximumActualImageOpens: 8,
  maximumContextImageOpens: 24, parentImageOpens: 0,
  repairsAuthorized: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
  databaseWrites: false, newPaidCalls: 0, formalHandoff: false,
});
assert(!meter.currentResume1816[stage]);
meter.currentResume1816[stage] = {
  status: 'FIRST_INDEPENDENT_SOURCE_REVIEW_INPUT_READY', inputFreeze: input,
  reviewer: null, reviewerClosed: false, imagesAuthorized: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${T}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: input, sourceApproval: false }));
