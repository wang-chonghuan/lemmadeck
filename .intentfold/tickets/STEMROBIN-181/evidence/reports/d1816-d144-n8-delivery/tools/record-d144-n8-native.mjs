import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d144-n8-native`;
const C = '.tmp/STEMROBIN-181/d1816-d144/root/9p';
const D = '.tmp/STEMROBIN-181/d1816-d144/display';
const id = 'phy9-c1-s1-n8';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const install = bind(`${O}/figure-install.json`);
const records = [];
const calls = [];
assert(!fs.existsSync(`${O}/native-finalized.json`));
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  for (const stage of ['first-native-finalize', 'first-offline-render']) {
    const receipt = `${T}/tmp/d1816-recovery/native/d144-n8-${locale}-${stage}/receipt.json`;
    assert.equal(read(receipt).exitCode, 0, receipt);
    calls.push(bind(receipt));
  }
  const dir = `${C}/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/lesson.json`).prose.length, 13);
  assert.equal(read(`${dir}/exercises.json`).count, 0);
  assert.deepEqual(read(`${dir}/figures.json`).figures.map(row => row.id), ['fig-05']);
  records.push({ locale, edition, files: fs.readdirSync(dir).map(name => bind(`${dir}/${name}`)),
    html: ['text.html', 'exercises.html'].map(name => bind(`${D}/render/9p/${edition}/${id}/${name}`)) });
}
fs.writeFileSync(`${O}/native-finalized.json`, JSON.stringify({
  batch: 'D144', status: 'pass', lesson: id, install, records, calls,
  operativeRoot: '.tmp/STEMROBIN-181/d1816-d144/root',
  operativeWork: '.tmp/STEMROBIN-181/d1816-d144/work', displayWork: D,
  nativeFinalizers: 2, firstOfflineRenders: 2, passedStagesReplayed: 0,
  originalTasks: 0, answers: 0, choices: 0,
  displayPixelsPending: true, parentImageOpens: 0, completeCoursesAdded: 0,
  canonicalPromotions: 0, sourcePagesAdded: 0, productAcceptance: false,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D144 = {
  status: 'FIRST_N8_BILINGUAL_NATIVE_FINALIZE_RENDER_PASS_DISPLAY_PENDING',
  native: bind(`${O}/native-finalized.json`), originalTasks: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, parentImageOpens: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ native: bind(`${O}/native-finalized.json`),
  nativeFinalizers: 2, offlineRenders: 2, completeCoursesAdded: 0, imagesOpened: 0 }));
