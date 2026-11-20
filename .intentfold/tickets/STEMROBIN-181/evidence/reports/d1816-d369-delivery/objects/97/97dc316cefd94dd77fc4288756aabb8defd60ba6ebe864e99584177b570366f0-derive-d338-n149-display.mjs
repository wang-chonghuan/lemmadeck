import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const from = `${T}/tmp/d1816-recovery/check-d112-n19-offline.mjs`;
const to = `${T}/tmp/d1816-recovery/check-d338-n149-offline.mjs`;
assert(!fs.existsSync(to));
let code = fs.readFileSync(from, 'utf8');
const replacements = [
  ['d1816-d112-n19-display', 'd1816-d338-n149-display'],
  ['d1816-d112/display', 'd1816-d337/display'],
  ['d1816-d112/root/9p', 'd1816-d337/root/10p'],
  ['phy9-c1-s2-n19', 'phy10-c3-s4-n149'],
  ['fig-26', 'fig-277'],
  ['render/9p/', 'render/10p/'],
  ['n19-${locale}', 'n149-${locale}'],
  ["batch: 'D112'", "batch: 'D338'"],
  ['headless: true', 'headless: false'],
];
for (const [before, after] of replacements) {
  assert(code.includes(before), before);
  code = code.replaceAll(before, after);
}
fs.writeFileSync(to, code, { flag: 'wx' });
const bind = file => ({
  path: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
fs.writeFileSync(`${T}/tmp/d1816-recovery/d338-display-derivation.json`, JSON.stringify({
  stage: 'D338', source: bind(from), derived: bind(to), replacements,
  checksPreserved: ['Complete paragraph equality', 'Declared section boundaries', 'Current native audits',
    'Single unique figure', 'SVG nonempty', 'Minimum actual label size', 'Horizontal media end',
    'No whole-page overflow', 'Font family and size', 'Zero indent', 'No overlapping sections',
    'Localized heading', 'Empty exercises', 'No network requests', 'No browser errors'],
  firstDisplayRunPending: true, firstNativeRequiredBeforeRun: 'D337',
  browser: 'Isolated headed Chrome, using the existing app Playwright package',
  parentImageOpens: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ derived: bind(to), executed: false }));
